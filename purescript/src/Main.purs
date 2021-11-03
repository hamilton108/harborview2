module Main where

import Prelude
import Effect (Effect)

import Control.Monad.Reader 
    ( runReader 
    )
import Effect.Aff
    ( launchAff_
    )
import Effect.Class
    ( liftEffect
    )
import Effect.Console 
    ( logShow
    )
import Data.Either 
    ( Either(..)
    )

import Maunaloa.Common 
    ( ChartMappings
    , Drop(..)
    , Take(..)
    , Env(..)
    , Ticker(..)
    , ChartType
    , asChartType
    )
import Maunaloa.ChartCollection
    ( paintAff
    )
import Maunaloa.LevelLine 
    ( Line(..)
    , clear
    )
import Maunaloa.ChartTransform
    ( transform 
    )
import Maunaloa.JsonCharts
    ( fetchCharts 
    )
import Maunaloa.MaunaloaError 
    ( handleErrorAff
    )

createEnv :: ChartType -> Ticker -> Drop -> Take -> ChartMappings -> Env
createEnv ctype tik curDrop curTake mappings = 
    Env
    { ticker: tik 
    , dropAmt: curDrop
    , takeAmt: curTake
    , chartType: ctype 
    , mappings: mappings
    }

paint :: Int -> ChartMappings -> String -> Int -> Int -> Effect Unit
paint chartTypeId mappings ticker dropAmt takeAmt = 
    let
        curTicker = Ticker ticker 
        curChartType = asChartType chartTypeId
        curDrop = Drop dropAmt
        curTake = Take takeAmt
    in 
    launchAff_ $
        fetchCharts curTicker curChartType >>= \charts ->
            case charts of 
                Left err ->
                    handleErrorAff err 
                Right jsonChartResponse ->
                    let 
                        curEnv = createEnv curChartType curTicker curDrop curTake mappings
                        collection = runReader (transform jsonChartResponse) curEnv
                    in
                    (liftEffect $ logShow collection) *>
                    paintAff collection

clearLevelLines :: Effect Unit
clearLevelLines =
    logShow "clearLevelLines" *>
    clear

tmp :: Line -> Int
tmp (StdLine v) = 1
tmp (RiscLine v) = 2
tmp (BreakEvenLine v) = 3

{-
newtype Ax = Ax
  { a :: ChartHeight}

instance showAx :: Show Ax where
  show (Ax x) = "(Ax " <> show x <> ")"

tryMe :: Number -> Ax -> Maybe Ax
tryMe v (Ax {a: (ChartHeight h)}) = 
  let 
    axx = Ax { a: ChartHeight (v * h) }
  in
  Just axx

tryMes :: Number -> Array Ax -> Effect Unit
tryMes v axs = 
  let 
    tt = map (tryMe v) axs
  in
  logShow tt
 -}
