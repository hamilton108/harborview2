(ns harborview.maunaloa.adapters.dbadapters
  (:gen-class)
  (:import
   (java.sql Date)
   (java.time Instant LocalDate)
   (java.util.function Consumer)
   (java.util Optional)
   (oahu.exceptions FinancialException)
   (vega.financial StockOption$OptionType)
   (vega.financial.calculator BlackScholes)
   (critter.stockoption
    StockOptionSale
    StockOption
    StockOptionPurchase)
   (critter.util StockOptionUtil)
   (critter.repos StockMarketRepository)
   (critter.mybatis
    CritterMapper
    StockMapper
    StockOptionMapper)
   (nordnet.downloader DefaultDownloader TickerInfo)
   (nordnet.redis NordnetRedis)
   ;(nordnet.html StockOptionParser2)
   (harborview.downloader DownloaderStub))
  (:require
   [harborview.commonutils :as cu :refer [with-session with-session-2]]
   [harborview.maunaloa.ports :as ports]))

;; (comment
;;   (defn cacheInvalid? [oid]
;;     (let [currentTime (.getEpochSecond (Instant/now))
;;           cacheTime (.hget jedis "olu" (str oid))]
;;       (if (nil? cacheTime)
;;         true
;;         (< currentTime (Integer/parseInt cacheTime)))))

;;   (defonce app-id (UUID/randomUUID))

;;   (def jedis (Jedis. "172.20.1.2" 6379))

;;   (.select jedis 5))


(comment ^:dynamic is-test true)

;(def start-date (LocalDate/of 2020 3 1))
(def start-date (Date/valueOf (LocalDate/of 2010 3 1)))

;(def rx (StockMarketReposImpl.))

(def stox-cache (atom nil))

(defn stox-m []
  (if (nil? @stox-cache)
    (let [stox (with-session StockMapper (.selectStocks it))]
      (prn "FIRST TIME")
      (reset! stox-cache stox)
      stox)
    @stox-cache))

(comment redis (NordnetRedis. "172.20.1.2" 5))

(comment stock-option-utils
         (if (= is-test true)
           (StockOptionUtil. (LocalDate/of 2020 10 5))
           (StockOptionUtil.)))

(defn find-stock [oid]
  (first (filter #(= oid (.getOid %)) (stox-m))))

(def prices-cache (atom {}))

(defn fetch-prices [oid]
  (with-session StockMapper
    (let [prices (.selectStockPrices it oid start-date)
          s (find-stock oid)]
      (prn "CACHE MISS PRICES")
      (doseq [p prices]
        (.setStock p s))
      prices)))

(defn fetch-prices-init [oid]
  (let [data (fetch-prices oid)
        timestamp (.getEpochSecond (Instant/now))]
    (prn (str "NEW INIT: " timestamp))
    (swap! prices-cache assoc oid [timestamp data])
    data))

(defn fetch-prices-cache [ctx oid] ;<--
  (if-let [[my-tm my-prices] (get @prices-cache oid)]
    ;then ---------------------------
    (let [ticker (.getTicker (find-stock oid)) ;(.getTickerFor repos (cu/rs oid))
          tm (.getLastUpdateTimeStockPrices (:redis ctx) ticker)]
      (if (> tm my-tm)
        (fetch-prices-init oid)
        my-prices))
    ;else ---------------------------
    (fetch-prices-init oid)))

(defn str->optiontype [s]
  (if (= s "c")
    StockOption$OptionType/CALL
    StockOption$OptionType/PUT))

(defn json->stockoption [ctx j stock]
  (StockOption.
   (:ticker j)
   (str->optiontype (:opType j))
   (:x j)
   stock
   (:stock-option-utils ctx)))

;; (defn error-handler (reify java.util.function.Consumer
;;                       (accept [this ex]
;;                         (prn ex)
;;                         {:ok false :msg (.getMessage ex) :statusCode 0})))

(comment purchase-option_ [purchase-type ticker ask bid vol spot]
         (try
           (let [purchase (.registerOptionPurchase
                           purchase-type
                           ticker
                           ask
                           vol
                           spot
                           bid)]
             {:ok true  :msg (str "Option purchase oid: " (.getOid purchase)) :statusCode 0})
           (catch FinancialException ex
             {:ok false :msg (.getMessage ex) :statusCode 1})
           (catch Exception ex
             {:ok false :msg (.getMessage ex) :statusCode 2})))

(defn purchase-option_ [purchase-type ticker ask bid vol spot]
  (with-session-2 StockOptionMapper CritterMapper
    (if-let [o (.findStockOption it ticker)]
      (let [p (StockOptionPurchase.)]
        (doto p
          (.setOptionId (.getOid o))
          (.setLocalDx (LocalDate/now))
          (.setPrice bid)
          (.setVolume vol)
          (.setStatus 1)
          (.setPurchaseType purchase-type)
          (.setSpotAtPurchase spot)
          (.setBuyAtPurchase bid))
        (try
          (do
            (.insertPurchase it2 p)
            {:ok true  :msg (str "Option purchase oid: " (.getOid p)) :statusCode 0})
          (catch Exception ex
            {:ok false :msg (str ex) :statusCode 2})))
      {:ok false :msg (str "No suck option: " ticker) :statusCode 1})))

(defn purchase-option [j]
  (let [purchase-type (if (= (:rt j) true) 3 11)
        ticker (:ticker j)
        ask (:ask j)
        bid (:bid j)
        vol (:volume j)
        spot (:spot j)]
    (prn purchase-type ticker ask bid vol spot)
    (purchase-option_ purchase-type ticker ask bid vol spot)))

(comment demo-json
         {:expiry "2022-12-16"
          :ticker "NHY2L58"
          :volume 10
          :opType "c"
          :rt false
          :x 58
          :spot 70.98
          :ask 18
          :stockId 1
          :bid 16})

(defn register-and-purchase-option [ctx j]
  (let [soid (:stockId j)]
    (prn j)
    (if-let [stock (find-stock soid)]
      (let [so (json->stockoption ctx j stock)]
        (with-session StockOptionMapper
          (.insertStockOption it so))
        (purchase-option j))
      {:ok false :msg (str "Could not find stock with oid: " soid) :statusCode 0})))

(defn sell-option [j]
  (let [oid (:iv j)
        price (:dv j)
        volume (:sv j)]
    (try
      (if-let [sale-oid (.registerOptionSale oid price volume)]
        {:ok true :msg (str "Option ale oid: " sale-oid) :statusCode 0})
      (catch Exception ex
        {:ok false :msg (.getMessage ex) :statusCode 1}))))

(defrecord PostgresAdapter [ctx]
  ports/MaunaloaDB
  (invalidateDB [this]
    (reset! prices-cache {}))
  (invalidateDB [this oid]
    (swap! prices-cache dissoc oid))
  (stockTickers [this] (stox-m))
  (prices [this oid]
    (fetch-prices-cache ctx oid))
  (registerAndPurchaseOption [this json]
    (register-and-purchase-option ctx json))
  (activePurchasesWithCritters [this ptype]
    (.activePurchasesWithCritters ptype))
  (stockOptionPurchases [this ptype status]
    (.purchasesWithSalesAll ptype status nil))
  (purchaseOption [this json]
    (purchase-option json))
  (sellOption [this json]
    (sell-option json)))

(defrecord StockMarketAdapter []
  StockMarketRepository
  (findStock [this s]
    (find-stock (StockOptionUtil/stockTickerToOid s)))
  (findStockOption [this stockOptInfo]
    (with-session StockOptionMapper
      (if-let [result (.findStockOption it stockOptInfo)]
        (Optional/of result)
        (Optional/empty)))))



