module Test.Main where

import Prelude

import Test.Unit.Main (runTest)

import Effect (Effect)

import Test.CandlestickTest (testCandlestickSuite)
import Test.HRulerTest (testHRulerSuite)
import Test.VRulerTest (testVRulerSuite)
import Test.ChartTest (testChartSuite)
--import Test.ChartCollectionTest (testChartColletionSuite)
import Test.ElmTest (testElmSuite)


main :: Effect Unit
main = runTest do
    testChartSuite
    testCandlestickSuite
    testHRulerSuite
    testVRulerSuite
    testVRulerSuite
    --testChartColletionSuite
    testElmSuite
