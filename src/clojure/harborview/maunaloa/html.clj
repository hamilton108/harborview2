(ns harborview.maunaloa.html
  (:gen-class)
  (:import
   [java.time LocalDate]
   [harborview.maunaloa.charts
    ElmChartsFactory ElmChartsWeekFactory ElmChartsMonthFactory]
   [critterrepos.models.impl StockMarketReposImpl])
  (:require
    ;[jsonista.core :as j]
   [harborview.htmlutils :as U]
   [harborview.maunaloa.derivatives :refer (etrade)]
   [compojure.core :refer (GET defroutes)]))

(def start-date (LocalDate/of 2015 1 1))

(def repos (StockMarketReposImpl.))

(defn tickers []
  (let [tix (.getStocks repos)
        mapped (map U/bean->json tix)]
    (prn "Fetching tikcers...")
    (U/json-response mapped)))

(def tickers-m (memoize tickers))

(defn calls [ticker]
  (.calls etrade ticker))

(defn puts [ticker]
  (.puts etrade ticker))

(defn prices [oid]
  (let [ticker (.getTickerFor repos (U/rs oid))]
    (.findStockPrices repos ticker start-date)))

(defn elmChartsDay [oid]
  (let [factory (ElmChartsFactory.)
        charts (.elmCharts factory (prices oid))]
    (U/om->json charts)))

(def elmChartsDay-m (memoize elmChartsDay))

(defn elmChartsWeek [oid]
  (let [factory (ElmChartsWeekFactory.)
        charts (.elmCharts factory (prices oid))]
    (U/om->json charts)))

(defn elmChartsMonth [oid]
  (let [factory (ElmChartsMonthFactory.)
        charts (.elmCharts factory (prices oid))]
    (U/om->json charts)))

(defn risclines [ticker]
  (prn "Fetching risclines: " ticker)
  (U/json-response
   [{:ticker "NHY-DEMO"
     :be 100.0
     :stockprice 120.0
     :optionprice 5.0
     :ask 7.5
     :risc 4.5} ;(.getCurrentRisc o)})
    ]))

(defroutes my-routes
  (GET "/tickers" []
    (tickers-m))
  (GET "/days/:oid" [oid]
    (elmChartsDay-m oid))
  (GET "/weeks/:oid" [oid]
    (elmChartsWeek oid))
  (GET "/months/:oid" [oid]
    (elmChartsMonth oid))
  (GET "/risclines/:ticker" [ticker]
    (risclines ticker))
  (GET "/calls/:ticker" [ticker]
    (calls ticker))
  (GET "/puts/:ticker" [ticker]
    (puts ticker)))

