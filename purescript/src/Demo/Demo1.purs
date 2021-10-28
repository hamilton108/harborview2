module Demo.Demo1 where

import Prelude
import Effect (Effect)
import Control.Monad.Reader 
    ( Reader 
    , runReader
    , ask 
    )
import Control.Monad.Reader.Class
    ( class MonadReader 
    )

newtype Env =
    Env
    { x :: String
    }

demo :: forall m. (MonadReader Env m) => m String
demo =
    ask >>= \(Env t) ->
    pure t.x 

runDemo :: Effect String
runDemo = 
    let 
        xx = runReader demo (Env { x: "sfsdf" })
    in
    pure xx

a :: Int
a = 3

{-
import Effect (Effect)
import Effect.Console (logShow)

import Control.Monad.Except (runExcept)

import Data.Either (fromRight)
import Partial.Unsafe (unsafePartial)
import Foreign.Index ((!))

import Maunaloa.Common 
  ( ChartWidth(..)
  , ChartHeight(..)
  , HtmlId(..)
  )

import Maunaloa.Chart 
  ( ChartId(..)
  , readLines
  , readCandlesticks
  , readValueRange
  , readHRuler
  , readChart
  ) 

import Demo.DemoData (demox)

canvas :: HtmlId
canvas = HtmlId "canvas1"

w :: ChartWidth
w = ChartWidth 1200.0

h :: ChartHeight
h = ChartHeight 600.0

cid :: ChartId 
cid = ChartId "chart"


lines :: Effect Unit
lines = 
  logShow (unsafePartial $ fromRight $ runExcept $ readLines $ demox ! "chart")

cndl :: Effect Unit
cndl = 
  logShow (unsafePartial $ fromRight $ runExcept $ readCandlesticks $ demox ! "chart")

vr :: Effect Unit
vr = 
  logShow (unsafePartial $ fromRight $ runExcept $ readValueRange $ demox ! "chart")

hr :: Effect Unit
hr = 
  logShow (unsafePartial $ fromRight $ runExcept $ readHRuler w demox)

ch :: Effect Unit
ch = 
  logShow (unsafePartial $ fromRight $ runExcept $ readChart cid canvas w h demox)
-}