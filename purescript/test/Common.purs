module Test.Common where

import Foreign (F, Foreign, unsafeToForeign)
import Control.Monad.Except (runExcept)
import Data.Number.Approximate as Approximate
import Data.Either (Either(..))
import HarborView.Util.Value (foreignValue)
import HarborView.Maunaloa.Common (
      Padding(..)
    , ChartWidth(..)
    , ChartHeight(..))


moreOrLessEq :: Number -> Number -> Boolean
moreOrLessEq a b = 
  let 
    f = Approximate.Fraction 0.001
  in 
  Approximate.eqRelative f a b

pad0 :: Padding 
pad0 = Padding { left: 0.0, top: 0.0, right: 0.0, bottom: 0.0 }

pad1 :: Padding
pad1 = Padding { left: 10.0, top: 20.0, right: 50.0, bottom: 60.0 }

chartWidth :: ChartWidth
chartWidth = ChartWidth 600.0

chartHeight :: ChartHeight
chartHeight = ChartHeight 200.0

demo :: F Foreign
demo = foreignValue """{ 
  "startdate":1548115200000, 
  "xaxis":[10,9,8,5,4], 
  "chart3": null,
  "chart2": null,
  "chart": { "candlesticks":null,"lines":[[3.0,2.2,3.1,4.2,3.5]],"valueRange":[2.2,4.2] }}"""

demox :: Foreign
demox = 
  case runExcept demo of
    Right result -> result
    Left _ -> unsafeToForeign "what?"
