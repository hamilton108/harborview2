module Test.VRulerTest where

import Prelude

import Test.Unit.Assert as Assert
import Test.Unit (suite, test, TestSuite)

import HarborView.Maunaloa.VRuler as V
import HarborView.Maunaloa.Common (
     Pix(..)
    , RulerLineInfo(..) 
    , ValueRange(..)
    , calcPpy )
import Test.Common (moreOrLessEq,chartWidth,chartHeight,pad0,pad1)

valueRange :: ValueRange
valueRange = ValueRange { minVal: 10.0, maxVal: 50.0 }

testVRuler :: V.VRuler
testVRuler = V.create valueRange chartWidth chartHeight pad0

testVRulerpadding :: V.VRuler
testVRulerpadding = V.create valueRange chartWidth chartHeight pad1

testVRulerSuite :: TestSuite
testVRulerSuite = 
  suite "VRuler" do
    test "valueToPix" do
      let pix = V.valueToPix testVRuler 30.0
      Assert.equal 100.0 pix 
    test "valueToPix (padding)" do
      let pix = V.valueToPix testVRulerpadding 30.0
      Assert.equal 80.0 pix 
    test "pixToValue " do
      let val = V.pixToValue testVRuler (Pix 100.0)
      Assert.equal 30.0 val
    test "pixToValue (padding)" do
      let val = V.pixToValue testVRulerpadding (Pix 100.0)
      Assert.assert "pixToValue with padding should be 23.33" $ moreOrLessEq 23.33 val
    test "calcPpy" do
      let vr = ValueRange { minVal: 10.0, maxVal: 50.0 }
      Assert.equal 5.0 (calcPpy chartHeight vr pad0)
    test "calcPpy (padding)" do
      let vr = ValueRange { minVal: 10.0, maxVal: 50.0 }
      Assert.equal 3.0 (calcPpy chartHeight vr pad1)
    test "yaxis" do
      let prices = [50.0,40.0,30.0,10.0]
      let cyrYaxis = V.yaxis testVRuler prices
      let expectedYaxis = [0.0,50.0,100.0,200.0]
      Assert.equal expectedYaxis cyrYaxis 
    test "yaxis (padding)" do
      let prices = [50.0,40.0,30.0,10.0]
      let cyrYaxis = V.yaxis testVRuler prices
      let expectedYaxis = [0.0,50.0,100.0,200.0]
      Assert.equal expectedYaxis cyrYaxis 
    test "vruler lines" do
      let result = V.lines testVRuler 4
      let exTx (RulerLineInfo {tx}) = tx
      let resultTx = map exTx result
      Assert.equal ["50.00","40.00","30.00","20.00","10.00"] resultTx 
    test "vruler lines (padding)" do
      let result = V.lines testVRulerpadding 4
      let exTx (RulerLineInfo {tx}) = tx
      let resultTx = map exTx result
      Assert.equal ["50.00","40.00","30.00","20.00","10.00"] resultTx 