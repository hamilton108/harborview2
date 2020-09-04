(ns harborview.htmlutils
  (:require
    [cheshire.core :as json]))

(defn json-response [data & [status]]
  {:status (or status 200)
   :headers {"Content-Type" "application/json"}
   :body (json/generate-string data)})

(defn json-req-parse [req]
  (let [r (slurp (:body req))]
    (json/parse-string r)))

(defn bean->json [b]
  {"v" (str (.getOid b)) "t" (.toHtml b)})

(comment allow-cross-origin
  "middleware function to allow cross origin"
  [handler]
  (fn [request]
    (let [response (handler request)]
      (-> response
        (assoc-in [:headers "Access-Control-Allow-Origin"]  "*")
        (assoc-in [:headers "Access-Control-Allow-Methods"] "GET,PUT,POST,DELETE,OPTIONS")
        (assoc-in [:headers "Access-Control-Allow-Headers"] "X-Requested-With,Content-Type,Cache-Control")))))


(comment rs [v]
  (if (string? v)
    (let [vs (if-let [v (re-seq #"(\d+),(\d+)" v)]
               (let [[a b c] (first v)] (str b "." c))
               v)]
      (read-string vs))
    v))

(comment in?
  "true if seq contains elm"
  [seq elm]
  (some #(= elm %) seq))

(comment str->bool [b]
  (if (.equals b "true") true false))

(comment str->date [dx]
  (LocalDate/parse dx date-fmt-1))

(comment date->str [dx]
  (.format dx date-fmt-1))
