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

--import Web.DOM.ParentNode (QuerySelector(..))
--import Web.HTML (HTMLElement)
--import Halogen.Aff as HA

import HarborView.Maunaloa.Common 
    ( ChartMappings
    , Drop(..)
    , Take(..)
    , Env(..)
    , StockTicker(..)
    , ChartType
    , ChartWidth(..)
    , Scaling(..)
    , asChartType
    )
import HarborView.Maunaloa.ChartCollection 
    as ChartCollection 
import HarborView.Maunaloa.LevelLine 
    ( Line(..)
    , clear
    )
import HarborView.Maunaloa.ChartTransform as ChartTransform 
import HarborView.Maunaloa.JsonCharts (fetchCharts)
import HarborView.Maunaloa.MaunaloaError (handleErrorAff)
import HarborView.Maunaloa.Repository as Repository 

createEnv :: ChartType -> StockTicker -> Drop -> Take -> ChartMappings -> Env
createEnv ctype tik curDrop curTake mappings = 
    Env
    { ticker: tik 
    , dropAmt: curDrop
    , takeAmt: curTake
    , chartType: ctype 
    , mappings: mappings
    , globalChartWidth: ChartWidth 1750.0
    , scaling: Scaling 1.1
    }

createEnvEmpty :: ChartMappings -> Env
createEnvEmpty mappings = 
    Env
    { ticker: StockTicker "-"
    , dropAmt: Drop 0 
    , takeAmt: Take 0
    , chartType: asChartType 1 
    , mappings: mappings
    , globalChartWidth: ChartWidth 1750.0
    , scaling: Scaling 1.0
    }


reposIdFor :: Int -> String -> String 
reposIdFor chartTypeId ticker = 
    ticker <> ":" <> (toString $ toNumber chartTypeId)

resetChart :: Int -> String -> Effect Unit
resetChart chartTypeId ticker = 
    let
        reposId = reposIdFor chartTypeId ticker 
    in
    Repository.resetChart reposId

resetCharts :: Effect Unit
resetCharts = 
    Repository.resetCharts 

paint :: Int -> ChartMappings -> String -> Int -> Int -> Effect Unit
paint chartTypeId mappings ticker dropAmt takeAmt = 
    let
        curTicker = StockTicker ticker 
        curChartType = asChartType chartTypeId
        curEnv = createEnv curChartType curTicker (Drop dropAmt) (Take takeAmt) mappings
        reposId = reposIdFor chartTypeId ticker 
        cachedResponse =  Repository.getJsonResponse reposId
    in 
    logShow ("StockTicker: " <> ticker) *>
    case cachedResponse of 
        Just cachedResponse1 ->
            let 
                collection = runReader (ChartTransform.transform cachedResponse1) curEnv
            in
            logShow "Fetched response from repository" *>
            ChartCollection.paint curChartType collection
        Nothing ->
            launchAff_ $
                fetchCharts curTicker curChartType >>= \charts ->
                    case charts of 
                        Left err ->
                            handleErrorAff err 
                        Right jsonChartResponse ->
                            let 
                                collection = runReader (ChartTransform.transform jsonChartResponse) curEnv
                            in
                            (liftEffect $ Repository.setJsonResponse reposId jsonChartResponse) *>
                            ChartCollection.paintAff curChartType collection
        

paintEmpty :: ChartMappings -> Effect Unit
paintEmpty mappings = 
    let 
        curEnv = createEnvEmpty mappings
        collection = runReader (ChartTransform.transformEmpty) curEnv
    in
    let 
        (ChartCollection.EmptyChartCollection coll) = collection
    in
    logShow "__paintEmpty__" *>
    logShow coll *>
    ChartCollection.paintEmpty collection

clearLevelLines :: Int -> Effect Unit
clearLevelLines cti =
    logShow "clearLevelLines" *>
    clear cti

tmp :: Line -> Int
tmp (StdLine v) = 1
tmp (RiscLine v) = 2
tmp (BreakEvenLine v) = 3

main :: Effect Unit
main = 
    paint 4  [] "-" 0 0 *>
    paintEmpty [] *>
    clearLevelLines 1  *> 
    resetCharts 

{-
run :: Maybe HTMLElement -> QuerySelector -> Aff Unit
run node qs = 
  case node of 
      Nothing ->
          let 
            QuerySelector qs1 = qs
          in
          liftEffect (logShow $ "No such element: " <> qs1) 
      Just nodex ->
          -- runUI Button.component unit nodex *>
          pure unit

main :: Effect Unit
main = HA.runHalogenAff $
    HA.awaitLoad *> 
    let 
      qs1 = QuerySelector "#ps-main"
    in
    HA.selectElement qs1 >>= \node ->
      run node qs1

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
