(ns harborview.htmlutils
  (:import
   (com.fasterxml.jackson.databind ObjectMapper))
  (:require
   [io.pedestal.http :as http]
   [io.pedestal.http.body-params :as body-params]
   [cheshire.core :as json]))

(def common-interceptors [(body-params/body-params) http/html-body])

(def om (ObjectMapper.))

(defn om->json [bean]
  (let [data (.writeValueAsString om bean)]
    {:status 200
     :headers {"Content-Type" "application/json"}
     :body data}))

(defn json-response [data & [status]]
  {:status (or status 200)
   :headers {"Content-Type" "application/json"}
   :body (json/generate-string data)})

(defn response [status body & {:as headers}]
  {:status status :body body :headers headers})

(defn json-req-parse [req]
  (let
   [r (slurp (:body req))]
    (json/parse-string r true)))

(defn bean->json [^critter.stock.Stock b]
  {"v" (str (.getOid b)) "t" (.toHtml b)})

;; (comment allow-cross-origin
;;          "middleware function to allow cross origin"
;;          [handler]
;;          (fn [request]
;;            (let [response (handler request)]
;;              (-> response
;;                  (assoc-in [:headers "Access-Control-Allow-Origin"]  "*")
;;                  (assoc-in [:headers "Access-Control-Allow-Methods"] "GET,PUT,POST,DELETE,OPTIONS")
;;                  (assoc-in [:headers "Access-Control-Allow-Headers"] "X-Requested-With,Content-Type,Cache-Control")))))

;; (comment in?
;;          "true if seq contains elm"
;;          [seq elm]
;;          (some #(= elm %) seq))

;; (comment str->bool [b]
;;          (if (.equals b "true") true false))

;; (comment str->date [dx]
;;          (LocalDate/parse dx date-fmt-1))

;; (comment date->str [dx]
;;          (.format dx date-fmt-1))
