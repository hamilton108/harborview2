module Maunaloa.Candlestick where

import Prelude

import Effect (Effect)
import Graphics.Canvas (Context2D)

import Maunaloa.Common (Xaxis)

import Maunaloa.VRuler as V
import Maunaloa.HRuler as H
import Maunaloa.ElmTypes 
  ( ElmCandlestick 
  )

foreign import fi_paint :: Xaxis -> Candlesticks -> Context2D -> Effect Unit 

newtype Candlestick = Candlestick {
      o :: Number
    , h :: Number
    , l :: Number
    , c :: Number
}

instance showCandlestick :: Show Candlestick where
  show (Candlestick v) = "(Candlestick " <> show v <> ")"

derive instance eqCandlestick :: Eq Candlestick 

type Candlesticks = Array Candlestick

candleToPix :: V.VRuler -> ElmCandlestick -> Candlestick 
candleToPix vr {o,h,l,c} =  
    let 
        po = V.valueToPix vr o
        ph = V.valueToPix vr h
        pl = V.valueToPix vr l
        pc = V.valueToPix vr c
    in
    Candlestick { o: po, h: ph, l: pl, c: pc }

paint :: H.HRuler -> Candlesticks -> Context2D -> Effect Unit
paint (H.HRuler {xaxis: xaxis}) cndls ctx = 
  fi_paint xaxis cndls ctx