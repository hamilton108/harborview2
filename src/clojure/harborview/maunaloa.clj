(ns harborview.maunaloa
  (:gen-class)
  (:import
    [java.time LocalDate]
    [harborview.maunaloa.charts 
      ElmChartsFactory ElmChartsWeekFactory ElmChartsMonthFactory]
    [critterrepos.models.impl StockMarketReposImpl])
  (:require 
    ;[jsonista.core :as j]
    [harborview.htmlutils :as U]
    [compojure.core :refer (GET defroutes)]
    ))

(def start-date (LocalDate/of 2010 1 1))

(def repos (StockMarketReposImpl.))

(defn tickers []
  (let [tix (.getStocks repos)
        mapped (map U/bean->json tix)]
    (prn "Fetching tikcers...")
    (U/json-response mapped)))

(def tickers-m (memoize tickers))


(defn calls [])

(defn puts [])

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

(defroutes my-routes
  (GET "/tickers" [] 
    (tickers-m))
  (GET "/days/:oid" [oid]
    (elmChartsDay-m oid))
  (GET "/weeks/:oid" [oid]
    (elmChartsWeek oid))
  (GET "/months/:oid" [oid]
    (elmChartsMonth oid))
  (GET "/calls" []
    (calls))
  (GET "/puts" []
      (puts)))


