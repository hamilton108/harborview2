module Main where

import Prelude
import Effect (Effect)

import Maunaloa.ChartCollection as Collection

import Maunaloa.ElmTypes (ChartInfoWindow)
import Maunaloa.Elm as Elm
--import Effect.Console (logShow)

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
