(ns harborview.maunaloa.adapters.nordnetadapters-test
  (:require
   [clojure.test :refer :all]
   [harborview.commonutils :refer [not-nil? find-first]]
   [harborview.maunaloa.adapters.nordnetadapters])
  (:import
   ;(critter.util StockOptionUtil)
   (critter.repos StockMarketRepository)
   (critter.util StockOptionUtil)
   (harborview.downloader DownloaderStub)
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
    (prn (map #(str (.getTicker %)
                    ", days: " (.getDays %)
                    ", iv buy: " (.getIvBuy %)
                    ", iv sell: " (.getIvSell %)) calls))
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
  (let [sp (.stockPrice sut "YAR")]
    (is (not-nil? sp))))

(defn find-ticker [s coll]
  (let [ticker (str "YAR2F" s)]
    (find-first #(= (:ticker %) ticker) coll)))

(deftest yar-calc-risc-stockprices
  (let [riscs [{:ticker "YAR2F470" :risc 2.3}
               {:ticker "YAR2F410" :risc 2.3}
               {:ticker "YAR2F375" :risc 2.3}]
        calculated (.calcRiscStockprices sut "YAR" riscs)]
    (prn calculated)
    (is (= (count calculated) 3))
    (prn "HERE WE GO")
    (let [yar_375 (find-ticker 375 calculated)
          yar_410 (find-ticker 410 calculated)
          yar_470 (find-ticker 470 calculated)]
      (prn yar_375 yar_410 yar_470))))


