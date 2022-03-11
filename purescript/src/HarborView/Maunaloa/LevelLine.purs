module HarborView.Maunaloa.LevelLine (initEvents,clear,Line(..)) where

import Prelude
import Data.Maybe (Maybe(..))
--import Data.Array ((:)) 
import Data.Either (Either(..))
import Data.Number.Format (toStringWith,fixed)
import Effect (Effect)
import Effect.Class (liftEffect)
import Effect.Console (logShow)
import Effect.Aff (Aff, launchAff_)

import Affjax as Affjax
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
    , Ticker(..)
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




foreign import addListener :: EventListenerInfo -> Effect Unit

foreign import resetListeners :: Effect Unit 

foreign import getListeners :: Effect (Array EventListenerInfo)

foreign import clearLines :: Effect Unit

foreign import addLine :: Line -> Effect Unit

foreign import onMouseDown :: Event.Event -> Effect Unit

foreign import onMouseDrag :: Event.Event -> Effect Unit

foreign import onMouseUpImpl :: (Line -> Maybe Line) -> (Maybe Line) -> Effect (Maybe Line)

foreign import updateRiscLine :: Line -> Number -> Effect Unit

foreign import redraw :: Context2D -> VRuler -> Effect Unit 

foreign import clearCanvas :: Effect Unit

--foreign import showJson :: Json -> Effect Unit

--foreign import alert :: String -> Effect Unit


data Line = 
    StdLine 
    { y :: Number
    , selected :: Boolean
    } 
    | RiscLine
    { y :: Number
    , selected :: Boolean
    , ticker :: Ticker 
    , bid :: Number
    }
    | BreakEvenLine
    { y :: Number
    , ticker :: Ticker
    , ask :: Number
    , breakEven :: Number
    }

instance showLine :: Show Line where
    show (StdLine v) = "StdLine: " <> show v 
    show (RiscLine v) = "RiscLine: " <> show v 
    show (BreakEvenLine v) = "BreakEvenLine: " <> show v 

onMouseUp :: Event.Event -> Effect (Maybe Line)
onMouseUp _ = onMouseUpImpl Just Nothing 

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

unlistenEvents :: Effect Unit
unlistenEvents = 
    getListeners >>= \listeners ->
    Traversable.traverse_ unlisten listeners *>
    resetListeners 

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

addLevelLineButtonClick :: Event.Event -> Effect Unit
addLevelLineButtonClick _ =
    let
        line = StdLine { y: 200.0, selected: false }
    in
    addLine line

fetchLevelLinesURL :: Ticker -> String
fetchLevelLinesURL (Ticker ticker) =
    -- "http://localhost:6346/maunaloa/risclines/" <> ticker
    mainURL <>  "/risclines/" <> ticker

optionPriceURL :: Ticker -> Number -> String
optionPriceURL (Ticker ticker) curStockPrice =
    mainURL <> "/stockoption/price/" <> ticker <> "/" <> toStringWith (fixed 2) curStockPrice


addRiscLine :: VRuler -> RiscLineJson -> Effect Unit
addRiscLine vr line = 
    let 
        ticker = Ticker line.ticker
        rl = RiscLine
                { y: valueToPix vr line.riscStockPrice
                , selected: false
                , ticker: ticker
                , bid: line.bid
                }
        bl = BreakEvenLine
                { y: valueToPix vr line.be
                , ticker: ticker
                , ask: line.ask 
                , breakEven: line.be
                }
    in
    addLine rl *>
    addLine bl 

addRiscLines :: VRuler -> RiscLinesJson -> Effect Unit
addRiscLines vr lines = 
    let 
        addRiscLine1 = addRiscLine vr
    in
    Traversable.traverse_ addRiscLine1 lines

fetchLevelLines :: Ticker -> Aff (Either MaunaloaError RiscLinesJson)
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

fetchLevelLineButtonClick :: Ticker -> VRuler -> Event.Event -> Effect Unit
fetchLevelLineButtonClick ticker vruler evt = 
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
                        clearLines *>
                        addRiscLines vruler lines1
                    )
    )

{-
    Affjax.get ResponseFormat.json (fetchLevelLinesURL ticker) >>= \res ->
        case res of  
            Left err -> 
                liftEffect (
                    defaultEventHandling evt *>
                    alert ("Affjax Error: " <> Affjax.printError err)
                )
            Right response -> 
                liftEffect (
                    defaultEventHandling evt *>
                    showJson response.body *>
                    let 
                        lines = riscLinesFromJson response.body
                    in 
                    case lines of
                        Left err 
                            -> alert (show err)
                        Right lines1 
                            -> logShow lines *> 
                               clearLines *>
                               addRiscLines vruler lines1
                )
-}
    

mouseEventDown :: Event.Event -> Effect Unit
mouseEventDown evt = 
    defaultEventHandling evt *>
    onMouseDown evt 

mouseEventDrag :: Event.Event -> Effect Unit
mouseEventDrag evt = 
    defaultEventHandling evt *>
    onMouseDrag evt

fetchUpdatedOptionPrice :: Ticker -> Number -> Aff (Either MaunaloaError Number)
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

handleUpdateOptionPrice :: VRuler -> Line -> Effect Unit
handleUpdateOptionPrice vr lref@(RiscLine line) = 
    launchAff_ $
        let 
            sp = pixToValue vr (Pix line.y)
        in
        (liftEffect $ logShow lref) *>
        fetchUpdatedOptionPrice line.ticker sp >>= \n ->
            case n of 
                Left err ->
                    handleErrorAff err
                Right value ->
                    (liftEffect $ updateRiscLine lref value)

handleUpdateOptionPrice _ _ = 
    pure unit

handleMouseEventUpLine :: VRuler -> Maybe Line -> Effect Unit
handleMouseEventUpLine vr line = 
    case line of 
        Nothing -> 
            pure unit
        Just line1 ->
            handleUpdateOptionPrice vr line1

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

mouseEventUp :: VRuler -> Event.Event -> Effect Unit
mouseEventUp vruler evt = 
    defaultEventHandling evt *>
    onMouseUp evt >>= \line ->
    handleMouseEventUpLine vruler line 


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



initEvent :: (Event.Event -> Effect Unit) -> Element -> EventType -> Effect Unit
initEvent toListener element eventType =
    EventTarget.eventListener toListener >>= \e1 -> 
    let
        info = EventListenerInfo {target: element, listener: e1, eventType: eventType}
    in 
    addListener info *>
    EventTarget.addEventListener eventType e1 false (toEventTarget element) 

initEvents :: Ticker -> VRuler -> ChartLevel -> Effect Unit
initEvents ticker vruler chartLevel =
    unlistenEvents *>
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
                    redraw ctx vruler *>
                    initEvent addLevelLineButtonClick context1.addLevelLineBtn (EventType "click") *>
                    initEvent (fetchLevelLineButtonClick ticker vruler) context1.fetchLevelLinesBtn (EventType "click") *>
                    initEvent mouseEventDown context1.canvasElement (EventType "mousedown") *>
                    initEvent mouseEventDrag context1.canvasElement (EventType "mousemove") *>
                    initEvent (mouseEventUp vruler) context1.canvasElement (EventType "mouseup") 

clear :: Effect Unit
clear = clearCanvas