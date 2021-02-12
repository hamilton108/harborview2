module Critters.Main exposing (init, initModel, main)

import Browser
import Common.ModalDialog as DLG
import Common.Utils as Utils
import Critters.Types
    exposing
        ( Flags
        , Model
        , Msg(..)
        , Oid(..)
        , Oidable
        , RuleType(..)
        , RuleValue(..)
        )
import Critters.Update as U
import Critters.Views as V
import Html as H


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = V.view
        , update = U.update
        , subscriptions = \_ -> Sub.none
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( initModel flags, Cmd.none )



-- dny1 =
--     T.DenyRule 1 1 1 1 2 2.0 True False
--
--
-- dny2 =
--     T.DenyRule 2 1 1 1 2 4.0 False True
--
--
-- acc =
--     T.AccRule 1 1 1 7 5.5 True [ dny1, dny2 ]
--
--
-- acc2 =
--     T.AccRule 2 1 1 5 3.5 True []
--
--
-- critter =
--     T.Critter 1 10 1 [ acc, acc2 ]
--
--
-- opx =
--     T.OptionPurchase 1 "YAR8L240" [ critter ]
--
--
-- initx : Model
-- initx =
--    initModel Flags
-- opx =
--     T.OptionPurchase 1 "YAR8L240" []


initModel : Flags -> Model
initModel flags =
    { dlgAlert = DLG.DialogHidden
    , dlgNewCritter = DLG.DialogHidden
    , dlgNewAccRule = DLG.DialogHidden
    , dlgNewDenyRule = DLG.DialogHidden
    , purchases = []
    , currentPurchaseType = 0
    , currentCritId = Oid 0
    , currentAccId = Oid 0
    , saleVol = "10"
    , selectedPurchase = Nothing
    , selectedRule = NoRuleType
    , ruleValue = RuleValue "0.0"
    , hasMemory = True
    }
