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
   (vega.financial.calculator BlackScholes)
   (harborview.dto.html.critters OptionPurchaseDTO)
   (harborview.dto.html.options OptionPurchaseWithSalesDTO)
   (harborview.maunaloa.charts
    ElmChartsFactory ElmChartsWeekFactory ElmChartsMonthFactory)
   (java.util ArrayList)
   (java.time.temporal IsoFields)
   (java.time LocalDate)))

(def calculator (BlackScholes.))

(def db-adapter (atom nil))

(def nordnet-adapter (atom nil))

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

(defn critter-purchases [request]
  (let [ptypes (get-in request [:path-params :ptype])
        ptype (cu/rs ptypes)
        items (.activePurchasesWithCritters @db-adapter ptype)
        result (map #(OptionPurchaseDTO. %) items)]
    (hu/om->json result)))

(defn risclines [request]
  (let [oid (req-oid request)]
    (hu/om->json (.riscLines @nordnet-adapter oid))))

(defn fetch-optionpurchases [request]
  (let [ptype (cu/rs (get-in request [:path-params :ptype]))
        purchases (.stockOptionPurchases @db-adapter ptype 1)
        purchases-json (map #(OptionPurchaseWithSalesDTO. % calculator) purchases)]
    (hu/om->json purchases-json)))

(defn charts [request ^ElmChartsFactory factory]
  (let [oid (req-oid request)
        prices (.prices @db-adapter oid)]
    (.elmCharts factory (str oid) prices)))

(def days
  (pu/default-json-response ::days 200
                            (fn [body req]
                              (charts req factory))))

(def weeks
  (pu/default-json-response ::weeks 200
                            (fn [body req]
                              (charts req factory-weeks))))

(def months
  (pu/default-json-response ::months 200
                            (fn [body req]
                              (charts req factory-months))))

(def calls
  (pu/default-json-response ::calls 200
                            (fn [body req]
                              (let [oid (req-oid req)]
                                (.calls @nordnet-adapter oid)))))

(def puts
  (pu/default-json-response ::puts 200
                            (fn [body req]
                              (let [oid (req-oid req)]
                                (.puts @nordnet-adapter oid)))))

(def calcoptionprice
  (pu/default-json-response ::calcoptionprice 200
                            (fn [body req]
                              (let [ticker (get-in req [:path-params :ticker])
                                    sp (cu/rs (get-in req [:path-params :stockprice]))
                                    price (.calcRiscOptionPrice @nordnet-adapter ticker sp)]
                                {:value price}))))

(def calcriscstockprices
  (pu/default-json-response ::calcriscstockprices 200
                            (fn [body req]
                              (let [oid (req-oid req)]
                                (.calcRiscStockprices @nordnet-adapter oid body)))
                            :om-json false))

(def purchaseoption
  (pu/default-json-response ::purchaseoption 201
                            (fn [body _]
                              (.purchaseOption @db-adapter body))
                            :om-json false))

(def regpuroption
  (pu/default-json-response ::regpuroption 201
                            (fn [body _]
                              (.registerAndPurchaseOption @db-adapter body))
                            :om-json false))

(def selloption
  (pu/default-json-response ::selloption 201
                            (fn [body _]
                              (.sellOption @db-adapter body))
                            :om-json false))

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
