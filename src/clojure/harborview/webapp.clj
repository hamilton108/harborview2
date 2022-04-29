(ns harborview.webapp
  (:gen-class)
  (:require
   [io.pedestal.http :as http]
   [io.pedestal.http.route :as route]
   [io.pedestal.http.body-params :as body-params]
   [ring.util.response :as ring-resp]
   [harborview.htmlutils :as hu]
   [harborview.commonutils :refer [with-session rs]]
   ;[harborview.maunaloa.adapters.dbadapters]
   [harborview.maunaloa.adapters.nordnetadapters :as nordnet] ; :refer (->Postgres)]
   [harborview.maunaloa.core :as maunaloa]
   [harborview.thyme :as thyme])
  (:import
   (critter.mybatis StockMapper)
   (harborview.maunaloa.adapters.dbadapters
    PostgresAdapter
    StockMarketAdapter)
   (harborview.maunaloa.adapters.nordnetadapters
    NordnetEtradeAdapter)))

;(require '[clojure.core.match :refer [match]])

;(doseq [n (range 1 101)]
;  (println
;    (match [(mod n 3) (mod n 5)]
;      [0 0] "FizzBuzz"
;      [0 _] "Fizz"
;      [_ 0] "Buzz"
;      :else n)))

;(reset! maunaloa/db-adapter (PostgresAdapter.))
;(reset! maunaloa/nordnet-adapter (DemoEtradeAdapter. (StockMarketAdapter.)))
;(reset! maunaloa/nordnet-adapter (NordnetEtradeAdapter. (StockMarketAdapter.)))

;(reset! maunaloa/nordnet-adapter (NordnetEtradeAdapter. stockmarket-repos))

(def repos (StockMarketAdapter.))

;(.calls @maunaloa/nordnet-adapter oid))

(comment demo
         (memoize
          (fn []
            (with-session StockMapper
              (.selectStocks it)))))

(comment
  (def rows
    (memoize
     (fn []
       (let [tif (nordnet.downloader.TickerInfo. "YAR")
             dl (nordnet/downloader nil)
             page (first (.downloadDerivatives dl tif))
             content (-> page .getPage .getWebResponse .getContentAsString)
             doc (org.jsoup.Jsoup/parse content)]
         (prn "Fetching...")
         (vec (.select doc ".bRPJha"))))))

  (defn el->num [x]
    (-> (.children x)
        first
        .text
        rs))

  (defn el->str [x]
    (-> (.children x)
        first
        .text))

  (defn sp []
    (let [row (.children (first (rows)))
          cls (el->num (nth row 4))
          hi (el->num (nth row 7))
          lo (el->num (nth row 8))
          opn 450.0]
      [opn hi lo cls]))

  (defn opx []
    (let [orows (filter #(= (-> % .children .size) 16) (rows))]
      orows))

  (defn os []
    (let [row (.children (first (drop 12 (opx))))
          result [(str "1 c ticker: " (el->str (nth row 1)))
        ;(str "2: " (el->str (nth row 2)))
                  (str "3 c bid: " (el->str (nth row 3)))
                  (str "4 c ask: " (el->str (nth row 4)))
        ;(str "5: " (el->str (nth row 5)))
        ;(str "6: " (el->str (nth row 6)))
                  (str "7 x: " (el->str (nth row 7)))
        ;(str "8: " (el->str (nth row 8)))
                  (str "9 p bid: " (el->str (nth row 9)))
                  (str "10 p ask: " (el->str (nth row 10)))
        ;(str "11: " (el->str (nth row 11)))
        ;(str "12: " (el->str (nth row 12)))
                  (str "13 p ticker: " (el->str (nth row 13)))
        ;(str "14: " (el->str (nth row 14)))
        ;(str "15: " (el->str (nth row 15)))
                  ]]
      result)))


  ;(.calls @maunaloa/nordnet-adapter 3))
         ;(nordnet/etrade (StockMarketAdapter.)))
  ;(let [req {:path-params {:ptype 11 :oid 1}}]
  ;  (maunaloa/fetch-optionpurchases req)))


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
     ["/maunaloa/risclines/:oid" :get maunaloa/risclines :route-name :risclines]
     ;-------------------- stock option -------------------- 
     ["/maunaloa/stockoption" :get (conj hu/common-interceptors `stockoptions) :route-name :stockoptions]
     ["/maunaloa/stockoption/purchases" :get (conj hu/common-interceptors `optionpurchases) :route-name :optionpurchases]
     ["/maunaloa/stockoption/purchases/:ptype" :get maunaloa/fetch-optionpurchases :route-name :optionpurchases-2]
     ["/maunaloa/stockoption/price/:ticker/:stockprice" :get maunaloa/calcoptionprice :route-name :optionprice]
     ["/maunaloa/stockoption/calls/:oid" :get maunaloa/calls :route-name :calls]
     ["/maunaloa/stockoption/puts/:oid" :get maunaloa/puts :route-name :puts]
     ["/maunaloa/stockoption/purchase" :post [maunaloa/purchaseoption]]
     ["/maunaloa/stockoption/regpur" :post [maunaloa/regpuroption]]
     ["/maunaloa/stockoption/sell" :post [maunaloa/selloption]]
     ;-------------------- stock -------------------- 
     ["/maunaloa/stockprice/calculate/:oid" :post [maunaloa/calcriscstockprices]]
     ["/maunaloa/stockprice/tickers" :get maunaloa/tix :route-name :tix]
     ["/maunaloa/stockprice/days/:oid" :get maunaloa/days :route-name :days]
     ["/maunaloa/stockprice/weeks/:oid" :get maunaloa/weeks :route-name :weeks]
     ["/maunaloa/stockprice/months/:oid" :get maunaloa/months :route-name :months]
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