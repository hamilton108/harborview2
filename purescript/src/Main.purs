module Main where

import Prelude
import Effect (Effect)

import Maunaloa.ChartCollection as Collection
import Maunaloa.LevelLine as LevelLine

import Maunaloa.ElmTypes (ChartInfoWindow)
import Maunaloa.Elm as Elm
import Effect.Console (logShow)
--import Effect.Console (logShow)
import Maunaloa.LevelLine (Line(..))

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

paint :: Collection.ChartMappings -> ChartInfoWindow -> Effect Unit
paint mappings ciwin = 
    --logShow ciwin *> 
    let 
        coll = Elm.transform mappings ciwin
    in 
    Collection.paint coll

clearLevelLines :: Effect Unit
clearLevelLines =
  logShow "clearLevelLines" *>
  LevelLine.clear


tmp :: Line -> Int
tmp (StdLine v) = 1
tmp (RiscLine v) = 2
tmp (BreakEvenLine v) = 3