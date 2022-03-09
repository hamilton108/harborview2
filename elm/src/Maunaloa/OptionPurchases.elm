module Maunaloa.OptionPurchases exposing (main)

--import Common.ComboBox as CMB

import Browser
import Common.Buttons as BTN
import Common.Html as CH
    exposing
        ( Checked(..)
        , HtmlId(..)
        , InputCaption(..)
        )
import Common.ModalDialog as DLG
import Common.Utils as U
import Html as H
import Html.Attributes as A
import Html.Events as E
import Http
import Json.Decode as Json
import Json.Decode.Pipeline as JP
import Json.Encode as JE
import VirtualDom as VD



-- region Init


type alias Flags =
    Int


mainUrl =
    "/maunaloa"


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


initModel : Flags -> Model
initModel flags =
    { purchases = Nothing
    , isRealTimePurchase = True
    , dlgSell = DLG.DialogHidden
    , dlgAlert = DLG.DialogHidden
    , selectedPurchase = Nothing
    , salePrice = "0.0"
    , saleVolume = "10"
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( initModel flags, Cmd.none )



-- endregion
-- region TYPES


type alias PurchaseWithSales =
    { oid : Int
    , stock : String
    , dx : String
    , optionType : String
    , ticker : String
    , purchaseDate : String
    , exp : String
    , days : Int
    , price : Float
    , bid : Float
    , spot : Float
    , purchaseVolume : Int
    , volumeSold : Int
    , iv : Float
    , curAsk : Float
    , curBid : Float
    , curIv : Float
    }


type alias OptionPurchases =
    List PurchaseWithSales


type Msg
    = ToggleRealTimePurchase
    | FetchPurchases
    | PurchasesFetched (Result Http.Error OptionPurchases)
    | SellClick PurchaseWithSales
    | SellDlgOk
    | SellDlgCancel
    | SaleOk (Result Http.Error String)
    | SalePriceChange String
    | SaleVolumeChange String
    | AlertOk
    | ResetCache


type alias Model =
    { purchases : Maybe OptionPurchases
    , isRealTimePurchase : Bool
    , selectedPurchase : Maybe PurchaseWithSales
    , dlgSell : DLG.DialogState
    , dlgAlert : DLG.DialogState
    , salePrice : String
    , saleVolume : String
    }



-- endregion TYPES
-- region UPDATE


makeLabel : String -> VD.Node a
makeLabel caption =
    H.label [] [ H.text caption ]


swap : Maybe OptionPurchases -> Int -> Int -> Maybe OptionPurchases
swap lx oid saleVol =
    case lx of
        Nothing ->
            Nothing

        Just lxx ->
            let
                swapFn : PurchaseWithSales -> PurchaseWithSales
                swapFn x =
                    if x.oid == oid then
                        { x | volumeSold = x.volumeSold + saleVol }

                    else
                        x
            in
            Just (List.map swapFn lxx)


errorAlert : Http.Error -> Cmd Msg
errorAlert err =
    Cmd.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        AlertOk ->
            ( { model | dlgAlert = DLG.DialogHidden }, Cmd.none )

        ToggleRealTimePurchase ->
            let
                checked =
                    not model.isRealTimePurchase

                curCmd =
                    Cmd.none

                {-
                   if model.selectedTicker == "-1" then
                       Cmd.none
                   else
                       fetchPurchases model.selectedTicker checked False
                -}
            in
            ( { model | isRealTimePurchase = checked }, curCmd )

        --( { model | isRealTimePurchase = checked }, Cmd.none )
        FetchPurchases ->
            let
                curCmd =
                    fetchPurchases model.isRealTimePurchase False
            in
            ( model, curCmd )

        PurchasesFetched (Ok s) ->
            ( { model | purchases = Just s }, Cmd.none )

        PurchasesFetched (Err s) ->
            let
                errStr =
                    "PurchasesFetched Error: " ++ CH.httpErr2str s
            in
            ( { model | dlgAlert = DLG.DialogVisibleAlert "PurchasesFetched ERROR!" errStr DLG.Error }, Cmd.none )

        SellClick p ->
            ( { model
                | dlgSell = DLG.DialogVisible
                , selectedPurchase = Just p
                , salePrice = String.fromFloat p.curBid
                , saleVolume = String.fromInt (p.purchaseVolume - p.volumeSold)
              }
            , Cmd.none
            )

        SellDlgOk ->
            case model.selectedPurchase of
                Nothing ->
                    ( model, Cmd.none )

                Just curPur ->
                    let
                        saleVol =
                            Maybe.withDefault -1 (String.toInt model.saleVolume)

                        salePri =
                            Maybe.withDefault -1.0 (String.toFloat model.salePrice)
                    in
                    ( { model
                        | dlgSell = DLG.DialogHidden
                        , purchases = swap model.purchases curPur.oid saleVol

                        -- , purchases = swap model.purchases curPur.oid (curPur.volumeSold + saleVol)
                      }
                      -- , Cmd.none
                    , sellPurchase curPur.oid saleVol salePri
                    )

        SellDlgCancel ->
            ( { model | dlgSell = DLG.DialogHidden }, Cmd.none )

        SaleOk (Ok s) ->
            ( { model | dlgAlert = DLG.DialogVisibleAlert "Purchase Sale" s DLG.Info }, Cmd.none )

        SaleOk (Err s) ->
            let
                errStr =
                    "SaleOk Error: " ++ CH.httpErr2str s
            in
            ( { model | dlgAlert = DLG.DialogVisibleAlert "Purchase Sale ERROR!" errStr DLG.Error }, Cmd.none )

        SalePriceChange s ->
            ( { model | salePrice = s }, Cmd.none )

        SaleVolumeChange s ->
            ( { model | saleVolume = s }, Cmd.none )

        ResetCache ->
            ( model, fetchPurchases model.isRealTimePurchase True )



-- endregion
-- region VIEW


tableHeader : H.Html Msg
tableHeader =
    H.thead []
        [ H.tr
            []
            [ H.th [] [ H.text "Sell" ]
            , H.th [] [ H.text "Oid" ]
            , H.th [] [ H.text "Stock" ]
            , H.th [] [ H.text "Option Type" ]
            , H.th [] [ H.text "Ticker" ]
            , H.th [] [ H.text "Purchase Date" ]
            , H.th [] [ H.text "Expiry" ]
            , H.th [] [ H.text "Days" ]
            , H.th [] [ H.text "Purchase Price" ]
            , H.th [] [ H.text "Bid" ]
            , H.th [] [ H.text "Purchase vol." ]
            , H.th [] [ H.text "Sales vol." ]
            , H.th [] [ H.text "Spot" ]
            , H.th [] [ H.text "Iv" ]
            , H.th [] [ H.text "Cur. Ask" ]
            , H.th [] [ H.text "Cur. Bid" ]
            , H.th [] [ H.text "Cur. Iv" ]
            , H.th [] [ H.text "Profit" ]
            , H.th [] [ H.text "Diff Bid" ]
            , H.th [] [ H.text "Diff Iv Pct" ]
            ]
        ]


view : Model -> H.Html Msg
view model =
    let
        purchaseTable =
            case model.purchases of
                Nothing ->
                    H.table [ A.class "table table-hoover" ]
                        [ tableHeader
                        , H.tbody [] []
                        ]

                Just purchases ->
                    let
                        toRow x =
                            let
                                profit =
                                    U.toDecimal (x.curBid - x.price) 100.0

                                diffBid =
                                    U.toDecimal (x.curBid - x.bid) 100.0

                                diffIv =
                                    U.toDecimal (100.0 * ((x.curIv / x.iv) - 1.0)) 100.0

                                oidStr =
                                    String.fromInt x.oid
                            in
                            H.tr []
                                [ H.button [ A.class "btn btn-success", E.onClick (SellClick x) ] [ H.text ("Sell " ++ oidStr) ]
                                , H.td [] [ H.text oidStr ]
                                , H.td [] [ H.text x.stock ]
                                , H.td [] [ H.text x.optionType ]
                                , H.td [] [ H.text x.ticker ]
                                , H.td [] [ H.text x.purchaseDate ]
                                , H.td [] [ H.text x.exp ]
                                , H.td [] [ H.text (String.fromInt x.days) ]
                                , H.td [] [ H.text (String.fromFloat x.price) ]
                                , H.td [] [ H.text (String.fromFloat x.bid) ]
                                , H.td [] [ H.text (String.fromInt x.purchaseVolume) ]
                                , H.td [] [ H.text (String.fromInt x.volumeSold) ]
                                , H.td [] [ H.text (String.fromFloat x.spot) ]
                                , H.td [] [ H.text (String.fromFloat x.iv) ]
                                , H.td [] [ H.text (String.fromFloat x.curAsk) ]
                                , H.td [] [ H.text (String.fromFloat x.curBid) ]
                                , H.td [] [ H.text (String.fromFloat x.curIv) ]
                                , H.td [] [ H.text (String.fromFloat profit) ]
                                , H.td [] [ H.text (String.fromFloat diffBid) ]
                                , H.td [] [ H.text (String.fromFloat diffIv) ]
                                ]

                        rows =
                            List.map toRow purchases
                    in
                    H.div [ A.class "row" ]
                        [ -- H.text ("Date: " ++ s.curDx ++ ", Current spot: " ++ toString s.curSpot)
                          H.table [ A.class "table table-hoover" ]
                            [ tableHeader
                            , H.tbody []
                                rows
                            ]
                        ]

        dlgHeader =
            case model.selectedPurchase of
                Nothing ->
                    "Option Sale:"

                Just sp ->
                    "Option Sale: " ++ sp.ticker
    in
    H.div []
        [ H.div [ A.class "grid-elm" ]
            [ -- ===>>> M.checkbox "Real-time purchase" "col-sm-2 checkbox" True ToggleRealTimePurchase
              CH.labelCheckBox (HtmlId "cb1") (InputCaption "Real-time purchase") (Checked model.isRealTimePurchase) ToggleRealTimePurchase
            , BTN.button "Reset Cache" ResetCache
            , BTN.button "Fetch all purchases" FetchPurchases
            ]
        , H.div [ A.class "grid-elm" ]
            [ purchaseTable ]
        , DLG.modalDialog dlgHeader
            model.dlgSell
            SellDlgOk
            SellDlgCancel
            [ makeLabel "Sale Price:"
            , CH.makeInput "Sales price:" SalePriceChange model.salePrice
            , makeLabel "Sale Volume:"
            , CH.makeInput "Sales volume:" SaleVolumeChange model.saleVolume
            ]
        , DLG.alert model.dlgAlert AlertOk
        ]



-- endregion
-- region COMMANDS


sellPurchase : Int -> Int -> Float -> Cmd Msg
sellPurchase oid volume price =
    let
        url =
            mainUrl ++ "/sellpurchase"

        params =
            [ ( "oid", JE.int oid )
            , ( "vol", JE.int volume )
            , ( "price", JE.float price )
            ]

        jbody =
            U.asHttpBody params
    in
    Http.send SaleOk <|
        Http.post url jbody Json.string


fetchPurchases : Bool -> Bool -> Cmd Msg
fetchPurchases isRealTime resetCache =
    let
        purchaseType =
            case isRealTime of
                True ->
                    "3"

                False ->
                    "11"

        resetCacheJson =
            case resetCache of
                True ->
                    "true"

                False ->
                    "false"

        url =
            mainUrl ++ "/stockoption/purchases/" ++ purchaseType

        purchaseDecoder =
            Json.succeed PurchaseWithSales
                |> JP.required "oid" Json.int
                |> JP.required "stock" Json.string
                |> JP.required "dx" Json.string
                |> JP.required "ot" Json.string
                |> JP.required "ticker" Json.string
                |> JP.required "dx" Json.string
                |> JP.required "exp" Json.string
                |> JP.required "days" Json.int
                |> JP.required "price" Json.float
                |> JP.required "bid" Json.float
                |> JP.required "spot" Json.float
                |> JP.required "pvol" Json.int
                |> JP.required "svol" Json.int
                |> JP.required "iv" Json.float
                |> JP.required "cur-ask" Json.float
                |> JP.required "cur-bid" Json.float
                |> JP.required "cur-iv" Json.float
    in
    Http.send PurchasesFetched <|
        Http.get url (Json.list purchaseDecoder)



-- endregion
