(ns harborview.maunaloa.adapters
  (:gen-class)
  (:import
   ;[com.github.benmanes.caffeine.cache Caffeine]
   [java.time Instant]
   ;[java.util UUID]
   ;[redis.clients.jedis Jedis]
   [java.util ArrayList]
   [java.util.function Consumer]
   [java.time LocalDate]
   [vega.financial.calculator BlackScholes]
   [critterrepos.models.impl StockMarketReposImpl]
   [critterrepos.utils StockOptionUtils]
   [nordnet.downloader DefaultDownloader TickerInfo]
   [nordnet.redis NordnetRedis]
   [nordnet.html StockOptionParser]
   [harborview.dto.html.options StockPriceAndOptions OptionDTO]
   [harborview.dto.html StockPriceDTO]
   [harborview.downloader DownloaderStub])
  (:require
   [clojure.core.cache :as cache]
   [harborview.htmlutils :as hu]
   [harborview.commonutils :as cu]
   [harborview.maunaloa.ports :as ports]))

(comment
  (defn cacheInvalid? [oid]
    (let [currentTime (.getEpochSecond (Instant/now))
          cacheTime (.hget jedis "olu" (str oid))]
      (if (nil? cacheTime)
        true
        (< currentTime (Integer/parseInt cacheTime)))))

  (defonce app-id (UUID/randomUUID))

  (def jedis (Jedis. "172.20.1.2" 6379))

  (.select jedis 5))

;(def start-date (LocalDate/of 2020 3 1))
(def start-date (LocalDate/of 2010 3 1))

(def repos (StockMarketReposImpl.))

(def ^:dynamic is-test true)

(defn downloader [^Consumer page-consumer]
  (let [dl (if (= is-test true)
             (DownloaderStub. "/home/rcs/opt/java/harborview2/feed/2020/10/13")
             (DefaultDownloader. "172.20.1.2" 6379 0))]
    (.setOnPageDownloaded dl page-consumer)
    (println (str "DOWNLOADER: " dl))
    dl))

(def redis (NordnetRedis. "172.20.1.2" 5))

(defn etrade []
  (let [stockmarket (StockMarketReposImpl.)
        utils (if (= is-test true)
                (StockOptionUtils. (LocalDate/of 2020 10 5))
                (StockOptionUtils.))
        calc (BlackScholes.)]
    (StockOptionParser. calc redis stockmarket utils)))

(def my-etrade (etrade))

(def my-dl (downloader nil))

(def prices-cache (atom {}))

(defn fetch-prices [oid]
  (let [ticker (.getTickerFor repos (hu/rs oid))]
    (prn "CACHE MISS PRICES")
    (.findStockPrices repos ticker start-date)))

(defn fetch-prices-init [oid]
  (let [data (fetch-prices oid)
        timestamp (.getEpochSecond (Instant/now))]
    (prn (str "NEW INIT: " timestamp))
    (swap! prices-cache assoc oid [timestamp data])
    data))

(defn fetch-prices-cache [oid]
  (if-let [[my-tm my-prices] (get @prices-cache oid)]
    ;then ---------------------------
    (let [ticker (.getTickerFor repos (hu/rs oid))
          tm (.getLastUpdateTimeStockPrices redis ticker)]
      (if (> tm my-tm)
        (fetch-prices-init oid)
        my-prices))
    ;else ---------------------------
    (fetch-prices-init oid)))

(defrecord Postgres []
  ports/MaunaloaDB
  (invalidateDB [this]
    (reset! prices-cache {}))
  (invalidateDB [this oid]
    (swap! prices-cache dissoc oid))
  (tickers [this] (.getStocks repos))
  (prices [this oid]
    (fetch-prices-cache oid)))

(defn ticker-info [oid]
  (let [ticker (.getTickerFor repos (hu/rs oid))]
    (TickerInfo. ticker)))

(defn fetch-options [oid]
  (let [tif (ticker-info oid)
        pages (.downloadDerivatives my-dl tif)
        page (first pages)
        sp (.stockPrice my-etrade tif page)]
    (prn "CACHE MISS OPTIONS")
    (map #(OptionDTO. %) (.options my-etrade page (.get sp)))))

(def options-cache (atom {}))

(defn fetch-options-cache [oid]
  (let [cached (get @options-cache oid)]
    (if (nil? cached)
      (let [data (fetch-options oid)]
        (swap! options-cache assoc oid data)
        data)
      cached)))

(defn stock-and-options [this oid is-call]
  (let [opx (filter #(= (.isCall %) is-call) (fetch-options-cache oid))
        s (.stockPrice this oid)]
    (StockPriceAndOptions. (StockPriceDTO. s) opx)))

(defn calcStockPrice [oid risc]
  (let [opx (fetch-options-cache oid)]
    (if-let [o (cu/find-first #(= (.getTicker %) (risc "ticker")) opx)]
      (let [sp (.getStockOptionPrice o)]
        (.stockPriceFor sp (.getSell o))))))

(defrecord NordnetEtrade []
  ports/Etrade
  ;(calcStockPrices [this oid riscs])
  (invalidateEtrade [this]
    (reset! options-cache {}))
  (invalidateEtrade [this oid]
    (swap! options-cache dissoc oid))
  (calls [this oid]
    (stock-and-options this oid true))
  (puts [this oid]
    (stock-and-options this oid false))
  (stockPrice [this oid]
    (let [data (fetch-options-cache oid)]
      (if (> (.size data) 0)
        (.getStockPrice (first data))))))

(def n (NordnetEtrade.))

(comment
  (def my-cache (atom (cache/ttl-cache-factory {} :ttl 3000)))

  (defn fetch-data-cache [oid]
    (-> (swap! my-cache cache/through-cache oid fetch-data)
        (cache/lookup oid)))

  (defn ^java.util.function.Function as-function [f]
    (reify java.util.function.Function
      (apply [this arg] (f arg))))

  (def cache (.build (Caffeine/newBuilder)))

  (def kkey
    (reify
      java.util.function.Function
      (apply [this oid]
        (fetch-data oid))))

  (defn fetch-data-cache [oid]
    (.get cache oid kkey)))
