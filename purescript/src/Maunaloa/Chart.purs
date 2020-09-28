module Maunaloa.Chart where
  
import Prelude

import Data.Maybe (Maybe(..))
import Graphics.Canvas as Canvas -- (Context2D,Canvas)
import Effect (Effect)
import Effect.Console (logShow)

import Maunaloa.Common 
  ( ValueRange(..)
  , Padding(..)
  , ChartWidth(..)
  , ChartHeight(..)
  , HtmlId(..)
  )
import Maunaloa.HRuler as H
import Maunaloa.VRuler as V
import Maunaloa.Line as L
import Maunaloa.Candlestick as CNDL

newtype ChartId = ChartId String

instance showChartId :: Show ChartId where
  show (ChartId c) = "(ChartId " <> c <> ")"

type ChartLevel = 
    { levelCanvasId :: HtmlId
    , addLevelId :: HtmlId
    , fetchLevelId :: HtmlId
    }

newtype Chart = 
    Chart 
    { lines :: L.Lines
    , candlesticks :: CNDL.Candlesticks
    , canvasId :: HtmlId 
    , vruler :: V.VRuler
    , w :: ChartWidth
    , h :: ChartHeight
    -- , levelCanvasId :: Maybe HtmlId 
    , chartLevel :: Maybe ChartLevel
    }

newtype ChartConfig =
    ChartConfig
    { chartId :: ChartId
    , htmlId :: HtmlId
    , w :: ChartWidth
    , h :: ChartHeight
    , chartLevel :: Maybe ChartLevel
    }

derive instance eqChart :: Eq Chart

instance showChart :: Show Chart where
    show (Chart cx) = 
        "(Chart lines: " <> show cx.lines <> 
        ", candlesticks: " <> show cx.candlesticks <> 
        ", canvasId: " <> show cx.canvasId <> 
        ", vruler: " <> show cx.vruler <> 
        ", w: " <> show cx.w <> 
        ", h: " <> show cx.h <> 
        ", chartLevel: " <> show cx.chartLevel <> ")"


{-

chartWidth :: ChartWidth 
chartWidth = ChartWidth 1200.0 
-}

padding :: Padding 
padding = Padding { left: 50.0, top: 0.0, right: 50.0, bottom: 0.0 }

vruler :: ValueRange -> ChartWidth -> ChartHeight -> V.VRuler
vruler vr w h = V.create vr w h padding

valueRangeFor :: Array Number -> ValueRange
valueRangeFor [mi,ma] = ValueRange { minVal: mi, maxVal: ma }
valueRangeFor _ = ValueRange { minVal: 0.0, maxVal: 0.0 }

toRectangle :: Chart -> Canvas.Rectangle
toRectangle (Chart {w: (ChartWidth w), h: (ChartHeight h)} ) =  
    {x: 0.0, y: 0.0, width: w, height: h} 

paint :: H.HRuler -> Chart -> Effect Unit
paint hruler chart@(Chart {vruler: vrobj@(V.VRuler vr), canvasId: (HtmlId curId), lines: lines, candlesticks: candlesticks}) =
    Canvas.getCanvasElementById curId >>= \canvas ->
        case canvas of
            Nothing -> 
                logShow $ "CanvasId " <> curId <> " does not exist!"
            Just canvax ->
                logShow ("Drawing canvas: " <> curId) *>
                Canvas.getContext2D canvax >>= \ctx ->
                    let 
                        r = toRectangle chart
                    in
                    Canvas.clearRect ctx r *>
                    V.paint vrobj ctx *>
                    H.paint hruler vr.h ctx *>
                    L.paint hruler lines ctx *>
                    CNDL.paint hruler candlesticks ctx


