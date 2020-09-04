(ns harborview.maunaloa
  (:gen-class)
  (:import
    [critterrepos.models.impl StockMarketReposImpl])
  (:require 
    ;[jsonista.core :as j]
    [harborview.htmlutils :as U]
    [compojure.core :refer (GET defroutes)]
    ))

(def repos (StockMarketReposImpl.))

(defn tickers []
  (let [tix (.getStocks repos)
        mapped (map U/bean->json tix)]
    (U/json-response mapped)))


(defroutes my-routes
  (GET "/tickers" [] 
    (tickers)))


