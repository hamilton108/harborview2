(ns harborview.webapp
  (:gen-class)
  (:require
   [io.pedestal.http :as http]
   [io.pedestal.http.route :as route]
   [ring.util.response :as ring-resp]
   [harborview.htmlutils :as hu]
   [harborview.maunaloa.config :as config]
   [harborview.maunaloa.adapters.dbadapters]
   [harborview.maunaloa.adapters.nordnetadapters] ; :refer (->Postgres)]
   [harborview.maunaloa.core :as maunaloa]
   [harborview.thyme :as thyme])
  (:import
   (harborview.maunaloa.adapters.dbadapters PostgresAdapter StockMarketAdapter)
   (harborview.maunaloa.adapters.nordnetadapters NordnetEtradeAdapter)))

;(require '[clojure.core.match :refer [match]])

;(doseq [n (range 1 101)]
;  (println
;    (match [(mod n 3) (mod n 5)]
;      [0 0] "FizzBuzz"
;      [0 _] "Fizz"
;      [_ 0] "Buzz"
;      :else n)))


(def ctx (config/get-context :demo))

(reset! maunaloa/db-adapter (PostgresAdapter. ctx))

(reset! maunaloa/nordnet-adapter (NordnetEtradeAdapter. ctx))

;; (def req
;;   {:path-params {:ptype 11 :oid 1}})

;; (def calls maunaloa/calls)

;; (def nordnet @maunaloa/nordnet-adapter)

;; (def db (StockMarketAdapter.))

(defn home
  [request]
  (ring-resp/response (thyme/render "maunaloa/charts")))

(defn stockoptions
  [request]
  (ring-resp/response (thyme/render "maunaloa/options")))

(defn optionpurchases
  [request]
  (ring-resp/response (thyme/render "maunaloa/optionpurchases")))

(defn critters
  [request]
  (ring-resp/response (thyme/render "critter/overlook")))

(def routes
  (route/expand-routes
   #{["/" :get (conj hu/common-interceptors `home) :route-name :home]
     ;-------------------- maunaloa -------------------- 
     ["/maunaloa/charts" :get (conj hu/common-interceptors `home) :route-name :charts]
     ;["/maunaloa/optiontickers" :get (conj hu/common-interceptors `stockoptions) :route-name :stockoptions]
     ["/maunaloa/risclines/:oid" :get maunaloa/risclines]
     ;-------------------- stock option -------------------- 
     ["/maunaloa/stockoption" :get (conj hu/common-interceptors `stockoptions) :route-name :stockoptions]
     ["/maunaloa/stockoption/purchases" :get (conj hu/common-interceptors `optionpurchases) :route-name :optionpurchases]
     ;["/maunaloa/stockoption/purchases/:ptype" :get maunaloa/fetch-optionpurchases :route-name :optionpurchases-2]
     ["/maunaloa/stockoption/purchases/:ptype" :get maunaloa/fetch-optionpurchases]
     ["/maunaloa/stockoption/price/:ticker/:stockprice" :get maunaloa/calcoptionprice]
     ["/maunaloa/stockoption/calls/:oid" :get maunaloa/calls]
     ["/maunaloa/stockoption/puts/:oid" :get maunaloa/puts]
     ["/maunaloa/stockoption/purchase" :post [maunaloa/purchaseoption]]
     ["/maunaloa/stockoption/regpur" :post [maunaloa/regpuroption]]
     ["/maunaloa/stockoption/sell" :post [maunaloa/selloption]]
     ;-------------------- stock -------------------- 
     ["/maunaloa/stockprice/calculate/:oid" :post [maunaloa/calcriscstockprices]]
     ["/maunaloa/stockprice/tickers" :get maunaloa/tix :route-name :tix]
     ["/maunaloa/stockprice/days/:oid" :get maunaloa/days]
     ["/maunaloa/stockprice/weeks/:oid" :get maunaloa/weeks]
     ["/maunaloa/stockprice/months/:oid" :get maunaloa/months]
     ;-------------------- critters -------------------- 
     ["/critter/purchases/:ptype" :get maunaloa/critter-purchases :route-name :critter-purchases]
     ["/critter/overlook" :get (conj hu/common-interceptors `critters) :route-name :critters]}))

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

;(def ^:dynamic *app-context* nil)

(defn -main
  "The entry-point for 'lein run'"
  [& _]
  (println "\nCreating your server...")
  (http/start runnable-service))

;(.calls @maunaloa/nordnet-adapter 3))
       ;(nordnet/etrade (StockMarketAdapter.)))
;(let [req {:path-params {:ptype 11 :oid 1}}]
;  (maunaloa/fetch-optionpurchases req)))

;; (comment wrap-return-favicon [handler]
;;          (fn [req]
;;            (if (= [:get "/favicon.ico"] [(:request-method req) (:uri req)])
;;              (resource-response "favicon.ico" {:root "public/img"})
;;              (handler req))))

;; (comment -main []
;;          (let [x (run-jetty #'webapp {:port 8082 :join? false})]

;;            (prn x))
;;          (comment
;;            (run-jetty #'webapp
;;                       {:port 8443
;;                        :join? false
;;                        :ssl? true
;;                        :keystore "../local/harborview.ssl"
;;                        :key-password "VhCHeUJ4"})))