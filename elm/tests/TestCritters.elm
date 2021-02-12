module TestCritters exposing (x)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Json.Decode as JD
import Json.Encode as JE
import Test exposing (..)
import Test.Html.Event as Event
import Test.Html.Query as Query
import Test.Html.Selector as S


x =
    3



{-
   suite : Test
   suite =
       test "a" <|
           \_ ->
               Expect.equal 1 1
-}
