(ns harborview.maunaloa.adapters.nordnetadapters-test
  (:require
   [clojure.test :refer :all]
   [harborview.commonutils :refer [not-nil? find-first close-to]]
   [harborview.maunaloa.adapters.nordnetadapters])
  (:import
   ;(critter.util StockOptionUtil)
   (critter.repos StockMarketRepository)
   (critter.util StockOptionUtil)
   (harborview.downloader DownloaderStub)
   (harborview.dto.html StockPriceDTO)
   (harborview.factory StockMarketFactory)
   (harborview.maunaloa.adapters.nordnetadapters NordnetEtradeAdapter)
   (java.time Instant LocalDate)
   (java.util Optional)
   (nordnet.html StockOptionParser3)
   (nordnet.redis NordnetRedis)
   (vega.financial.calculator BlackScholes)))

(def dl-stub-path
  "/home/rcs/opt/java/nordnet-repos/src/integrationTest/resources/html/derivatives")

(def downloader
  (DownloaderStub. dl-stub-path))

(def redis (NordnetRedis. "172.20.1.2" 5))

(def stock-option-utils (StockOptionUtil. (LocalDate/of 2022 5 25)))

(def factory (StockMarketFactory. stock-option-utils))

(def repos
  (reify StockMarketRepository
    (findStock [this stockInfo]
      (.createStock factory 3))
    (findStockOption [this stockOptInfo]
      (Optional/empty))))

(def etrade
  (let [calc (BlackScholes.)]
    (prn calc ", " redis ", " repos ", " stock-option-utils)
    (StockOptionParser3. calc redis repos stock-option-utils)))

(def ctx {:repos repos :etrade etrade, :dl downloader, :redis redis})

(def sut (NordnetEtradeAdapter. ctx))

(deftest yar-calls-should-be-8
  (let [calls (.calls sut "YAR")
        iscalls (map #(.isCall %) calls)]
    (comment #(str (.getTicker %)
                   ", days: " (.getDays %)
                   ", buy: " (.getBuy %)
                   ", sell: " (.getSell %)
                   ", iv buy: " (.getIvBuy %)
                   ", iv sell: " (.getIvSell %)) calls)
    (comment (map #(str (.getTicker %)
                        ", Stockprice: " (-> % .getStockPrice .getCls)
                        ", buy: " (.getBuy %)
                        ", sell: " (.getSell %)
                        ", days: " (.getDays %)
                        ", exp: " (.getExpiry %)
                        ", iv buy: " (-> % .getStockOptionPrice .getIvBuy)
                        ", iv sell: " (-> % .getStockOptionPrice .getIvSell)
                        " ====== ") calls))
    (is (= 8 (.size calls)))
    (is (= '(true true true true true true true true) iscalls))))

(deftest yar-stock-price-should-not-be-nil
  (let [^StockPriceDTO sp (.stockPrice sut "YAR")]
    (is (not-nil? sp))
    (is (= (.getC sp) 487.4))))

(defn find-ticker [s coll]
  (let [ticker (str "YAR2F" s)]
    (find-first #(= (:ticker %) ticker) coll)))

(deftest yar-calc-risc-stockprices
  (let [riscs [{:ticker "YAR2F550" :risc 1.05}
               {:ticker "YAR2F510" :risc 2.0}
               {:ticker "YAR2F470" :risc 6.25}]
        calculated (.calcRiscStockprices sut "YAR" riscs)]
    (prn calculated)
    (is (= (count calculated) 3))
    (let [yar_550 (find-ticker 550 calculated)    ; 487.4 ->  473.5   (0.85 (0.806) / 1.25 (1.295) ->  0.2 (0.289) )     - iv buy: 0.2875, iv sell: 0.31875
          yar_510 (find-ticker 510 calculated)    ; 487.4 ->    (6.0/6.9 -> )       - iv buy: 0.28125, iv sell: 0.30312
          yar_470 (find-ticker 470 calculated)]   ; 487.4 ->    (24.25/26.25 -> )   - iv buy: 0.2640625, iv sell: 0.3125
      (prn yar_550 yar_510 yar_470)
      (is (close-to (:stockprice yar_550) 468.5 0.5))
      (is (close-to (:stockprice yar_510) 483.6 0.5))
      (is (close-to (:stockprice yar_470) 481.5 0.5)))))

(deftest yar-calc-risc-optionprice
  (let [o (.stockOptionPrice sut "YAR2F470")]
    (is (not-nil? o))
    (comment "Buy: " (.getBuy o) ", sell: " (.getSell o) ", stock price: " (-> o .getStockPrice .getCls))
    (is (close-to (.optionPriceFor o 480.0) 19.1 0.2))))

(comment demo-risc [{:ticker "YAR2F550" :risc 1.05}])

(comment demo-run []
         (.calcRiscStockprices sut "YAR" demo-risc))