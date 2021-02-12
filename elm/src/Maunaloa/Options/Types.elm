module Maunaloa.Options.Types exposing
    ( Ask(..)
    , Bid(..)
    , Flags
    , Model
    , Msg(..)
    , Option
    , OptionMsg(..)
    , OptionSale
    , Options
    , PurchaseMsg(..)
    , RiscItem
    , RiscItems
    , RiscMsg(..)
    , Spot(..)
    , Stock
    , StockAndOptions
    , StockId(..)
    , Ticker(..)
    , Volume(..)
    )

import Common.DateUtil exposing (UnixTime)
import Common.ModalDialog as DLG exposing (errorAlert)
import Common.Select as CMB
import Common.Types exposing (JsonStatus)
import Http
import Table


type alias Flags =
    { isCalls : Bool
    }


type alias Stock =
    { unixTime : UnixTime
    , o : Float
    , h : Float
    , l : Float
    , c : Float
    }


type alias Option =
    { ticker : String
    , x : Float
    , days : Float
    , buy : Float
    , sell : Float
    , ivBuy : Float
    , ivSell : Float
    , breakEven : Float
    , expiry : String
    , spread : Float
    , risc : Float
    , optionPriceAtRisc : Float
    , stockPriceAtRisc : Float
    , selected : Bool
    }


type alias Options =
    List Option


type alias StockAndOptions =
    { stock : Stock
    , opx : Options
    }


type alias RiscItem =
    { ticker : String
    , risc : Float
    }


type alias RiscItems =
    List RiscItem


type alias OptionSale =
    {}


type StockId
    = StockId Int


type Ask
    = Ask Float


type Bid
    = Bid Float


type Ticker
    = Ticker String


type Spot
    = Spot Float


type Volume
    = Volume Int



{-
   type alias PurchaseStatus =
       { ok : Bool, msg : String, statusCode : Int }
-}
{-
   type alias PurchaseStatus =
       { ok : Bool, msg : String, statusCode : Int }
-}


type OptionMsg
    = FetchOptions String
    | OptionsFetched (Result Http.Error StockAndOptions)


type PurchaseMsg
    = PurchaseClick Option
    | PurchaseDlgOk
    | PurchaseDlgCancel
    | OptionPurchased (Result Http.Error JsonStatus)


type RiscMsg
    = CalcRisc
    | RiscCalculated (Result Http.Error RiscItems)
    | RiscChange String


type Msg
    = AlertOk
    | TickersFetched (Result Http.Error CMB.SelectItems)
    | SetTableState Table.State
    | ResetCache
    | ToggleSelected String
    | ToggleRealTimePurchase
    | ToggleOnlyIvGtZero
    | AskChange String
    | BidChange String
    | VolumeChange String
    | SpotChange String
    | RiscMsgFor RiscMsg
    | OptionMsgFor OptionMsg
    | PurchaseMsgFor PurchaseMsg


type alias Model =
    { tickers : CMB.SelectItems
    , selectedTicker : Maybe String
    , stock : Maybe Stock
    , options : Options
    , risc : String
    , flags : Flags
    , tableState : Table.State
    , dlgPurchase : DLG.DialogState
    , dlgAlert : DLG.DialogState
    , selectedPurchase : Maybe Option
    , isRealTimePurchase : Bool
    , isOnlyIvGtZero : Bool
    , ask : String
    , bid : String
    , volume : String
    , spot : String
    }
