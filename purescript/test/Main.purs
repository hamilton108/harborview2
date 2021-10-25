module Test.Main where

import Prelude

import Test.Unit.Main (runTest)

import Effect (Effect)

import Test.CandlestickTest (testCandlestickSuite)
import Test.HRulerTest (testHRulerSuite)
import Test.VRulerTest (testVRulerSuite)
import Test.ChartTest (testChartSuite)
import Test.ChartTransformTest (testChartTransformSuite)
--import Test.ChartCollectionTest (testChartColletionSuite)
import Test.ElmTest (testElmSuite)
import Test.Util.DateUtilTest (testDateUtilSuite)


main :: Effect Unit
main = runTest do
    testDateUtilSuite
    testChartSuite
    testChartTransformSuite
    testCandlestickSuite
    testHRulerSuite
    testVRulerSuite
    --testChartColletionSuite
    --testElmSuite
