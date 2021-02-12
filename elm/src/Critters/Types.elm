module Critters.Types exposing
    ( AccRule
    , AccRuleMsg(..)
    , Activable
    , Critter
    , CritterMsg(..)
    , DenyRule
    , DenyRuleMsg(..)
    , Flags
    , JsonStatus
    , Model
    , Msg(..)
    , Oid(..)
    , Oidable
    , OptionPurchase
    , OptionPurchases
    , RuleType(..)
    , RuleValue(..)
    , rtypDesc
    , rtypSelectItems
    )

import Common.ModalDialog as DLG
import Common.Select as S
import Http


rtypDesc : Int -> String
rtypDesc rtyp =
    case rtyp of
        1 ->
            "[1] Diff from watermark"

        2 ->
            "[2] Diff from watermark percent"

        3 ->
            "[3] Stock price floor (valid if above price)"

        4 ->
            "[4] Stock price roof (valid if below price)"

        5 ->
            "[5] Option price floor (valid if above price)"

        6 ->
            "[6] Option price roof (valid if below price)"

        7 ->
            "[7] Diff from bought"

        9 ->
            "[9] Gradient diff from watermark"

        _ ->
            "Composite"


rtypSelectItems : S.SelectItems
rtypSelectItems =
    [ S.SelectItem "1" (rtypDesc 1)
    , S.SelectItem "2" (rtypDesc 2)
    , S.SelectItem "3" (rtypDesc 3)
    , S.SelectItem "4" (rtypDesc 4)
    , S.SelectItem "5" (rtypDesc 5)
    , S.SelectItem "6" (rtypDesc 6)
    , S.SelectItem "7" (rtypDesc 7)
    , S.SelectItem "9" (rtypDesc 9)
    ]


type CritterMsg
    = PaperCritters
    | RealTimeCritters
    | NewCritter
    | PaperCrittersFetched (Result Http.Error OptionPurchases)
    | RealTimeCrittersFetched (Result Http.Error OptionPurchases)
    | DlgNewCritterOk
    | DlgNewCritterCancel
    | OnNewCritter (Result Http.Error JsonStatus)


type AccRuleMsg
    = ToggleAccActive AccRule
    | NewAccRule Oid
    | DlgNewAccOk
    | DlgNewAccCancel
    | OnNewAccRule (Result Http.Error JsonStatus)


type DenyRuleMsg
    = ToggleDenyActive DenyRule
    | NewDenyRule Oid
    | DlgNewDenyOk
    | DlgNewDenyCancel
    | OnNewDenyRule (Result Http.Error JsonStatus)


type Msg
    = AlertOk
    | CritterMsgFor CritterMsg
    | AccRuleMsgFor AccRuleMsg
    | DenyRuleMsgFor DenyRuleMsg
    | Toggled (Result Http.Error JsonStatus)
    | SelectedPurchaseChanged String
    | SelectedRuleChanged String
    | SaleVolChanged String
    | RuleValueChanged String
    | ToggleHasMemory
    | ResetCache
    | CacheReset (Result Http.Error JsonStatus)


type Oid
    = Oid Int


type RuleType
    = RuleType Int
    | NoRuleType


type RuleValue
    = RuleValue String


type alias JsonStatus =
    { ok : Bool, msg : String, statusCode : Int }


type alias Activable a =
    { a | oid : Int, active : Bool }


type alias Oidable a =
    { a | oid : Int }


type alias OptionPurchase =
    { oid : Int
    , ticker : String
    , critters : List Critter
    }


type alias OptionPurchases =
    List OptionPurchase


type alias Critter =
    { oid : Int
    , sellVolume : Int
    , status : Int
    , accRules : List AccRule
    }


type alias AccRule =
    { oid : Int
    , purchaseId : Int
    , critId : Int
    , rtyp : Int
    , value : Float
    , active : Bool
    , denyRules : List DenyRule
    }


type alias DenyRule =
    { oid : Int
    , purchaseId : Int
    , critId : Int
    , accId : Int
    , rtyp : Int
    , value : Float
    , active : Bool
    , memory : Bool
    }


type alias Flags =
    {}


type alias Model =
    { dlgAlert : DLG.DialogState
    , dlgNewCritter : DLG.DialogState
    , dlgNewAccRule : DLG.DialogState
    , dlgNewDenyRule : DLG.DialogState
    , purchases : OptionPurchases
    , currentPurchaseType : Int
    , currentCritId : Oid
    , currentAccId : Oid
    , saleVol : String
    , selectedPurchase : Maybe String
    , selectedRule : RuleType
    , ruleValue : RuleValue
    , hasMemory : Bool
    }
