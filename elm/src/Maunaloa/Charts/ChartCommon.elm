module Maunaloa.Charts.ChartCommon exposing (chartInfoWindow, chartValueRange, chartWindow)

import Common.DateUtil as DU
import Maunaloa.Charts.Types as T
import Tuple exposing (first, second)


minMax : List Float -> ( Maybe Float, Maybe Float )
minMax v =
    let
        minVal =
            List.minimum v

        maxVal =
            List.maximum v
    in
    ( minVal, maxVal )


minMaxCndl : List T.Candlestick -> ( Maybe Float, Maybe Float )
minMaxCndl cndl =
    let
        lows =
            List.map .l cndl

        his =
            List.map .h cndl

        minVal =
            List.minimum lows

        maxVal =
            List.maximum his
    in
    ( minVal, maxVal )


mfunc : (number -> number -> number) -> Maybe number -> Maybe number -> Maybe number
mfunc fn a b =
    case a of
        Nothing ->
            b

        Just ax ->
            case b of
                Nothing ->
                    a

                Just bx ->
                    Just (fn ax bx)


mmin : Maybe number -> Maybe number -> Maybe number
mmin =
    mfunc min


mmax : Maybe number -> Maybe number -> Maybe number
mmax =
    mfunc max


minMaxTuples : List ( Maybe Float, Maybe Float ) -> T.Scaling -> ( Float, Float )
minMaxTuples tuples (T.Scaling scale) =
    let
        min_ =
            List.map first tuples |> List.foldr mmin Nothing |> Maybe.withDefault 0

        max_ =
            List.map second tuples |> List.foldr mmax Nothing |> Maybe.withDefault 0
    in
    ( min_ / scale, max_ * scale )


chartValueRange :
    List (List Float)
    -> List (List Float)
    -> List T.Candlestick
    -> T.Scaling
    -> ( Float, Float )
chartValueRange lx bars cx scaling =
    let
        minMaxLines =
            List.map minMax lx

        minMaxBars =
            List.map minMax bars

        minMaxCx =
            minMaxCndl cx

        result =
            minMaxCx :: (minMaxLines ++ minMaxBars)
    in
    minMaxTuples result scaling


slice : T.Drop -> T.Take -> List a -> List a
slice (T.Drop dropAmount) (T.Take takeAmount) vals =
    if dropAmount == 0 then
        List.take takeAmount vals

    else
        List.take takeAmount <| List.drop dropAmount vals


minMaxWithDefault : List Float -> Float -> Float -> ( Float, Float )
minMaxWithDefault v minDefault maxDefault =
    let
        minVal =
            List.minimum v

        maxVal =
            List.maximum v
    in
    ( Maybe.withDefault minDefault minVal
    , Maybe.withDefault maxDefault maxVal
    )


normalizeLine : List Float -> List Float
normalizeLine line =
    let
        ( mi, ma ) =
            minMaxWithDefault line -1.0 1.0

        scalingFactor =
            max (abs mi) ma

        scalingFunction x =
            x / scalingFactor
    in
    List.map scalingFunction line


normalizeLines : List (List Float) -> List (List Float)
normalizeLines lines =
    List.map normalizeLine lines


chartWindow : T.Drop -> T.Take -> T.Chart -> T.Scaling -> Bool -> T.Chart
chartWindow dropAmt takeAmt c scaling doNormalizeLines =
    let
        sliceFn =
            slice dropAmt takeAmt

        lines_ =
            if doNormalizeLines == True then
                normalizeLines <| List.map sliceFn c.lines

            else
                List.map sliceFn c.lines

        bars_ =
            List.map sliceFn c.bars

        cndl_ =
            sliceFn c.candlesticks

        valueRange =
            chartValueRange lines_ bars_ cndl_ scaling
    in
    T.Chart
        lines_
        bars_
        cndl_
        valueRange
        c.numVlines


chartInfoWindow : T.Ticker -> T.Drop -> T.Take -> T.ChartType -> T.ChartInfo -> T.ChartInfoWindow
chartInfoWindow ticker dropAmt takeAmt chartType ci =
    let
        ticker1 = case ticker of 
            T.NoTicker -> "-1"
            T.Ticker t -> t
        incMonths =
            case chartType of
                T.DayChart ->
                    1

                T.WeekChart ->
                    3

                T.MonthChart ->
                    6

        strokes =
            [ "#000000", "#ff0000", "#aa00ff" ]

        xAxis_ =
            slice dropAmt takeAmt ci.xAxis

        ( minDx_, _ ) =
            DU.dateRangeOf ci.minDx xAxis_

        chw =
            chartWindow dropAmt takeAmt ci.chart (T.Scaling 1.05) False

        chw2 =
            ci.chart2
                |> Maybe.andThen
                    (\c2 ->
                        Just (chartWindow dropAmt takeAmt c2 (T.Scaling 1.0) True)
                    )

        chw3 =
            ci.chart3
                |> Maybe.andThen
                    (\c3 ->
                        Just (chartWindow dropAmt takeAmt c3 (T.Scaling 1.0) False)
                    )
    in
    T.ChartInfoWindow ticker1 minDx_ xAxis_ chw chw2 chw3 strokes incMonths