module Maunaloa.Json.JsonCharts where

import Prelude

import Data.Either 
    ( Either(..)
    )
import Data.Argonaut.Core 
    ( Json
    )
import Data.Argonaut.Decode as Decode
import Data.Argonaut.Decode.Error 
    ( JsonDecodeError
    )
import Effect 
    ( Effect
    )
import Effect.Console 
    ( logShow
    )
import Effect.Class
    ( liftEffect
    )
import Effect.Aff
    ( Aff
    )
import Affjax as Affjax
import Affjax
    ( URL
    )
import Affjax.ResponseFormat as ResponseFormat
import Data.Maybe 
    ( Maybe(..)
    )
import Maunaloa.Common
    ( ValueRange
    , Ticker(..)
    , ChartType(..)
    , MaunaloaError(..)
    )

foreign import addCharts :: String -> JsonChartResponse -> Effect Unit

type JsonCandlestick =
    { o :: Number 
    , h :: Number 
    , l :: Number 
    , c :: Number 
    }

type JsonChart =
    { lines :: Maybe (Array (Array Number))
    , bars :: Maybe (Array (Array Number))
    , candlesticks :: Maybe (Array JsonCandlestick)
    }

type JsonChartWindow =
    { lines :: Array (Array Number)
    , bars :: Array (Array Number)
    , candlesticks :: Array JsonCandlestick
    , valueRange :: ValueRange 
    , numVlines :: Int
    }
    
type JsonChartResponse =
    { ticker :: String
    , chart :: JsonChart
    , chart2 :: JsonChart
    , chart3 :: JsonChart
    , xAxis :: Array Int
    , minDx :: Number
    }

emptyJsonChart :: JsonChart
emptyJsonChart = 
    { lines: Nothing
    , bars: Nothing 
    , candlesticks: Nothing 
    }

chartsFromJson :: Json -> Either JsonDecodeError JsonChartResponse 
chartsFromJson = Decode.decodeJson

chartUrl :: ChartType -> Ticker -> URL
chartUrl DayChart (Ticker ticker) = 
    "-"
chartUrl WeekChart (Ticker ticker) = 
    "-"
chartUrl MonthChart (Ticker ticker) = 
    "-"

fetchCharts :: Ticker -> ChartType -> Aff (Either MaunaloaError JsonChartResponse)
fetchCharts ticker chartType =  
    Affjax.get ResponseFormat.json (chartUrl chartType ticker) >>= \res ->
        case res of  
            Left err -> 
                pure $ Left $ AffjaxError (Affjax.printError err)
            Right response -> 
                let 
                    charts = chartsFromJson response.body
                in 
                case charts of
                    Left err ->
                        pure $ Left $ JsonError (show err)
                    Right charts1 ->
                        pure $ Right charts1

 {-
demo :: Effect Unit
demo = 
    launchAff_ $
        --Affjax.get ResponseFormat.json "https://reqbin.com/echo/get/json" >>= \res ->
        let
            key = "1"
        in
        Affjax.get ResponseFormat.json (days key) >>= \res ->
            case res of  
                Left err -> 
                    (liftEffect $ logShow $ "Affjax Error: " <> Affjax.printError err) *>
                    pure unit
                Right response -> 
                    -- (liftEffect $ logShow "OK!") *>
                    let 
                        charts = chartsFromJson response.body
                    in 
                    -- (liftEffect $ showJson response.body) *>
                    case charts of
                        Left err ->
                            (liftEffect $ alert $ show err)
                        Right charts1 ->
                            -- -> (liftEffect $ logShow charts1)
                            (liftEffect $ addCharts key charts1)
-}


