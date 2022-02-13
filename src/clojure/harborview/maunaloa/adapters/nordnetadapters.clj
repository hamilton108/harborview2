(ns harborview.maunaloa.adapters.nordnetadapters
  (:gen-class)
  (:import
   [java.util.function Consumer]
   [java.time LocalDate]
   [oahu.financial StockOption$OptionType]
   [vega.financial.calculator BlackScholes]
   [critterrepos.models.impl StockMarketReposImpl]
   [critterrepos.utils StockOptionUtils]
   [nordnet.downloader DefaultDownloader TickerInfo]
   [nordnet.redis NordnetRedis]
   [nordnet.html StockOptionParser2]
   [harborview.dto.html.options StockPriceAndOptions OptionDTO]
   [harborview.dto.html StockPriceDTO RiscLineDTO]
   [harborview.factory StockMarketFactory]
   [harborview.downloader DownloaderStub])
  (:require
   [harborview.commonutils :as cu]
   [harborview.maunaloa.ports :as ports]))

(def ^:dynamic is-test true)

(def redis (NordnetRedis. "172.20.1.2" 5))

(def stock-option-utils
  (if (= is-test true)
    (StockOptionUtils. (LocalDate/of 2020 10 5))
    (StockOptionUtils.)))

;; (defn etrade []
;;   (let [stockmarket (StockMarketReposImpl.)
;;         calc (BlackScholes.)]
;;     (StockOptionParser2. calc redis stockmarket stock-option-utils)))

;; (def my-etrade (etrade))

(defn etrade [repos]
  (let [calc (BlackScholes.)]
    (StockOptionParser2. calc redis repos stock-option-utils)))

(def dl-stub-path "/home/rcs/opt/java/harborview2/feed/demo")

(defn downloader [^Consumer page-consumer]
  (let [dl (if (= is-test true)
             (DownloaderStub. dl-stub-path)
             (DefaultDownloader. "172.20.1.2" 6379 0))]
    (.setOnPageDownloaded dl page-consumer)
    (println (str "DOWNLOADER: " dl))
    dl))

(def my-dl (downloader nil))

(defn ticker-info [repos oid]
  (let [ticker (.getTickerFor repos (cu/rs oid))]
    (TickerInfo. ticker)))

(defn fetch-options [repos oid]
  (let [tif (ticker-info repos oid)
        pages (.downloadDerivatives my-dl tif)
        page (first pages)
        sp (.stockPrice (etrade repos) tif page)]
    (prn "CACHE MISS OPTIONS")
    (map #(OptionDTO. %) (.options (etrade repos) page (.get sp)))))

(defn fetch-options-demo [repos oid]
  (let [factory (StockMarketFactory. (StockOptionUtils.))
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
  (cu/find-first #(= (.getTicker %) ticker) opx))

(defn find-option-from-ticker [ticker]
  (if-let [info (.stockOptionInfoFromTicker stock-option-utils ticker)]
    (let [is-calls (= (.second info) StockOption$OptionType/CALL)
          opx (calls-or-puts (.first info) is-calls)]
      (find-option ticker opx))))

(defn calcRiscStockPrice [repos oid risc-json]
  (let [opx (fetch-options-cache repos oid)
        risc-ticker (risc-json "ticker")
        risc-value (risc-json "risc")]
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
    (map #(RiscLineDTO. %) calculated)))

(defrecord NordnetEtradeAdapter [repos]
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

(defrecord DemoEtradeAdapter [repos]
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