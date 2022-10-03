(ns harborview.maunaloa.config
  (:gen-class)
  (:require [harborview.maunaloa.adapters.dbadapters])
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

(def dl-stub-path
  "/home/rcs/opt/java/nordnet-repos/src/integrationTest/resources/html/derivatives")

(def downloader
  (DownloaderStub. dl-stub-path))

(def redis (NordnetRedis. "172.20.1.2" 5))

(def stock-option-utils (StockOptionUtil. (LocalDate/of 2022 5 25)))

(def factory (StockMarketFactory. stock-option-utils))

(defn etrade [repos]
  (let [calc (BlackScholes.)]
    (StockOptionParser3. calc redis repos stock-option-utils)))

(defn get-context [is-prod]
  (if (= is-prod true)
    ; Prod
    (let [repos (StockMarketAdapterTest. factory)]
      {:repos repos
       :etrade (etrade repos)
       :dl downloader
       :redis redis})
    ; Test
    (let [repos (StockMarketAdapterTest. factory)]
      {:repos repos
       :etrade (etrade repos)
       :dl downloader
       :redis redis
       :factory factory})))

(comment consumer
         (reify java.util.function.Consumer
           (accept [this page]
             (print page))))

(comment downloader [^Consumer page-consumer]
         (let [dl (if (= is-test false)
                    (DefaultDownloader. "172.20.1.2" 6379 0)
                    (DownloaderStub. "/home/rcs/opt/java/harborview2/feed/2020/10/13"))]
           (.setOnPageDownloaded dl page-consumer)
           (println (str "DOWNLOADER: " dl))
           dl))

(comment etrade [^Consumer page-consumer]
         (let [stockmarket (StockMarketReposImpl.)
               result (EtradeRepositoryImpl.)]
           (.setDownloader result (downloader page-consumer))
           (.setStockMarketRepository result stockmarket)
           result))
