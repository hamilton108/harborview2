module Maunaloa.Options.Main exposing (initModel, main)

import Browser
import Common.ModalDialog as DLG
import Maunaloa.Options.Commands as C
import Maunaloa.Options.Types exposing (Flags, Model, Msg(..))
import Maunaloa.Options.Update exposing (update)
import Maunaloa.Options.Views exposing (view)
import Table


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( initModel flags
    , C.fetchTickers
    )



{-
   init : Flags -> ( Model, Cmd Msg )
   init flags =
       ( initModel flags
       , Cmd.batch
           [ Task.perform SetModelId Time.now
           , C.fetchTickers
           ]
       )
-}


initModel : Flags -> Model
initModel flags =
    { tickers = []
    , selectedTicker = Nothing
    , stock = Nothing
    , options = []
    , risc = "0.0"
    , flags = flags
    , tableState = Table.initialSort "Ticker"
    , dlgPurchase = DLG.DialogHidden
    , dlgAlert = DLG.DialogHidden
    , selectedPurchase = Nothing
    , isRealTimePurchase = True
    , isOnlyIvGtZero = True
    , ask = "0.0"
    , bid = "0.0"
    , volume = "10"
    , spot = "0.0"
    }
