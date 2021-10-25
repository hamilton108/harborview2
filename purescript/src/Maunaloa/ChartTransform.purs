module Maunaloa.ChartTransform where
  
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
import Data.Tuple 
    ( Tuple(..)
    )
import Partial.Unsafe 
    ( unsafePartial
    )
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
    , Padding(..)
    , valueRange
    )
import Maunaloa.Json.JsonCharts 
    ( JsonChartResponse 
    , JsonChart
    , JsonChartWindow
    , JsonCandlestick
    )
import Maunaloa.Candlestick 
    ( Candlestick
    )
import Maunaloa.Chart
    ( padding
    , vruler
    , valueRangeFor
    , Chart(..)
    , ChartId(..)
    )
import Maunaloa.ChartCollection
    ( ChartCollection(..)
    , ChartMappings
    , ChartMapping(..)
    , globalChartWidth
    , mappingToChartLevel
    )
import Maunaloa.Line
    ( lineToPix
    )
import Maunaloa.Candlestick 
    ( candleToPix 
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

chartWindow :: Drop -> Take -> JsonChart -> Scaling -> Boolean -> Int -> JsonChartWindow
chartWindow dropAmt takeAmt c scaling doNormalizeLines numVlines =
    let
        lines_ = 
            let 
                tmp = slice dropAmt takeAmt $ fromMaybe [] c.lines
            in
            if doNormalizeLines == true then
                map normalizeLine tmp
            else
                tmp

        bars_ =
            slice dropAmt takeAmt $ fromMaybe [] c.bars

        cndl_ =
            slice dropAmt takeAmt $ fromMaybe [] c.candlesticks

        valueRange =
            chartValueRange lines_ bars_ cndl_ scaling 

    in
    { lines: lines_
    , bars: bars_
    , candlesticks: cndl_
    , valueRange: valueRange
    , numVlines: numVlines 
    }


transformMapping1 :: ChartMapping -> JsonChartWindow -> Chart 
transformMapping1 cm@(ChartMapping mapping) ec = 
    let 
        h = mapping.chartHeight
        --range = valueRangeFor ec.valueRange
        vr = vruler ec.valueRange globalChartWidth h
        linesToPix = map (lineToPix vr) ec.lines
        cndlToPix = map (candleToPix vr) ec.candlesticks
        clevel = mappingToChartLevel cm
    in
    Chart 
        { lines: linesToPix
        , candlesticks: cndlToPix
        , canvasId: mapping.canvasId
        , vruler: vr 
        , w: globalChartWidth
        , h: h
        , chartLevel: clevel 
        }


transformMapping :: Drop -> Take -> JsonChartResponse -> ChartMapping -> Maybe Chart 
transformMapping dropAmt takeAmt response cm@(ChartMapping mapping) =
    case mapping.chartId of
        ChartId "chart" -> 
            let 
                cw = chartWindow dropAmt takeAmt response.chart (Scaling 1.05) false 10
            in
            Just $ transformMapping1 cm cw
            --transformMapping1 mapping1 (Just ciwin.chart)
        ChartId "chart2" -> 
            --transformMapping1 mapping1 (toMaybe ciwin.chart2)
            Nothing
        ChartId "chart3" -> 
            --transformMapping1 mapping1 (toMaybe ciwin.chart3)
            Nothing
        _ -> 
            Nothing


transform :: ChartMappings -> JsonChartResponse -> ChartCollection
transform mappings response = 
    let 
        dropAmt = Drop 0
        takeAmt = Take 90
        xaxis = slice dropAmt takeAmt response.xAxis
        tm = UnixTime response.minDx 
        ruler = H.create globalChartWidth tm xaxis padding
        ruler1 = unsafePartial (fromJust ruler)
        maybeCharts = filter (\c -> c /= Nothing) (map (transformMapping dropAmt takeAmt response) mappings) 
        charts1 = map (unsafePartial $ fromJust) maybeCharts
    in
    ChartCollection 
        { ticker: response.ticker
        , charts: charts1
        , hruler: ruler1 
        }

demo = 
    let 
        padding = Padding { bottom: 0.0, left: 50.0, right: 50.0, top: 0.0}
        xaxis = [4226,4225,4224,4221,4220,4219,4218,4217,4214,4213,4212,4211,4210,4207,4206,4205,4204,4203,4200,4199,4198,4197,
                4196,4193,4192,4191,4190,4189,4186,4185,4184,4183,4182,4179,4178,4177,4176,4175,4172,4171,4170,4169,4168,4165,
                4164,4163,4162,4158,4157,4156,4155,4151,4149,4148,4147,4144,4143,4142,4141,4140,4137,4136,4135,4134,4133,4130,
                4129,4128,4127,4126,4123,4122,4121,4120,4119,4116,4115,4114,4113,4107,4106,4105,4102,4101,4100,4099,4098,4095,
                4094,4093]
        tm = UnixTime 1262304000000.0
        ruler = H.create globalChartWidth tm xaxis padding
    in 
    logShow ruler   







{-
demo = 
    let 
        axisFull = [4226,4225,4224,4221,4220,4219,4218,4217,4214,4213,4212,4211,4210,4207,4206,4205,4204,4203,4200,4199,4198,4197,
            4196,4193,4192,4191,4190,4189,4186,4185,4184,4183,4182,4179,4178,4177,4176,4175,4172,4171,4170,4169,4168,4165,
            4164,4163,4162,4158,4157,4156,4155,4151,4149,4148,4147,4144,4143,4142,4141,4140,4137,4136,4135,4134,4133,4130,
            4129,4128,4127,4126,4123,4122,4121,4120,4119,4116,4115,4114,4113,4107,4106,4105,4102,4101,4100,4099,4098,4095,
            4094,4093,4092,4091,4088,4087,4086,4085,4084,4081,4080,4079,4078,4077,4074,4073,4072,4071,4070,4067,4066,4065,
            4064,4063,4060,4059,4058,4057,4056,4053,4052,4051,4050,4049,4046,4045,4044,4043,4042,4039,4038,4037,4036,4035,
            4032,4031,4030,4029,4028,4025,4024,4023,4022,4021,4016,4015,4014,4009,4008,4007,4004,4003,4002,4001,4000,3997,
            3996,3995,3994,3993,3990,3989,3988,3987,3986,3983,3982,3981,3980,3979,3976,3975,3974,3973,3972,3969,3968,3967,
            3966,3965,3962,3961,3960,3959,3958,3955,3954,3953,3952,3951,3948,3947,3946,3945,3944,3941,3940,3939,3938,3937,
            3934,3933,3932,3931,3930,3927,3926,3925,3924,3923,3920,3919,3918,3917,3916,3913,3912,3911,3910,3909,3906,3905,
            3904,3903,3902,3899,3898,3897,3896,3895,3892,3891,3890,3889,3888,3885,3884,3883,3882,3881,3878,3877,3876,3875,
            3874,3871,3870,3869,3868,3867,3864,3863,3862,3861,3860,3857,3856,3855,3854,3853,3850,3849,3848,3847,3846,3843,
            3842,3841,3840,3839,3836,3835,3834,3833,3832,3829,3828,3827,3826,3825,3822,3821,3820,3819,3818,3815,3814,3813,
            3812,3811,3808,3807,3806,3805,3801,3800,3799,3798,3797,3794,3792,3791,3790,3787,3786,3785,3784,3783,3780,3779,
            3778,3777,3776,3772,3771,3770,3769,3766,3765,3764,3763,3762,3759,3758,3757,3756,3750,3749,3748,3745,3744,3743,
            3742,3741,3738,3737,3736,3735,3734,3731,3730,3729,3728,3727,3724,3723,3722,3721,3720,3717,3716,3715,3714,3713,
            3710,3709,3708,3707,3706,3703,3702,3701,3700,3699,3696,3695,3694,3693,3692,3689,3688,3687,3686,3685,3682,3681,
            3680,3679,3678,3675,3674,3673,3672,3671,3668,3667,3666,3665,3664,3661,3660,3659,3658,3657,3654,3653,3650,3647,
            3643,3640,3639,3638]
        tm = UnixTime 1262304000000.0
        dropAmt = Drop 0
        takeAmt = Take 90
        xaxis = slice dropAmt takeAmt axisFull 
        (Tuple startDate endDate) = dateRangeOf tm xaxis
    in
    endDate 
-}

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