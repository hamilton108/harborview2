module Test.HRulerTest where

import Prelude

import Partial.Unsafe (unsafePartial)
import Data.Maybe (fromJust)
import Test.Unit.Assert as Assert
import Test.Unit (suite, test, TestSuite)
import Data.Array as Array

import HarborView.Maunaloa.HRuler as H
import HarborView.Maunaloa.Common 
    ( Pix(..)
    , UnixTime(..)
    , RulerLineInfo(..) 
    , OffsetBoundary(..)
    , Padding
    , calcPpx 
    )
import Test.Common (moreOrLessEq,chartWidth,pad0,pad1)

offsets :: Array Int
offsets = [17,16,15,14,11,10,9,8,7,4,3,2,0]

jan_2_19 :: UnixTime 
jan_2_19 = UnixTime 1546387200000.0

jan_11_19 :: UnixTime 
jan_11_19 = UnixTime 1547164800000.0

jan_19_19 :: UnixTime 
jan_19_19 = UnixTime 1547856000000.0 

jan_20_19 :: UnixTime 
jan_20_19 = UnixTime 1547942400000.0  

jan_21_19 :: UnixTime 
jan_21_19 = UnixTime 1548028800000.0

feb_11_19 :: UnixTime 
feb_11_19 = UnixTime  1549843200000.0 

april_1_19 :: UnixTime 
april_1_19 = UnixTime 1554076800000.0

testHRuler_ :: UnixTime -> Array Int -> Padding -> H.HRuler 
testHRuler_ tm myOffsets myPadding =
    let 
        hr = H.create chartWidth tm myOffsets myPadding 1
        hrx = unsafePartial $ fromJust hr
    in 
    hrx

testHRuler :: UnixTime -> H.HRuler 
testHRuler tm =
    testHRuler_ tm offsets pad0

testHRulerPadding :: UnixTime -> H.HRuler 
testHRulerPadding tm =
    testHRuler_ tm offsets pad1

testHRulerSuite :: TestSuite
testHRulerSuite = 
    suite "HRuler" do
        test "startTime and endTime" do
            let (H.HRuler hr) = testHRuler jan_2_19 
            Assert.equal jan_2_19 hr.startTime
            Assert.equal jan_19_19 hr.endTime
        test "timeStampToPix half width of canvas" do
            let hr = testHRuler jan_2_19 
            let t = H.timeStampToPix hr jan_11_19
            Assert.equal 300.0 t
        test "timeStampToPix half width of canvas (padding)" do
            let hr = testHRulerPadding jan_2_19 
            let t = H.timeStampToPix hr jan_11_19
            Assert.equal 280.0 t
        test "timeStampToPix full width of canvas" do
            let hr = testHRuler jan_2_19 
            let t = H.timeStampToPix hr jan_20_19
            Assert.equal 600.0 t
        test "timeStampToPix full width of canvas (padding)" do
            let hr = testHRulerPadding jan_2_19 
            let t = H.timeStampToPix hr jan_20_19
            Assert.equal 550.0 t
        test "offsetsToPix" do
            let (H.HRuler {ppx: (Pix ppd),xaxis}) = testHRuler jan_2_19 
            Assert.assert "Pix pr day should be 33.33" $ moreOrLessEq ppd 33.33
            let expectedOffests = [566.66,533.28,499.95,466.62,366.63,333.3,299.97,266.64,233.31,133.32,99.99,66.66,0.0]
            let result = Array.zipWith moreOrLessEq expectedOffests xaxis
            Assert.equal [true,true,true,true,true,true,true,true,true,true,true,true,true] result 
        test "offsetsToPix (padding)" do
            let (H.HRuler {ppx: (Pix ppd),xaxis}) = testHRulerPadding jan_2_19 
            Assert.assert "Pix pr day should be 30.0" $ moreOrLessEq ppd 30.0
            let expectedOffests = [520.0,490.0,460.0,430.0,340.0,310.0,280.0,250.0,220.0,130.0,100.0,70.0,10.0]
            let result = Array.zipWith moreOrLessEq expectedOffests xaxis
            Assert.equal [true,true,true,true,true,true,true,true,true,true,true,true,true] result
        test "pixPrUnit" do
            let myOffsets = OffsetBoundary { oHead: 12, oLast: 1 } -- [12,9,8,7,1]
            let pix = calcPpx chartWidth myOffsets pad0
            Assert.equal 50.0 pix 
        test "pixPrUnit (padding)" do
            let myOffsets = OffsetBoundary { oHead: 12, oLast: 1 } -- [12,9,8,7,1]
            let pix = calcPpx chartWidth myOffsets pad1
            Assert.equal 45.0 pix 
        test "incMonts" do
            let tm = H.incMonths jan_2_19 3
            Assert.equal tm april_1_19
        test "dateToString" do
            let s = H.dateToString jan_2_19 
            Assert.equal "01.2019" s
        test "pixToDays" do
            let hr = testHRuler jan_2_19 
            let days = H.pixToDays hr (Pix 200.0)
            Assert.equal 6.0 days
        test "pixToDays (padding)" do
            let hr = testHRulerPadding jan_2_19 
            let days = H.pixToDays hr (Pix 200.0)
            Assert.assert "pixToDays should be 6.33" $ moreOrLessEq 6.33 days
        test "pixToTimeStamp" do
            let hr = testHRuler jan_2_19 
            let result = H.pixToTimeStamp hr (Pix 200.0)
            Assert.equal (UnixTime 1546905600000.0) result 
        test "pixToTimeStamp (padding)" do
            let hr = testHRulerPadding jan_2_19 
            let result = H.pixToTimeStamp hr (Pix 200.0)
            Assert.equal (UnixTime 1546934400000.0) result 
        test "startOfNextMonth" do
            let expected = UnixTime 1548979200000.0
            let result = H.startOfNextMonth jan_11_19 
            Assert.equal expected result 
        test "incDays 9" do
            let tm = H.incDays jan_2_19 9
            Assert.equal jan_11_19 tm
        test "incDays 40" do
            let tm = H.incDays jan_2_19 40
            Assert.equal feb_11_19 tm
        test "monthly lines" do
            let hr = testHRuler_ april_1_19 [100,0] pad0 
            let result = H.lines hr 
            let exTx (RulerLineInfo {tx}) = tx
            let resultTx = map exTx result
            Assert.equal ["07.2019","06.2019","05.2019"] resultTx 