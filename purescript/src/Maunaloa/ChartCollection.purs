module Maunaloa.ChartCollection where

import Prelude

import Data.Maybe (Maybe(..),fromJust)
import Data.String (length)
import Data.Traversable (traverse_)
import Partial.Unsafe (unsafePartial)
import Effect (Effect)
import Data.Array as Array


import Maunaloa.Chart as C
import Maunaloa.HRuler as H
import Maunaloa.Common 
    ( HtmlId(..)
    , Ticker
    , ChartWidth(..)
    , ChartHeight
    )
import Maunaloa.LevelLine as LevelLine


import Effect.Console (logShow)

newtype ChartCollection = ChartCollection 
    { ticker :: String
    , charts :: Array C.Chart -- List C.Chart
    , hruler :: H.HRuler
    }

newtype ChartMapping = ChartMapping 
    { ticker ::Ticker 
    , chartId :: C.ChartId
    , canvasId :: HtmlId
    , chartHeight :: ChartHeight 
    , levelCanvasId :: HtmlId
    , addLevelId :: HtmlId
    , fetchLevelId :: HtmlId
    }

instance showChartMapping :: Show ChartMapping where
    show (ChartMapping x) = "(ChartMapping " <> show x <> ")"

type ChartMappings = Array ChartMapping

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
findChartPredicate (C.Chart chart) =
    chart.chartLevel /= Nothing

findLevelLineChart :: Array C.Chart -> Maybe C.Chart
findLevelLineChart charts = 
    Array.find findChartPredicate charts

levelLines :: String -> Array C.Chart -> Effect Unit
levelLines ticker charts = 
    let
        levelLine = Array.find findChartPredicate charts
    in
    case levelLine of 
        Nothing ->
            logShow "ERROR! (levelLines) No levelLine!" *>
            pure unit
        Just (C.Chart levelLine1) ->
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