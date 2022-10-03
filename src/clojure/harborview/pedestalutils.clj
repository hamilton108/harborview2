(ns harborview.pedestalutils
  (:require
   [harborview.commonutils :refer [defn-defaults]]
   [harborview.htmlutils :as hu]))

(defn-defaults default-json-response
  [route-name
   http-status
   body-fn
   {om-json true}]
  {:name route-name
   :enter
   (fn [context]
     (let [req (:request context)
           body (hu/json-req-parse req)
           result (body-fn body req)
           response (if (= om-json true)
                      (hu/om->json result)
                      (hu/json-response result http-status))]
       (assoc context :response response)))
   :error
   (fn [context ex-info]
     (assoc context
            :response {:status 500
                       :body (.getMessage ex-info)}))})

(comment default-om-json [route-name http-status body-fn]
         {:name route-name
          :enter
          (fn [context]
            (let [req (:request context)
                  body (hu/json-req-parse req)
                  result (body-fn body req)
                  response (hu/om->json result)]
              (assoc context :response response)))
          :error
          (fn [context ex-info]
            (assoc context
                   :response {:status 500
                              :body (.getMessage ex-info)}))})

(comment default-json-response [route-name http-status body-fn]
         `{:name route-name
           :enter
           (fn [context]
             (let [req (:request context)
                   body (hu/json-req-parse req)
                   result (~body-fn body)
                   response (hu/json-response result http-status)]
               (assoc context :response response)))
           :error
           (fn [context ex-info]
             (prn ex-info))})