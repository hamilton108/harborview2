(ns harborview.maunaloa.adapters
  (:gen-class)
  (:import
   [java.util.function Consumer]
   [java.time LocalDate]
   [critterrepos.models.impl StockMarketReposImpl]
   [nordnet.downloader DefaultDownloader]
   [nordnet.repos EtradeRepositoryImpl]
   ;[critterrepos.models.impl
   ; StockMarketReposImpl]
   [harborview.downloader DownloaderStub])
  (:require
   [harborview.htmlutils :as u]
   [harborview.maunaloa.ports :as ports]))

(def start-date (LocalDate/of 2010 1 1))

(def repos (StockMarketReposImpl.))

(def ^:dynamic is-test false)

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

(defrecord Postgres []
  ports/MaunaloaDB
  (tickers [this] (.getStocks repos))
  (prices [this oid]
    (let [ticker (.getTickerFor repos (u/rs oid))]
      (.findStockPrices repos ticker start-date))))
