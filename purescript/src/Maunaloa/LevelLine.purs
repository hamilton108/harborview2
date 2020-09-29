module Maunaloa.LevelLine (initEvents) where

import Prelude
import Data.Maybe (Maybe(..))
import Data.Array ((:)) 
import Data.Either (Either(..))
import Effect (Effect)
import Effect.Class (liftEffect)
import Effect.Console (logShow)
import Effect.Aff as Aff
import Affjax as Affjax
import Affjax.ResponseFormat as ResponseFormat
import Data.Traversable as Traversable

import Graphics.Canvas as Canvas 
import Graphics.Canvas (CanvasElement,Context2D)
import Web.Event.Event (EventType(..))
import Web.Event.Event as Event
import Web.Event.EventTarget as EventTarget
import Effect.Ref as Ref
import Web.DOM.NonElementParentNode (NonElementParentNode,getElementById)
import Web.DOM.Element (toEventTarget,Element)
import Web.HTML as HTML
import Web.HTML.Window as Window
import Web.HTML.HTMLDocument as HTMLDocument

import Data.Argonaut.Core (Json)

import Maunaloa.Common (HtmlId(..))
import Maunaloa.VRuler (VRuler)
import Maunaloa.Chart (ChartLevel)

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


newtype PilotLine = 
    PilotLine 
    { y :: Number
    , strokeStyle :: String
    } 

derive instance eqPilotLine :: Eq PilotLine 

newtype Line = 
    Line 
    { y :: Number
    , draggable :: Boolean
    , selected :: Boolean
    , riscLine :: Boolean
    , strokeStyle :: String
    } 


foreign import addListener :: EventListenerInfo -> Effect Unit

foreign import resetListeners :: Effect Unit 

foreign import getListeners :: Effect (Array EventListenerInfo)

foreign import hasPilotLine :: Effect Boolean

foreign import createLine :: Context2D -> VRuler -> Effect Unit

foreign import onMouseDown :: Event.Event -> Effect Unit

foreign import onMouseDrag :: Event.Event -> Context2D -> VRuler -> Effect Unit

foreign import onMouseUp :: Event.Event -> Effect Unit

foreign import redraw :: Context2D -> VRuler -> Effect Line

foreign import createRiscLines :: Json -> Context2D -> VRuler -> Effect (Array Line)

foreign import showJson :: Json -> Effect Unit

instance showLine :: Show Line where
    show (Line v) = "Line: " <> show v 

instance showPilotLine :: Show PilotLine where
    show (PilotLine v) = "PilotLine : " <> show v 

newtype Lines = 
    Lines
    { lines :: Array Line
    , pilotLine :: Maybe PilotLine 
    }

instance showLines :: Show Lines where
    show (Lines { lines, pilotLine }) = "Lines, " <> show lines <> ", pilotLine: " <> show pilotLine

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

type EventListeners = Array EventListenerInfo -- List.List EventListenerInfo 

type EventListenerRef = Ref.Ref EventListeners

type HtmlContext = 
    { canvasContext :: CanvasElement --Canvas.Context2D
    , canvasElement :: Element
    , addLevelLineBtn :: Element
    , fetchLevelLinesBtn :: Element
    }


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

addLevelLineButtonClick :: CanvasElement -> VRuler -> Event.Event -> Effect Unit
addLevelLineButtonClick ce vruler evt =
    defaultEventHandling evt *>
    Canvas.getContext2D ce >>= \ctx ->
    createLine ctx vruler 
    --createLine ctx vruler >>= \newLine ->
    --Ref.modify_ (addLine newLine) lref 

addLine :: Line -> Lines -> Lines
addLine newLine (Lines l@{lines}) = 
    Lines $ l { lines = newLine : lines } 

addRiscLevelLines :: Json -> CanvasElement -> VRuler -> Effect Unit
addRiscLevelLines json ce vruler =
    pure unit 
    {-
    Ref.modify_ (\_ -> initLines) lref *>
    Canvas.getContext2D ce >>= \ctx ->
    redraw ctx vruler *>
    createRiscLines json ctx vruler >>= \newLines ->
    Traversable.traverse_ (\newLine -> Ref.modify_ (addLine newLine) lref) newLines 
    -}

mainURL :: String
mainURL = 
    "http://localhost:8082"

fetchLevelLinesURL :: String -> String
fetchLevelLinesURL ticker =
    -- "http://localhost:6346/maunaloa/risclines/" <> ticker
    mainURL <>  "/risclines/" <> ticker

optionPriceURL :: String
optionPriceURL =
    mainURL <> "/optionprice/3/2" 

fetchLevelLineButtonClick :: String -> CanvasElement -> VRuler -> Event.Event -> Effect Unit
fetchLevelLineButtonClick ticker ce vruler evt = 
    Aff.launchAff_ $
    Affjax.get ResponseFormat.json (fetchLevelLinesURL ticker) >>= \res ->
        case res of  
            Left err -> 
                liftEffect (
                    defaultEventHandling evt *>
                    logShow ("Affjax Error: " <> Affjax.printError err)
                )
            Right response -> 
                liftEffect (
                    defaultEventHandling evt 
                    {--
                    addRiscLevelLines response.body lref ce vruler 
                    Canvas.getContext2D ce >>= \ctx ->
                    createLine ctx vruler >>= \newLine ->
                    showJson response.body
                    --}
                )
    
mouseEventDown :: Event.Event -> Effect Unit
mouseEventDown evt = 
    defaultEventHandling evt *>
    onMouseDown evt 

mouseEventDrag :: CanvasElement -> VRuler -> Event.Event -> Effect Unit
mouseEventDrag ce vruler evt = 
    defaultEventHandling evt *>
    hasPilotLine >>= \hasPilot ->
        if hasPilot == true then
            Canvas.getContext2D ce >>= \ctx ->
                onMouseDrag evt ctx vruler
        else
            pure unit

mouseEventUp :: CanvasElement -> VRuler -> Event.Event -> Effect Unit
mouseEventUp ce vruler evt = 
    defaultEventHandling evt *>
    onMouseUp evt 

handleRiscLine :: Line -> Effect Unit
handleRiscLine (Line {y,riscLine}) = 
    Aff.launchAff_ $
    Affjax.get ResponseFormat.json optionPriceURL >>= \res ->
        case res of  
            Left err -> 
                liftEffect (
                    logShow ("Affjax Error: " <> Affjax.printError err)
                )
            Right response -> 
                liftEffect (
                    showJson response.body
                )

checkIfRiscLine :: Line -> Effect Unit
checkIfRiscLine curLine@(Line {riscLine}) = 
    case riscLine of 
        true ->
            handleRiscLine curLine
        false ->
            pure unit

getHtmlContext1 :: Maybe Element -> Maybe Element -> Maybe Element -> Maybe CanvasElement -> Maybe HtmlContext
getHtmlContext1 canvas addLlBtn fetchLlBtn ctx = 
    canvas >>= \canvas1 ->
    addLlBtn >>= \addLlBtn1 ->
    fetchLlBtn >>= \fetchLlBtn1 ->
    ctx >>= \ctx1 ->
        Just
        { canvasContext: ctx1 
        , canvasElement: canvas1 
        , addLevelLineBtn : addLlBtn1
        , fetchLevelLinesBtn : fetchLlBtn1
        }

validateMaybe :: forall a . String -> Maybe a -> Effect Unit
validateMaybe desc el = 
    case el of
        Nothing -> logShow ("ERROR!: " <> desc)
        Just _ -> pure unit -- logShow ("OK: " <> desc)

getHtmlContext :: ChartLevel -> Effect (Maybe HtmlContext)
getHtmlContext {levelCanvasId: (HtmlId levelCanvasId1), addLevelId: (HtmlId addLevelId1), fetchLevelId: (HtmlId fetchLevelId1)} =
    getDoc >>= \doc ->
        getElementById levelCanvasId1 doc >>= \canvasElement ->
        getElementById addLevelId1 doc >>= \addLevelId2 ->
        getElementById fetchLevelId1 doc >>= \fetchLevelId2 ->
        Canvas.getCanvasElementById levelCanvasId1 >>= \canvas ->
        validateMaybe "canvasElement" canvasElement *>
        validateMaybe "addLevelId2" addLevelId2 *>
        validateMaybe "fetchLevelId2" fetchLevelId2 *>
        validateMaybe "canvas" canvas *>
        pure (getHtmlContext1 canvasElement addLevelId2 fetchLevelId2 canvas)


initEvent :: (Event.Event -> Effect Unit) -> Element -> EventType -> Effect Unit
initEvent toListener element eventType =
    EventTarget.eventListener toListener >>= \e1 -> 
    let
        info = EventListenerInfo {target: element, listener: e1, eventType: eventType}
    in 
    addListener info *>
    EventTarget.addEventListener eventType e1 false (toEventTarget element) 

initEvents :: String -> VRuler -> ChartLevel -> Effect Unit
initEvents ticker vruler chartLevel =
    unlistenEvents *>
    getHtmlContext chartLevel >>= \context ->
        case context of
            Nothing ->
                logShow "ERROR! (initEvents) No getHtmlContext chartLevel!" *>
                pure unit
            Just context1 ->
                let 
                    ce = context1.canvasContext  
                in
                Canvas.getContext2D ce >>= \ctx ->
                    redraw ctx vruler *>
                    initEvent (addLevelLineButtonClick ce vruler) context1.addLevelLineBtn (EventType "click") *>
                    initEvent (fetchLevelLineButtonClick ticker ce vruler) context1.fetchLevelLinesBtn (EventType "click") *>
                    initEvent mouseEventDown context1.canvasElement (EventType "mousedown") *>
                    initEvent (mouseEventDrag ce vruler) context1.canvasElement (EventType "mousemove") *>
                    initEvent (mouseEventUp ce vruler) context1.canvasElement (EventType "mouseup") 
