(ns harborview.webapp
  (:gen-class)
  (:require 
    [io.pedestal.http :as http]
    [io.pedestal.http.route :as route]
    [io.pedestal.http.body-params :as body-params]
    [ring.util.response :as ring-resp]
    [harborview.htmlutils :as hu]
    [harborview.maunaloa.core :as maunaloa]
    [harborview.thyme :as thyme]))

(defn home
  [request]
  (ring-resp/response (thyme/charts)))

(defn stockoptions
  [request]
  (ring-resp/response (thyme/stockoptions)))

(defn optionpurchases
  [request]
  (ring-resp/response (thyme/optionpurchases)))

(defn critters
  [request]
  (ring-resp/response (thyme/critters)))

(def routes
  (route/expand-routes
   #{["/" :get (conj hu/common-interceptors `home) :route-name :home]
     ;-------------------- maunaloa -------------------- 
     ["/maunaloa/calcriscstockprices/:oid" :post [maunaloa/calcriscstockprices]]
     ["/maunaloa/calls/:oid" :get maunaloa/calls :route-name :calls]
     ["/maunaloa/charts" :get (conj hu/common-interceptors `home) :route-name :charts]
     ["/maunaloa/days/:oid" :get maunaloa/days :route-name :days]
     ["/maunaloa/months/:oid" :get maunaloa/months :route-name :months]
     ["/maunaloa/optionprice/:ticker/:stockprice" :get maunaloa/calcoptionprice :route-name :optionprice]
     ["/maunaloa/optionpurchases" :get (conj hu/common-interceptors `optionpurchases) :route-name :optionpurchases]
     ["/maunaloa/optiontickers" :get (conj hu/common-interceptors `stockoptions) :route-name :stockoptions]
     ["/maunaloa/purchaseoption" :post [maunaloa/purchaseoption]]
     ["/maunaloa/puts/:oid" :get maunaloa/puts :route-name :puts]
     ["/maunaloa/regpuroption" :post [maunaloa/regpuroption]]
     ["/maunaloa/risclines/:oid" :get maunaloa/risclines :route-name :risclines]
     ["/maunaloa/tickers" :get maunaloa/tix :route-name :tix]
     ["/maunaloa/weeks/:oid" :get maunaloa/weeks :route-name :weeks]
     ;-------------------- critters -------------------- 
     ["/critters/purchases/:ptype" :get maunaloa/critter-purchases :route-name :critter-purchases]
     ["/critters/overlook" :get (conj hu/common-interceptors `critters) :route-name :critters]}))

(def service {:env :prod
              ;::http/allowed-origins {:creds true, :allowed-origins (constantly true)}
              ::http/routes routes
              ::http/secure-headers {:content-security-policy-settings {:object-src "'none'"}}
              ::http/resource-path "/public"
              ::http/type :jetty
              ::http/port 8080
              ::http/container-options {:h2c? true
                                        :h2? false
                                        :ssl? false}})

(defonce runnable-service (http/create-server service))

(def ^:dynamic *app-context* nil)

(defn -main
  "The entry-point for 'lein run'"
  [& args]
  (println "\nCreating your server...")
  (http/start runnable-service))

(comment wrap-return-favicon [handler]
         (fn [req]
           (if (= [:get "/favicon.ico"] [(:request-method req) (:uri req)])
             (resource-response "favicon.ico" {:root "public/img"})
             (handler req))))

(comment -main []
         (let [x (run-jetty #'webapp {:port 8082 :join? false})]
           (prn x))
         (comment
           (run-jetty #'webapp
                      {:port 8443
                       :join? false
                       :ssl? true
                       :keystore "../local/harborview.ssl"
                       :key-password "VhCHeUJ4"})))