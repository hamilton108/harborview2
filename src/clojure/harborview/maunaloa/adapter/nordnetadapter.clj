(ns harborview.maunaloa.adapter.nordnetadapter
  (:gen-class)
  (:require
   [cheshire.core :as cheshire]
   [clj-http.client :as client]
   [harborview.maunaloa.config :refer [get-context]]
   [harborview.commonutils :refer [find-first not-nil?]]
   [harborview.maunaloa.ports :as ports])
  (:import
   (org.slf4j LoggerFactory)
   (harborview.dto.html StockPriceDTO RiscLineDTO)
   (critter.util StockOptionUtil)
   (oahu.dto Tuple3)
   (oahu.exceptions BinarySearchException)
   (vega.financial StockOption$OptionType)
   (vega.financial.calculator BlackScholes)))

(def logger (LoggerFactory/getLogger "harborview.maunaloa.adapter.nordnetadapter"))

;; (defn ticker-info
;;   "critter.repos.StockMarketRepository -> Int -> TickerInfo"
;;   [repos oid]
;;   (let [stock (.findStock repos oid)
;;         ticker (.getTicker stock)]
;;     (TickerInfo. ticker)))


;; (defn stock-options
;;   "Map -> Int -> [OptionDTO]"
;;   [ctx oid]
;;   (let [{:keys [repos etrade dl]} ctx
;;         tif (ticker-info repos oid)
;;         pages (.downloadDerivatives dl tif)
;;         page (first pages)
;;         sp (.stockPrice etrade oid page)
;;         opx (map #(OptionDTO. %) (.options etrade page sp))]
;;     opx))

;; (def options-cache (atom {}))


;; (defn stock-options-cache
;;   "Map -> Int -> [OptionDTO]"
;;   [ctx oid]
;;   (let [cached (get @options-cache oid)]
;;     (if (nil? cached)
;;       (let [data (stock-options ctx oid)]
;;         (swap! options-cache assoc oid data)
;;         data)
;;       cached)))


;; (defn find-option
;;   "String -> [OptionDTO] -> OptionDTO"
;;   [ticker
;;    opx]
;;   (find-first #(= (.getTicker %) ticker) opx))


;; (defn calls-or-puts
;;   "Map -> Int -> Bool -> [OptionDTO]"
;;   [ctx
;;    oid
;;    is-call]
;;   (filter #(= (.isCall %) is-call)
;;           (stock-options-cache ctx oid)))


;; (defn calls_
;;   "Map -> Int -> [OptionDTO]"
;;   [ctx oid]
;;   (calls-or-puts ctx oid true))

(def calculator (BlackScholes.))

(defn calls-json
  [ctx oid]
  (let [url (str (:nordnetservice ctx) "/calls/" oid)]
    (client/get url)))

(defn puts-json
  [ctx oid]
  (let [url (str (:nordnetservice ctx) "/puts/" oid)]
    (client/get url)))

(defn options
  [ctx oid]
  (let [url (str (:nordnetservice ctx) "/stockoptions/" oid)]
    (cheshire/parse-string (:body (client/get url)) true)))

  ;(calls-or-puts ctx oid false))


;; (defn stockprice_
;;   "Map -> Int -> StockPriceDTO"
;;   [ctx oid]
;;   (let [data (stock-options-cache ctx oid)]
;;     (if (> (.size data) 0)
;;       (StockPriceDTO. (.getStockPrice (first data)))
;;       nil)))


;; (defn get-riscs
;;   "Int -> [Map String StockOptionRisc]"
;;   [stock-oid]
;;   (if-let [riscs-ticker (get @risc-repos stock-oid)]
;;     riscs-ticker
;;     (clojure.lang.PersistentHashMap/EMPTY)))

;; (defn get-risc
;;   "String -> Map"
;;   [option-ticker]
;;   (let [^Tuple3 info (StockOptionUtil/stockOptionInfoFromTicker option-ticker)
;;         oid (.first info)]
;;     ((get-riscs oid) option-ticker)))

;; (defn update-risc
;;   "Map -> ()"
;;   [risc-obj]
;;   (let [opt-tik (:ticker risc-obj)
;;         ^Tuple3 info (StockOptionUtil/stockOptionInfoFromTicker opt-tik)
;;         oid (.first info)]
;;     (reset! risc-repos
;;             (update @risc-repos oid (fn [s] (assoc-in s [opt-tik] risc-obj))))))

;StockOptionRisc -> String
;; (defn make-risc-json [risc-ticker risc]
;;   {:ticker risc-ticker :stockprice (.getStockPrice risc) :status 1})

(defn find-option
  "String -> [Map] -> Map"
  [ticker
   items]
  (let [opx (:opx items)]
    (find-first #(= (:ticker %) ticker) opx)))

(def risc-repos
  (atom {}))

(defn get-risc
  [option-ticker])

; double stockPrice = blackScholes.stockPriceFor2(CALL, 12.0, 100.0, 200, 0.2, 110);
; {:brEven 0.0, :expiry "2023-01-20", 
;:ticker "YAR3A528.02X", 
;:days 117, :ivSell 0.1375, 
;:sell 0.6, :buy 0.0, :ivBuy 0.05, :ot 1, :x 528.02} 
(defn risc-option-price [risc-adjusted-price option start-val]
  (try
    (let [ot (if (= (:ot option) 1)
               StockOption$OptionType/CALL
               StockOption$OptionType/PUT)
          adjusted-stock-price (.stockPriceFor2 calculator
                                                ot
                                                risc-adjusted-price
                                                (:x option)
                                                (:days option)
                                                (:ivBuy option)
                                                start-val)]
      adjusted-stock-price)
    (catch BinarySearchException ex
      (.warn logger (str ex))
      nil)))

(def risc-line-repos
  (atom {}))

;; type RiscLineJson = 
;;     { ticker :: String
;;     , be :: Number
;;     , riscStockPrice :: Number
;;     , riscOptionPrice :: Number
;;     , bid :: Number
;;     , ask :: Number
;;     , risc :: Number
;;     }

(defn add-risc-line-repos [oid rline]
  (let [v (@risc-line-repos oid)
        old-vec (if (nil? v) [] v)
        new-vec (conj old-vec rline)]
    (swap! risc-line-repos assoc oid new-vec)))

(defn calc-risc-stockprice
  [oid
   opx
   risc-json]
  (let [risc-value (:risc risc-json)
        risc-ticker (:ticker risc-json)
        cached (get-risc risc-ticker)]
    (if (not-nil? cached)
      cached
      ;; (let [^Tuple3 info (StockOptionUtil/stockOptionInfoFromTicker risc-ticker)
      ;;       oid (.first info)
      ;;       opx (if (= StockOption$OptionType/CALL (.third info))
      ;;             (calls-json ctx oid)
      ;;             (puts-json ctx oid))]
      (if-let [o (find-option risc-ticker opx)]
          ;then
        (let
         [risc-adjusted-price (- (:sell o) risc-value)]
          (if (and (> (:ivBuy o) 0.0) (> risc-adjusted-price 0.0))
            (let [start-val (get-in opx [:stock-price :c])
                  x (risc-option-price risc-adjusted-price o start-val)]
              (if (nil? x)
                {:ticker risc-ticker :stockprice -1.0 :status 2}
                (let [rline
                      {:ticker risc-ticker
                       :be 0.0
                       :riscStockPrice x
                       :riscOptionPrice risc-adjusted-price
                       :bid (:sell o)
                       :ask (:buy o)
                       :risc risc-value}]
                  (add-risc-line-repos oid rline)
                  {:ticker risc-ticker :stockprice x :status 1})))
            {:ticker risc-ticker :stockprice -1.0 :status 3}))
          ;else
        {:ticker risc-ticker :stockprice -1.0 :status 4}))))


  ;; (let [opx (stock-options-cache ctx oid)
  ;;       risc-ticker (:ticker risc-json)
  ;;       risc-value (:risc risc-json)
  ;;       cached (get-risc risc-ticker)]
  ;;   (if (not-nil? cached)
  ;;     (make-risc-json risc-ticker cached)
  ;;     (if-let [^OptionDTO o (find-option risc-ticker opx)] ;[o (cu/find-first #(= (.getTicker %) risc-ticker) opx)]
  ;;     ;then
  ;;       (let [^StockOptionPrice sp (.getStockOptionPrice o)
  ;;             cur-option-price (- (.getSell o) risc-value)
  ;;             ^StockOptionRisc risc (.riscOptionPrice sp cur-option-price)] ;adjusted-stockprice (.stockPriceFor sp cur-option-price)]
  ;;         (if (= (.isPresent risc) true)
  ;;           (let [risc1 (.get risc)]
  ;;             (update-risc risc1)
  ;;             (make-risc-json risc-ticker risc1))
  ;;           {:ticker risc-ticker :stockprice -1.0 :status 2}))
  ;;     ;else
  ;;       {:ticker risc-ticker :stockprice -1.0 :status 3}))))

;; (defn find-option-from-ticker
;;   "String -> OptionDTO"
;;   [ctx ticker]
;;   (if-let [^Tuple3 info (StockOptionUtil/stockOptionInfoFromTicker ticker)]
;;     (let [is-calls (= (.third info) StockOption$OptionType/CALL)
;;           opx (calls-or-puts ctx (.first info) is-calls)]
;;       (find-option ticker opx))
;;     nil))

;; (comment risc-lines [ctx oid]
;;          (let [opx (stock-options-cache ctx oid)
;;                calculated (map #(.getStockOptionPrice %) (filter #(= (.isCalculated %) true) opx))]
;;            (map #(RiscLineDTO. %) calculated)))


(defn risc-lines [oid]
  (@risc-line-repos oid))
  ;; (let [riscs-oid (get-riscs oid)]
  ;;   (if (= (.size riscs-oid) 0)
  ;;     clojure.lang.PersistentVector/EMPTY
  ;;     (map #(RiscLineDTO. (.getValue %)) riscs-oid))))

(defn invalidate-riscs []
  (reset! risc-line-repos {}))

(defrecord NordnetEtradeAdapter [ctx]
  ports/Etrade
  (calls [_ oid]
    (calls-json ctx oid))
  (puts [_ oid]
    (puts-json ctx oid))
  (stockPrice [_ oid]
    (:stock-price (calls-json ctx oid)))
  (stockOptionPrice [_ s])
  (calcRiscStockprices [_ riscs]
    (if-let [risc-1 (first riscs)]
      (let [^Tuple3 info (StockOptionUtil/stockOptionInfoFromTicker (:ticker risc-1))
            oid (.first info)
            opx (options ctx oid)]
        (map (partial calc-risc-stockprice oid opx) riscs))
      []))
  (calcRiscOptionPrice [_ s price])
  (invalidateRiscs [_]
    (invalidate-riscs))
  (riscLines [_ oid]
    (risc-lines oid)))

(def t "YAR3A528.02X")

(def risc {:risc 0.1 :ticker t})

(def demo (NordnetEtradeAdapter. (get-context :demo)))



  ;; (invalidateRiscs
  ;;   [this]
  ;;   (reset! risc-repos {}))
  ;; (invalidate
  ;;   [this]
  ;;   (reset! options-cache {}))
  ;; (invalidate
  ;;   "Int -> ()"
  ;;   [this oid]
  ;;   (swap! options-cache dissoc oid))
  ;; (calls
  ;;   "Int -> [OptionDTO]"
  ;;   [this oid]
  ;;   (let [opx (calls_ ctx oid)
  ;;         s (stockprice_ ctx oid)]
  ;;     (StockPriceAndOptions. s opx)))
  ;; (puts
  ;;   "Int -> [OptionDTO]"
  ;;   [this oid]
  ;;   (let [opx (puts_ ctx oid)
  ;;         s (stockprice_ ctx oid)]
  ;;     (StockPriceAndOptions. s opx)))
  ;; (stockPrice
  ;;   "Int -> StockPriceDTO"
  ;;   [this oid]
  ;;   (stockprice_ ctx oid))
  ;; (stockOptionPrice
  ;;   "String (stock option ticker) -> StockOptionPrice"
  ;;   [this ticker]
  ;;   (if-let [^OptionDTO o (find-option-from-ticker ctx ticker)]
  ;;     (.getStockOptionPrice o)
  ;;     nil))
  ;; (calcRiscStockprices
  ;;   "Int -> {:ticker :risc} -> {:ticker :stockprice :status}"
  ;;   [this oid riscs]
  ;;   (map (partial calc-risc-stockprice ctx oid) riscs))
  ;; (calcRiscOptionPrice
  ;;   "String (stock option ticker) -> Double"
  ;;   [this ticker stockPrice]
  ;;   (if-let [^OptionDTO o (find-option-from-ticker ctx ticker)]
  ;;     (.optionPriceFor (.getStockOptionPrice o) stockPrice)
  ;;     nil))
  ;; (riscLines
  ;;   "Int -> [RiscLineDTO]"
  ;;   [this oid]
  ;;   (risc-lines oid)))
