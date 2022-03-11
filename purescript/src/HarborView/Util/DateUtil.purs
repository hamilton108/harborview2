module HarborView.Util.DateUtil where
  
import Prelude
import Data.Maybe 
    ( fromMaybe
    )
import Data.Array 
    ( head
    , last
    )
import Data.Tuple 
    ( Tuple(..)
    )
import Data.Int
    ( toNumber
    )
import HarborView.Maunaloa.Common
    ( UnixTime(..) 
    , dayInMillis
    )

dateRangeOf :: UnixTime -> Array Int -> Tuple UnixTime UnixTime
dateRangeOf (UnixTime dx) lx =
    let 
        hi = 
            dx + (dayInMillis * (toNumber $ fromMaybe 0 $ head lx))

        lo = 
            dx + (dayInMillis * (toNumber $ fromMaybe 0 $ last lx))

    in
    Tuple (UnixTime lo) (UnixTime hi)
