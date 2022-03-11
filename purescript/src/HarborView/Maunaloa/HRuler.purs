module HarborView.Maunaloa.HRuler where

import Prelude 

import Data.Tuple 
    ( Tuple(..)
    )
import Data.Int 
    ( toNumber
    )
import Data.Maybe 
    ( Maybe(..)
    )
import Data.Array 
    ( head
    , last
    ,(:)
    )
import Effect (Effect)
import Graphics.Canvas (Context2D)

import HarborView.Maunaloa.Common 
    ( Pix(..)
    , UnixTime(..)
    , Padding(..)
    , ChartWidth
    , ChartHeight(..)
    , RulerLineBoundary
    , RulerLineInfo(..) 
    , OffsetBoundary(..)
    , calcPpx
    , dayInMillis 
    )
import HarborView.Util.DateUtil 
    ( dateRangeOf
    )

foreign import fi_incMonths :: Number -> Int -> Number
foreign import fi_incDays :: Number -> Int -> Number
foreign import fi_dateToString :: Number -> String 
foreign import fi_lines :: Context2D -> RulerLineBoundary -> Array RulerLineInfo -> Effect Unit 
foreign import fi_startOfNextMonth :: Number -> Number


newtype HRulerLine = HRulerLine {}

newtype HRuler = 
    HRuler 
    { startTime :: UnixTime
    , endTime :: UnixTime
    , xaxis :: Array Number
    , ppx :: Pix 
    , padding :: Padding 
    , myIncMonths :: Int 
    }

instance showHRuler :: Show HRuler where
    show (HRuler v) = "(HRuler " <> show v <> ")"
      
derive instance eqHRuler :: Eq HRuler


paint :: HRuler -> ChartHeight -> Context2D -> Effect Unit
paint hruler (ChartHeight cd) ctx = do
    let curLines = lines hruler  
    let linesX = { p1: 0.0, p2: cd }
    fi_lines ctx linesX curLines 
  
 
 {-
createLine :: HRuler -> Number -> Number -> Int -> RulerLineInfo 
createLine ruler hpix padLeft n = 
  let
    curPix = padLeft + (hpix * (toNumber n))
    val = pixToValue vruler (Pix curPix) 
    tx = toStringWith (fixed 1) val
  in
  RulerLineInfo { p0: curPix, tx: tx }
-}

lines_ :: (UnixTime -> Number) -> UnixTime -> Int -> Array RulerLineInfo -> UnixTime -> Array RulerLineInfo
lines_ timestampFn endTime numMonths curLines curTime 
    | curTime >= endTime = curLines
    | otherwise = 
        let 
            nextTime = incMonths curTime numMonths 
            newCurLines = RulerLineInfo { p0: timestampFn curTime, tx: dateToString curTime } : curLines
        in 
        lines_ timestampFn endTime numMonths newCurLines nextTime

lines :: HRuler -> Array RulerLineInfo 
lines hr@(HRuler {startTime, endTime, myIncMonths}) = 
    let 
        snm = startOfNextMonth startTime
        timestampFn = timeStampToPix hr
    in
    lines_ timestampFn endTime myIncMonths [] snm

--instance graphLine :: Graph HRuler where
--  draw = draw_


create :: ChartWidth -> UnixTime -> Array Int -> Padding -> Int -> Maybe HRuler 
create w minDx offsets p@(Padding pad) myIncMonths = 
    head offsets >>= \offset0 ->
    last offsets >>= \offsetN ->
    let 
      (Tuple startT endT) = dateRangeOf minDx offsets
      offsetBoundary = OffsetBoundary { oHead: offset0, oLast: offsetN }
      pix = calcPpx w offsetBoundary p 
      curPix = Pix pix
    in
    Just $ HRuler 
            { startTime: startT 
            , endTime: endT
            , xaxis: offsetsToPix offsetN offsets curPix pad.left
            , ppx: curPix 
            , padding: p
            , myIncMonths: myIncMonths 
            }

timeStampToPix :: HRuler -> UnixTime -> Number
timeStampToPix (HRuler {startTime,ppx,padding: (Padding p)}) (UnixTime tm) = 
    let 
        (UnixTime stm) = startTime
        (Pix pix) = ppx 
        days = (tm - stm) / dayInMillis
    in 
    p.left + (days * pix)
        
pixToTimeStamp :: HRuler -> Pix -> UnixTime
pixToTimeStamp ruler@(HRuler {startTime: (UnixTime stm)}) pix = 
    let
        days = pixToDays ruler pix
        tm = stm + (dayInMillis * days)
    in
    UnixTime tm

offsetsToPix :: Int -> Array Int -> Pix -> Number -> Array Number
offsetsToPix startOffset offsets (Pix pix) padLeft =
    map (\x -> padLeft + ((toNumber (x - startOffset)) * pix)) offsets

incMonths :: UnixTime -> Int -> UnixTime
incMonths (UnixTime tm) numMonths = UnixTime $ fi_incMonths tm numMonths


incDays :: UnixTime -> Int -> UnixTime
incDays (UnixTime tm) offset = UnixTime $ fi_incDays tm offset


pixToDays :: HRuler -> Pix -> Number
pixToDays (HRuler {ppx: (Pix ppxVal), padding: (Padding p)}) (Pix pix) = (pix - p.left) / ppxVal


startOfNextMonth :: UnixTime -> UnixTime
startOfNextMonth (UnixTime tm) = 
    UnixTime $ fi_startOfNextMonth tm

dateToString :: UnixTime -> String
dateToString (UnixTime tm) = fi_dateToString tm
{-
defcr :: Maybe HRuler
defcr =
    Just $ HRuler {
          dim: ChartDim { w: 600.0, h: 200.0 }
        , startTime: UnixTime 1.0 
        , xaxis: [1.0] 
    }
    -}
