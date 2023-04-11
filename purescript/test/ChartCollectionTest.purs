module Test.ChartCollectionTest where

--import Util.Value (foreignValue)
import HarborView.Maunaloa.Chart as Chart 
--import Maunaloa.ChartCollection as ChartCollection
import HarborView.Maunaloa.Common 
    ( HtmlId(..)
    , StockTicker(..)
    , ChartHeight(..)
    , ChartMapping(..)
    , ChartId(..)
    , ChartMappings
    )

chartMapping :: HtmlId -> HtmlId -> HtmlId -> ChartMapping
chartMapping levelCanvasId addLevelId fetchLevelId = 
    ChartMapping 
    { ticker: StockTicker "1"
    , chartId: ChartId "chart"
    , canvasId: HtmlId "test-canvasId"
    , chartHeight: ChartHeight 500.0
    , levelCanvasId: levelCanvasId 
    , addLevelId: addLevelId 
    , fetchLevelId: fetchLevelId 
    }

asChartLevel :: ChartMapping -> Chart.ChartLevel
asChartLevel (ChartMapping m) = 
    { levelCanvasId: m.levelCanvasId
    , addLevelId: m.addLevelId
    , fetchLevelId: m.fetchLevelId 
    } 

chartMappingsWithoutChartLevel :: ChartMappings 
chartMappingsWithoutChartLevel = [chartMapping (HtmlId "") (HtmlId "") (HtmlId "")]
     
chartMappingWithChartLevel :: ChartMapping
chartMappingWithChartLevel = chartMapping (HtmlId "level-canvasid") (HtmlId "add-level-id") (HtmlId "fetch-level-id")

chartMappingsWithChartLevel :: ChartMappings 
chartMappingsWithChartLevel = [chartMappingWithChartLevel]


{--
testChartColletionSuite :: TestSuite
testChartColletionSuite = 
    suite "ChartCollection" do
        test "Without ChartCollection" do
            let collection = runExcept $ ChartCollection.fromMappings chartMappingsWithoutChartLevel TC.demox 
            let collection1 = unsafePartial $ fromRight collection
            let (Chart.Chart chart1) = unsafePartial $ fromJust $ Array.head collection1
            Assert.equal chart1.chartLevel Nothing 
        test "With ChartCollection" do
            let collection = runExcept $ ChartCollection.fromMappings chartMappingsWithChartLevel TC.demox 
            let collection1 = unsafePartial $ fromRight collection
            let (Chart.Chart chart1) = unsafePartial $ fromJust $ Array.head collection1
            Assert.equal (Just $ asChartLevel chartMappingWithChartLevel) chart1.chartLevel 
--}

