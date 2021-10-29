module Main where

import Prelude
import Effect (Effect)

import Data.Either 
    ( Either(..)
    )
import Maunaloa.Common 
    ( ChartMappings
    , Drop(..)
    , Take(..)
    , Env(..)
    , Ticker(..)
    , ChartType(..)
    , asChartType
    )
import Maunaloa.ChartCollection
    ( paint
    )
import Effect.Aff
    ( launchAff_
    )
import Effect.Console 
    ( logShow
    )
import Maunaloa.LevelLine 
    ( Line(..)
    , clear
    )
import Maunaloa.ChartTransform
    ( transform 
    )
import Maunaloa.Json.JsonCharts
    ( fetchCharts 
    )


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

{-
paint_ :: Collection.ChartMappings -> ChartInfoWindow -> Effect Unit
paint_ mappings ciwin = 
    let 
        coll = Elm.transform mappings ciwin
    in 
    Collection.paint coll
-}

curEnv :: String -> Drop -> Take -> ChartMappings -> Env
curEnv stik curDrop curTake mappings = 
    Env
    { ticker: Ticker stik 
    , dropAmt: curDrop
    , takeAmt: curTake
    , chartType: DayChart
    , mappings: mappings
    }


paint :: Int -> ChartMappings -> String -> Effect Unit
paint chartTypeId mappings ticker = 
    launchAff_ $
        fetchCharts (Ticker ticker) (asChartType chartTypeId) >>= \charts ->
            case charts of 
                Left err ->
                    pure unit
                Right charts1 ->
                    pure unit


{-
    let 
        env = ticker (Drop 0) (Take 90) mappings
        coll = runReader (transform "") env
    in
    paint coll
-}

 
clearLevelLines :: Effect Unit
clearLevelLines =
    logShow "clearLevelLines" *>
    clear


tmp :: Line -> Int
tmp (StdLine v) = 1
tmp (RiscLine v) = 2
tmp (BreakEvenLine v) = 3