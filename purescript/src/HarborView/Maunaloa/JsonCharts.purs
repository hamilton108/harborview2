module HarborView.Maunaloa.JsonCharts where

import Prelude

--import Effect.Console (logShow)
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
import Effect.Aff
    ( Aff
    )
import Affjax.Web as Affjax
import Affjax
    ( URL
    )
import Affjax.ResponseFormat as ResponseFormat
import Data.Maybe 
    ( Maybe(..)
    )
import HarborView.Maunaloa.Common
    ( ValueRange
    , StockTicker(..)
    , ChartType(..)
    )
import HarborView.Maunaloa.MaunaloaError
    ( MaunaloaError(..)
    )

--foreign import addCharts :: String -> JsonChartResponse -> Effect Unit
--foreign import getChartsImpl :: (JsonChartResponse -> Maybe JsonChartResponse) -> Maybe JsonChartResponse -> String -> Maybe JsonChartResponse

--getCharts :: String -> Maybe JsonChartResponse 
--getCharts key = getChartsImpl Just Nothing key

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

chartUrl :: ChartType -> StockTicker -> URL
chartUrl DayChart (StockTicker ticker) = 
    "/maunaloa/stockprice/days/" <> ticker
chartUrl WeekChart (StockTicker ticker) = 
    "/maunaloa/stockprice/weeks/" <> ticker
chartUrl MonthChart (StockTicker ticker) = 
    "/maunaloa/stockprice/months/" <> ticker

fetchCharts :: StockTicker -> ChartType -> Aff (Either MaunaloaError JsonChartResponse)
fetchCharts ticker chartType =  
    Affjax.get ResponseFormat.json (chartUrl chartType ticker) >>= \res ->
        let 
            result :: Either MaunaloaError JsonChartResponse
            result = 
                case res of  
                    Left err -> 
                        Left $ AffjaxError (Affjax.printError err)
                    Right response -> 
                        let 
                            charts = chartsFromJson response.body
                        in 
                        case charts of
                            Left err ->
                                Left $ JsonError (show err)
                            Right charts1 ->
                                Right charts1
        in
        pure result

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


