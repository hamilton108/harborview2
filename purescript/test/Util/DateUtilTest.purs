module Test.Util.DateUtilTest where

import Prelude

import Test.Unit.Assert as Assert
import Test.Unit 
    ( suite
    , test
    , TestSuite
    )
import Data.Tuple 
    ( Tuple(..)
    )
import HarborView.Maunaloa.Common
    ( UnixTime(..) 
    )
import HarborView.Util.DateUtil
    ( dateRangeOf 
    )

startDx :: UnixTime 
startDx = UnixTime 1636671600000.0 -- Nov 12, 2021

testXaxis :: Array Int
testXaxis = [16,15,14,13,12,4,3,2,1,0] 

startDx2 :: UnixTime 
startDx2 = UnixTime 1262304000000.0 -- Jan 01, 2010

testXaxis2 :: Array Int
testXaxis2 = [4226,4225,4224,4221,4220,4219,4218,4217,4214,4213,4212,4211,4210,4207,4206,4205,4204,4203,4200,4199,4198,4197,
            4196,4193,4192,4191,4190,4189,4186,4185,4184,4183,4182,4179,4178,4177,4176,4175,4172,4171,4170,4169,4168,4165,
            4164,4163,4162,4158,4157,4156,4155,4151,4149,4148,4147,4144,4143,4142,4141,4140,4137,4136,4135,4134,4133,4130,
            4129,4128,4127,4126,4123,4122,4121,4120,4119,4116,4115,4114,4113,4107,4106,4105,4102,4101,4100,4099,4098,4095,
            4094,4093]

expected :: Tuple UnixTime UnixTime
expected = Tuple (UnixTime 1636671600000.0) (UnixTime 1638054000000.0)

expected2 :: Tuple UnixTime UnixTime
expected2 = Tuple (UnixTime 1615939200000.0) (UnixTime 1627430400000.0)

testDateUtilSuite :: TestSuite
testDateUtilSuite = 
    suite "testDateUtilSuite" do
        test "dateRangeOf" do
            let actual = dateRangeOf startDx testXaxis
            Assert.equal expected actual
        test "dateRangeOf2" do
            let actual2 = dateRangeOf startDx2 testXaxis2
            Assert.equal expected2 actual2
