module Maunaloa.Repository where

import Prelude 
    ( Unit 
    )
import Effect 
    ( Effect
    )
import Data.Maybe
    ( Maybe(..)
    )
import Maunaloa.JsonCharts
    ( JsonChartResponse 
    )
import Maunaloa.Common
    ( Ticker(..)
    )

foreign import setJsonResponse :: Ticker -> JsonChartResponse -> Effect Unit

foreign import getJsonResponseImpl :: 
    (JsonChartResponse -> Maybe JsonChartResponse) 
    -> Maybe JsonChartResponse 
    -> Ticker 
    -> Maybe JsonChartResponse

getJsonResponse :: Ticker -> Maybe JsonChartResponse 
getJsonResponse key = getJsonResponseImpl Just Nothing key


{-
foreign import setDemo :: Ticker -> String -> Effect Unit 
foreign import getDemoImpl :: 
    (String -> Maybe String) 
    -> Maybe String  
    -> Ticker 
    -> Maybe String 

getDemo :: Ticker -> Maybe String 
getDemo key = getDemoImpl Just Nothing key
--}