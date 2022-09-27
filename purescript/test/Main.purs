module Test.Main where

import Prelude

import Test.Unit.Main (runTest)

import Effect (Effect)

import Test.CandlestickTest (testCandlestickSuite)
import Test.ChartTest (testChartSuite)
import Test.ChartTransformTest (testChartTransformSuite)
import Test.HRulerTest (testHRulerSuite)
import Test.Util.DateUtilTest (testDateUtilSuite)
import Test.VRulerTest (testVRulerSuite)

--import Test.ChartCollectionTest (testChartColletionSuite)

main :: Effect Unit
main = runTest do
    testCandlestickSuite
    testChartSuite
    testChartTransformSuite
    testDateUtilSuite
    testHRulerSuite
    testVRulerSuite