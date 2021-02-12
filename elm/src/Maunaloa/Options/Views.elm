module Maunaloa.Options.Views exposing (view)

import Common.Buttons as BTN
import Common.DateUtil exposing (unixTimeStr)
import Common.Html
    exposing
        ( Checked(..)
        , HtmlClass(..)
        , HtmlId(..)
        , InputCaption(..)
        , InputType(..)
        , InputValue(..)
        , inputItem
        , labelCheckBox
        , labelInputItem
        )
import Common.ModalDialog as DLG
import Common.Select as CMB
import Html as H
import Html.Attributes as A
import Html.Events as E
import Maunaloa.Options.Tables exposing (config)
import Maunaloa.Options.Types
    exposing
        ( Model
        , Msg(..)
        , OptionMsg(..)
        , PurchaseMsg(..)
        , RiscMsg(..)
        )
import Table


view : Model -> H.Html Msg
view model =
    let
        -- opx =
        --     Maybe.withDefault [] model.options
        stockInfo =
            case model.stock of
                Nothing ->
                    ""

                Just sx ->
                    let
                        o =
                            String.fromFloat sx.o

                        hi =
                            String.fromFloat sx.h

                        lo =
                            String.fromFloat sx.l

                        c =
                            String.fromFloat sx.c
                    in
                    unixTimeStr sx.unixTime ++ ", o: " ++ o ++ ", hi: " ++ hi ++ ", lo: " ++ lo ++ ", c: " ++ c

        dlgHeader =
            case model.selectedPurchase of
                Nothing ->
                    "Option Purchase"

                Just sp ->
                    "Option Purchase " ++ sp.ticker

        curOptions =
            if model.isOnlyIvGtZero == True then
                List.filter (\x -> x.ivBuy > 0.0 && x.ivSell > 0.0) model.options

            else
                model.options
    in
    H.div
        []
        [ H.div [ A.class "grid-elm" ]
            [ H.div [ A.class "form-group form-group--elm" ]
                [ H.text stockInfo ]
            , BTN.button "Calc Risc" (RiscMsgFor CalcRisc)
            , H.div [ A.class "form-group form-group--elm" ]
                [ H.input [ A.placeholder "Risc", E.onInput (RiscMsgFor << RiscChange) ] [] ]
            , BTN.button "Reset Cache" ResetCache
            , CMB.makeSelect "Tickers: " (OptionMsgFor << FetchOptions) model.tickers model.selectedTicker
            , labelCheckBox (HtmlId "cb1") (InputCaption "Only iv > 0.0") (Checked model.isOnlyIvGtZero) ToggleOnlyIvGtZero
            ]
        , H.div [ A.class "grid-elm" ]
            [ Table.view config model.tableState curOptions ]
        , DLG.modalDialog dlgHeader
            model.dlgPurchase
            (PurchaseMsgFor PurchaseDlgOk)
            (PurchaseMsgFor PurchaseDlgCancel)
            [ labelCheckBox (HtmlId "cb2") (InputCaption "Real-time purchase") (Checked model.isRealTimePurchase) ToggleRealTimePurchase
            , labelInputItem (InputCaption "Ask:") (InputType "number") (InputValue model.ask) (HtmlClass "form-control") (Just AskChange)
            , labelInputItem (InputCaption "Bid:") (InputType "number") (InputValue model.bid) (HtmlClass "form-control") (Just BidChange)
            , labelInputItem (InputCaption "Voluime:") (InputType "number") (InputValue model.volume) (HtmlClass "form-control") (Just VolumeChange)
            , labelInputItem (InputCaption "Spot:") (InputType "number") (InputValue model.spot) (HtmlClass "form-control") (Just SpotChange)
            ]
        , DLG.alert model.dlgAlert AlertOk
        ]



{-
   view : Model -> H.Html Msg
   view model =
       let
           opx =
               Maybe.withDefault [] model.options

           stockInfo =
               case model.stock of
                   Nothing ->
                       ""

                   Just sx ->
                       toString sx

           dlgHeader =
               case model.selectedPurchase of
                   Nothing ->
                       "Option Purchase"

                   Just sp ->
                       "Option Purchase " ++ sp.ticker
       in
       H.div []
           [ H.div [ A.class "grid-elm" ]
               [ H.div [ A.class "form-group form-group--elm" ]
                   [ H.text stockInfo ]
               , BTN.button "Calc Risc" CalcRisc
               , H.div [ A.class "form-group form-group--elm" ]
                   [ H.input [ A.placeholder "Risc", E.onInput RiscChange ] [] ]
               , BTN.button "Reset Cache" ResetCache
               , CMB.makeSelect "Tickers: " (OptionMsgFor << FetchOptions) model.tickers model.selectedTicker
               ]
           , H.div [ A.class "grid-elm" ]
               [ Table.view config model.tableState opx ]
           , DLG.modalDialog dlgHeader
               model.dlgPurchase
               (PurchaseMsgFor PurchaseDlgOk)
               (PurchaseMsgFor PurchaseDlgCancel)
               [ H.div [ A.class "form-group row" ]
                   [ H.input [ A.class "form-control", A.checked True, A.type_ "checkbox", E.onClick ToggleRealTimePurchase ]
                       []
                   , H.text "Real-time purchase"
                   ]
               , M.makeFGRInput AskChange "id1" "Ask:" "number" M.CX39 model.ask
               , M.makeFGRInput BidChange "id2" "Bid:" "number" M.CX39 model.bid
               , M.makeFGRInput VolumeChange "id3" "Volume:" "number" M.CX39 model.volume
               , M.makeFGRInput SpotChange "id4" "Spot:" "number" M.CX39 model.spot
               ]
           , DLG.alert model.dlgAlert AlertOk
           ]
-}
