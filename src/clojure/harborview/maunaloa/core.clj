(ns harborview.maunaloa.core
  (:gen-class)
  (:require
   [harborview.maunaloa.adapters] ; :refer (->Postgres)]
   [harborview.htmlutils :as hu]
   [harborview.commonutils :as cu]
   [cheshire.core :as json]
   [harborview.thyme :as thyme])
  (:import
   [harborview.dto.html.critters OptionPurchaseDTO]
   [harborview.maunaloa.adapters Postgres NordnetEtrade DemoEtrade]
   [harborview.maunaloa.charts
    ElmChartsFactory ElmChartsWeekFactory ElmChartsMonthFactory]
   [critterrepos.models.impl StockMarketReposImpl]
   [critterrepos.beans StockPriceBean]
   [java.util ArrayList]
   [java.time.temporal IsoFields]
   [java.time LocalDate]))

(def db (Postgres.))

;(def nordnet (NordnetEtrade.))
(def nordnet (DemoEtrade.))

(def factory (ElmChartsFactory.))

(def factory-weeks (ElmChartsWeekFactory.))

(def factory-months (ElmChartsMonthFactory.))

(def tix-m
  (memoize
   (fn []
     (let [t (map hu/bean->json (.stockTickers ^Postgres db))]
       (hu/json-response t)))))

(comment ok [body]
         {:status 200 :body body
          :headers {"Content-Type" "application/json"}})

(defn tix [request]
  (tix-m))

(defn req-oid [request]
  (let [oid (get-in request [:path-params :oid])]
    (cu/rs oid)))

(defn charts [request ^ElmChartsFactory factory]
  (let [oid (req-oid request)
        prices (.prices db oid)
        charts (.elmCharts factory (str oid) prices)]
    (hu/om->json charts)))

(defn days [request]
  (charts request factory))

(defn weeks [request]
  (charts request factory-weeks))

(defn months [request]
  (charts request factory-months))

(comment check-implied-vol [ox]
         (if (= (.isPresent (.getIvBuy ox)) true)
           (if (= (.isPresent (.getIvSell ox)) true)
             true
             false)
           false))

(comment valid? [ox]
         (if (> (.getBuy ox) 0)
           (if (> (.getSell ox) 0)
             (if (= (check-implied-vol ox) true)
               (.isPresent (.getBreakEven ox)))
             false)
           false))

(defn puts [request]
  (let [oid (req-oid request)
        items (.puts nordnet oid)]
    (hu/om->json items)))

(defn calls [request]
  (let [oid (req-oid request)
        items (.calls nordnet oid)]
    (hu/om->json items)))

(defn critter-purchases [request]
  (let [ptypes (get-in request [:path-params :ptype])
        ptype (cu/rs ptypes)
        items (.activePurchasesWithCritters db ptype)
        result (map #(OptionPurchaseDTO. %) items)]
    (hu/om->json result)))

(def demo-req
  {:path-params {:ptype 11}})

(def echo
  {:name ::echo
   :enter
   (fn [context]
     (let [request (:request context)
           response (hu/json-response request)]
       (assoc context :response response)))
   :error
   (fn [context ex-info]
     (prn ex-info)
     (assoc context :response {:status 400 :body "invalid"}))})

(def calcriscstockprices
  {:name ::calcriscstockprices
   :enter
   (fn [context]
     (let [req (:request context)
           oid (req-oid req)
           body (hu/json-req-parse req)
           result (.calcRiscStockprices nordnet oid body)
           response (hu/json-response result)]
       (prn body)
       (prn response)
       (assoc context :response response)))
   :error
   (fn [context ex-info]
     (prn ex-info))})

(comment demo []
         (.calcRiscStockprices nordnet
                               "2"
                               ({"ticker" "EQNR1", "risc" 2.3} {"ticker" "EQNR2", "risc" 2.9} {"ticker" "EQNR3", "risc" 1.75})))

(defn risclines [request]
  (let [oid (req-oid request)]
    (hu/om->json (.riscLines nordnet oid))))

(defn calcoptionprice [request]
  (let [ticker (get-in request [:path-params :ticker])
        sp (cu/rs (get-in request [:path-params :stockprice]))
        price (.calcRiscOptionPrice nordnet ticker sp)]
    (hu/json-response {:value price})))

(defn default-json-response [route-name http-status body-fn]
  {:name route-name 
   :enter
   (fn [context]
     (let [req (:request context)
           body (hu/json-req-parse req)
           result (body-fn body)
           response (hu/json-response result http-status)]
       (assoc context :response response)))
   :error
   (fn [context ex-info]
     (prn ex-info))})

(def purchaseoption
  (default-json-response ::purchaseoption 201
    (fn [body] 
      (.purchaseOption db body))))

(comment purchaseoption
  {:name ::purchaseoption
   :enter
   (fn [context]
     (let [req (:request context)
           body (hu/json-req-parse req)
           result (.purchaseOption db body)
           response (hu/json-response result 201)]
       (prn body)
       (prn response)
       (assoc context :response response)))
   :error
   (fn [context ex-info]
     (prn ex-info))})

(def regpuroption
  {:name ::regpuroption
   :enter
   (fn [context]
     (let [req (:request context)
           body (hu/json-req-parse req)
           result (.registerAndPurchaseOption db body)
           response (hu/json-response result 201)]
       (prn body)
       (prn response)
       (assoc context :response response)))
   :error
   (fn [context ex-info]
     (prn ex-info))})
