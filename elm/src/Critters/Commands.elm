module Critters.Commands exposing (fetchCritters, mainUrl, newAccRule, newCritter, newDenyRule, resetCache, toggleRule)

import Common.Decoders as Dec
import Critters.Decoders as CD
import Critters.Types
    exposing
        ( AccRuleMsg(..)
        , CritterMsg(..)
        , DenyRuleMsg(..)
        , Msg(..)
        , Oid(..)
        , RuleType(..)
        , RuleValue(..)
        )
import Http


mainUrl =
    "purchases"


newCritter_ : Int -> Int -> Cmd Msg
newCritter_ oid vol =
    let
        url =
            mainUrl
                ++ "/newcritter/"
                ++ String.fromInt oid
                ++ "/"
                ++ String.fromInt vol
    in
    Http.send (CritterMsgFor << OnNewCritter) <|
        Http.get url Dec.jsonStatusDecoder


newCritter : String -> String -> Cmd Msg
newCritter oid vol =
    let
        maybeCmd =
            String.toInt oid
                |> Maybe.andThen
                    (\oidx ->
                        String.toInt vol
                            |> Maybe.andThen (\volx -> Just (newCritter_ oidx volx))
                    )
    in
    case maybeCmd of
        Nothing ->
            Cmd.none

        Just cmd ->
            cmd



{-
   newAccRule_ : Oid -> RuleType -> RuleValue -> Cmd Msg
   newAccRule_ (Oid oid) rt val =
       let
           url =
               mainUrl
                   ++ "/newacc/"
                   ++ String.fromInt oid
                   ++ "/"
                   ++ String.fromFloat vol
       in
       Http.send (CritterMsgFor << OnNewCritter) <|
           Http.get url Dec.jsonStatusDecoder
-}


newAccRule : Oid -> RuleType -> RuleValue -> Cmd Msg
newAccRule (Oid oid) ruleType (RuleValue val) =
    case ruleType of
        NoRuleType ->
            Cmd.none

        RuleType rt ->
            let
                url =
                    mainUrl
                        ++ "/newacc/"
                        ++ String.fromInt oid
                        ++ "/"
                        ++ String.fromInt rt
                        ++ "/"
                        ++ val
            in
            Http.send (AccRuleMsgFor << OnNewAccRule) <|
                Http.get url Dec.jsonStatusDecoder


newDenyRule : Oid -> RuleType -> RuleValue -> Bool -> Cmd Msg
newDenyRule (Oid oid) ruleType (RuleValue val) hasMemory =
    case ruleType of
        NoRuleType ->
            Cmd.none

        RuleType rt ->
            let
                boolStr =
                    if hasMemory == True then
                        "true"

                    else
                        "false"

                url =
                    mainUrl
                        ++ "/newdeny/"
                        ++ String.fromInt oid
                        ++ "/"
                        ++ String.fromInt rt
                        ++ "/"
                        ++ val
                        ++ "/"
                        ++ boolStr
            in
            Http.send (DenyRuleMsgFor << OnNewDenyRule) <|
                Http.get url Dec.jsonStatusDecoder



--  p1m =
--      Utils.findInList m.purchases curAcc.purchaseId
--          |> Maybe.andThen (\p -> Utils.findInList p.critters curAcc.critId)
--          |> Maybe.andThen (\c -> Just (List.map (U.toggleOid curAcc.oid) c.accRules))
--


resetCache : Int -> Cmd Msg
resetCache purchaseType =
    let
        url =
            mainUrl ++ "/resetcache/" ++ String.fromInt purchaseType
    in
    Http.send CacheReset <|
        Http.get url Dec.jsonStatusDecoder


toggleRule : Bool -> Int -> Bool -> Cmd Msg
toggleRule isAccRule oid newVal =
    let
        rt =
            if isAccRule == True then
                "1"

            else
                "2"

        newValx =
            if newVal == True then
                "true"

            else
                "false"

        url =
            mainUrl ++ "/toggle/" ++ rt ++ "/" ++ String.fromInt oid ++ "/" ++ newValx
    in
    Http.send Toggled <|
        Http.get url Dec.jsonStatusDecoder


fetchCritters : Bool -> Cmd Msg
fetchCritters isRealTime =
    let
        critterTypeUrl =
            if isRealTime == True then
                "3"

            else
                "11"

        url =
            mainUrl ++ "/" ++ critterTypeUrl

        msg =
            if isRealTime == True then
                CritterMsgFor << RealTimeCrittersFetched

            else
                CritterMsgFor << PaperCrittersFetched
    in
    Http.send msg <|
        Http.get url CD.optionPurchasesDecoder
