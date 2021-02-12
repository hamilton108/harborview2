module Maunaloa.Charts.View exposing (view)

import Common.Buttons as BTN
import Common.Html
    exposing
        ( Checked(..)
        , HtmlId(..)
        , InputCaption(..)
        , labelCheckBox
        )
import Common.ModalDialog as DLG
import Common.Select as CS
import Html as H
import Html.Attributes as A
import Maunaloa.Charts.Types exposing (ChartType(..), Model, Msg(..))


view : Model -> H.Html Msg
view model =
    let
        cbId =
            case model.chartType of
                DayChart ->
                    "cb-day"

                WeekChart ->
                    "cb-week"

                MonthChart ->
                    "cb-month"
    in
    H.div [ A.class "grid-elm" ]
        [ CS.makeSelect "Tickers: " FetchCharts model.tickers model.selectedTicker

        --, labelCheckBox (HtmlId cbId) (InputCaption "Reset cache") (Checked model.resetCache) ToggleResetCache
        --, BTN.button "Spot" FetchSpot
        --, BTN.button "Risc Lines" FetchRiscLines
        --, BTN.button "Clear Risc Lines" ClearRiscLines
        , BTN.button "Previous" Previous
        , BTN.button "Next" Next
        , BTN.button "Last" Last
        , DLG.alert model.dlgAlert AlertOk
        ]
