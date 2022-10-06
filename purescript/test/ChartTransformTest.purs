module Test.ChartTransformTest where

import Prelude

import Test.Unit.Assert as Assert
import Test.Unit.Console (log)
import Test.Unit 
    ( suite
    , test
    , TestSuite
    )
import Control.Monad.Reader 
    ( runReader 
    )
import Data.Maybe 
    ( Maybe(..)
    , fromMaybe
    )
import Data.Array 
    ( length
    , take
    , head
    ) 
import Data.Either 
    ( Either
    , fromRight
    )
--import Partial.Unsafe (unsafePartial)

import Data.Argonaut.Parser as Parser
import Data.Argonaut.Core 
    ( Json
    , fromString
    )
--import Data.Argonaut.Decode as Decode
--import Data.Argonaut.Decode.Error (JsonDecodeError)

import HarborView.Maunaloa.JsonCharts 
    ( JsonChartResponse
    , chartsFromJson
    , emptyJsonChart
    )
import HarborView.Maunaloa.ChartCollection
    ( ChartCollection(..)
    , EmptyChartCollection(..)
    )
import HarborView.Maunaloa.Common 
    ( HtmlId(..)
    , Ticker(..)
    , ChartHeight(..)
    , ChartWidth(..)
    , Scaling(..)
    , ValueRange
    , UnixTime(..)
    , Pix(..)
    , Padding(..)
    , ChartId(..)
    , ChartMappings
    , ChartMapping(..)
    , Env(..)
    , Drop(..)
    , Take(..)
    , ChartType(..)
    , valueRange
    )
import HarborView.Maunaloa.Chart
    ( Chart(..)
    , ChartLevel
    , ChartContent
    , ChartContent2
    , emptyChart
    )
import HarborView.Maunaloa.ChartTransform
    ( minMaxRanges 
    , normalizeLine 
    , transform
    , transformEmpty
    , chartWindow
    )
import HarborView.Maunaloa.HRuler
    ( HRuler(..)
    )
import HarborView.Maunaloa.VRuler
    ( VRuler(..)
    )
import HarborView.Maunaloa.Candlestick
    ( Candlestick(..)
    )

import Effect.Console (logShow)
--import Maunaloa.HRuler as H

testJsonStr :: String
testJsonStr =
    """{"ticker":"NHY","chart":
            {"lines":[
                [57.4,57.0,56.5,56.2,56.1,55.8,55.8,56.4,57.2,57.2,56.8,56.4,56.2,55.9,56.1,56.4,56.2,55.7,55.1,54.7,
                54.4,54.0,53.5,52.8,51.9,51.1,50.8,50.9,51.4,52.3,53.2,53.8,54.0,53.9,54.0,54.3,54.7,55.0,55.0,55.0,
                54.6,53.7,52.8,52.0,51.2,51.1,51.7,52.3,53.0,54.1,54.9,55.2,55.3,54.9,54.2,53.4,53.1,53.0,52.9,53.0,
                53.2,53.6,53.9,54.3,54.3,54.1,54.1,54.5,54.7,54.6,54.0,53.3,52.7,52.5,52.5,52.7,52.7,52.7,52.5,52.1,
                51.4,50.9,50.3,50.1,50.6,51.5,52.2,52.2,51.8,51.2,51.1,50.8,50.4,49.7,48.8,48.5,48.5,48.4,48.4,48.2]],
            "bars":null,
            "candlesticks":[
                {"o":57.78,"h":58.48,"l":57.38,"c":57.88},{"o":57.2,"h":58.1,"l":56.88,"c":58.1},
                {"o":55.98,"h":57.52,"l":55.3,"c":57.34},{"o":58.0,"h":58.0,"l":55.5,"c":56.16},
                {"o":56.5,"h":56.8,"l":56.12,"c":56.64},{"o":55.42,"h":56.46,"l":54.52,"c":56.26},
                {"o":54.06,"h":55.38,"l":54.04,"c":55.38},{"o":55.5,"h":55.5,"l":53.28,"c":53.52},
                {"o":58.5,"h":58.7,"l":55.36,"c":55.4},{"o":57.44,"h":58.2,"l":57.3,"c":58.0},
                {"o":56.5,"h":57.68,"l":56.44,"c":57.22},{"o":56.3,"h":57.26,"l":56.22,"c":56.76},
                {"o":56.16,"h":56.5,"l":55.02,"c":56.18},{"o":54.0,"h":56.4,"l":54.0,"c":56.4},
                {"o":55.8,"h":55.94,"l":53.64,"c":53.74},{"o":56.4,"h":56.92,"l":56.14,"c":56.36},
                {"o":57.3,"h":57.3,"l":56.06,"c":56.06},{"o":56.3,"h":57.28,"l":56.12,"c":56.98},
                {"o":55.16,"h":56.2,"l":55.02,"c":55.94},{"o":55.16,"h":55.84,"l":54.9,"c":55.0},
                {"o":55.0,"h":55.2,"l":54.44,"c":54.94},{"o":54.28,"h":55.26,"l":54.28,"c":54.78},
                {"o":55.08,"h":55.28,"l":54.2,"c":54.44},{"o":54.58,"h":55.48,"l":54.4,"c":55.24},
                {"o":53.62,"h":54.44,"l":53.3,"c":54.3},{"o":52.04,"h":53.36,"l":52.0,"c":53.18},
                {"o":51.58,"h":51.58,"l":50.5,"c":51.28},{"o":49.0,"h":50.96,"l":48.25,"c":50.96},
                {"o":50.12,"h":50.7,"l":49.51,"c":49.67},{"o":50.98,"h":51.14,"l":50.34,"c":50.46},
                {"o":52.46,"h":52.74,"l":50.66,"c":51.46},{"o":54.34,"h":54.4,"l":52.44,"c":52.44},
                {"o":54.28,"h":55.02,"l":53.9,"c":54.32},{"o":53.54,"h":54.86,"l":53.54,"c":54.1},
                {"o":53.54,"h":54.1,"l":53.24,"c":53.24},{"o":53.76,"h":54.48,"l":53.26,"c":53.26},
                {"o":53.7,"h":53.92,"l":52.68,"c":53.48},{"o":55.32,"h":55.32,"l":53.94,"c":53.94},
                {"o":54.2,"h":55.32,"l":54.2,"c":55.24},{"o":56.34,"h":56.5,"l":54.1,"c":54.2},
                {"o":56.2,"h":56.8,"l":55.64,"c":56.3},{"o":55.2,"h":56.1,"l":55.08,"c":56.1},
                {"o":54.28,"h":55.28,"l":54.28,"c":54.74},{"o":54.2,"h":54.92,"l":53.56,"c":54.18},
                {"o":51.0,"h":53.56,"l":50.72,"c":53.56},{"o":50.64,"h":51.24,"l":50.12,"c":50.44},
                {"o":52.0,"h":52.44,"l":50.2,"c":50.22},{"o":50.88,"h":51.78,"l":50.38,"c":51.78},
                {"o":51.98,"h":52.12,"l":50.08,"c":50.58},{"o":53.16,"h":53.16,"l":50.64,"c":50.9},
                {"o":54.4,"h":55.88,"l":53.7,"c":53.88},{"o":54.28,"h":54.9,"l":52.84,"c":53.88},
                {"o":56.1,"h":56.36,"l":54.7,"c":55.38},{"o":55.98,"h":56.04,"l":54.86,"c":55.62},
                {"o":55.66,"h":56.74,"l":55.5,"c":56.44},{"o":54.2,"h":55.36,"l":53.86,"c":55.0},
                {"o":54.47,"h":55.18,"l":53.87,"c":52.87},{"o":52.97,"h":54.43,"l":52.97,"c":53.89},
                {"o":53.42,"h":53.63,"l":52.36,"c":52.54},{"o":51.78,"h":53.07,"l":51.68,"c":53.01},
                {"o":52.85,"h":53.24,"l":51.93,"c":51.93},{"o":53.28,"h":53.63,"l":52.6,"c":52.75},
                {"o":53.73,"h":53.93,"l":52.83,"c":52.85},{"o":55.29,"h":55.78,"l":52.13,"c":53.1},
                {"o":54.22,"h":54.78,"l":52.99,"c":54.73},{"o":53.07,"h":54.2,"l":53.05,"c":53.98},
                {"o":53.05,"h":54.0,"l":52.95,"c":53.01},{"o":53.73,"h":54.59,"l":52.4,"c":53.01},
                {"o":54.63,"h":55.16,"l":53.67,"c":53.91},{"o":55.55,"h":56.0,"l":54.45,"c":54.63},
                {"o":55.18,"h":55.92,"l":55.12,"c":55.43},{"o":53.94,"h":55.18,"l":53.85,"c":54.43},
                {"o":52.64,"h":53.67,"l":52.64,"c":53.44},{"o":52.26,"h":53.98,"l":52.24,"c":52.4},
                {"o":51.74,"h":52.34,"l":51.23,"c":51.54},{"o":52.28,"h":52.85,"l":51.8,"c":52.07},
                {"o":52.56,"h":53.01,"l":51.91,"c":52.07},{"o":52.48,"h":53.36,"l":52.07,"c":52.26},
                {"o":55.25,"h":55.25,"l":52.05,"c":52.26},{"o":52.73,"h":53.69,"l":52.46,"c":53.5},
                {"o":52.05,"h":52.62,"l":51.87,"c":52.19},{"o":51.78,"h":52.24,"l":50.88,"c":51.83},
                {"o":49.78,"h":51.95,"l":49.78,"c":51.85},{"o":49.16,"h":49.67,"l":48.05,"c":48.9},
                {"o":47.76,"h":48.92,"l":47.67,"c":48.74},{"o":48.36,"h":49.24,"l":47.38,"c":47.96},
                {"o":50.97,"h":51.66,"l":50.35,"c":50.58},{"o":52.54,"h":52.81,"l":51.23,"c":51.44},
                {"o":51.11,"h":52.91,"l":51.07,"c":52.91},{"o":50.25,"h":51.39,"l":50.12,"c":50.72},
                {"o":50.8,"h":51.11,"l":49.88,"c":50.25},{"o":50.31,"h":51.07,"l":49.84,"c":50.76},
                {"o":50.6,"h":50.72,"l":49.51,"c":50.27},{"o":50.06,"h":51.4,"l":50.02,"c":51.29},
                {"o":48.06,"h":49.69,"l":47.98,"c":49.61},{"o":47.33,"h":48.12,"l":46.93,"c":47.33},
                {"o":48.01,"h":48.24,"l":46.97,"c":47.59},{"o":46.94,"h":48.15,"l":46.8,"c":47.82},
                {"o":48.06,"h":48.2,"l":46.5,"c":46.67},{"o":48.43,"h":49.14,"l":47.56,"c":47.96}]},
        "chart2":
            {"lines":[
                [0.5,1.1,0.9,-0.1,0.6,0.4,-0.4,-2.9,-1.8,0.8,0.5,0.3,0.0,0.5,-2.4,0.0,-0.1,1.3,0.8,0.3,0.6,0.8,
                0.9,2.4,2.4,2.1,0.5,0.1,-1.8,-1.9,-1.7,-1.4,0.3,0.2,-0.7,-1.0,-1.2,-1.1,0.2,-0.8,1.7,2.4,2.0,
                2.2,2.3,-0.6,-1.5,-0.5,-2.4,-3.2,-1.0,-1.3,0.1,0.7,2.2,1.6,-0.2,0.9,-0.3,0.1,-1.3,-0.9,-1.1,-1.2,
                0.5,-0.1,-1.1,-1.5,-0.8,0.1,1.4,1.1,0.7,-0.1,-1.0,-0.6,-0.6,-0.4,-0.3,1.4,0.8,0.9,1.6,-1.2,-1.9,
                -3.5,-1.6,-0.8,1.2,-0.5,-0.8,-0.1,-0.1,1.6,0.8,-1.2,-0.9,-0.6,-1.7,-0.3]],
            "bars":null,
            "candlesticks":null},
        "chart3":
            {"lines":null,
            "bars":[
                [0.09198195940547159,0.11989745404036914,0.10826354108695246,0.13840079890560805,0.11986398337200169,0.10735890773180097,
                0.11968099549489271,0.14434307096860158,0.1760597359218508,0.11220328443935546,0.08698219456164497,0.10043284051363724,
                0.08221279980896512,0.11515750964698687,0.1932880365748575,0.09949285396444273,0.09361404535176651,0.11454048792640563,
                0.10579877255497086,0.08684467446568338,0.15384468856867234,0.09252715798544738,0.08939559247773371,0.11122453062413001,
                0.15123853916773347,0.15931725452200216,0.1459285723812297,0.1589853237660188,0.34214546792792055,0.13771664440500286,
                0.2084655329012203,0.17872523274239258,0.11799788991206818,0.1150304551174929,0.0957082115833783,0.16466930692488027,
                0.12563009570186204,0.09458399277569604,0.06803170198763442,0.13349091668598648,0.15051673415361677,0.167084906438793,
                0.10132668923017271,0.17681887237733063,0.4284371584532071,0.1429608823289357,0.15990294335761027,0.18172958418453805,
                0.2038359874711854,0.19201270519769167,0.19574843381840595,0.16800179216444314,0.11099869135749055,0.12264045348575793,
                0.1347224394571766,0.11052177421727294,0.1379681051651591,0.14266306038561655,0.18715457648054104,0.07686776699335188,
                0.209407880584313,0.12670983585205697,0.16602418298864288,0.27478898642073607,0.1539996938183664,0.12387085950442862,
                0.11832509840025521,0.1544455652385444,0.1320434458847574,0.102848631470839,0.18779773021007645,0.15709724623506033,
                0.14430018767185623,0.21967198489742182,0.11141115592373078,0.1378114088330785,0.15462456471379835,0.1294887628213559,
                0.2670270778026165,0.1524637124031704,0.14196952516384834,0.11914071062600233,0.2600780692969826,0.20456101511400096,
                0.18259730089211934,0.34991449185494955,0.1851218635447116,0.3463144965261658,0.2710949924370329,0.18305679669303415,
                0.20683041576951555,0.15597159160271026,0.2173619982646304,0.2943790591162199,0.2868680369283894,0.17973717006105192,
                0.16707909932569207,0.16644673023477266,0.2163669717698364,0.2277446697880857]],
            "candlesticks":null},
        "minDx":1262304000000,
        "xAxis":[4226,4225,4224,4221,4220,4219,4218,4217,4214,4213,4212,4211,4210,4207,4206,4205,4204,4203,4200,4199,4198,4197,
                4196,4193,4192,4191,4190,4189,4186,4185,4184,4183,4182,4179,4178,4177,4176,4175,4172,4171,4170,4169,4168,4165,
                4164,4163,4162,4158,4157,4156,4155,4151,4149,4148,4147,4144,4143,4142,4141,4140,4137,4136,4135,4134,4133,4130,
                4129,4128,4127,4126,4123,4122,4121,4120,4119,4116,4115,4114,4113,4107,4106,4105,4102,4101,4100,4099,4098,4095,
                4094,4093,4092,4091,4088,4087,4086,4085,4084,4081,4080,4079]}"""

testJson :: Either String Json
testJson = Parser.jsonParser testJsonStr

defaultJsonChartInfo :: JsonChartResponse
defaultJsonChartInfo =
    { ticker: "NHY"
    , chart: emptyJsonChart 
    , chart2: emptyJsonChart 
    , chart3: emptyJsonChart 
    , xAxis: []
    , minDx: 0.0
    }

chartMapping :: HtmlId -> HtmlId -> HtmlId -> ChartMapping
chartMapping levelCanvasId addLevelId fetchLevelId = 
    ChartMapping 
    { ticker: Ticker "NHY"
    , chartId: ChartId "chart"
    , canvasId: HtmlId "test-canvasId"
    , chartHeight: ChartHeight 500.0
    , levelCanvasId: levelCanvasId 
    , addLevelId: addLevelId 
    , fetchLevelId: fetchLevelId 
    }

defaultChartMappings :: ChartMappings
defaultChartMappings =
    let 
        mapping1 = chartMapping (HtmlId "level-id") (HtmlId "add-level-id") (HtmlId "fetch-level-id")
    in
    [mapping1]

testJsonChartResponse :: JsonChartResponse
testJsonChartResponse =
    let 
        json = fromRight (fromString "") testJson
        result = chartsFromJson json
    in
    fromRight defaultJsonChartInfo result

testValueRanges :: Array (Maybe ValueRange)
testValueRanges = 
    [ Nothing
    , Nothing
    , Just (valueRange 1.0 7.5)
    , Just (valueRange 3.0 10.5)
    , Just (valueRange 3.5 10.0)
    , Nothing
    , Nothing
    ]

expectedValueRange :: ValueRange
expectedValueRange = 
    valueRange 1.0 10.5

expectedValueRangeWithScale :: ValueRange
expectedValueRangeWithScale = 
    valueRange 0.5 21.0

testLine :: Array Number
testLine = 
    [ (-7.0)
    , (-10.0)
    , (-6.0)
    , (-4.0)
    , (-2.0)
    , (-3.0)
    , 0.0
    , (-1.0)
    , 0.0
    , 1.0
    , 3.0
    , 4.0
    , 2.0
    , 5.0
    , 6.0
    , 8.0
    , 7.0
    , 6.0
    , 5.0
    , 4.0
    ]

expectedLine :: Array Number
expectedLine = 
    [ (-0.7)
    , (-1.0)
    , (-0.6)
    , (-0.4)
    , (-0.2)
    , (-0.3)
    , 0.0
    , (-0.1)
    , 0.0
    , 0.1
    , 0.3
    , 0.4
    , 0.2
    , 0.5
    , 0.6
    , 0.8
    , 0.7
    , 0.6
    , 0.5
    , 0.4
    ]

expectedXaxis10 :: Array Number
expectedXaxis10 = 
    [ 1250.9701492537315
    , 1241.9402985074628
    , 1232.910447761194
    , 1205.8208955223881
    , 1196.7910447761194
    , 1187.761194029851
    , 1178.7313432835822
    , 1169.7014925373135
    , 1142.6119402985075
    , 1133.5820895522388
    ]

expectedChartLines10 :: Array Number
expectedChartLines10 = 
    [ 128.24635528573714
    , 140.3593522430676
    , 155.50059843973077
    , 164.58534615772857
    , 167.61359539706123
    , 176.69834311505926
    , 176.69834311505926
    , 158.52884767906343
    , 134.30285376440227
    , 134.30285376440227
    ]

expectedCandlesticks10 :: Array Candlestick
expectedCandlesticks10 = 
    [ (Candlestick { c: 113.71075893694038, h: 95.54126350094477, l: 128.85200513360354, o: 116.73900817627305})
    , (Candlestick { c: 107.04861061040862, h: 107.04861061040862, l: 143.9932513302667, o: 134.30285376440227})
    , (Candlestick { c: 130.06330482933657, h: 124.61245619853783, l: 191.83958931172242, o: 171.24749448426053})
    , (Candlestick { c: 165.79664585346183, h: 110.0768598497413, l: 185.7830908330571, o: 110.0768598497413})
    , (Candlestick { c: 151.26104950466507, h: 146.41585072173297, l: 167.00794554919483, o: 155.50059843973077})
    , (Candlestick { c: 162.76839661412913, h: 156.7118981354638, l: 215.45993337851678, o: 188.20569022452312})
    , (Candlestick { c: 189.41698992025616, h: 189.41698992025616, l: 229.9955297273135, o: 229.3898798794469})
    , (Candlestick { c: 245.74242577184307, h: 185.7830908330571, l: 253.01022394624144, o: 185.7830908330571})
    , (Candlestick { c: 188.81134007238975, h: 88.87911517441279, l: 190.0226397681228, o: 94.93561365307814})
    , (Candlestick { c: 110.0768598497413, h: 104.02036137107595, l: 131.2746045250698, o: 127.0350555900041})
    ]

expectedVruler :: VRuler
expectedVruler = 
    VRuler 
    { h: ChartHeight 500.0
    , maxVal: 61.635000000000005
    , padding: 
        Padding 
        { bottom: 0.0
        , left: 50.0
        , right: 50.0
        , top: 0.0
        }
    , ppy: Pix 30.28249239332631
    , w: ChartWidth 1310.0
    }

expectedChartLevel :: Maybe ChartLevel
expectedChartLevel =
    Just 
    { levelCanvasId: HtmlId "level-id"
    , addLevelId: HtmlId "add-level-id"
    , fetchLevelId: HtmlId "fetch-level-id"
    }

testEnv :: Env
testEnv = Env
    { ticker: Ticker "1"
    , dropAmt: Drop 0
    , takeAmt: Take 90
    , chartType: DayChart
    , mappings: defaultChartMappings 
    , globalChartWidth: ChartWidth 1310.0
    , scaling: Scaling 1.05
    }

getFirstChartFromColl :: Array Chart -> ChartContent
getFirstChartFromColl charts =
    case take 1 charts of
        [c] -> 
            case c of 
                (Chart cx) -> 
                    cx
                _ ->
                    emptyChart
        _ -> emptyChart

emptyChart2 :: ChartContent2 
emptyChart2 = 
    { canvasId: HtmlId "empty chart"
    , w: ChartWidth 0.0
    , h: ChartHeight 0.0
    }

getFirstChartFromColl2 :: Array Chart -> ChartContent2
getFirstChartFromColl2 charts =
    case take 1 charts of
        [c] -> 
            case c of 
                (ChartWithoutTicker cx) -> 
                    cx
                _ ->
                    emptyChart2
        _ -> emptyChart2


testChartTransformSuite :: TestSuite
testChartTransformSuite = 
    let 
        testJsonChartResponse1 = testJsonChartResponse
    in
    suite "TestChartsSuite" do
        test "minMaxRanges no scaling" do
            let actual = minMaxRanges (Scaling 1.0) testValueRanges
            Assert.equal expectedValueRange actual 
        test "minMaxRanges with scaling" do
            let actual = minMaxRanges (Scaling 2.0) testValueRanges
            Assert.equal expectedValueRangeWithScale actual 
        test "normalizeLine" do
            let actual = normalizeLine testLine
            Assert.equal expectedLine actual
        test "transform" do
            let cw = chartWindow (Drop 0) (Take 90) testJsonChartResponse1.chart (Scaling 1.0) false 10
            Assert.equal 90 (length cw.candlesticks)
            Assert.equal 90 (length $ fromMaybe [] $ head cw.lines)
            let (ChartCollection coll) = runReader (transform testJsonChartResponse1) testEnv 
            let (HRuler hruler) = coll.hruler
            Assert.equal 1 (length coll.charts)
            Assert.equal (UnixTime 1615939200000.0) hruler.startTime
            Assert.equal (UnixTime 1627430400000.0) hruler.endTime
            let (Ticker tkr) = coll.ticker
            Assert.equal "NHY" tkr 
            Assert.equal (Pix 9.029850746268657) hruler.ppx
            let actualXaxis10 = take 10 hruler.xaxis
            Assert.equal expectedXaxis10 actualXaxis10
            let chart1 = getFirstChartFromColl coll.charts -- fromMaybe emptyChart (head collection.charts) 
            Assert.equal expectedVruler chart1.vruler
            let line1_1 = fromMaybe [] (head chart1.lines)
            Assert.equal 90 (length line1_1)
            Assert.equal 90 (length chart1.candlesticks)
            let actualChartLines10 = take 10 line1_1 
            Assert.equal expectedChartLines10 actualChartLines10
            let actualCandlesticks10 = take 10 chart1.candlesticks 
            Assert.equal expectedCandlesticks10 actualCandlesticks10 
            Assert.equal (HtmlId "test-canvasId") chart1.canvasId
            Assert.equal expectedChartLevel chart1.chartLevel
            Assert.equal (ChartWidth 1310.0) chart1.w
            Assert.equal (ChartHeight 500.0) chart1.h
        test "transformEmpty" do
            let (EmptyChartCollection coll) = runReader transformEmpty testEnv 
            Assert.equal 1 (length coll)
            let chart1 = getFirstChartFromColl2 coll
            --log (show chart1)
            Assert.equal (HtmlId "test-canvasId") chart1.canvasId
            Assert.equal (ChartWidth 1310.0) chart1.w
            Assert.equal (ChartHeight 500.0) chart1.h


