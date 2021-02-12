module Maunaloa.Charts.Types exposing
    ( Candlestick
    , Chart
    , ChartInfo
    , ChartInfoWindow
    , ChartType(..)
    , Drop(..)
    , Flags
    , Model
    , Msg(..)
    , RiscLine
    , RiscLines
    , RiscLinesJs
    , Scaling(..)
    , Spot
    , Take(..)
    , Ticker(..)
    , asTicker
    )

import Common.DateUtil exposing (UnixTime)
import Common.ModalDialog as DLG
import Common.Select as CS
import Common.Types as T
import Http
import Time


type alias Flags =
    Int


type alias Candlestick =
    { o : Float
    , h : Float
    , l : Float
    , c : Float
    }


type Drop
    = Drop Int


type Take
    = Take Int


type Scaling
    = Scaling Float


type Ticker
    = NoTicker
    | Ticker String


asTicker : Maybe String -> Ticker
asTicker ticker =
    case ticker of
        Nothing ->
            NoTicker

        Just s ->
            if String.isEmpty s then
                NoTicker

            else
                Ticker s


type alias Chart =
    { lines : List (List Float)
    , bars : List (List Float)
    , candlesticks : List Candlestick
    , valueRange : ( Float, Float )
    , numVlines : Int
    }


type alias ChartInfoWindow =
    { ticker : String
    , startdate : UnixTime
    , xaxis : List UnixTime
    , chart : Chart
    , chart2 : Maybe Chart
    , chart3 : Maybe Chart
    , strokes : List String
    , numIncMonths : Int
    }


type alias ChartInfo =
    { ticker : String
    , minDx : UnixTime
    , xAxis : List UnixTime
    , chart : Chart
    , chart2 : Maybe Chart
    , chart3 : Maybe Chart
    }


type alias RiscLine =
    { ticker : String
    , be : Float
    , stockPrice : Float
    , optionPrice : Float
    , risc : Float
    , ask : Float
    }


type alias RiscLines =
    List RiscLine


type alias RiscLinesJs =
    { riscLines : RiscLines
    , valueRange : ( Float, Float )
    }


type alias Spot =
    { tm : UnixTime
    , o : Float -- open
    , h : Float -- high
    , l : Float -- low
    , c : Float -- close
    }


type ChartType
    = DayChart
    | WeekChart
    | MonthChart


type Msg
    = AlertOk
    | TickersFetched (Result Http.Error CS.SelectItems)
    | FetchCharts String
    | ChartsFetched (Result Http.Error ChartInfo)
    | Previous
    | Next
    | Last
    | FetchRiscLines
    | RiscLinesFetched (Result Http.Error RiscLines)
    | ClearRiscLines
    | RiscLinesCleared (Result Http.Error T.JsonStatus)
    | FetchSpot
    | SpotFetched (Result Http.Error Spot)


type alias Model =
    { dlgAlert : DLG.DialogState
    , chartType : ChartType
    , selectedTicker : Maybe String
    , tickers : CS.SelectItems
    , dropAmount : Drop
    , takeAmount : Take
    , chartInfo : Maybe ChartInfo
    , curValueRange : Maybe ( Float, Float )
    }
