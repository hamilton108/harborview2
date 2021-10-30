module Maunaloa.ChartCollection where

import Prelude

import Effect.Aff
    ( Aff
    )
import Effect 
    ( Effect
    )
import Effect.Class
    ( liftEffect
    )
import Effect.Console 
    ( logShow
    )
import Data.Maybe 
    ( Maybe(..)
    , fromJust
    )
import Data.String 
    ( length
    )
import Data.Traversable 
    ( traverse_
    )
import Partial.Unsafe 
    ( unsafePartial
    )
import Data.Array as Array


import Maunaloa.Chart as C
import Maunaloa.Chart 
    ( Chart(..)
    )
import Maunaloa.HRuler as H
import Maunaloa.Common 
    ( HtmlId(..)
    , ChartWidth(..)
    , ChartMapping(..)
    )
import Maunaloa.LevelLine as LevelLine


newtype ChartCollection = ChartCollection 
    { ticker :: String
    , charts :: Array C.Chart -- List C.Chart
    , hruler :: H.HRuler
    }

instance showChartCollection :: Show ChartCollection where
    show (ChartCollection coll) = "(ChartCollection " <> show coll <> ")"


globalChartWidth :: ChartWidth
globalChartWidth = ChartWidth 1310.0

mappingToChartLevel :: ChartMapping -> Maybe C.ChartLevel 
mappingToChartLevel (ChartMapping {levelCanvasId, addLevelId, fetchLevelId}) = 
    let 
        (HtmlId lcaid) = levelCanvasId
    in
    if length lcaid == 0 then
        Nothing
    else
        Just
        { levelCanvasId: levelCanvasId
        , addLevelId: addLevelId
        , fetchLevelId: fetchLevelId
        }


findChartPredicate :: C.Chart -> Boolean
findChartPredicate EmptyChart =
    false
findChartPredicate (Chart chart) =
    chart.chartLevel /= Nothing

findLevelLineChart :: Array Chart -> Maybe Chart
findLevelLineChart charts = 
    Array.find findChartPredicate charts

levelLines :: String -> Array Chart -> Effect Unit
levelLines ticker charts = 
    let
        levelLine = Array.find findChartPredicate charts
    in
    case levelLine of 
        Nothing ->
            logShow "ERROR! (levelLines) No levelLine!" *>
            pure unit
        Just EmptyChart ->
            pure unit
        Just (Chart levelLine1) ->
            let 
                caid = unsafePartial $ fromJust levelLine1.chartLevel
            in
            LevelLine.initEvents ticker levelLine1.vruler caid

paint :: ChartCollection -> Effect Unit
paint (ChartCollection coll) = 
    let 
        paint_ = C.paint coll.hruler
    in
    traverse_ paint_ coll.charts *>
    levelLines coll.ticker coll.charts

paintAff :: ChartCollection -> Aff Unit
paintAff coll = 
    liftEffect $ paint coll
    