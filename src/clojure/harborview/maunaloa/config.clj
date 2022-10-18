(ns harborview.maunaloa.config
  (:gen-class)
  (:require [harborview.maunaloa.adapters.dbadapters]
            [clojure.core.match :refer [match]])
  ;(:require [harborview.maunaloa.repository :as repository])
  (:import
   (harborview.maunaloa.adapters.dbadapters
    StockMarketAdapter
    StockMarketAdapterTest)
   (critter.util StockOptionUtil)
   (vega.financial.calculator BlackScholes)
   (harborview.downloader DownloaderStub)
   (harborview.factory StockMarketFactory)
   (java.time LocalDate)
   (nordnet.downloader DefaultDownloader)
   (nordnet.html StockOptionParser3)
   (nordnet.redis NordnetRedis)))

(defn dl-stub-path [ct]
  (match ct
    :test
    "/home/rcs/opt/java/nordnet-repos/src/integrationTest/resources/html/derivatives"
    :demo
    "/home/rcs/opt/java/harborview2/feed/2022/10/17"))

(defn downloader [ct]
  (match ct
    :prod
    (DefaultDownloader. "172.20.1.2" 6379 0)
    :else
    (DownloaderStub. (dl-stub-path ct))))

(defn redis [ct]
  (match ct
    :prod
    (NordnetRedis. "172.20.1.2" 0)
    :else
    (NordnetRedis. "172.20.1.2" 5)))

(defn stock-option-util [ct]
  (match ct
    :prod
    (StockOptionUtil.)
    :test
    (StockOptionUtil. (LocalDate/of 2022 5 25))
    :demo
    (StockOptionUtil. (LocalDate/of 2022 10 17))))

(defn factory [ct]
  (match ct
    :test
    (StockMarketFactory. (stock-option-util ct))
    :demo
    (StockMarketFactory. (stock-option-util ct))))

(defn repos [ct]
  (if (= ct :prod)
    (StockMarketAdapter.)
    (StockMarketAdapterTest. (factory ct))))

(defn etrade [ct]
  (let [calc (BlackScholes.)]
    (StockOptionParser3. calc (redis ct) (repos ct) (stock-option-util ct))))

(defn get-context [ct]
  {:repos (repos ct)
   :etrade (etrade ct)
   :dl (downloader ct)
   :redis (redis ct)
   :scrapbook "/home/rcs/opt/java/harborview2/scrapbook"})

;; (comment consumer
;;          (reify java.util.function.Consumer
;;            (accept [this page]
;;              (print page))))

;; (comment downloader [^Consumer page-consumer]
;;          (let [dl (if (= is-test false)
;;                     (DefaultDownloader. "172.20.1.2" 6379 0)
;;                     (DownloaderStub. "/home/rcs/opt/java/harborview2/feed/2020/10/13"))]
;;            (.setOnPageDownloaded dl page-consumer)
;;            (println (str "DOWNLOADER: " dl))
;;            dl))

;; (comment etrade [^Consumer page-consumer]
;;          (let [stockmarket (StockMarketReposImpl.)
;;                result (EtradeRepositoryImpl.)]
;;            (.setDownloader result (downloader page-consumer))
;;            (.setStockMarketRepository result stockmarket)
;;            result))
