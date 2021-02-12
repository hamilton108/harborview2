module Maunaloa.Charts.Main exposing (main)

import Browser
import Common.ModalDialog as DLG
import Maunaloa.Charts.Commands exposing (fetchTickers)
import Maunaloa.Charts.Types
    exposing
        ( ChartType(..)
        , Drop(..)
        , Flags
        , Model
        , Msg(..)
        , Take(..)
        , Ticker(..)
        )
import Maunaloa.Charts.Update exposing (update)
import Maunaloa.Charts.View exposing (view)



-------------------- INIT ---------------------


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( initModel flags, fetchTickers )


initModel : Flags -> Model
initModel flags =
    { dlgAlert = DLG.DialogHidden
    , chartType =
        case flags of
            2 ->
                WeekChart

            3 ->
                MonthChart

            _ ->
                DayChart
    , selectedTicker = Nothing
    , tickers = []
    , dropAmount = Drop 0
    , takeAmount = Take 90
    , chartInfo = Nothing
    , curValueRange = Nothing
    }
