module Maunaloa.Charts where
  
import Prelude

import Effect.Console (logShow)

import Effect.Class (liftEffect)
import Effect (Effect)
import Effect.Aff 
    ( Aff
    , launchAff_
    )

import Affjax as Affjax
import Affjax.ResponseFormat as ResponseFormat

import Data.Either (Either(..))
import Data.Array 
    ( take
    , drop
    , filter
    , concat
    , (:)
    )

--import Data.Tuple (fst,snd)
--import Data.Nullable 
--    ( Nullable
--    )
import Data.Foldable 
    ( minimum
    , maximum
    , minimumBy
    , maximumBy
    )
import Data.Ord
    ( abs
    )
import Data.Ordering
    ( Ordering
    )
import Partial.Unsafe (unsafePartial)
import Data.Maybe 
    ( Maybe(..)
    , fromJust 
    , fromMaybe
    )

import Maunaloa.Common 
    ( mainURL
    , showJson
    , alert
    , Ticker(..)
    , Scaling(..)
    , UnixTime(..)
    , ValueRange(..)
    , valueRange
    )
import Maunaloa.Json.JsonCharts 
    ( JsonChartInfo
    , JsonChart
    , JsonChartWindow
    , JsonCandlestick
    )
import Maunaloa.Candlestick 
    ( Candlestick
    )
import Maunaloa.Chart
    ( padding
    )
import Maunaloa.ChartCollection
    ( ChartCollection(..)
    , ChartMappings
    , ChartMapping(..)
    , globalChartWidth
    , mappingToChartLevel
    )
import Maunaloa.HRuler as H
import Util.DateUtil (dateRangeOf)


data ChartType
    = DayChart
    | WeekChart
    | MonthChart


{-
type ChartInfoWindow =
    { ticker :: String
    , startdate :: Number
    , xaxis :: Array Number
    , chart :: Chart
    , chart2 :: Maybe Chart
    , chart3 :: Maybe Chart
    , strokes :: Array String
    , numIncMonths :: Int
    }
-}

newtype Drop = Drop Int

newtype Take = Take Int

nullValueRange = ValueRange { minVal: 0.0, maxVal: 0.0 }

days :: String -> String
days ticker =
    mainURL <> "/days/" <> ticker

slice :: forall a. Drop -> Take -> Array a -> Array a
slice (Drop dropAmount) (Take takeAmount) vals =
    if dropAmount == 0 then
        take takeAmount vals
    else
        take takeAmount $ drop dropAmount vals

incMonths :: ChartType -> Int
incMonths DayChart = 1
incMonths WeekChart = 3
incMonths MonthChart = 6

-- cndl = [] :: Array JsonCandlestick 
cndl = [{o:1.0,h:3.0,l:0.5,c:2.0},{o:3.0,h:7.0,l:2.0,c:5.0},{o:6.0,h:6.4,l:3.0,c:3.0}] :: Array JsonCandlestick 
linex = [[1.0,2.1,3.2],[4.1,5.2,6.3],[7.4,8.5,9.6]] :: Array (Array Number)

minMaxCndl :: Array JsonCandlestick -> Maybe ValueRange
minMaxCndl cndl = 
    minimumBy (\x y -> if x.l < y.l then LT else GT) cndl >>= \mib ->
    maximumBy (\x y -> if x.h > y.h then GT else LT) cndl >>= \mab ->
    Just $ ValueRange { minVal: mib.l, maxVal: mab.h }

minMaxArray :: Array Number -> Maybe ValueRange
minMaxArray ar = 
    minimum ar >>= \mib ->
    maximum ar >>= \mab ->
    Just $ ValueRange { minVal: mib, maxVal: mab }

minMaxRanges :: Scaling -> Array (Maybe ValueRange) -> ValueRange
minMaxRanges (Scaling scale) vals = 
    let 
        mmas = map (\y -> fromMaybe nullValueRange y) $ filter (\x -> x /= Nothing) vals
        result = 
            fromMaybe nullValueRange $
                minimumBy (\(ValueRange x) (ValueRange y) -> if x.minVal < y.minVal then LT else GT) mmas >>= \mib ->
                maximumBy (\(ValueRange x) (ValueRange y) -> if x.maxVal > y.maxVal then GT else LT) mmas >>= \mab ->
                    let 
                        (ValueRange mibx) = mib
                        (ValueRange mabx) = mab
                    in
                    Just $ ValueRange { minVal: mibx.minVal / scale, maxVal: mabx.maxVal * scale}
    in
    result 

{-
minMax :: Array (Array Number) -> Array (Maybe ValueRange)
minMax vals = 
    let 
        mmas = filter (\x -> x /= Nothing) $ (minMaxCndl : map minMaxArray vals)
    in
    Nothing
-}

normalizeLine :: Array Number -> Array Number
normalizeLine line = 
    let 
        (ValueRange vr) = fromMaybe (valueRange (-1.0) 1.0) $ minMaxArray line
        scalingFactor = max (abs vr.minVal) vr.maxVal
        scalingFn x = x / scalingFactor
    in
    map scalingFn line


chartValueRange ::
    Array (Array Number)
    -> Array (Array Number)
    -> Array JsonCandlestick
    -> Scaling
    -> ValueRange 
chartValueRange lx bars cx scaling =
    let 
        minMaxLines = 
            map minMaxArray lx 

        minMaxBars = 
            map minMaxArray bars

        minMaxCandlesticks = 
            minMaxCndl cx

        allVr = minMaxCandlesticks : (concat [minMaxLines,minMaxBars]) 
    in
    minMaxRanges scaling allVr

{-
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
-}

chartWindow :: Drop -> Take -> JsonChart -> Scaling -> Boolean -> JsonChartWindow
chartWindow dropAmt takeAmt c scaling doNormalizeLines =
    let
        lines_ = 
            let 
                tmp = slice dropAmt takeAmt $ fromMaybe [] c.lines
            in
            if doNormalizeLines == true then
                tmp
            else
                tmp

            --if doNormalizeLines == true then
            --    normalizeLines <| List.map sliceFn c.lines

            --else
            --    List.map sliceFn c.lines

        bars_ =
            slice dropAmt takeAmt $ fromMaybe [] c.bars

        cndl_ =
            slice dropAmt takeAmt $ fromMaybe [] c.candlesticks
            {-
            if c.candlesticks == Nothing then
                []
            else
                slice dropAmt takeAmt $ unsafePartial $ fromJust c.candlesticks
            -}

        valueRange =
            chartValueRange lines_ bars_ cndl_ scaling 

    in
    { lines: lines_
    , bars: bars_
    , candlesticks: cndl_
    , valueRange: valueRange
    , numVlines: 10
    }

transform :: ChartMappings -> JsonChartInfo-> ChartCollection
transform mappings jci = 
{--}
    let 
        dropAmt = Drop 0
        takeAmt = Take 90
        xaxis = slice dropAmt takeAmt jci.xAxis
        tm = UnixTime 1234.0 --jci.startdate
        ruler = H.create globalChartWidth tm jci.xAxis padding
        ruler1 = unsafePartial (fromJust ruler)
    in
    ChartCollection 
        { ticker: "NA"
        , charts: []
        , hruler: ruler1 
        }
--}

{-
chartWindow :: Drop -> Take -> Chart -> Scaling -> Boolean -> Chart
chartWindow dropAmt takeAmt c scaling doNormalizeLines =
    let
        sliceFn =
            slice dropAmt takeAmt

        lines_ =
            map sliceFn c.lines
            --if doNormalizeLines == true then
            --    normalizeLines <| List.map sliceFn c.lines

            --else
            --    List.map sliceFn c.lines

        bars_ =
            map sliceFn c.bars

        cndl_ =
            sliceFn c.candlesticks

        valueRange =
            chartValueRange lines_ bars_ cndl_ scaling
    in
    { lines: Just lines_
    , bars: Just bars_
    , candlesticks: Just cndl_
    }
    --    valueRange
    --   c.numVlines


chartInfoWindow :: Ticker -> Drop -> Take -> ChartType -> JsonChartInfo -> ChartInfoWindow 
chartInfoWindow (Ticker t) dropAmt takeAmt chartType jci = 
    let
        strokes = 
            [ "#000000", "#ff0000", "#aa00ff" ]

        xAxis_ =
            slice dropAmt takeAmt jci.xAxis

        minMaxDate =
            dateRangeOf jci.minDx xAxis_
        
        chw =
            chartWindow dropAmt takeAmt jci.chart (Scaling 1.05) false

    in
    { ticker: t
    , startdate: 1.0
    , xaxis: [] 
    , chart: emptyChart 
    , chart2: Nothing 
    , chart3: Nothing
    , strokes: [] 
    , numIncMonths: 3
    }

transformMapping1 :: ChartMapping -> Maybe ElmChart -> Maybe Chart 
transformMapping1 cm@(ChartMapping mapping) elmChart = 
    elmChart >>= \ec -> 
    let 
        h = mapping.chartHeight
        range = Chart.valueRangeFor ec.valueRange
        vr = Chart.vruler range globalChartWidth h
        linesToPix = map (Line.lineToPix vr) ec.lines
        cndlToPix = map (Candlestick.candleToPix vr) ec.candlesticks
        clevel = mappingToChartLevel cm
    in
    pure $ Chart 
            { lines: linesToPix
            , candlesticks: cndlToPix
            , canvasId: mapping.canvasId
            , vruler: vr 
            , w: globalChartWidth
            , h: h
            , chartLevel: clevel 
            }
-}