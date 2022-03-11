module Main where

import Prelude
import Effect (Effect)

import Control.Monad.Reader (runReader)
import Effect.Aff  (launchAff_)
import Effect.Class (liftEffect)
import Effect.Console (logShow)
import Data.Number.Format (toString)
import Data.Either (Either(..))
import Data.Int (toNumber)
import Data.Maybe (Maybe(..))
import HarborView.Maunaloa.Common 
    ( ChartMappings
    , Drop(..)
    , Take(..)
    , Env(..)
    , Ticker(..)
    , ChartType
    , asChartType
    )
import HarborView.Maunaloa.ChartCollection 
    as ChartCollection 
import HarborView.Maunaloa.LevelLine 
    ( Line(..)
    , clear
    )
import HarborView.Maunaloa.ChartTransform (transform)
import HarborView.Maunaloa.JsonCharts (fetchCharts)
import HarborView.Maunaloa.MaunaloaError (handleErrorAff)
import HarborView.Maunaloa.Repository as Repository 

createEnv :: ChartType -> Ticker -> Drop -> Take -> ChartMappings -> Env
createEnv ctype tik curDrop curTake mappings = 
    Env
    { ticker: tik 
    , dropAmt: curDrop
    , takeAmt: curTake
    , chartType: ctype 
    , mappings: mappings
    }

reposIdFor :: Int -> String -> String 
reposIdFor chartTypeId ticker = 
    ticker <> ":" <> (toString $ toNumber chartTypeId)

paint :: Int -> ChartMappings -> String -> Int -> Int -> Effect Unit
paint chartTypeId mappings ticker dropAmt takeAmt = 
    let
        curTicker = Ticker ticker 
        curChartType = asChartType chartTypeId
        curEnv = createEnv curChartType curTicker (Drop dropAmt) (Take takeAmt) mappings
        reposId = reposIdFor chartTypeId ticker 
        cachedResponse =  Repository.getJsonResponse reposId
    in 
    case cachedResponse of 
        Just cachedResponse1 ->
            let 
                collection = runReader (transform cachedResponse1) curEnv
            in
            logShow "Fetched response from repository" *>
            ChartCollection.paint collection
        Nothing ->
            launchAff_ $
                fetchCharts curTicker curChartType >>= \charts ->
                    case charts of 
                        Left err ->
                            handleErrorAff err 
                        Right jsonChartResponse ->
                            let 
                                collection = runReader (transform jsonChartResponse) curEnv
                            in
                            (liftEffect $ Repository.setJsonResponse reposId jsonChartResponse) *>
                            ChartCollection.paintAff collection
        

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
