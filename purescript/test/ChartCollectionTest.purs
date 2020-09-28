module Test.ChartCollectionTest where

--import Util.Value (foreignValue)
import Maunaloa.Chart as Chart 
import Maunaloa.ChartCollection as ChartCollection
import Maunaloa.Common 
    ( HtmlId(..)
    , Ticker(..)
    , ChartHeight(..)
    )

chartMapping :: HtmlId -> HtmlId -> HtmlId -> ChartCollection.ChartMapping
chartMapping levelCanvasId addLevelId fetchLevelId = 
    ChartCollection.ChartMapping 
    { ticker: Ticker "1"
    , chartId: Chart.ChartId "chart"
    , canvasId: HtmlId "test-canvasId"
    , chartHeight: ChartHeight 500.0
    , levelCanvasId: levelCanvasId 
    , addLevelId: addLevelId 
    , fetchLevelId: fetchLevelId 
    }

asChartLevel :: ChartCollection.ChartMapping -> Chart.ChartLevel
asChartLevel (ChartCollection.ChartMapping m) = 
    { levelCanvasId: m.levelCanvasId
    , addLevelId: m.addLevelId
    , fetchLevelId: m.fetchLevelId 
    } 

chartMappingsWithoutChartLevel :: ChartCollection.ChartMappings 
chartMappingsWithoutChartLevel = [chartMapping (HtmlId "") (HtmlId "") (HtmlId "")]
     
chartMappingWithChartLevel :: ChartCollection.ChartMapping
chartMappingWithChartLevel = chartMapping (HtmlId "level-canvasid") (HtmlId "add-level-id") (HtmlId "fetch-level-id")

chartMappingsWithChartLevel :: ChartCollection.ChartMappings 
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

