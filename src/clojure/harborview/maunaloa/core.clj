(ns harborview.maunaloa.core
  (:gen-class)
  (:require
   [io.pedestal.http :as http]
   [io.pedestal.http.route :as route]
   [ring.util.response :as ring-resp]
   [harborview.maunaloa.adapters] ; :refer (->Postgres)]
   [harborview.htmlutils :as hu]
   [cheshire.core :as json]
   [harborview.thyme :as thyme])
  (:import
   [harborview.maunaloa.adapters Postgres NordnetEtrade]
   [harborview.maunaloa.charts
    ElmChartsFactory ElmChartsWeekFactory ElmChartsMonthFactory]
   [critterrepos.models.impl StockMarketReposImpl]
   [critterrepos.beans StockPriceBean]
   [java.time.temporal IsoFields]
   [java.time LocalDate]))

(def db (Postgres.))

(def nordnet (NordnetEtrade.))

(def factory (ElmChartsFactory.))

(def factory-weeks (ElmChartsWeekFactory.))

(def factory-months (ElmChartsMonthFactory.))

(def tix-m
  (memoize
   (fn []
     (let [t (map hu/bean->json (.tickers ^Postgres db))]
       (hu/json-response t)))))

(defn ok [body]
  {:status 200 :body body
   :headers {"Content-Type" "application/json"}})

(defn tix [request]
  (tix-m))

(defn home
  [request]
  (ring-resp/response (thyme/charts)))

(defn stockoptions
  [request]
  (ring-resp/response (thyme/stockoptions)))

(defn charts [request ^ElmChartsFactory factory]
  (let [oid (get-in request [:path-params :oid])
        prices (.prices db oid)
        charts (.elmCharts factory prices)]
    (hu/om->json charts)))

(defn days [request]
  (charts request factory))

(defn weeks [request]
  (charts request factory-weeks))

(defn months [request]
  (charts request factory-months))

(defn risclines [request]
  (let [oid (get-in request [:path-params :oid])]))

(defn check-implied-vol [ox]
  (if (= (.isPresent (.getIvBuy ox)) true)
    (if (= (.isPresent (.getIvSell ox)) true)
      true
      false)
    false))

(defn valid? [ox]
  (if (> (.getBuy ox) 0)
    (if (> (.getSell ox) 0)
      (if (= (check-implied-vol ox) true)
        (.isPresent (.getBreakEven ox)))
      false)
    false))

(defn puts [request op-fn]
  (let [oid (get-in request [:path-params :oid])
        items (.puts nordnet oid)]
    (hu/om->json items)))

(defn calls [request]
  (let [oid (get-in request [:path-params :oid])
        items (.calls nordnet oid)]
    (hu/om->json items)))

(def echo
  {:name ::echo
   :enter (fn [context]
            (let [request (:request context)
                  response (ok request)]
              (assoc context :response response)))})

(def calcriscstockprices
  {:name ::calcriscstockprices
   :enter
   (fn [context]
     (let [req (:request context)
           oid (get-in req [:path-params :oid] "-1")
           body (hu/json-req-parse req)
           response (ok (json/generate-string {:a 3, :oid oid}))]
       (prn body)
       (prn (type body))
       (prn (type (first body)))
       (assoc context :response response)))})

(def routes
  (route/expand-routes
   #{["/" :get (conj hu/common-interceptors `home) :route-name :home]
     ["/maunaloa/charts" :get (conj hu/common-interceptors `home) :route-name :charts]
     ["/maunaloa/optiontickers" :get (conj hu/common-interceptors `stockoptions) :route-name :stockoptions]
     ["/maunaloa/tickers" :get tix :route-name :tix]
     ["/maunaloa/days/:oid" :get days :route-name :days]
     ["/maunaloa/weeks/:oid" :get weeks :route-name :weeks]
     ["/maunaloa/months/:oid" :get months :route-name :months]
     ["/maunaloa/risclines/:oid" :get risclines :route-name :risclines]
     ["/maunaloa/calls/:oid" :get calls :route-name :calls]
     ["/maunaloa/puts/:oid" :get puts :route-name :puts]
     ["/maunaloa/calcriscstockprices/:oid" :post [calcriscstockprices]]
     ["/echo"  :get echo :route-name :echo]}))

(comment
  (defn prices->years [ps]
    (group-by #(-> ^StockPriceBean % .getLocalDx .getYear) ps))

  (defn week [s]
    (.get ^LocalDate s IsoFields/WEEK_OF_WEEK_BASED_YEAR))

  (defn week->stockprice [^StockPriceBean w]
    (.weekToStockPrice ^ElmChartsFactory factory w))

  (defn sorted-vals [m]
    (let [k (sort (keys m))]
      (map #(m %) k)))

  (defn weeks->stockprices [w]
    (let [weeks (sorted-vals w)]
      (map week->stockprice weeks)))

  (defn year->weeks [y]
    (group-by #(-> ^StockPriceBean % .getLocalDx week) y))

  (defn prices->weeks [raw-prices]
    (let [yx (-> (prices->years raw-prices) sorted-vals)
          wx (map year->weeks yx)
          result (map weeks->stockprices wx)]
      (apply concat result))))

(comment
  (def db (Postgres.))

  (def factory (ElmChartsFactory.))

  (def tix
    (memoize
     (fn []
       (let [tix (map hu/bean->json (.tickers db))]
         (hu/json-response tix)))))

  (defn tix2
    [request]
    (let [tix (map hu/bean->json (.tickers db))]
      (ring-resp/response tix)))

  (defn days [oid]
    (let [prices (.prices db oid)
          charts (.elmCharts factory prices)]
      (hu/om->json charts)))

  (defn home-page
    [request]
    (ring-resp/response (thyme/charts)))

  (def unmentionables #{"YHWH" "Voldemort" "Mxyzptlk" "Rumplestiltskin"})

  (defn ok [body]
    {:status 200 :body body})

  (defn not-found []
    {:status 404 :body "Not found\n"})

  (defn greeting-for [nm]
    (cond
      (unmentionables nm) nil
      (empty? nm)         "Hello, world!\n"
      :else               (str "Hello, " nm "\n")))

  (defn respond-hello [request]
    (let [nm   (get-in request [:query-params :name])
          resp (greeting-for nm)]
      (if resp
        (ok resp)
        (not-found))))

  (def echo
    {:name ::echo
     :enter (fn [context]

              (let [request (:request context)
                    response (ok request)]
                (assoc context :response response)))})
  (defn hello-page-x
    [request]
    (ring-resp/response
     (let [resp (clojure.string/trim (get-in request [:query-params :name]))]
       (if (empty? resp) "Hello World!" (str "Hello " resp "!")))))

  (defn hello-page
    [request]
    (ring-resp/response tix))

  (def play
    {:name ::msg-play
     :enter
     (fn [context]
       (update-in context [:request :query-params :name] clojure.string/upper-case))
     :leave
     (fn [context] context) ;(update-in context [:response :body] #(str % "Good to see you!")))
     :error
     (fn [context ex-info]
       (assoc context :response {:status 400 :body "Invalid name!"}))})

  (def routes
    (route/expand-routes
     #{["/" :get (conj hu/common-interceptors `home-page)]
       ["/tickers" :get (conj hu/common-interceptors `play 'hello-page)]
       ["/days/:oid" :get (conj hu/common-interceptors `days)]})))
