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

import Data.Argonaut.Core (Json)
import Data.Argonaut.Core as AC
import Data.Argonaut.Decode as Decode
import Data.Argonaut.Decode.Error (JsonDecodeError)

import Data.Number.Format ( toString
                          , toStringWith 
                          , fixed
                          )
import Data.Int (toNumber)

import HarborView.UI as UI
import HarborView.UI (Title(..))
import HarborView.Common (HarborViewError(..)) 
import HarborView.Common as Common


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
 
data Action =
  Sell Purchase MouseEvent
  | FetchPaper MouseEvent
  | FetchReal MouseEvent

type State = 
  { purchases :: Purchases 
  , msg :: String
  , header :: String
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
                          , header: "" 
                          }
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction }
    }

toRow :: forall w. Purchase -> HTML w Action
toRow p = 
  let 
    oid = toString $ toNumber p.oid
    days = toString $ toNumber p.days
    price = toStringWith (fixed 2) p.price
    bid = toStringWith (fixed 2) p.bid
    spot = toStringWith (fixed 2) p.spot
    pvol = toString $ toNumber p.pvol
    svol = toString $ toNumber p.svol
  in
  HH.tr_
    [ UI.mkButton (Title "Sell") (Sell p)
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
render state =
  let 
    purchaseTable = 
      let 
        rows = map toRow state.purchases
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
        ]
    , HH.div [ HP.classes [ ClassName "grid-elm" ]]
        [ purchaseTable ]
    ]

handleAction :: forall cs o m. MonadAff m => Action -> H.HalogenM State Action cs o m Unit       
handleAction = case _ of
  (Sell purchase _) -> pure unit
  (FetchReal event) ->
    (H.liftEffect $ E.preventDefault (ME.toEvent event)) *>
      H.modify_ \st -> st { purchases = [] 
                          , header = "Real purchases"
                          }
  (FetchPaper event) -> 
    (H.liftEffect $ E.preventDefault (ME.toEvent event)) *>
    fetchPurchases true >>= \result ->
      case result of 
        Left err -> 
          H.modify_ \st -> st { msg = "Fetch purchases FAIL: " <> Common.errToString err }
        Right result1 -> 
          H.modify_ \st -> st { msg = "Fetch purchases"
                              , header = "Paper purchases"
                              , purchases = result1
                              }
