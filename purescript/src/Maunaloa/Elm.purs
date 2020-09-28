module Maunaloa.Elm where

import Prelude 

import Partial.Unsafe (unsafePartial)
import Data.Array (filter)
import Data.Nullable (toMaybe)
import Data.Maybe 
    ( Maybe(..)
    , fromJust 
    )
import Maunaloa.ElmTypes
    ( ElmChart
    , ChartInfoWindow
    )
import Maunaloa.ChartCollection 
    ( ChartCollection(..)
    , ChartMappings
    , ChartMapping(..)
    , globalChartWidth
    , mappingToChartLevel
    )
import Maunaloa.Chart 
    ( ChartId(..)
    , Chart(..)
    )
import Maunaloa.Line as Line
import Maunaloa.Chart as Chart
import Maunaloa.HRuler as H
import Maunaloa.Candlestick as Candlestick
import Maunaloa.Common 
    ( UnixTime(..)
    )


transformMapping1 :: ChartMapping -> Maybe ElmChart -> Maybe Chart 
transformMapping1 cm@(ChartMapping mapping) elmChart = 
    elmChart >>= \ec -> 
    let 
        h = mapping.chartHeight
        range = Chart.valueRangeFor ec.valueRange
        vr = Chart.vruler range globalChartWidth h
        linesToPix = map (Line.lineToPix vr) ec.lines
        cndlToPix = map (Candlestick.candleToPix vr) ec.candlesticks
        clevel = mappingToChartLevel cm
    in
    pure $ Chart 
            { lines: linesToPix
            , candlesticks: cndlToPix
            , canvasId: mapping.canvasId
            , vruler: vr 
            , w: globalChartWidth
            , h: h
            , chartLevel: clevel 
            }

transformMapping :: ChartInfoWindow -> ChartMapping -> Maybe Chart 
transformMapping ciwin mapping1@(ChartMapping mapping) =
    case mapping.chartId of
        ChartId "chart" -> 
            transformMapping1 mapping1 (Just ciwin.chart)
        ChartId "chart2" -> 
            transformMapping1 mapping1 (toMaybe ciwin.chart2)
        ChartId "chart3" -> 
            transformMapping1 mapping1 (toMaybe ciwin.chart3)
        _ -> 
            Nothing


transform :: ChartMappings -> ChartInfoWindow -> ChartCollection
transform mappings ciwin = 
    let 
        tm = UnixTime ciwin.startdate
        ruler = H.create globalChartWidth tm ciwin.xaxis Chart.padding
        ruler1 = unsafePartial (fromJust ruler)
        maybeCharts = filter (\c -> c /= Nothing) (map (transformMapping ciwin) mappings)
        charts1 = map (unsafePartial $ fromJust) maybeCharts
    in
    ChartCollection 
    { ticker: ciwin.ticker
    , charts: charts1
    , hruler: ruler1
    }

