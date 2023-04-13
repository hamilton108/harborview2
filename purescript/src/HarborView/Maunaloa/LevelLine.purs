module HarborView.Maunaloa.LevelLine (initEvents,clear,Line(..)) where

import Prelude
import Data.Maybe (Maybe(..))
--import Data.Array ((:)) 
import Data.Array (length)
import Data.Either (Either(..))
import Data.Number.Format (toStringWith,fixed)
import Effect (Effect)
import Effect.Class (liftEffect)
import Effect.Console (logShow)
import Effect.Aff (Aff, launchAff_)

import Affjax.Web as Affjax
import Affjax.ResponseFormat as ResponseFormat
import Data.Traversable as Traversable

import Graphics.Canvas as Canvas 
import Graphics.Canvas (CanvasElement,Context2D)
import Web.Event.Event (EventType(..))
import Web.Event.Event as Event
import Web.Event.EventTarget as EventTarget
--import Effect.Ref as Ref
import Web.DOM.NonElementParentNode (NonElementParentNode,getElementById)
import Web.DOM.Element (toEventTarget,Element)
import Web.HTML as HTML
import Web.HTML.Window as Window
import Web.HTML.HTMLDocument as HTMLDocument

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode as Decode
import Data.Argonaut.Decode.Error (JsonDecodeError)
import HarborView.Maunaloa.MaunaloaError
  ( MaunaloaError(..)
  , handleErrorAff
  )


import HarborView.Maunaloa.Common 
  ( Pix(..)
  , HtmlId(..)
  , OptionTicker(..)
  , StockTicker(..)
  , ChartType
  , chartTypeAsInt
  , mainURL
  , alert)
import HarborView.Maunaloa.VRuler (VRuler,valueToPix,pixToValue)
import HarborView.Maunaloa.Chart (ChartLevel)

{-
import Data.IORef (newIORef,modifyIORef,readIORef)

type Counter = Int -> IO Int

makeCounter :: IO Counter
makeCounter = do
    r <- newIORef 0
    return (\i -> do modifyIORef r (\q -> q + i) -- (+i)
                    readIORef r)

testCounter :: Counter -> IO ()
testCounter counter = do
  b <- counter 1
  c <- counter 1
  d <- counter 1
  print [b,c,d]

main = do
  counter <- makeCounter
  testCounter counter
  testCounter counter
-}




foreign import addListener :: Int -> EventListenerInfo -> Effect Unit

foreign import resetListeners :: Int -> Effect Unit 

foreign import getListeners :: Int -> Effect (Array EventListenerInfo)

foreign import clearLines :: Int -> Effect Unit

foreign import addLine :: Int -> Line -> Effect Unit

foreign import onMouseDown :: Int -> Event.Event -> Effect Unit

foreign import onMouseDrag :: Int -> Event.Event -> Effect Unit

foreign import onMouseUpImpl :: Int -> (Line -> Maybe Line) -> (Maybe Line) -> Effect (Maybe Line)

foreign import updateRiscLine :: Int -> Line -> Number -> Effect Unit

foreign import redraw :: Int -> Context2D -> VRuler -> Effect Unit 

foreign import clearCanvas :: Int -> Effect Unit

foreign import randomRgb :: Effect String

--foreign import showJson :: Json -> Effect Unit

--foreign import alert :: String -> Effect Unit


data Line = 
  StdLine 
  { y :: Number
  , selected :: Boolean
  , lt :: Int
  , color :: String
  } 
  | RiscLine
  { y :: Number
  , selected :: Boolean
  , ticker :: OptionTicker 
  , ask :: Number
  , bid :: Number
  , risc :: Number
  , riscPrice :: Number
  , lt :: Int
  }
  | BreakEvenLine
  { y :: Number
  , ticker :: OptionTicker
  , ask :: Number
  , breakEven :: Number
  , lt :: Int
  }

instance showLine :: Show Line where
  show (StdLine v) = "StdLine: " <> show v 
  show (RiscLine v) = "RiscLine: " <> show v 
  show (BreakEvenLine v) = "BreakEvenLine: " <> show v 

ltSTD :: Int
ltSTD= 1

ltRISC :: Int
ltRISC = 2

ltBREAK_EVEN :: Int 
ltBREAK_EVEN= 3

onMouseUp :: ChartType -> Event.Event -> Effect (Maybe Line)
onMouseUp ct _ = onMouseUpImpl (chartTypeAsInt ct) Just Nothing 

{-
const STD_LINE = 1;
const RISC_LINE = 2;
const BREAK_EVEN_LINE = 3;
-}

{-}
newtype PilotLine = 
    PilotLine 
    { y :: Number
    , strokeStyle :: String
    } 

derive instance eqPilotLine :: Eq PilotLine 

instance showPilotLine :: Show PilotLine where
    show (PilotLine v) = "PilotLine : " <> show v 

newtype Lines = 
    Lines
    { lines :: Array Line
    , pilotLine :: Maybe PilotLine 
    }

instance showLines :: Show Lines where
    show (Lines { lines, pilotLine }) = "Lines, " <> show lines <> ", pilotLine: " <> show pilotLine
-}

defaultEventHandling :: Event.Event -> Effect Unit
defaultEventHandling event = 
  Event.stopPropagation event *>
  Event.preventDefault event 

getDoc :: Effect NonElementParentNode
getDoc = 
  HTML.window >>= \win ->
    Window.document win >>= \doc ->
      pure $ HTMLDocument.toNonElementParentNode doc

newtype EventListenerInfo =
  EventListenerInfo 
  { target :: Element 
  , listener :: EventTarget.EventListener
  , eventType :: EventType
  }

-- type EventListeners = Array EventListenerInfo -- List.List EventListenerInfo 

-- type EventListenerRef = Ref.Ref EventListeners

type HtmlContext = 
  { canvasContext :: CanvasElement --Canvas.Context2D
  , canvasElement :: Element
  , addLevelLineBtn :: Element
  , fetchLevelLinesBtn :: Element
  }

type RiscLineJson = 
  { ticker :: String
  , be :: Number
  , riscStockPrice :: Number
  , riscOptionPrice :: Number
  , bid :: Number
  , ask :: Number
  , risc :: Number
  }

type RiscLinesJson = Array RiscLineJson

riscLinesFromJson :: Json -> Either JsonDecodeError RiscLinesJson 
riscLinesFromJson = Decode.decodeJson

type UpdatedOptionPriceJson = 
  { value :: Number
  }

updOptionPriceFromJson :: Json -> Either JsonDecodeError UpdatedOptionPriceJson 
updOptionPriceFromJson = Decode.decodeJson

unlisten :: EventListenerInfo -> Effect Unit
unlisten (EventListenerInfo {target,listener,eventType}) = 
  EventTarget.removeEventListener eventType listener false (toEventTarget target)

unlistenEvents :: ChartType -> Effect Unit
unlistenEvents ct = 
  let 
    cti = chartTypeAsInt ct
  in
  getListeners cti >>= \listeners ->
  Traversable.traverse_ unlisten listeners *>
  resetListeners cti

{-
unlistener :: EventListenerRef -> Int -> Effect Unit
unlistener elr dummy =
    Ref.read elr >>= \elrx -> 
        Traversable.traverse_ unlisten elrx

remButtonClick :: Event -> Effect Unit
remButtonClick evt =
    getListeners >>= \listeners ->
    Traversable.traverse_ unlisten listeners *>
    resetListeners 
-}

addLevelLineButtonClick :: ChartType -> Event.Event -> Effect Unit
addLevelLineButtonClick ct _ =
  randomRgb >>= \curColor ->
  let
    line = StdLine { y: 200.0, selected: false, lt: ltSTD, color: curColor }
  in
  addLine (chartTypeAsInt ct) line

fetchLevelLinesURL :: StockTicker -> String
fetchLevelLinesURL (StockTicker ticker) =
    -- "http://localhost:6346/maunaloa/risclines/" <> ticker
  mainURL <>  "/risclines/" <> ticker

optionPriceURL :: OptionTicker -> Number -> String
optionPriceURL (OptionTicker ticker) curStockPrice =
  mainURL <> "/stockoption/price/" <> ticker <> "/" <> toStringWith (fixed 2) curStockPrice


addRiscLine :: ChartType -> VRuler -> RiscLineJson -> Effect Unit
addRiscLine ct vr line = 
  let 
    cti = chartTypeAsInt ct
    ticker = OptionTicker line.ticker
    rl = 
      RiscLine
      { y: valueToPix vr line.riscStockPrice
      , selected: false
      , ticker: ticker
      , ask: line.ask 
      , bid: line.bid
      , risc: line.risc 
      , riscPrice: line.riscOptionPrice
      , lt: ltRISC
      }
    bl = 
      BreakEvenLine
      { y: valueToPix vr line.be
      , ticker: ticker
      , ask: line.ask 
      , breakEven: line.be
      , lt: ltBREAK_EVEN
      }
  in
  addLine cti rl *>
  addLine cti bl 

addRiscLines :: ChartType -> VRuler -> RiscLinesJson -> Effect Unit
addRiscLines ct vr lines = 
  let 
    addRiscLine1 = addRiscLine ct vr
  in
  Traversable.traverse_ addRiscLine1 lines

fetchLevelLines :: StockTicker -> Aff (Either MaunaloaError RiscLinesJson)
fetchLevelLines ticker = 
  Affjax.get ResponseFormat.json (fetchLevelLinesURL ticker) >>= \res ->
    let 
      result :: Either MaunaloaError RiscLinesJson 
      result = 
        case res of  
          Left err -> 
            Left $ AffjaxError (Affjax.printError err)
          Right response ->
            let 
              lines = riscLinesFromJson response.body
            in
            case lines of
              Left err ->
                Left $ JsonError (show err)
              Right lines1 ->
                Right lines1 
    in
    pure result

fetchLevelLineButtonClick :: ChartType -> StockTicker -> VRuler -> Event.Event -> Effect Unit
fetchLevelLineButtonClick ct ticker vruler evt = 
  defaultEventHandling evt *>
  launchAff_ 
  (
    fetchLevelLines ticker >>= \lines ->
      case lines of
        Left err ->
          handleErrorAff err
        Right lines1 ->
          liftEffect 
          (
            --logShow lines1 *>
            clearLines (chartTypeAsInt ct) *>
            addRiscLines ct vruler lines1
          )
  )


mouseEventDown :: ChartType -> Event.Event -> Effect Unit
mouseEventDown ct evt = 
  defaultEventHandling evt *>
  onMouseDown (chartTypeAsInt ct) evt 

mouseEventDrag :: ChartType -> Event.Event -> Effect Unit
mouseEventDrag ct evt = 
  defaultEventHandling evt *>
  onMouseDrag (chartTypeAsInt ct) evt

fetchUpdatedOptionPrice :: OptionTicker -> Number -> Aff (Either MaunaloaError Number)
fetchUpdatedOptionPrice ticker curStockPrice = 
  Affjax.get ResponseFormat.json (optionPriceURL ticker curStockPrice) >>= \res ->
    let 
      result :: Either MaunaloaError Number 
      result = 
        case res of  
          Left err -> 
            Left $ AffjaxError (Affjax.printError err)
          Right response -> 
            let 
              json = updOptionPriceFromJson response.body 
            in
            case json of
              Left err ->
                Left $ JsonError (show err)
              Right json1 ->
                Right json1.value
    in 
    pure result

handleUpdateOptionPrice :: ChartType -> VRuler -> Line -> Effect Unit
handleUpdateOptionPrice ct vr lref@(RiscLine line) = 
  launchAff_ $
    let 
      cti = chartTypeAsInt ct
      sp = pixToValue vr (Pix line.y)
    in
    --(liftEffect $ logShow lref) *>
    fetchUpdatedOptionPrice line.ticker sp >>= \n ->
      case n of 
        Left err ->
          handleErrorAff err
        Right value ->
          (liftEffect $ updateRiscLine cti lref value)
handleUpdateOptionPrice _ _ _ = 
  pure unit

handleMouseEventUpLine :: ChartType -> VRuler -> Maybe Line -> Effect Unit
handleMouseEventUpLine ct vr line = 
  case line of 
    Nothing -> 
      pure unit
    Just line1 ->
      handleUpdateOptionPrice ct vr line1

{- 
        Just lref@(RiscLine rec0) ->76
            logShow rec0 *>
            let 
                oldOpPrice = rec0.bid
                newPrice = oldOpPrice * 1.2
            in
            updateRiscLine lref newPrice 
        _ -> 
            pure unit
-}

mouseEventUp :: ChartType -> VRuler -> Event.Event -> Effect Unit
mouseEventUp ct vruler evt = 
  defaultEventHandling evt *>
  onMouseUp ct evt >>= \line ->
  handleMouseEventUpLine ct vruler line 


getHtmlContext1 :: 
  { canvas :: Maybe Element
  , add :: Maybe Element
  , fetch :: Maybe Element
  , ctx :: Maybe CanvasElement } -> Maybe HtmlContext
getHtmlContext1 prm = 
  prm.canvas >>= \canvas1 ->
  prm.add >>= \addLlBtn1 ->
  prm.fetch >>= \fetchLlBtn1 ->
  prm.ctx >>= \ctx1 ->
    Just
    { canvasContext: ctx1 
    , canvasElement: canvas1 
    , addLevelLineBtn : addLlBtn1
    , fetchLevelLinesBtn : fetchLlBtn1
    }

validateMaybe :: forall a . String -> Maybe a -> Effect Unit
validateMaybe desc el = 
  case el of
    Nothing -> alert ("ERROR!: " <> desc)
    Just _ -> pure unit -- logShow ("OK: " <> desc)

getHtmlContext :: ChartLevel -> Effect (Maybe HtmlContext)
getHtmlContext 
  { levelCanvasId: ( HtmlId levelCanvasId1)
  , addLevelId: (HtmlId addLevelId1)
  , fetchLevelId: (HtmlId fetchLevelId1)
  } =
  getDoc >>= \doc ->
    getElementById levelCanvasId1 doc >>= \canvasElement ->
    getElementById addLevelId1 doc >>= \addLevelId2 ->
    getElementById fetchLevelId1 doc >>= \fetchLevelId2 ->
    Canvas.getCanvasElementById levelCanvasId1 >>= \canvas ->
    validateMaybe "canvasElement" canvasElement *>
    validateMaybe "addLevelId2" addLevelId2 *>
    validateMaybe "fetchLevelId2" fetchLevelId2 *>
    validateMaybe "canvas" canvas *>
    pure (getHtmlContext1 { canvas: canvasElement
                          , add: addLevelId2
                          , fetch: fetchLevelId2
                          , ctx: canvas })



initEvent :: ChartType -> (Event.Event -> Effect Unit) -> Element -> EventType -> Effect Unit
initEvent ct toListener element eventType =
  EventTarget.eventListener toListener >>= \e1 -> 
  let
    info = EventListenerInfo {target: element, listener: e1, eventType: eventType}
    cti = chartTypeAsInt ct
  in 
  addListener cti info *>
  EventTarget.addEventListener eventType e1 false (toEventTarget element) 

initEvents :: ChartType -> StockTicker -> VRuler -> ChartLevel -> Effect Unit
initEvents ct ticker vruler chartLevel =
  unlistenEvents ct *>
  getHtmlContext chartLevel >>= \context ->
    case context of
        Nothing ->
          alert "ERROR! (initEvents) No getHtmlContext chartLevel!" *>
          pure unit
        Just context1 ->
          let 
            ce = context1.canvasContext  
          in
          Canvas.getContext2D ce >>= \ctx ->
            redraw (chartTypeAsInt ct) ctx vruler *>
            initEvent ct (addLevelLineButtonClick ct) context1.addLevelLineBtn (EventType "click") *>
            initEvent ct (fetchLevelLineButtonClick ct ticker vruler) context1.fetchLevelLinesBtn (EventType "click") *>
            initEvent ct (mouseEventDown ct) context1.canvasElement (EventType "mousedown") *>
            initEvent ct (mouseEventDrag ct) context1.canvasElement (EventType "mousemove") *>
            initEvent ct (mouseEventUp ct vruler) context1.canvasElement (EventType "mouseup") 

clear :: Int -> Effect Unit
clear cti = clearCanvas cti