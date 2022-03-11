module Test.CandlestickTest where

import Test.Unit (TestSuite,suite,test)
import Test.Unit.Assert as Assert

import HarborView.Maunaloa.Candlestick as CA
import HarborView.Maunaloa.Candlestick
    ( Candlestick(..)
    )
import HarborView.Maunaloa.JsonCharts
    ( JsonCandlestick
    )
import Test.VRulerTest as VT

testCandle :: JsonCandlestick
testCandle = { o: 40.0, h: 50.0, l: 10.0, c: 30.0 }

pixCandle :: Candlestick
pixCandle = Candlestick { o: 50.0, h: 0.0, l: 200.0, c: 100.0 }

testCandlestickSuite :: TestSuite
testCandlestickSuite = 
  suite "Candlesticks" do
    test "Scale candlestick" do
      let result = CA.candleToPix VT.testVRuler testCandle
      Assert.equal pixCandle result