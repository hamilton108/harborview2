module HarborView.OptionPurchase.Core where

import Prelude

import Data.Either (Either(..))
import Effect.Class (class MonadEffect)
import Effect.Aff.Class (class MonadAff)
import Affjax.RequestBody as REQB
import Affjax.RequestBody (RequestBody)

import Halogen as H
import Halogen.HTML.Properties as HP
import Halogen.HTML as HH
import Halogen.HTML ( HTML
                    , ClassName(..)
                    )
import Web.UIEvent.MouseEvent (MouseEvent)
import Web.UIEvent.MouseEvent as ME
import Web.Event.Event as E
import DOM.HTML.Indexed.InputType (InputType(..))

import Data.Argonaut.Core (Json)
import Data.Argonaut.Core as AC
import Data.Argonaut.Decode as Decode
import Data.Argonaut.Decode.Error (JsonDecodeError)

import Data.Number as NUM 
import Data.Number.Format as Format 
import Data.Int as DI
import Data.Maybe (Maybe(..))

import HarborView.UI as UI
import HarborView.UI  ( Title(..)
                      , InputVal(..)
                      )
import HarborView.Common  ( HarborViewError
                          , Oid(..)
                          , Amount(..)
                          , Price(..)
                          , Url(..)
                          , JsonResult
                          ) 
import HarborView.Util.HttpUtil as HttpUtil
import HarborView.Common as Common
import HarborView.ModalDialog as DLG 
import HarborView.ModalDialog (DialogState(..)) 


type Purchase =
    { oid :: Int
    , stock :: String
    , ot :: String -- option type
    , ticker :: String
    , pdate :: String -- purchase date
    , exp :: String
    , days :: Int
    , price :: Number 
    , bid :: Number 
    , spot :: Number 
    , pvol :: Int -- purchase volume
    , svol :: Int -- sales volume
    }
    
type Purchases = Array Purchase

demoPurchase :: Purchase
demoPurchase = 
  { oid: 1
  , stock: "NHY"
  , ot: "c"
  , ticker: "NHY2280"
  , pdate: "2022-03-01"
  , exp: "2202-12-15"
  , days: 240
  , price: 2.3
  , bid: 2.0
  , spot: 98.9
  , pvol: 10
  , svol: 0
  }
-- oid | opid  |     dx     | price | volume | status | transaction_cost | 
-- purchase_type | spot  |  buy  | ticker | d_oid | opname  |  exp_date  | 
-- optype | strike | s_oid | s_dx | s_price | s_volume 

tableHeader :: forall w i. HTML w i
tableHeader = 
  HH.thead_ 
    [
      HH.tr_ 
        [ HH.th_ [ HH.text "Sell"]
        , HH.th_ [ HH.text "Oid" ]
        , HH.th_ [ HH.text "Stock" ]
        , HH.th_ [ HH.text "Option Type" ]
        , HH.th_ [ HH.text "Ticker" ]
        , HH.th_ [ HH.text "Purchase Date" ]
        , HH.th_ [ HH.text "Expiry" ]
        , HH.th_ [ HH.text "Days" ]
        , HH.th_ [ HH.text "Purchase Price" ]
        , HH.th_ [ HH.text "Bid" ]
        , HH.th_ [ HH.text "Spot" ]
        , HH.th_ [ HH.text "Purchase vol." ]
        , HH.th_ [ HH.text "Sales vol." ]
        ]
    ]
 
data Field = 
  SellAmount
  | SellPrice

data Action 
  = FetchPaper MouseEvent
  | FetchReal MouseEvent
  | SellDlgShow Purchase MouseEvent
  | SellDlgOk MouseEvent
  | SellDlgCancel MouseEvent
  | ValueChanged Field String


{- type SellPrm = 
  { price :: String
  }
-}


type State = 
  { purchases :: Purchases 
  , msg :: String
  , header :: String
  , isPaper :: Boolean
  , dlgSell :: DLG.DialogState
  , sp :: Maybe Purchase
  , sellPrice :: String
  , sellAmount :: String
  }


purchasesFromJson :: Json -> Either JsonDecodeError Purchases
purchasesFromJson = Decode.decodeJson

resultFromJson :: Json -> Either JsonDecodeError JsonResult
resultFromJson = Decode.decodeJson

fetchPurchases :: forall m. MonadAff m => Boolean -> m (Either HarborViewError Purchases)
fetchPurchases isPaper = 
  let 
    url = if isPaper == false then 
            "/maunaloa/stockoption/purchases/3" 
          else
            "/maunaloa/stockoption/purchases/11" 
  in
  HttpUtil.getAff (Url url) purchasesFromJson 

sell :: forall m. MonadAff m => Oid -> Price -> Amount -> m (Either HarborViewError JsonResult)
sell (Oid oid) (Price price) (Amount amt) = 
  let
    url = 
      "/maunaloa/stockoption/sell" 

    payload :: RequestBody
    payload = 
      REQB.json (
        AC.fromArray 
        [
          AC.jsonSingletonObject "oid" (AC.fromNumber $ DI.toNumber oid)
        , AC.jsonSingletonObject "price" (AC.fromNumber price)
        , AC.jsonSingletonObject "amt" (AC.fromNumber $ DI.toNumber amt)
        ]
      )
  in
  HttpUtil.postAff (Url url) payload resultFromJson 

component :: forall q i o m. MonadAff m => H.Component q i o m
component =
  H.mkComponent
    { initialState: \_ -> { purchases: []
                          , msg: "" 
                          , header: "-" 
                          , isPaper: true 
                          , dlgSell: DialogHidden
                          , sp: Nothing
                          , sellPrice: "0.0"
                          , sellAmount: "0.0"
                          }
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction }
    }

toRow :: forall w. Purchase -> HTML w Action
toRow p = 
  let 
    oid = Format.toString $ DI.toNumber p.oid
    days = Format.toString $ DI.toNumber p.days
    price = Common.numToString p.price
    bid = Common.numToString p.bid
    spot = Common.numToString p.spot
    pvol = Format.toString $ DI.toNumber p.pvol
    svol = Format.toString $ DI.toNumber p.svol
  in
  HH.tr_
    [ UI.mkButton (Title "Sell") (SellDlgShow p)
    , HH.td_ [ HH.text oid ] 
    , HH.td_ [ HH.text p.stock] 
    , HH.td_ [ HH.text p.ot ] 
    , HH.td_ [ HH.text p.ticker ] 
    , HH.td_ [ HH.text p.pdate ] 
    , HH.td_ [ HH.text p.exp ] 
    , HH.td_ [ HH.text days ] 
    , HH.td_ [ HH.text price ] 
    , HH.td_ [ HH.text bid ] 
    , HH.td_ [ HH.text spot ] 
    , HH.td_ [ HH.text pvol ] 
    , HH.td_ [ HH.text svol ] 
    ]

render :: forall cs m. State -> H.ComponentHTML Action cs m
render st =
  let 
    purchaseTable = 
      let 
        rows = map toRow st.purchases
      in 
      HH.div [ HP.classes [ ClassName "row" ]]
        [ HH.table [ HP.classes [ ClassName "table", ClassName "table-hoover" ]]
            [ tableHeader
            , HH.tbody_ 
                rows
            ]
        ]
  in
  HH.div_ 
    [ HH.div [ HP.classes [ ClassName "grid-menu-bar" ]]
        [ UI.mkButton (Title "Fetch paper purchases") FetchPaper
        , UI.mkButton (Title "Fetch real purchases") FetchReal
        , HH.p_ [ HH.h5_ [ HH.text st.header ]
                , HH.text st.msg 
                ]
        ]
    , HH.div 
        [ HP.classes [ ClassName "grid-table" ]]
        [ HH.div 
          [ HP.classes [ ClassName "main-table" ]]
          [ purchaseTable 
          , mkSellDialog st.dlgSell st.sp
          ]
        ]
    ]

type SellDlgParam r = 
  { ticker :: String
  , bid :: Number 
  | r
  }

mkSellDialog :: forall w r. DialogState -> Maybe (SellDlgParam r) -> HTML w Action
mkSellDialog dlgState prm = 
  let 
    
    prmx = 
      case prm of 
        Nothing ->  { h: Title ""
                    , inp: InputVal "0.0"
                    } 
        Just p ->   { h: Title ("Option purchase for " <> p.ticker )
                    , inp: InputVal $ Common.numToString p.bid
                    } 

    amt = 
      UI.mkInput (Title "Amount") InputNumber (ValueChanged SellAmount) Nothing

    price = 
      UI.mkInput (Title "Price") InputNumber (ValueChanged SellPrice) (Just prmx.inp)

    content = 
      HH.div_ 
      [ amt
      , price 
      ]
  in
  DLG.modalDialog prmx.h dlgState SellDlgOk SellDlgCancel content

mkHeader :: Boolean -> String
mkHeader isPaper = 
  if  isPaper == true then
        "Paper purchases." 
      else  
        "Real purchases." 

fetchPurchases_ :: forall cs o m. MonadAff m => Boolean -> H.HalogenM State Action cs o m Unit       
fetchPurchases_ isPaper = 
  fetchPurchases isPaper >>= \result ->
    case result of 
      Left err -> 
        H.modify_ \st -> st { header = mkHeader isPaper
                            , purchases = []
                            , msg = " Fetch purchases FAIL: " <> Common.errToString err
                            }
      Right result1 -> 
        H.modify_ \st -> st { header = mkHeader isPaper
                            , purchases = result1
                            , msg = " Fetch purchases Ok" 
                            }

-- sell :: forall m. MonadAff m => Oid -> Price -> Amount -> m (Either HarborViewError JsonResult)


sellParams :: String -> String -> Maybe { price :: Price, amt :: Amount }
sellParams price amount = 
  DI.fromString amount >>= \a ->
  NUM.fromString price >>= \p ->
    Just { price: Price p, amt: Amount a }



sell_ :: forall cs o m. MonadAff m => H.HalogenM State Action cs o m Unit       
sell_ = 
  H.gets _.sp >>= \sp1 ->
  H.gets _.sellPrice >>= \sellPrice1 -> 
  H.gets _.sellAmount >>= \sellAmount1 ->
  case sp1 of 
    Nothing -> 
      H.modify_ \st -> 
        st  { dlgSell = DialogHidden 
            , msg = "No purchase selected"
            }
    Just sp2 ->
      case sellParams sellPrice1 sellAmount1 of
        Nothing ->
          H.modify_ \st -> 
            st  { sp = Nothing
                , dlgSell = DialogHidden 
                , msg = "Wrong format sell price/amount"
                }
        Just prms ->
          sell (Oid sp2.oid) prms.price prms.amt >>= \result ->
            H.modify_ \st -> 
              st  { sp = Nothing 
                  , dlgSell = DialogHidden 
                  , msg = Common.jsonResultToString result  
                  }


prevDefault :: forall m. MonadEffect m => MouseEvent -> m Unit
prevDefault evt =
  (H.liftEffect $ E.preventDefault (ME.toEvent evt)) 

handleAction :: forall cs o m. MonadAff m => Action -> H.HalogenM State Action cs o m Unit       
handleAction = case _ of
  (FetchReal e) ->
    prevDefault e *> fetchPurchases_ false 
  (FetchPaper e) -> 
    prevDefault e *> fetchPurchases_ true
  (SellDlgShow purchase e) -> 
    prevDefault e *>
    H.modify_ \st -> 
      st  { sp = Just purchase 
          , dlgSell = DialogVisible 
          , sellPrice = Common.numToString purchase.bid
          }
  (SellDlgOk e) -> 
    prevDefault e *> sell_
  (SellDlgCancel e) -> 
    prevDefault e *>
    H.modify_ \st -> 
      st  { sp = Nothing 
          , dlgSell = DialogHidden 
          , msg = "0.0" 
          }
  (ValueChanged SellPrice s) -> 
    H.modify_ \st -> 
      st { sellPrice = s }
  (ValueChanged SellAmount s) -> 
    H.modify_ \st -> 
      st { sellAmount = s }

