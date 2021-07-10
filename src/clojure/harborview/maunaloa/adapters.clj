(ns harborview.maunaloa.adapters
  (:gen-class)
  (:import
   ;[com.github.benmanes.caffeine.cache Caffeine]
   [org.jsoup Jsoup]
   [java.time Instant]
   ;[java.util UUID]
   ;[redis.clients.jedis Jedis]
   [java.util ArrayList]
   [java.util.function Consumer]
   [java.time LocalDate]

   [oahu.dto Tuple2]
   [oahu.financial StockOption$OptionType]
   [vega.financial.calculator BlackScholes]
   [critterrepos.models.impl StockMarketReposImpl]
   [critterrepos.utils StockOptionUtils]
   [nordnet.downloader DefaultDownloader TickerInfo]
   [nordnet.redis NordnetRedis]
   [nordnet.html StockOptionParser2]
   [harborview.dto.html.options StockPriceAndOptions OptionDTO]
   [harborview.dto.html StockPriceDTO RiscLineDTO]
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

;(def dl-stub-path "/home/rcs/opt/java/harborview2/feed/2020/10/13")
(def dl-stub-path "/home/rcs/opt/java/harborview2/feed/2021/6/21")

(defn downloader [^Consumer page-consumer]
  (let [dl (if (= is-test true)
             (DownloaderStub. dl-stub-path)
             (DefaultDownloader. "172.20.1.2" 6379 0))]
    (.setOnPageDownloaded dl page-consumer)
    (println (str "DOWNLOADER: " dl))
    dl))

(def redis (NordnetRedis. "172.20.1.2" 5))

(def stock-option-utils
  (if (= is-test true)
    (StockOptionUtils. (LocalDate/of 2020 10 5))
    (StockOptionUtils.)))

(defn etrade []
  (let [stockmarket (StockMarketReposImpl.)
        ;utils (if (= is-test true)
        ;        (StockOptionUtils. (LocalDate/of 2020 10 5))
        ;        (StockOptionUtils.))
        calc (BlackScholes.)]
    (StockOptionParser2. calc redis stockmarket stock-option-utils)))

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

(defn calls-or-puts [oid is-call]
  (filter #(= (.isCall %) is-call)
          (fetch-options-cache oid)))

(defn stock-and-options [this oid is-call]
  (let [opx (calls-or-puts oid is-call)
        s (.stockPrice this oid)]
    (StockPriceAndOptions. (StockPriceDTO. s) opx)))

(defn find-option [ticker opx]
  (cu/find-first #(= (.getTicker %) ticker) opx))

(defn find-option-from-ticker [ticker]
  (if-let [info (.stockOptionInfoFromTicker stock-option-utils ticker)]
    (let [is-calls (= (.second info) StockOption$OptionType/CALL)
          opx (calls-or-puts (.first info) is-calls)]
      (find-option ticker opx))))

(defn calcRiscStockPrice [oid risc-json]
  (let [opx (fetch-options-cache oid)
        risc-ticker (risc-json "ticker")
        risc-value (risc-json "risc")]
    (if-let [o (find-option risc-ticker opx)] ;[o (cu/find-first #(= (.getTicker %) risc-ticker) opx)]
      ;then
      (let [sp (.getStockOptionPrice o)
            cur-option-price (- (.getSell o) (risc-json "risc"))
            adjusted-stockprice (.stockPriceFor sp cur-option-price)]
        (if (= (.isPresent adjusted-stockprice) true)
          {:ticker risc-ticker :stockprice (.get adjusted-stockprice) :status 1}
          {:ticker risc-ticker :stockprice -1.0 :status 2}))
      ;else
      {:ticker risc-ticker :stockprice -1.0 :status 3})))

        ;{:ticker (risc "ticker") :risc (.stockPriceFor sp cur-option-price)}))))


(defn risc-lines [oid]
  (let [opx (fetch-options-cache oid)
        calculated (map #(.getStockOptionPrice %) (filter #(= (.isCalculated %) true) opx))]
    (map #(RiscLineDTO. %) calculated)))

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
        (.getStockPrice (first data)))))
  (calcRiscStockprices [this oid riscs]
    (map (partial calcRiscStockPrice oid) riscs))
  (calcRiscOptionPrice [this ticker stockPrice]
    (if-let [o (find-option-from-ticker ticker)]
      (.optionPriceFor (.getStockOptionPrice o) stockPrice)))
  (riscLines [this oid]
    (risc-lines oid)))

(def n (NordnetEtrade.))

(comment
  (def soup
    (memoize
     (fn []
       (let [tif (ticker-info 2)
             pages (.downloadDerivatives my-dl tif)
             p (first pages)
             content (-> p .getPage .getWebResponse .getContentAsString)
             doc (Jsoup/parse content)]
         (prn "SOUP Init")
         doc))))

  (defn soup-row [index]
    (.get (.select (soup) "[role=row]") index))

  (defn z []
    (let [row (soup-row 1)
          arias (.select row "[aria-hidden=true]")
          cls (-> arias (.get 2) .text)
          hi (-> arias (.get 5) .text)
          lo (-> arias (.get 6) .text)]
      {:hi hi
       :lo lo
       :cls cls}))

  (defn o [row]
    (let [;row (soup-row 8)
          arias (.select row "[aria-hidden=true]")
          x (-> arias (.get 5) .text)
          call_bid (-> arias (.get 0) .text)
          call_ask (-> arias (.get 2) .text)
          put_bid (-> arias (.get 10) .text)
          put_ask (-> arias (.get 8) .text)
          ax (.getElementsByTag row "a")
          call (-> ax (.get 2) .text)
          put (-> ax (.get 3) .text)]
      {:x x
       :call_bid call_bid
       :call_ask call_ask
       :put_bid put_bid
       :put_ask put_ask
       :call call
       :put put}))

  (defn all []
    (let [rows (.select (soup) "[role=row]")]
      (map o (drop 3 rows))))

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
