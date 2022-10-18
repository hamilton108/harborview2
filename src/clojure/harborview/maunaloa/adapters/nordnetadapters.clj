(ns harborview.maunaloa.adapters.nordnetadapters
  (:gen-class)
  (:import
   (java.util Map Collection)
   (java.util ArrayList)
   (harborview.dto.html StockPriceDTO RiscLineDTO)
   (harborview.dto.html.options StockPriceAndOptions OptionDTO)
   (critter.util StockOptionUtil)
   (critter.stockoption StockOptionPrice StockOptionRisc)
   (nordnet.downloader TickerInfo)
   (oahu.dto Tuple3)
   (vega.financial StockOption$OptionType))
  (:require
   [harborview.commonutils :refer [find-first not-nil?]]
   [harborview.maunaloa.ports :as ports]))

;critter.repos.StockMarketRepository -> Int -> TickerInfo
(defn ticker-info
  [repos oid]
  (let [stock (.findStock repos oid)
        ticker (.getTicker stock)]
    (TickerInfo. ticker)))

;Map -> Int -> [OptionDTO]
(defn stock-options
  [ctx oid]
  (let [{:keys [repos etrade dl redis]} ctx
        tif (ticker-info repos oid)
        pages (.downloadDerivatives dl tif)
        page (first pages)
        sp (.stockPrice etrade oid page)
        opx (map #(OptionDTO. %) (.options etrade page sp))]
    opx))
    ;(StockPriceAndOptions. (StockPriceDTO. sp) opx)))

(def options-cache (atom {}))

;Map -> Int -> [OptionDTO]
(defn stock-options-cache
  [ctx oid]
  (let [cached (get @options-cache oid)]
    (if (nil? cached)
      (let [data (stock-options ctx oid)]
        (swap! options-cache assoc oid data)
        data)
      cached)))

;String -> [OptionDTO] -> OptionDTO
(defn find-option
  [ticker
   opx]
  (find-first #(= (.getTicker %) ticker) opx))

;Map -> Int -> Bool -> [OptionDTO]
(defn calls-or-puts
  [ctx
   oid
   is-call]
  (filter #(= (.isCall %) is-call)
          (stock-options-cache ctx oid)))


;Map -> Int -> [OptionDTO]
(defn calls_
  [ctx oid]
  (calls-or-puts ctx oid true))

;; (comment demo [x:TickerInfo y:int]
;;          (if-not (instance? TickerInfo x)
;;            (throw (Exception. "nope"))))

;Map -> Int -> [OptionDTO]
(defn puts_
  [ctx oid]
  (calls-or-puts ctx oid false))

;Map -> Int -> StockPriceDTO
(defn stockprice_
  [ctx oid]
  (let [data (stock-options-cache ctx oid)]
    (if (> (.size data) 0)
      (StockPriceDTO. (.getStockPrice (first data))))))

;{Int : {String : [StockOptionRisc]}}
(def risc-repos
  (atom {}))

;Int -> [Map String StockOptionRisc]
(defn get-riscs [stock-oid]
  (if-let [riscs-ticker (get @risc-repos stock-oid)]
    riscs-ticker
    (clojure.lang.PersistentHashMap/EMPTY)))

;String -> StockOptionRisc
(defn get-risc [option-ticker]
  (let [^Tuple3 info (StockOptionUtil/stockOptionInfoFromTicker option-ticker)
        oid (.first info)]
    ((get-riscs oid) option-ticker)))

;StockOptionRisc -> ()
(defn update-risc
  [^StockOptionRisc risc-obj]
  (let [opt-tik (.getOptionTicker risc-obj)
        ^Tuple3 info (StockOptionUtil/stockOptionInfoFromTicker opt-tik)
        oid (.first info)]
    (reset! risc-repos
            (update @risc-repos oid (fn [s] (assoc-in s [opt-tik] risc-obj))))))

;StockOptionRisc -> String
(defn make-risc-json [risc-ticker risc]
  {:ticker risc-ticker :stockprice (.getStockPrice risc) :status 1})

;Map -> Int -> Map -> Map
(defn calc-risc-stockprice
  [ctx
   oid
   risc-json]
  (let [opx (stock-options-cache ctx oid)
        risc-ticker (:ticker risc-json)
        risc-value (:risc risc-json)
        cached (get-risc risc-ticker)]
    (if (not-nil? cached)
      (make-risc-json risc-ticker cached)
      (if-let [^OptionDTO o (find-option risc-ticker opx)] ;[o (cu/find-first #(= (.getTicker %) risc-ticker) opx)]
      ;then
        (let [^StockOptionPrice sp (.getStockOptionPrice o)
              cur-option-price (- (.getSell o) risc-value)
              ^StockOptionRisc risc (.riscOptionPrice sp cur-option-price)] ;adjusted-stockprice (.stockPriceFor sp cur-option-price)]
          ;; (comment
          ;;   (prn "option ticker " (.getTicker o))
          ;;   (prn "cur-option-price " cur-option-price)
          ;;   (prn "x " (.getX o))
          ;;   (prn "iv buy" (.getIvBuy o))
          ;;   (prn "iv sell" (.getIvSell o))
          ;;   (prn "buy " (.getBuy o))
          ;;   (prn "sell " (.getSell o))
          ;;   (prn "days" (.getDays o))
          ;;   (prn "adjusted-stockprice " adjusted-stockprice)
          ;;   (prn "---------------------------------------"))
          (if (= (.isPresent risc) true)
            (let [risc1 (.get risc)]
              (update-risc risc1)
              (make-risc-json risc-ticker risc1))
            {:ticker risc-ticker :stockprice -1.0 :status 2}))
      ;else
        {:ticker risc-ticker :stockprice -1.0 :status 3}))))

;String -> OptionDTO
(defn find-option-from-ticker [ctx ticker]
  (if-let [^Tuple3 info (StockOptionUtil/stockOptionInfoFromTicker ticker)]
    (let [is-calls (= (.third info) StockOption$OptionType/CALL)
          opx (calls-or-puts ctx (.first info) is-calls)]
      (find-option ticker opx))))

;; (comment risc-lines [ctx oid]
;;          (let [opx (stock-options-cache ctx oid)
;;                calculated (map #(.getStockOptionPrice %) (filter #(= (.isCalculated %) true) opx))]
;;            (map #(RiscLineDTO. %) calculated)))

(defn risc-lines [oid]
  (let [riscs-oid (get-riscs oid)]
    (if (= (.size riscs-oid) 0)
      clojure.lang.PersistentVector/EMPTY
      (map #(RiscLineDTO. (.getValue %)) riscs-oid))))

(comment (risc-lines 3))

(defrecord NordnetEtradeAdapter [ctx]
  ports/Etrade
  (invalidateRiscs
    [this]
    (reset! risc-repos {}))
  (invalidate
    [this]
    (reset! options-cache {}))
  (invalidate
    ;Int -> ()
    [this oid]
    (swap! options-cache dissoc oid))
  (calls
    ;Int -> [OptionDTO]
    [this oid]
    (let [opx (calls_ ctx oid)
          s (stockprice_ ctx oid)]
      (StockPriceAndOptions. s opx)))
  (puts
    ;Int -> [OptionDTO]
    [this oid]
    (let [opx (puts_ ctx oid)
          s (stockprice_ ctx oid)]
      (StockPriceAndOptions. s opx)))
  (stockPrice
    ;Int -> StockPriceDTO
    [this oid]
    (stockprice_ ctx oid))
  (stockOptionPrice
    ;String (stock option ticker) -> StockOptionPrice
    [this ticker]
    (if-let [^OptionDTO o (find-option-from-ticker ctx ticker)]
      (.getStockOptionPrice o)))
  (calcRiscStockprices
    ;Int -> {:ticker :risc} -> {:ticker :stockprice :status}
    [this oid riscs]
    (map (partial calc-risc-stockprice ctx oid) riscs))
  (calcRiscOptionPrice
    ;String (stock option ticker) -> Double
    [this ticker stockPrice]
    (if-let [^OptionDTO o (find-option-from-ticker ctx ticker)]
      (.optionPriceFor (.getStockOptionPrice o) stockPrice)))
  (riscLines
    ;Int -> [RiscLineDTO]
    [this oid]
    (risc-lines oid)))
