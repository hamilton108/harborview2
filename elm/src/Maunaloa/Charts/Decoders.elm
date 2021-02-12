module Maunaloa.Charts.Decoders exposing
    ( candlestickDecoder
    , chartDecoder
    , chartInfoDecoder
    , riscsDecoder
    , spotDecoder
    )

import Json.Decode exposing (Decoder, field, float, int, list, map4, nullable, string, succeed)
import Json.Decode.Pipeline as JP
import Maunaloa.Charts.Types as T


candlestickDecoder : Decoder T.Candlestick
candlestickDecoder =
    map4 T.Candlestick
        (field "o" float)
        (field "h" float)
        (field "l" float)
        (field "c" float)


chartDecoder : Int -> Decoder T.Chart
chartDecoder numVlines =
    succeed T.Chart
        |> JP.optional "lines" (list (list float)) []
        |> JP.optional "bars" (list (list float)) []
        |> JP.optional "candlesticks" (list candlestickDecoder) []
        |> JP.hardcoded ( 0, 0 )
        |> JP.hardcoded numVlines


chartInfoDecoder : String -> Decoder T.ChartInfo
chartInfoDecoder ticker =
    succeed T.ChartInfo
        |> JP.hardcoded ticker
        |> JP.required "minDx" int
        |> JP.required "xAxis" (list int)
        |> JP.required "chart" (chartDecoder 10)
        |> JP.required "chart2" (nullable (chartDecoder 5))
        |> JP.required "chart3" (nullable (chartDecoder 5))


riscDecoder : Decoder T.RiscLine
riscDecoder =
    succeed T.RiscLine
        |> JP.required "ticker" string
        |> JP.required "be" float
        |> JP.required "stockprice" float
        |> JP.required "optionprice" float
        |> JP.required "risc" float
        |> JP.required "ask" float


riscsDecoder : Decoder T.RiscLines
riscsDecoder =
    list riscDecoder


spotDecoder : Decoder T.Spot
spotDecoder =
    succeed T.Spot
        |> JP.required "unixTime" int
        |> JP.required "o" float
        |> JP.required "h" float
        |> JP.required "l" float
        |> JP.required "c" float
