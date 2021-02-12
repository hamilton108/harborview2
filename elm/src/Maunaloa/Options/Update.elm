module Maunaloa.Options.Update exposing (update)

--import Common.Miscellaneous as M

import Common.ModalDialog as DLG exposing (errorAlert)
import Common.Utils as U
import Maunaloa.Options.Commands as C
import Maunaloa.Options.Types
    exposing
        ( Ask(..)
        , Bid(..)
        , Model
        , Msg(..)
        , OptionMsg(..)
        , PurchaseMsg(..)
        , RiscMsg(..)
        , Spot(..)
        , StockId(..)
        , Ticker(..)
        , Volume(..)
        )


updateOption : OptionMsg -> Model -> ( Model, Cmd Msg )
updateOption msg model =
    case msg of
        FetchOptions s ->
            let
                sx =
                    if s == "-1" then
                        Nothing

                    else
                        Just s
            in
            ( { model | selectedTicker = sx }, C.fetchOptions model sx )

        OptionsFetched (Ok s) ->
            ( { model | stock = Just s.stock, options = s.opx }, Cmd.none )

        OptionsFetched (Err s) ->
            ( errorAlert "Error" "OptionsFetched Error: " s model, Cmd.none )


updatePurchase : PurchaseMsg -> Model -> ( Model, Cmd Msg )
updatePurchase msg model =
    case msg of
        PurchaseClick opt ->
            let
                curSpot =
                    U.unpackMaybe model.stock .c 0

                -- Maybe.withDefault 0 <| Maybe.map .c model.stock
            in
            ( { model
                | dlgPurchase = DLG.DialogVisible
                , selectedPurchase = Just opt
                , ask = String.fromFloat opt.sell
                , bid = String.fromFloat opt.buy
                , volume = "10"
                , spot = String.fromFloat curSpot
              }
            , Cmd.none
            )

        PurchaseDlgOk ->
            case model.selectedPurchase of
                Just opx ->
                    let
                        curAsk =
                            Maybe.withDefault -1 (String.toFloat model.ask)

                        curBid =
                            Maybe.withDefault -1 (String.toFloat model.bid)

                        curVol =
                            Maybe.withDefault -1 (String.toInt model.volume)

                        curSpot =
                            Maybe.withDefault -1 (String.toFloat model.spot)
                    in
                    ( { model | dlgPurchase = DLG.DialogHidden }
                    , C.purchaseOption (Ticker opx.ticker) (Ask curAsk) (Bid curBid) (Volume curVol) (Spot curSpot) model.isRealTimePurchase
                    )

                Nothing ->
                    ( { model | dlgPurchase = DLG.DialogHidden }, Cmd.none )

        --( model, Cmd.none )
        PurchaseDlgCancel ->
            ( { model | dlgPurchase = DLG.DialogHidden }, Cmd.none )

        OptionPurchased (Ok s) ->
            {-
               let
                   alertCat =
                       case s.ok of
                           True ->
                               DLG.Info

                           False ->
                               DLG.Error
               in
               ( { model | dlgAlert = DLG.DialogVisibleAlert "Option purchase" s.msg alertCat }, Cmd.none )
            -}
            if s.statusCode == 1 then
                ( { model | dlgPurchase = DLG.DialogHidden }
                , C.registerAndPurchaseOption model
                )

            else
                let
                    alertCat =
                        case s.ok of
                            True ->
                                DLG.Info

                            False ->
                                DLG.Error
                in
                ( { model | dlgAlert = DLG.DialogVisibleAlert "Option purchase" s.msg alertCat }, Cmd.none )

        OptionPurchased (Err s) ->
            ( errorAlert "Purchase Sale ERROR!" "SaleOk Error: " s model, Cmd.none )


updateRisc : RiscMsg -> Model -> ( Model, Cmd Msg )
updateRisc msg model =
    case msg of
        CalcRisc ->
            ( model, C.calcRisc model.selectedTicker model.risc model.options )

        RiscCalculated (Ok riscItems) ->
            let
                curRisc =
                    Maybe.withDefault 0 (String.toFloat model.risc)
            in
            ( { model | options = List.map (C.setRisc curRisc riscItems) model.options }, Cmd.none )

        RiscCalculated (Err s) ->
            ( errorAlert "RiscCalculated" "RiscCalculated Error: " s model, Cmd.none )

        RiscChange s ->
            ( { model | risc = s }, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OptionMsgFor optMsg ->
            updateOption optMsg model

        PurchaseMsgFor purchaseMsg ->
            updatePurchase purchaseMsg model

        RiscMsgFor riscMsg ->
            updateRisc riscMsg model

        AlertOk ->
            ( { model | dlgAlert = DLG.DialogHidden }, Cmd.none )

        TickersFetched (Ok s) ->
            ( { model
                | tickers = s
              }
            , Cmd.none
            )

        TickersFetched (Err s) ->
            ( errorAlert "Error" "TickersFetched Error: " s model, Cmd.none )

        SetTableState newState ->
            ( { model | tableState = newState }
            , Cmd.none
            )

        ResetCache ->
            ( model, Cmd.none )

        --( model, C.fetchOptions model model.selectedTicker True )
        ToggleSelected ticker ->
            let
                newOptions =
                    List.map (C.toggle ticker) model.options
            in
            ( { model | options = newOptions }
            , Cmd.none
            )

        ToggleRealTimePurchase ->
            ( { model | isRealTimePurchase = not model.isRealTimePurchase }, Cmd.none )

        ToggleOnlyIvGtZero ->
            ( { model | isOnlyIvGtZero = not model.isOnlyIvGtZero }, Cmd.none )

        AskChange s ->
            ( { model | ask = s }, Cmd.none )

        BidChange s ->
            ( { model | bid = s }, Cmd.none )

        VolumeChange s ->
            ( { model | volume = s }, Cmd.none )

        SpotChange s ->
            ( { model | spot = s }, Cmd.none )
