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
   (critter.util StockOptionUtil)
   (oahu.dto Tuple3)
   (oahu.exceptions BinarySearchException)
   (vega.financial StockOption$OptionType)
   (vega.financial.calculator BlackScholes)))

(def logger (LoggerFactory/getLogger "harborview.maunaloa.adapter.nordnetadapter"))

(def calculator (BlackScholes.))

(defn calls-json
  [ctx oid]
  (let [url (str (:nordnetservice ctx) "/calls/" oid)]
    (client/get url)))

(defn puts-json
  [ctx oid]
  (let [url (str (:nordnetservice ctx) "/puts/" oid)]
    (client/get url)))

(defn find-option-json [ctx ticker]
  (let [url (str (:nordnetservice ctx) "/option/" ticker)]
    (cheshire/parse-string (:body (client/get url)) true)))

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

(defn risc-option-price [risc-adjusted-price option start-val]
  (try
    (let [ot (if (= (:ot option) 1)
               StockOption$OptionType/CALL
               StockOption$OptionType/PUT)]
      (.stockPriceFor2 calculator
                       ot
                       risc-adjusted-price
                       (:x option)
                       (:days option)
                       (:ivBuy option)
                       start-val))
    (catch BinarySearchException ex
      (.warn logger (str ex))
      nil)))

(defn break-even [option start-val]
  (try
    (let [ot (if (= (:ot option) 1)
               StockOption$OptionType/CALL
               StockOption$OptionType/PUT)]
      (.stockPriceFor2 calculator
                       ot
                       (:sell option)
                       (:x option)
                       (:days option)
                       (:ivBuy option)
                       start-val))
    (catch BinarySearchException ex
      (.warn logger (str ex))
      nil)))

(def risc-line-repos
  (atom {}))

(defn add-risc-line-repos [oid rline]
  (let [v (@risc-line-repos oid)
        old-vec (if (nil? v) [] v)
        new-vec (conj old-vec rline)]
    (swap! risc-line-repos assoc oid new-vec)))


;{:stock-price stock-price :option calc-op}

(defn calc-risc-stockprice
  [oid
   find-fn
   risc-json]
  (let [risc-value (:risc risc-json)
        risc-ticker (:ticker risc-json)
        cached (get-risc risc-ticker)]
    (if (not-nil? cached)
      cached
      (if-let [o (find-fn risc-ticker)]
          ;then
        (let
         [ox (:option o)
          risc-adjusted-price (- (:sell ox) risc-value)]
          (if (and (> (:ivBuy ox) 0.0) (> risc-adjusted-price 0.0))
            (let [start-val (get-in o [:stock-price :c])
                  x (risc-option-price risc-adjusted-price ox start-val)
                  be (break-even ox start-val)]
              (if (nil? x)
                {:ticker risc-ticker :stockprice -1.0 :status 2}
                (if (nil? be)
                  {:ticker risc-ticker :stockprice -1.0 :status 5}
                  (let [rline
                        {:ticker risc-ticker
                         :be be
                         :riscStockPrice x
                         :riscOptionPrice risc-adjusted-price
                         :bid (:buy ox)
                         :ask (:sell ox)
                         :risc risc-value}]
                    (add-risc-line-repos oid rline)
                    {:ticker risc-ticker :stockprice x :status 1}))))
            {:ticker risc-ticker :stockprice -1.0 :status 3}))
          ;else
        {:ticker risc-ticker :stockprice -1.0 :status 4}))))

(defn risc-lines [oid]
  (@risc-line-repos oid))

(defn invalidate-riscs []
  (reset! risc-line-repos {}))

(defn calc-option-price [o price]
  ;(if-let [o (find-option-json ctx option-ticker)]
  (let [strike (:x o)
        sigma (:ivBuy o)
        days (:days o)]
    (if (= (:ot o) 1)
      (.callPrice2 calculator price strike days sigma)
      (.putPrice2 calculator price strike days sigma))))

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
            oid (.first info)]
        (map (partial calc-risc-stockprice oid (partial find-option-json ctx)) riscs))
      []))
  (calcRiscOptionPrice [_ option-ticker price]
    (if-let [o (find-option-json ctx option-ticker)]
      (calc-option-price (:option o) price)
      nil))
  (invalidateRiscs [_]
    (invalidate-riscs))
  (riscLines [_ oid]
    (risc-lines oid)))

(def t "YAR3A528.02X")

(def risc {:risc 0.1 :ticker t})

(def demo (NordnetEtradeAdapter. (get-context :demo)))

(def riscs [risc])

(def map-fn (partial calc-risc-stockprice 3 (partial find-option-json (get-context :demo))))

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
