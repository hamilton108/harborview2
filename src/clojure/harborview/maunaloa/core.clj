(ns harborview.maunaloa.core
  (:gen-class)
  (:require
   [harborview.maunaloa.adapters.dbadapters] ; :refer (->Postgres)]
   [harborview.maunaloa.adapters.nordnetadapters]
   [harborview.htmlutils :as hu]
   [harborview.commonutils :as cu]
   [harborview.pedestalutils :as pu]
   [cheshire.core :as json]
   [harborview.thyme :as thyme])
  (:import
   [harborview.dto.html.critters OptionPurchaseDTO]
   [harborview.maunaloa.charts
    ElmChartsFactory ElmChartsWeekFactory ElmChartsMonthFactory]
   [critterrepos.models.impl StockMarketReposImpl]
   [critterrepos.beans StockPriceBean]
   [java.util ArrayList]
   [java.time.temporal IsoFields]
   [java.time LocalDate]))

(def db-adapter (atom nil))

(def nordnet-adapter (atom nil))

;(def db (PostgresAdapter.))

;(def nordnet (NordnetEtradeAdapter.))
;(def nordnet (DemoEtradeAdapter.))

(def factory (ElmChartsFactory.))

(def factory-weeks (ElmChartsWeekFactory.))

(def factory-months (ElmChartsMonthFactory.))

(def tix-m
  (memoize
   (fn []
     (let [t (map hu/bean->json (.stockTickers @db-adapter))]
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
        prices (.prices @db-adapter oid)
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
        items (.puts @nordnet-adapter oid)]
    (hu/om->json items)))

(defn calls [request]
  (let [oid (req-oid request)
        items (.calls @nordnet-adapter oid)]
    (hu/om->json items)))

(defn critter-purchases [request]
  (let [ptypes (get-in request [:path-params :ptype])
        ptype (cu/rs ptypes)
        items (.activePurchasesWithCritters @db-adapter ptype)
        result (map #(OptionPurchaseDTO. %) items)]
    (hu/om->json result)))

(def demo-req
  {:path-params {:ptype 11 :oid 1}})

;; (defn echo
;;   {:name ::echo
;;    :enter
;;    (fn [context]
;;      (let [request (:request context)
;;            response (hu/json-response request)]
;;        (assoc context :response response)))
;;    :error
;;    (fn [context ex-info]
;;      (prn ex-info)
;;      (assoc context :response {:status 400 :body "invalid"}))})

;; (defn demo []
;;   (.calcRiscStockprices nordnet
;;                         "2"
;;                         ({"ticker" "EQNR1", "risc" 2.3} {"ticker" "EQNR2", "risc" 2.9} {"ticker" "EQNR3", "risc" 1.75})))

(defn risclines [request]
  (let [oid (req-oid request)]
    (hu/om->json (.riscLines @nordnet-adapter oid))))

(defn calcoptionprice [request]
  (let [ticker (get-in request [:path-params :ticker])
        sp (cu/rs (get-in request [:path-params :stockprice]))
        price (.calcRiscOptionPrice @nordnet-adapter ticker sp)]
    (hu/json-response {:value price})))

(def calcriscstockprices
  (pu/default-json-response ::calcriscstockprices 200
                            (fn [body req]
                              (let [oid (req-oid req)]
                                (.calcRiscStockprices @nordnet-adapter oid body)))))

(def purchaseoption
  (pu/default-json-response ::purchaseoption 201
                            (fn [body _]
                              (.purchaseOption @db-adapter body))))

(def regpuroption
  (pu/default-json-response ::regpuroption 201
                            (fn [body _]
                              (.registerAndPurchaseOption @db-adapter body))))
