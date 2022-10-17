module HarborView.Maunaloa.Repository where

import Prelude 
    ( Unit 
    )
import Effect 
    ( Effect
    )
import Data.Maybe
    ( Maybe(..)
    )
import HarborView.Maunaloa.JsonCharts
    ( JsonChartResponse 
    )

foreign import setJsonResponse :: String -> JsonChartResponse -> Effect Unit

foreign import getJsonResponseImpl :: 
    (JsonChartResponse -> Maybe JsonChartResponse) 
    -> Maybe JsonChartResponse 
    -> String 
    -> Maybe JsonChartResponse

getJsonResponse :: String -> Maybe JsonChartResponse 
getJsonResponse key = getJsonResponseImpl Just Nothing key

foreign import resetChart :: String -> Effect Unit

foreign import resetCharts :: Effect Unit


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