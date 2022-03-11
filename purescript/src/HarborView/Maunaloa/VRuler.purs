module HarborView.Maunaloa.VRuler where

import Prelude 

import Data.Array (range)
import Data.Int (toNumber)
import Data.Number.Format (toStringWith,fixed)
import Graphics.Canvas (Context2D)
import Effect (Effect)

import HarborView.Maunaloa.Common (
      ValueRange(..)
    , Pix(..)
    , ChartWidth(..)
    , ChartHeight(..)
    , Padding(..)
    , calcPpy
    , RulerLineBoundary
    , RulerLineInfo(..) 
    )

  
newtype VRuler = 
    VRuler 
    { ppy :: Pix
    , maxVal :: Number
    , w :: ChartWidth
    , h :: ChartHeight
    , padding :: Padding
    }

instance showHRuler :: Show VRuler where
    show (VRuler v) = "(VRuler " <> show v <> ")"

derive instance eqVRuler :: Eq VRuler 

{-
newtype VRulerLine = VRulerLine {
      p0 :: Number
    , tx :: String
}
-}

-- type LinesX = { x1:: Number, x2 :: Number }

foreign import fi_lines :: Context2D -> RulerLineBoundary -> Array RulerLineInfo -> Effect Unit 

paint :: VRuler -> Context2D -> Effect Unit
paint vruler@(VRuler {w: (ChartWidth wx)}) ctx = do
    let curLines = lines vruler 4 
    let linesX = { p1: 0.0, p2: wx }
    fi_lines ctx linesX curLines 

-- instance graphLine :: Graph VRuler where
--  draw = draw_

createLine :: VRuler -> Number -> Number -> Int -> RulerLineInfo 
createLine vruler vpix padTop n = 
    let
        curPix = padTop + (vpix * (toNumber n))
        val = pixToValue vruler (Pix curPix) 
        tx = toStringWith (fixed 2) val
    in
    RulerLineInfo { p0: curPix, tx: tx }

lines :: VRuler -> Int -> Array RulerLineInfo 
lines vr@(VRuler {h: (ChartHeight hx),padding: (Padding p)}) num = 
    let
        vpix = (hx - p.top - p.bottom) / (toNumber num)
        sections = range 0 num
    in 
    map (createLine vr vpix p.top) sections


create :: ValueRange -> ChartWidth -> ChartHeight -> Padding -> VRuler 
create vr@(ValueRange {maxVal}) w h pad = 
    VRuler 
    { ppy: Pix $ calcPpy h vr pad 
    , maxVal: maxVal 
    , w: w
    , h: h
    , padding: pad 
    }
  
yaxis :: VRuler -> Array Number -> Array Number
yaxis vr values = 
    let 
        fn = valueToPix vr
    in
    map fn values

valueToPix :: VRuler -> Number -> Number
valueToPix (VRuler {ppy:(Pix ppyVal), maxVal, padding: (Padding curPad)}) value = 
  -- Pix $ (maxVal - value) * ppyVal
    ((maxVal - value) * ppyVal) + curPad.top 

pixToValue :: VRuler -> Pix -> Number
pixToValue (VRuler {maxVal,ppy:(Pix ppyVal),padding: (Padding curPad)}) (Pix p) = 
    maxVal - ((p - curPad.top) / ppyVal)