module HarborView.Maunaloa.Common where
  
import Prelude

--import Graphics.Canvas (Context2D)

-- import Data.Tuple (Tuple(..),fst,snd)
import Data.Int (toNumber)

import Effect (Effect)

import Data.Argonaut.Core (Json)

foreign import showJson :: Json -> Effect Unit
foreign import alert :: String -> Effect Unit

mainURL :: String
mainURL = 
    --"http://localhost:8082/maunaloa"
    "/maunaloa"

------------------------- Graph ------------------------- 
--class Graph a where
--    draw :: a -> Context2D -> Effect Unit

{-
newtype ChartWidth = ChartWidth Number

instance showChartWidth :: Show ChartWidth where
  show (ChartWidth v) = "(ChartWidth " <> show v <> ")"
    -}

type Xaxis = Array Number


dayInMillis :: Number
dayInMillis = 86400000.0

------------------------- Pix ------------------------- 
newtype Pix = Pix Number

derive instance eqPix :: Eq Pix

instance showPix :: Show Pix where
  show (Pix v) = "(Pix " <> show v <> ")"

------------------------- ChartDim ------------------------- 
{-
newtype ChartDim = ChartDim { w :: Number, h :: Number }

derive instance eqChartDim :: Eq ChartDim 

instance showChartDim :: Show ChartDim where
  show (ChartDim dim) = "(ChartDim w: " <> show dim.w <> ", h: " <> show dim.h <> ")"
-}

------------------------- ChartWidth ------------------------- 
newtype ChartWidth = ChartWidth Number

instance showChartWidth :: Show ChartWidth where
  show (ChartWidth x) = "(ChartWidth: " <> show x <> ")"

derive instance eqChartWidth :: Eq ChartWidth

------------------------- ChartHeight ------------------------- 
newtype ChartHeight = ChartHeight Number

instance showChartHeight :: Show ChartHeight where
  show (ChartHeight x) = "(ChartHeight: " <> show x <> ")"

derive instance eqChartHeight :: Eq ChartHeight

------------------------- Ticker ------------------------- 
newtype OptionTicker = OptionTicker String 

instance showOptionTicker :: Show OptionTicker where
  show (OptionTicker x) = "(OptionTicker : " <> x <> ")"

newtype StockTicker = StockTicker String 

instance showStockTicker :: Show StockTicker where
  show (StockTicker x) = "(StockTicker: " <> x <> ")"

------------------------- HtmlId ------------------------- 
newtype HtmlId = HtmlId String 

instance showHtmlId :: Show HtmlId where
  show (HtmlId x) = "(HtmlId : " <> x <> ")"

derive instance eqHtmlId :: Eq HtmlId 

------------------------- UnixTime ------------------------- 
newtype UnixTime = UnixTime Number

derive instance eqUnixTime :: Eq UnixTime 

instance showUnixTime :: Show UnixTime where
  show (UnixTime v) = "(UnixTime " <> show v <> ")"

instance ordUnixTime :: Ord UnixTime where
  compare (UnixTime u1) (UnixTime u2) = compare u1 u2

------------------------- ValueRange ------------------------- 
newtype ValueRange = ValueRange 
  { minVal :: Number
  ,  maxVal :: Number 
  }

derive instance eqValueRange :: Eq ValueRange 

instance showValueRange :: Show ValueRange where
  show (ValueRange v) = "(ValueRange " <> show v <> ")"

valueRange :: Number -> Number -> ValueRange
valueRange minv maxv = 
  ValueRange { minVal: minv, maxVal: maxv }

------------------------- Padding ------------------------- 
newtype Padding = Padding 
  { left :: Number
  , top :: Number
  , right :: Number
  , bottom :: Number 
  }

derive instance eqPadding :: Eq Padding 

instance showPadding :: Show Padding where
  show (Padding v) = "(Padding " <> show v <> ")"

------------------------- RulerLine ------------------------- 
type RulerLineBoundary = { p1:: Number, p2 :: Number }

newtype RulerLineInfo = RulerLineInfo 
  { p0 :: Number
  , tx :: String 
  }

instance showRulerLineInfo :: Show RulerLineInfo where
  show (RulerLineInfo v) = "(RulerLineInfo " <> show v <> ")"

------------------------- Offset ------------------------- 

newtype OffsetBoundary = OffsetBoundary 
  { oHead :: Int
  , oLast :: Int 
  }

instance showOffsetBoundary :: Show OffsetBoundary where
  show (OffsetBoundary v) = "(OffsetBoundary " <> show v <> ")"
    
------------------------- Scaling ------------------------- 
newtype Scaling = Scaling Number

------------------------- Util ------------------------- 

calcPpx :: ChartWidth -> OffsetBoundary -> Padding -> Number
calcPpx (ChartWidth w) (OffsetBoundary b) (Padding p) = 
  let
    diffDays = toNumber $ b.oHead - b.oLast + 1
    padding_w = w - p.left - p.right
  in 
  padding_w / diffDays

{-
calcPpx_ :: ChartDim -> Array Int -> Padding -> Maybe Number
calcPpx_ (ChartDim dim) offsets (Padding p) = 
  head offsets >>= \offset0 ->
  last offsets >>= \offsetN ->
  let
    diffDays = toNumber $ offset0 - offsetN + 1
    padding_w = dim.w - p.left - p.right
  in 
  if diffDays < 0.0 then 
    Nothing
  else
    Just $ padding_w / diffDays
-}

calcPpy :: ChartHeight -> ValueRange -> Padding -> Number
calcPpy (ChartHeight dim) (ValueRange {minVal,maxVal}) (Padding p) = 
  let
    padding_justified_h = dim - p.top - p.bottom
  in
  padding_justified_h / (maxVal - minVal)

---------------------------- Env ------------------------------

newtype ChartId = ChartId String

instance showChartId :: Show ChartId where
  show (ChartId c) = "(ChartId " <> c <> ")"


newtype ChartMapping = ChartMapping 
    { ticker ::StockTicker 
    , chartId :: ChartId
    , canvasId :: HtmlId
    , chartHeight :: ChartHeight 
    , levelCanvasId :: HtmlId
    , addLevelId :: HtmlId
    , fetchLevelId :: HtmlId
    }

instance showChartMapping :: Show ChartMapping where
    show (ChartMapping x) = "(ChartMapping " <> show x <> ")"

type ChartMappings = Array ChartMapping

data ChartType
    = DayChart
    | WeekChart
    | MonthChart

asChartType :: Int -> ChartType
asChartType 1 = 
    DayChart
asChartType 2 = 
    WeekChart
asChartType 3 = 
    MonthChart
asChartType _ = 
    DayChart

chartTypeAsInt  :: ChartType -> Int
chartTypeAsInt DayChart   = 1 
chartTypeAsInt WeekChart  = 2
chartTypeAsInt MonthChart = 3

newtype Drop = Drop Int

newtype Take = Take Int

newtype Env = 
    Env
    { ticker :: StockTicker
    , dropAmt :: Drop
    , takeAmt :: Take
    , chartType :: ChartType
    , mappings :: ChartMappings 
    , globalChartWidth :: ChartWidth
    , scaling :: Scaling
    }

