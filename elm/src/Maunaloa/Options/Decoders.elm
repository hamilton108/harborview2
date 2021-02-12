module Maunaloa.Options.Decoders exposing (optionDecoder, purchaseStatusDecoder, stockAndOptionsDecoder, stockDecoder)

import Common.Types exposing (JsonStatus)
import Common.Utils as U
import Json.Decode as JD
import Json.Decode.Pipeline as JP
import Maunaloa.Options.Types exposing (Option, Options, Stock, StockAndOptions)


purchaseStatusDecoder =
    JD.succeed JsonStatus
        |> JP.required "ok" JD.bool
        |> JP.required "msg" JD.string
        |> JP.required "statusCode" JD.int


buildOption :
    String
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> Float
    -> String
    -> Option
buildOption t x d b s ib is be ex =
    Option
        t
        x
        d
        b
        s
        ib
        is
        be
        ex
        (U.toDecimal (100 * ((s / b) - 1.0)) 10.0)
        0
        0
        0
        False


optionDecoder : JD.Decoder Option
optionDecoder =
    JD.succeed buildOption
        |> JP.required "ticker" JD.string
        |> JP.required "x" JD.float
        |> JP.required "days" JD.float
        |> JP.required "buy" JD.float
        |> JP.required "sell" JD.float
        |> JP.required "ivBuy" JD.float
        |> JP.required "ivSell" JD.float
        |> JP.required "brEven" JD.float
        |> JP.required "expiry" JD.string


stockDecoder : JD.Decoder Stock
stockDecoder =
    JD.succeed Stock
        |> JP.required "unixTime" JD.int
        |> JP.required "o" JD.float
        |> JP.required "h" JD.float
        |> JP.required "l" JD.float
        |> JP.required "c" JD.float


stockAndOptionsDecoder : JD.Decoder StockAndOptions
stockAndOptionsDecoder =
    JD.succeed StockAndOptions
        |> JP.required "stock" stockDecoder
        |> JP.required "options" (JD.list optionDecoder)
