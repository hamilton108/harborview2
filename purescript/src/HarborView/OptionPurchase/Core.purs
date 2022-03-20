module HarborView.OptionPurchase.Core where

import Prelude

import Data.Either (Either(..))
import Effect.Aff.Class (class MonadAff)
import Affjax as Affjax
import Affjax.ResponseFormat as ResponseFormat
import Affjax.RequestBody (RequestBody)
import Affjax.RequestBody as REQB

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

import Data.Number.Format ( toString
                          )
import Data.Int (toNumber)
import Data.Maybe (Maybe(..))

import HarborView.UI as UI
import HarborView.UI  ( Title(..)
                      , InputVal(..)
                      )
import HarborView.Common (HarborViewError(..)) 
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
  SellField

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
  , isPaper :: Boolean
  , dlgSell :: DLG.DialogState
  , sp :: Maybe Purchase
  , sellPrice :: String
  }


purchasesFromJson :: Json -> Either JsonDecodeError Purchases
purchasesFromJson = Decode.decodeJson

fetchPurchases :: forall m. MonadAff m => Boolean -> m (Either HarborViewError Purchases)
fetchPurchases isPaper = 
  let 
    url = if isPaper == false then 
            "/maunaloa/stockoption/purchases/3" 
          else
            "/maunaloa/stockoption/purchases/11" 
  in
  H.liftAff $
    Affjax.get ResponseFormat.json url >>= \res ->
      let 
        result :: Either HarborViewError Purchases
        result = 
          case res of  
            Left err -> 
              Left $ AffjaxError (Affjax.printError err)
            Right response ->
              let 
                initData = purchasesFromJson response.body
              in
              case initData of
                Left err ->
                  Left $ JsonError (show err)
                Right initData1 ->
                  Right initData1 
      in
      pure result

 
component :: forall q i o m. MonadAff m => H.Component q i o m
component =
  H.mkComponent
    { initialState: \_ -> { purchases: [ ]
                          , msg: "" 
                          , isPaper: true 
                          , dlgSell: DialogHidden
                          , sp: Nothing
                          , sellPrice: "0.0"
                          }
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction }
    }

toRow :: forall w. Purchase -> HTML w Action
toRow p = 
  let 
    oid = toString $ toNumber p.oid
    days = toString $ toNumber p.days
    price = Common.toString p.price
    bid = Common.toString p.bid
    spot = Common.toString p.spot
    pvol = toString $ toNumber p.pvol
    svol = toString $ toNumber p.svol
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
    [ HH.div [ HP.classes [ ClassName "grid-elm" ]]
        [ UI.mkButton (Title "Fetch paper purchases") FetchPaper
        , UI.mkButton (Title "Fetch real purchases") FetchReal
        , HH.p_ [ HH.text st.msg ]
        ]
    , HH.div [ HP.classes [ ClassName "grid-elm" ]]
        [ purchaseTable 
        , mkSellDialog st.dlgSell st.sp
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
                    , inp: InputVal $ Common.toString p.bid
                    } 

    field = 
      UI.mkInput (Title "Price") InputNumber (ValueChanged SellField) (Just prmx.inp)

    content = 
      HH.div_ 
      [ field 
      ]
  in
  DLG.modalDialog prmx.h dlgState SellDlgOk SellDlgCancel content

mkHeader :: Boolean -> String -> String
mkHeader isPaper msg = 
  if  isPaper == true then
        "Paper purchases. " <> msg
      else  
        "Real purchases. " <> msg

fetchPurchases_ :: forall cs o m. MonadAff m => Boolean -> H.HalogenM State Action cs o m Unit       
fetchPurchases_ isPaper = 
  fetchPurchases isPaper >>= \result ->
    case result of 
      Left err -> 
        H.modify_ \st -> st { msg = mkHeader isPaper (" Fetch purchases FAIL: " <> Common.errToString err) }
      Right result1 -> 
        H.modify_ \st -> st { msg = mkHeader isPaper " Purchases fetched."
                            , purchases = result1
                            }

handleAction :: forall cs o m. MonadAff m => Action -> H.HalogenM State Action cs o m Unit       
handleAction = case _ of
  (FetchReal event) ->
    (H.liftEffect $ E.preventDefault (ME.toEvent event)) *>
    fetchPurchases_ false 
  (FetchPaper e) -> 
    (H.liftEffect $ E.preventDefault (ME.toEvent e)) *>
    fetchPurchases_ true
  (SellDlgShow purchase e) -> 
    (H.liftEffect $ E.preventDefault (ME.toEvent e)) *>
    H.modify_ \st -> 
      st  { sp = Just purchase 
          , dlgSell = DialogVisible 
          , sellPrice = Common.toString purchase.bid
          }
  (SellDlgOk e) -> 
    (H.liftEffect $ E.preventDefault (ME.toEvent e)) *>
    H.modify_ \st -> 
      st  { sp = Nothing 
          , dlgSell = DialogHidden 
          , msg = st.sellPrice
          }
  (SellDlgCancel e) -> 
    (H.liftEffect $ E.preventDefault (ME.toEvent e)) *>
    H.modify_ \st -> 
      st  { sp = Nothing 
          , dlgSell = DialogHidden 
          , msg = "0.0" 
          }
  (ValueChanged SellField s) -> 
    H.modify_ \st -> 
      st { sellPrice = s }

