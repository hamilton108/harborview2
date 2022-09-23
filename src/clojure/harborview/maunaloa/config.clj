(ns harborview.maunaloa.config
  (:gen-class)
  (:import
   (java.util.function
    Consumer)
   (nordnet.downloader
    DefaultDownloader
    TickerInfo)
   (nordnet.repos
    EtradeRepositoryImpl)
   (critter.models.impl
    StockMarketReposImpl)
   (harborview.downloader
    DownloaderStub)))

(def ^:dynamic is-test false)
;(def ^:dynamic consumer nil)

(comment consumer
         (reify java.util.function.Consumer
           (accept [this page]
             (print page))))

(defn downloader [^Consumer page-consumer]
  (let [dl (if (= is-test false)
             (DefaultDownloader. "172.20.1.2" 6379 0)
             (DownloaderStub. "/home/rcs/opt/java/harborview2/feed/2020/10/13"))]
    (.setOnPageDownloaded dl page-consumer)
    (println (str "DOWNLOADER: " dl))
    dl))

(defn etrade [^Consumer page-consumer]
  (let [stockmarket (StockMarketReposImpl.)
        result (EtradeRepositoryImpl.)]
    (.setDownloader result (downloader page-consumer))
    (.setStockMarketRepository result stockmarket)
    result))

