module Test.ChartTest where

import Prelude

import Test.Unit.Assert as Assert
import Test.Unit (suite, test, TestSuite)
import Data.Maybe (fromJust,Maybe(..))
import Data.Array as Array

import Partial.Unsafe (unsafePartial)

import Maunaloa.Common 
  ( ValueRange(..)
  , HtmlId(..)
  , ChartWidth(..)
  , ChartHeight(..)
  )
--import Util.Value (foreignValue)
import Maunaloa.Chart as C

import Maunaloa.Line as L
import Test.VRulerTest as VT -- (moreOrLessEq,chartDim,pad0,pad1)

cid :: C.ChartId
cid = C.ChartId "chart"

canvId :: HtmlId
canvId = HtmlId "canvasId"

chartW :: ChartWidth
chartW = ChartWidth 200.0

chartH :: ChartHeight
chartH = ChartHeight 600.0

echart :: C.Chart
echart = C.Chart {
    lines: [[360.0,600.0,330.0,0.0,210.0]]
  , candlesticks: []
  , canvasId: canvId
  , vruler : VT.testVRuler 
  , w: chartW
  , h: chartH
  , chartLevel: Nothing 
}

getLines :: C.Chart -> L.Lines
getLines (C.Chart {lines}) = lines

getLine :: C.Chart -> L.Line
getLine c =  
  let
    lx = getLines c
  in
  unsafePartial $ fromJust $ Array.head lx

chartLevel :: C.ChartLevel
chartLevel = 
    { levelCanvasId: HtmlId "canvasId"
    , addLevelId: HtmlId "levelId"
    , fetchLevelId: HtmlId "fetchLevelId"
    }

  
getChartLevel :: C.Chart -> C.ChartLevel
getChartLevel (C.Chart c) = 
    unsafePartial $ fromJust $ c.chartLevel
    


testChartSuite :: TestSuite
testChartSuite = 
    suite "TestChartSuite" do
        test "valueRangeFor" do
            let vr = C.valueRangeFor [10.0,35.0]
            let expVr = ValueRange { minVal: 10.0, maxVal: 35.0 }
            Assert.equal expVr vr
        {--
        test "readChart chart2 and chart3 are null" do
            let chart = runExcept $ C.readChart cid canvId chartW chartH Nothing TC.demox 
            let rchart = unsafePartial $ fromRight chart
            Assert.equal true $ isRight chart
            let rline = getLine rchart
            let eline = getLine echart
            let result = Array.zipWith TC.moreOrLessEq rline eline
            Assert.equal [true,true,true,true,true] result
        test "readChart with ChartLevel" do
            let chart = runExcept $ C.readChart cid canvId chartW chartH (Just chartLevel) TC.demox 
            let rchart = unsafePartial $ fromRight chart
            let cl = getChartLevel rchart
            Assert.equal chartLevel cl
        test "Create HRuler" do
            let ruler = runExcept $ C.readHRuler chartW TC.demox
            Assert.equal true $ isRight ruler
            let mr = unsafePartial $ fromRight ruler
            Assert.equal true $ isJust mr
        --}


