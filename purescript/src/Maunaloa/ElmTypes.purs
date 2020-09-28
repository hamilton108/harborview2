module Maunaloa.ElmTypes where

import Data.Nullable (Nullable)

type ElmCandlestick =
    { o :: Number 
    , h :: Number 
    , l :: Number 
    , c :: Number 
    }


type ElmChart =
    { lines :: Array (Array Number)
    , bars :: Array (Array Number)
    , candlesticks :: Array ElmCandlestick
    , valueRange :: Array Number
    , numVlines :: Int
    }


type ChartInfoWindow =
    { ticker :: String
    , startdate :: Number
    , xaxis :: Array Int
    , chart :: ElmChart
    , chart2 :: Nullable ElmChart
    , chart3 :: Nullable ElmChart
    , strokes :: Array String
    , numIncMonths :: Int
    }