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

(defn ticker-info
  [repos oid]
  "critter.repos.StockMarketRepository -> Int -> TickerInfo"
  (let [stock (.findStock repos oid)
        ticker (.getTicker stock)]
    (TickerInfo. ticker)))

(defn stock-options
  [ctx oid]
  "Map -> Int -> [OptionDTO]"
  (let [{:keys [repos etrade dl redis]} ctx
        tif (ticker-info repos oid)
        pages (.downloadDerivatives dl tif)
        page (first pages)
        sp (.stockPrice etrade tif page)]
    (map #(OptionDTO. %) (.options etrade page sp))))

(def options-cache (atom {}))

(defn stock-options-cache
  [ctx oid]
  "Map -> Int -> [OptionDTO]"
  (let [cached (get @options-cache oid)]
    (if (nil? cached)
      (let [data (stock-options ctx oid)]
        (swap! options-cache assoc oid data)
        data)
      cached)))

(defn find-option
  [ticker
   opx]
  "String -> [OptionDTO] -> OptionDTO"
  (find-first #(= (.getTicker %) ticker) opx))

(defn calls-or-puts
  [ctx
   oid
   is-call]
  "Map -> Int -> Bool -> [OptionDTO]"
  (filter #(= (.isCall %) is-call)
          (stock-options-cache ctx oid)))

(defn calls_
  [ctx oid]
  "Map -> Int -> [OptionDTO]"
  (calls-or-puts ctx oid true))

(comment demo [x:TickerInfo y:int]
         (if-not (instance? TickerInfo x)
           (throw (Exception. "nope"))))

(defn puts_
  [ctx oid]
  "Map -> Int -> [OptionDTO]"
  (calls-or-puts ctx oid false))

(defn stockprice_
  [ctx oid]
  "Map -> Int -> StockPriceDTO"
  (let [data (stock-options-cache ctx oid)]
    (if (> (.size data) 0)
      (StockPriceDTO. (.getStockPrice (first data))))))

(def risc-repos
  "{Int : {String : [StockOptionRisc]}}"
  (atom {}))

(defn get-riscs [stock-oid]
  "Int -> [Map String StockOptionRisc]"
  (if-let [riscs-ticker (get @risc-repos stock-oid)]
    riscs-ticker
    (clojure.lang.PersistentHashMap/EMPTY)))

(defn get-risc [option-ticker]
  "String -> StockOptionRisc"
  (let [^Tuple3 info (StockOptionUtil/stockOptionInfoFromTicker option-ticker)
        oid (.first info)]
    ((get-riscs oid) option-ticker)))

(defn update-risc
  "StockOptionRisc -> ()"
  [^StockOptionRisc risc-obj]
  (let [opt-tik (.getOptionTicker risc-obj)
        ^Tuple3 info (StockOptionUtil/stockOptionInfoFromTicker opt-tik)
        oid (.first info)]
    (reset! risc-repos
            (update @risc-repos oid (fn [s] (assoc-in s [opt-tik] risc-obj))))))

(defn make-risc-json [risc-ticker risc]
  "StockOptionRisc -> String"
  {:ticker risc-ticker :stockprice (.getStockPrice risc) :status 1})

(defn calc-risc-stockprice
  [ctx
   oid
   risc-json]
  "Map -> Int -> Map -> Map"
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
          (comment
            (prn "option ticker " (.getTicker o))
            (prn "cur-option-price " cur-option-price)
            (prn "x " (.getX o))
            (prn "iv buy" (.getIvBuy o))
            (prn "iv sell" (.getIvSell o))
            (prn "buy " (.getBuy o))
            (prn "sell " (.getSell o))
            (prn "days" (.getDays o))
            (prn "adjusted-stockprice " adjusted-stockprice)
            (prn "---------------------------------------"))
          (if (= (.isPresent risc) true)
            (let [risc1 (.get risc)]
              (update-risc risc1)
              (make-risc-json risc-ticker risc1))
            {:ticker risc-ticker :stockprice -1.0 :status 2}))
      ;else
        {:ticker risc-ticker :stockprice -1.0 :status 3}))))

(defn find-option-from-ticker [ctx ticker]
  "String -> OptionDTO"
  (if-let [^Tuple3 info (StockOptionUtil/stockOptionInfoFromTicker ticker)]
    (let [is-calls (= (.third info) StockOption$OptionType/CALL)
          opx (calls-or-puts ctx (.first info) is-calls)]
      (find-option ticker opx))))

(comment risc-lines [ctx oid]
         (let [opx (stock-options-cache ctx oid)
               calculated (map #(.getStockOptionPrice %) (filter #(= (.isCalculated %) true) opx))]
           (map #(RiscLineDTO. %) calculated)))

(defn make-risc-line [])

(defn risc-lines [oid]
  (let [riscs-oid (get-riscs oid)]
    (if (= (.size riscs-oid) 0)
      clojure.lang.PersistentVector/EMPTY
      (map #(RiscLineDTO. (.getValue %)) riscs-oid))))

(defrecord NordnetEtradeAdapter [ctx]
  ports/Etrade
  (invalidateRiscs
    [this]
    (reset! risc-repos {}))
  (invalidate
    [this]
    (reset! options-cache {}))
  (invalidate
    ;String -> ()
    [this s]
    (let [oid (StockOptionUtil/stockTickerToOid s)]
      (swap! options-cache dissoc oid)))
  (calls
    ;String -> [OptionDTO]
    [this s]
    (let [oid (StockOptionUtil/stockTickerToOid s)]
      (calls_ ctx oid)))
  (puts
    ;String -> [OptionDTO]
    [this s]
    (let [oid (StockOptionUtil/stockTickerToOid s)]
      (puts_ ctx oid)))
  (stockPrice
    ;String -> StockPriceDTO
    [this s]
    (let [oid (StockOptionUtil/stockTickerToOid s)]
      (stockprice_ ctx oid)))
  (stockOptionPrice
    ;String -> StockOptionPrice
    [this ticker]
    (if-let [^OptionDTO o (find-option-from-ticker ctx ticker)]
      (.getStockOptionPrice o)))
  (calcRiscStockprices
    ;String -> {:ticker :risc} -> {:ticker :stockprice :status}
    [this ticker riscs]
    (let [oid (StockOptionUtil/stockTickerToOid ticker)]
      (map (partial calc-risc-stockprice ctx oid) riscs)))
  (calcRiscOptionPrice
    ;String -> Double
    [this ticker stockPrice]
    (if-let [^OptionDTO o (find-option-from-ticker ticker)]
      (.optionPriceFor (.getStockOptionPrice o) stockPrice)))
  (riscLines
    ;String -> [RiscLineDTO]
    [this s]
    (let [oid (StockOptionUtil/stockTickerToOid s)]
      (risc-lines oid))))

(comment

  (def ^:dynamic is-test true)

  (def redis (NordnetRedis. "172.20.1.2" 5))

  (def stock-option-utils
    (if (= is-test true)
      (StockOptionUtil. (LocalDate/of 2020 10 5))
      (StockOptionUtil.)))

  (def etrade
    (memoize
     (fn [repos]
       (let [calc (BlackScholes.)]
         (prn calc ", " redis ", " repos ", " stock-option-utils)
         (StockOptionParser3. calc redis repos stock-option-utils)))))

  (defn ex [repos]
    (let [calc (BlackScholes.)]

      (prn calc ", " redis ", " repos ", " stock-option-utils)
      (StockOptionParser3. calc redis repos stock-option-utils)))

  (comment dl-stub-path "/home/rcs/opt/java/harborview2/feed/demo")

  (def dl-stub-path "/home/rcs/opt/java/nordnet-repos/src/integrationTest/resources/html/derivatives")

  (defn downloader [^Consumer page-consumer]
    (let [dl (if (= is-test true)
               (DownloaderStub. dl-stub-path)
               (DefaultDownloader. "172.20.1.2" 6379 0))]
      (.setOnPageDownloaded dl page-consumer)
      (println (str "DOWNLOADER: " dl))
      dl))

  (def my-dl (downloader nil))

  (defn ticker-info [repos oid]
    (let [stock (.findStock repos (cu/rs oid))
          ticker (.getTicker stock)]
      (TickerInfo. ticker)))

  (defn fetch-options [repos oid]
    (let [tif (ticker-info repos oid)
          pages (.downloadDerivatives my-dl tif)
          page (first pages)
          sp (.stockPrice (etrade repos) tif page)]
      (prn "CACHE MISS OPTIONS")
      (map #(OptionDTO. %) (.options (etrade repos) page (.get sp)))))

  (defn fetch-options-demo [repos oid]
    (let [factory (StockMarketFactory. (StockOptionUtil.))
          opx (.nhy factory)]
      [(OptionDTO. opx)]))

  (def ^:dynamic *fetch-options* fetch-options)

  (def options-cache (atom {}))

  (defn fetch-options-cache [repos oid]
    (let [cached (get @options-cache oid)]
      (if (nil? cached)
        (let [data (*fetch-options* repos oid)]
          (swap! options-cache assoc oid data)
          data)
        cached)))

  (defn calls-or-puts [repos oid is-call]
    (filter #(= (.isCall %) is-call)
            (fetch-options-cache repos oid)))

  (defn stock-and-options [this repos oid is-call]
    (let [opx (calls-or-puts repos oid is-call)
          s (.stockPrice this oid)]
      (StockPriceAndOptions. (StockPriceDTO. s) opx)))

  (defn find-option [ticker opx]
    (find-first #(= (.getTicker %) ticker) opx))

  (defn find-option-from-ticker [ticker]
    (if-let [info (.stockOptionInfoFromTicker stock-option-utils ticker)]
      (let [is-calls (= (.second info) StockOption$OptionType/CALL)
            opx (calls-or-puts (.first info) is-calls)]
        (find-option ticker opx))))

  (defn calcRiscStockPrice [repos oid risc-json]
    (let [opx (fetch-options-cache repos oid)
          risc-ticker (:ticker risc-json)
          risc-value (:risc risc-json)]
      (if-let [o (find-option risc-ticker opx)] ;[o (cu/find-first #(= (.getTicker %) risc-ticker) opx)]
      ;then
        (let [sp (.getStockOptionPrice o)
              cur-option-price (- (.getSell o) risc-value)
              adjusted-stockprice (.stockPriceFor sp cur-option-price)]
          (if (= (.isPresent adjusted-stockprice) true)
            {:ticker risc-ticker :stockprice (.get adjusted-stockprice) :status 1}
            {:ticker risc-ticker :stockprice -1.0 :status 2}))
      ;else
        {:ticker risc-ticker :stockprice -1.0 :status 3})))

        ;{:ticker (risc "ticker") :risc (.stockPriceFor sp cur-option-price)}))))


  (defn risc-lines [repos oid]
    (let [opx (fetch-options-cache repos oid)
          calculated (map #(.getStockOptionPrice %) (filter #(= (.isCalculated %) true) opx))]
      (map #(RiscLineDTO. %) calculated))))

(comment NordnetEtradeAdapter [repos]
         ports/Etrade
    ;(calcStockPrices [this oid riscs])
         (invalidateEtrade [this]
                           (reset! options-cache {}))
         (invalidateEtrade [this oid]
                           (swap! options-cache dissoc oid))
         (calls [this oid]
                (stock-and-options this repos oid true))
         (puts [this oid]
               (stock-and-options this repos oid false))
         (stockPrice [this oid]
                     (let [data (fetch-options-cache repos oid)]
                       (if (> (.size data) 0)
                         (.getStockPrice (first data)))))
         (calcRiscStockprices [this oid riscs]
                              (map (partial calcRiscStockPrice oid) riscs))
         (calcRiscOptionPrice [this ticker stockPrice]
                              (if-let [o (find-option-from-ticker ticker)]
                                (.optionPriceFor (.getStockOptionPrice o) stockPrice)))
         (riscLines [this oid]
                    (risc-lines repos oid)))

(comment DemoEtradeAdapter [repos]
         ports/Etrade
         (invalidateEtrade [this])
         (invalidateEtrade [this oid])
         (calls [this oid]
                (binding [*fetch-options* fetch-options-demo]
                  (stock-and-options this repos oid true)))
         (puts [this oid])
         (stockPrice [this oid]
                     (let [data (fetch-options-cache repos oid)]
                       (if (> (.size data) 0)
                         (.getStockPrice (first data)))))
         (calcRiscStockprices [this oid riscs])
         (calcRiscOptionPrice [this ticker stockPrice])
         (riscLines [this oid]))