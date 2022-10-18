(ns harborview.maunaloa.derivatives
  (:gen-class)
  (:import
   (java.io IOException File FileOutputStream)
   (java.time LocalDate LocalTime)
   (nordnet.downloader PageInfo))
  (:require
   [harborview.maunaloa.config :as C]))

(def feed "/home/rcs/opt/java/harborview2/feed")

(defn today-feed [ticker]
  (let [dx (LocalDate/now)
        tm (LocalTime/now)
        y (.getYear dx)
        m (-> dx .getMonth .getValue)
        d (.getDayOfMonth dx)
        tms (str (.getHour tm) "_" (.getMinute tm))]
    (str feed "/" y "/" m "/" d "/" ticker "/" tms)))

(defn check-file [ticker file-name]
  (let [tf (today-feed ticker)
        cur-file (str tf "/" file-name ".html")
        out (File. cur-file)
        pout (.getParentFile out)]
    (if (= (.exists pout) false)
      (.mkdirs pout))
    (if (= (.exists out) false)
      (.createNewFile out))
    out))

(defn save-page [^PageInfo page-info]
  (let [page (.getPage page-info)
        utm (.getUnixTime page-info)
        ti (-> page-info .getTickerInfo .getTicker)
        out (check-file ti utm)]
    (try
      (let [contentInBytes (-> page .getWebResponse .getContentAsString .getBytes)
            fop (FileOutputStream. out)]
        (.write fop contentInBytes)
        (doto fop
          .flush
          .close))
      (catch IOException e
        (println (str "Could not save: " out ", " (.getMessage e)))))))

(def page-consumer
  (reify java.util.function.Consumer
    (accept [this page-info]
      (println page-info)
      (save-page page-info))))

(def etrade
  (binding [C/is-test true]
    (C/etrade page-consumer)))

;; (comment demo []
;;          (.calls etrade "EQNR"))