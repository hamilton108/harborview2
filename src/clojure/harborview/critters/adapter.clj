(ns harborview.critters.adapter
  (:gen-class)
  (:import
   [java.time LocalDate]
   [critterrepos.models.impl StockMarketReposImpl])
  (:require
    ;[jsonista.core :as j]
   [harborview.htmlutils :as U]
   [compojure.core :refer (GET defroutes)]))

(defroutes my-routes
  (GET "/:purchasetype" [purchasetype]
    (prn "whatever")))