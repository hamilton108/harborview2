port module Maunaloa.Charts.Update exposing (update)

import Common.ModalDialog as DLG
import Maunaloa.Charts.ChartCommon as ChartCommon
import Maunaloa.Charts.Commands as C
import Maunaloa.Charts.Types
    exposing
        ( ChartInfoWindow
        , ChartType(..)
        , Drop(..)
        , Model
        , Msg(..)
        , RiscLinesJs
        , Spot
        , Take(..)
        , Ticker(..)
        , asTicker
        )



-------------------- PORTS ---------------------


port drawCanvas : ChartInfoWindow -> Cmd msg


port drawRiscLines : RiscLinesJs -> Cmd msg


port drawSpot : Spot -> Cmd msg



-------------------- UPDATE ---------------------


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        AlertOk ->
            ( { model | dlgAlert = DLG.DialogHidden }, Cmd.none )

        TickersFetched (Ok s) ->
            ( { model
                | tickers = s
              }
            , Cmd.none
            )

        TickersFetched (Err s) ->
            ( model, Cmd.none )

        FetchCharts s ->
            let
                curTick =
                    asTicker <| Just s
            in
            ( { model | selectedTicker = Just s }, C.fetchCharts curTick model.chartType False )

        ChartsFetched (Ok chartInfo) ->
            let
                curTick = 
                    asTicker model.selectedTicker 

                ciWin =
                    ChartCommon.chartInfoWindow curTick model.dropAmount model.takeAmount model.chartType chartInfo
            in
            ( { model | chartInfo = Just chartInfo, curValueRange = Just ciWin.chart.valueRange }
            , drawCanvas ciWin
            )

        ChartsFetched (Err s) ->
            ( DLG.errorAlert "Error" "ChartsFetched Error: " s model, Cmd.none )

        --ToggleResetCache ->
        --       ( { model | resetCache = not model.resetCache }, Cmd.none )
        Previous ->
            let
                (Drop curDrop) =
                    model.dropAmount
            in
            shift model (Drop <| curDrop + 30)

        Next ->
            let
                (Drop curDrop) =
                    model.dropAmount
            in
            if curDrop == 0 then
                ( model, Cmd.none )

            else
                shift model (Drop <| curDrop - 30)

        Last ->
            shift model (Drop 0)

        FetchRiscLines ->
            ( model, C.fetchRiscLines <| asTicker model.selectedTicker )

        --( model, fetchRiscLines model )
        RiscLinesFetched (Ok riscLines) ->
            case model.curValueRange of
                Just vr ->
                    let
                        riscLinesJs =
                            RiscLinesJs riscLines vr
                    in
                    --( { model | riscLines = Just riscLines }, drawRiscLines riscLinesJs )
                    ( model, drawRiscLines riscLinesJs )

                Nothing ->
                    --( { model | riscLines = Just riscLines }, Cmd.none )
                    ( model, Cmd.none )

        RiscLinesFetched (Err s) ->
            --Debug.log ("RiscLinesFetched Error: " ++ CH.httpErr2str s) ( model, Cmd.none )
            ( DLG.errorAlert "Error" "RiscLinesFetched Error: " s model, Cmd.none )

        ClearRiscLines ->
            ( model, C.clearRiscLines <| asTicker model.selectedTicker )

        RiscLinesCleared (Ok status) ->
            if status.ok == True then
                ( { model | dlgAlert = DLG.DialogVisibleAlert "RiscLinesCleared Ok" status.msg DLG.Info }, Cmd.none )

            else
                ( { model | dlgAlert = DLG.DialogVisibleAlert "RiscLinesCleared Error" status.msg DLG.Error }, Cmd.none )

        RiscLinesCleared (Err s) ->
            ( DLG.errorAlert "Error" "RiscLinesCleared Error: " s model, Cmd.none )

        FetchSpot ->
            ( model, C.fetchSpot (asTicker <| model.selectedTicker) )

        SpotFetched (Ok s) ->
            ( model, drawSpot s )

        SpotFetched (Err s) ->
            ( DLG.errorAlert "Error" "SpotFetched Error: " s model, Cmd.none )


shift : Model -> Drop -> ( Model, Cmd Msg )
shift model newDrop =
    case model.chartInfo of
        Nothing ->
            ( model, Cmd.none )

        Just chartInfo ->
            let
                curTick = 
                    asTicker model.selectedTicker 

                ciWin =
                    ChartCommon.chartInfoWindow curTick newDrop model.takeAmount model.chartType chartInfo
            in
            ( { model | dropAmount = newDrop }, drawCanvas ciWin )
