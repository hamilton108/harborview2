(ns harborview.maunaloa.adapters.dbadapters
  (:gen-class)
  (:import
   [java.time Instant LocalDate]
   [java.util.function Consumer]
   [oahu.exceptions FinancialException]
   [oahu.financial StockOption$OptionType]
   [vega.financial.calculator BlackScholes]
   [critterrepos.beans.options
    OptionSaleBean
    StockOptionBean]
   [critterrepos.models.impl StockMarketReposImpl]
   [critterrepos.utils StockOptionUtils]
   [nordnet.downloader DefaultDownloader TickerInfo]
   [nordnet.redis NordnetRedis]
   [nordnet.html StockOptionParser2]
   [harborview.downloader DownloaderStub])
  (:require
   [harborview.commonutils :as cu]
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

(def ^:dynamic is-test true)

;(def start-date (LocalDate/of 2020 3 1))
(def start-date (LocalDate/of 2010 3 1))

;(def rx (StockMarketReposImpl.))

(def stox-cache (atom nil))

(defn stox-m [repos]
  (if (nil? @stox-cache)
    (let [stox (.getStocks repos)]
      (prn "FIRST TIME")
      (reset! stox-cache stox)
      stox)
    @stox-cache))

(def redis (NordnetRedis. "172.20.1.2" 5))

(def stock-option-utils
  (if (= is-test true)
    (StockOptionUtils. (LocalDate/of 2020 10 5))
    (StockOptionUtils.)))

(def prices-cache (atom {}))

(defn fetch-prices [repos oid] ;<--
  (let [ticker (.getTickerFor repos (cu/rs oid))]
    (prn "CACHE MISS PRICES")
    (.findStockPrices repos ticker start-date)))

(defn fetch-prices-init [repos oid]
  (let [data (fetch-prices repos oid)
        timestamp (.getEpochSecond (Instant/now))]
    (prn (str "NEW INIT: " timestamp))
    (swap! prices-cache assoc oid [timestamp data])
    data))

(defn fetch-prices-cache [repos oid] ;<--
  (if-let [[my-tm my-prices] (get @prices-cache oid)]
    ;then ---------------------------
    (let [ticker (.getTickerFor repos (cu/rs oid))
          tm (.getLastUpdateTimeStockPrices redis ticker)]
      (if (> tm my-tm)
        (fetch-prices-init repos oid)
        my-prices))
    ;else ---------------------------
    (fetch-prices-init repos oid)))

(defn str->optiontype [s]
  (if (= s "c")
    StockOption$OptionType/CALL
    StockOption$OptionType/PUT))

(defn json->stockoption [j stock]
  (StockOptionBean.
   (:ticker j)
   (str->optiontype (:opType j))
   (:x j)
   stock
   stock-option-utils))

;; (defn error-handler (reify java.util.function.Consumer
;;                       (accept [this ex]
;;                         (prn ex)
;;                         {:ok false :msg (.getMessage ex) :statusCode 0})))

(defn purchase-option_ [repos purchase-type ticker ask bid vol spot] ; <--
  (try
    (let [purchase (.registerOptionPurchase repos
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

(defn purchase-option [repos j]
  (let [purchase-type (if (= (:rt j) true) 3 11)
        ticker (:ticker j)
        ask (:ask j)
        bid (:bid j)
        vol (:volume j)
        spot (:spot j)]
    (prn purchase-type ticker ask bid vol spot)
    (purchase-option_ repos purchase-type ticker ask bid vol spot)))

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

(defn find-stock [repos oid]
  (first (filter #(= oid (.getOid %)) (stox-m repos))))

(defn register-and-purchase-option [repos j]
  (let [soid (:stockId j)]
    (prn j)
    (if-let [stock (find-stock repos soid)]
      (do
        (.insertDerivative repos (json->stockoption j stock))
        (purchase-option j))
      {:ok false :msg (str "Could not find stock with oid: " soid) :statusCode 0})))

(defn sell-option [repos j]
  (let [oid (:iv j)
        price (:dv j)
        volume (:sv j)]
    (try
      (if-let [sale-oid (.registerOptionSale repos oid price volume)]
        {:ok true :msg (str "Option ale oid: " sale-oid) :statusCode 0})
      (catch Exception ex
        {:ok false :msg (.getMessage ex) :statusCode 1}))))

(defrecord PostgresAdapter [repos]
  ports/MaunaloaDB
  (invalidateDB [this]
    (reset! prices-cache {}))
  (invalidateDB [this oid]
    (swap! prices-cache dissoc oid))
  (stockTickers [this] (stox-m repos))
  (prices [this oid]
    (fetch-prices-cache repos oid))
  (registerAndPurchaseOption [this json]
    (register-and-purchase-option repos json))
  (activePurchasesWithCritters [this ptype]
    (.activePurchasesWithCritters repos ptype))
  (stockOptionPurchases [this ptype status]
    (.purchasesWithSalesAll repos ptype status nil))
  (purchaseOption [this json]
    (purchase-option repos json))
  (sellOption [this json]
    (sell-option repos json)))