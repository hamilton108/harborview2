module Maunaloa.Charts.Commands exposing
    ( clearRiscLines
    , fetchCharts
    , fetchRiscLines
    , fetchSpot
    , fetchTickers
    )

import Common.Decoders as CD
import Common.Types as T
import Http
import Maunaloa.Charts.Decoders as DEC
import Maunaloa.Charts.Types
    exposing
        ( ChartType(..)
        , Msg(..)
        , Ticker(..)
        )


mainUrl =
    "/maunaloa"


fetchTickers : Cmd Msg
fetchTickers =
    let
        url =
            mainUrl ++ "/tickers"
    in
    Http.send TickersFetched <|
        Http.get url CD.selectItemListDecoder


fetchCharts : Ticker -> ChartType -> Bool -> Cmd Msg
fetchCharts ticker ct resetCache =
    case ticker of
        NoTicker ->
            Cmd.none

        Ticker s ->
            let
                url =
                    case ct of
                        DayChart ->
                            mainUrl ++ "/days/" ++ s

                        WeekChart ->
                            mainUrl ++ "/weeks/" ++ s

                        MonthChart ->
                            mainUrl ++ "/months/" ++ s
            in
            Http.send ChartsFetched <| Http.get url (DEC.chartInfoDecoder s)


fetchRiscLines : Ticker -> Cmd Msg
fetchRiscLines ticker =
    case ticker of
        NoTicker ->
            Cmd.none

        Ticker s ->
            let
                url =
                    mainUrl ++ "/risclines/" ++ s
            in
            Http.send RiscLinesFetched <|
                Http.get url DEC.riscsDecoder


clearRiscLines : Ticker -> Cmd Msg
clearRiscLines ticker =
    case ticker of
        NoTicker ->
            Cmd.none

        Ticker s ->
            let
                url =
                    mainUrl ++ "/clearrisclines/" ++ s
            in
            Http.send RiscLinesCleared <|
                Http.get url T.jsonStatusDecoder


fetchSpot : Ticker -> Cmd Msg
fetchSpot ticker =
    case ticker of
        NoTicker ->
            Cmd.none

        Ticker s ->
            let
                url =
                    mainUrl ++ "/spot/" ++ s
            in
            Http.send SpotFetched <|
                Http.get url DEC.spotDecoder
