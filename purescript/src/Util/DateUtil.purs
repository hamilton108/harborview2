module Util.DateUtil where
  
import Prelude
import Data.Maybe (fromMaybe)
import Data.Array (head,last)
--import Data.Tuple (Tuple(..))
import Maunaloa.Common
    ( ValueRange(..)
    )


day_ :: Number 
day_ =
    86400000.0

dateRangeOf :: Number -> Array Number -> ValueRange 
dateRangeOf dx lx =
    let
        offsetHi =
            dx + (day_ * (fromMaybe 0.0 $ head lx))

        offsetLow =
            dx + (day_ * (fromMaybe 0.0 $ last lx))

    in
    ValueRange { minVal: offsetLow, maxVal: offsetHi }
    --Tuple  dx + (offsetLow * day_), dx + (offsetHi * day_) )
