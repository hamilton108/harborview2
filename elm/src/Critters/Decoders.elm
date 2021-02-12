module Critters.Decoders exposing (..)

import Json.Decode.Pipeline as JP
import Json.Decode as Json
import Critters.Types
    exposing
        ( AccRule
        , DenyRule
        , Critter
        , OptionPurchase
        , OptionPurchases
        )


denyRuleDecoder : Json.Decoder DenyRule
denyRuleDecoder =
    Json.succeed DenyRule
        |> JP.required "oid" Json.int
        |> JP.required "pid" Json.int
        |> JP.required "cid" Json.int
        |> JP.required "accid" Json.int
        |> JP.required "rtyp" Json.int
        |> JP.required "value" Json.float
        |> JP.required "active" Json.bool
        |> JP.required "mem" Json.bool


accRuleDecoder : Json.Decoder AccRule
accRuleDecoder =
    Json.succeed AccRule
        |> JP.required "oid" Json.int
        |> JP.required "pid" Json.int
        |> JP.required "cid" Json.int
        |> JP.required "rtyp" Json.int
        |> JP.required "value" Json.float
        |> JP.required "active" Json.bool
        |> JP.optional "dnyRules" (Json.list denyRuleDecoder) []


critterDecoder : Json.Decoder Critter
critterDecoder =
    Json.succeed Critter
        |> JP.required "oid" Json.int
        |> JP.required "vol" Json.int
        |> JP.required "status" Json.int
        |> JP.optional "accRules" (Json.list accRuleDecoder) []


optionPurchaseDecoder : Json.Decoder OptionPurchase
optionPurchaseDecoder =
    Json.succeed OptionPurchase
        |> JP.required "oid" Json.int
        |> JP.required "ticker" Json.string
        |> JP.optional "critters" (Json.list critterDecoder) []


optionPurchasesDecoder : Json.Decoder OptionPurchases
optionPurchasesDecoder =
    Json.list optionPurchaseDecoder
