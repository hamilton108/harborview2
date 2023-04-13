(ns harborview.maunaloa.core
  (:gen-class)
  (:require
   [harborview.maunaloa.adapter.dbadapter] ; :refer (->Postgres)]
   [harborview.maunaloa.adapter.nordnetadapter]
   [harborview.htmlutils :as hu]
   [harborview.commonutils :as cu]
   [harborview.pedestalutils :as pu])
  (:import
   (vega.financial.calculator BlackScholes)
   (harborview.dto.html.critters OptionPurchaseDTO)
   (harborview.dto.html.options OptionPurchaseWithSalesDTO)
   (harborview.maunaloa.charts
    ElmChartsFactory ElmChartsWeekFactory ElmChartsMonthFactory)))

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

;; (comment ok [body]
;;          {:status 200 :body body
;;           :headers {"Content-Type" "application/json"}})

(defn tix [request]
  (tix-m))

(defn req-oid [request & {:keys [do-cast] :or {do-cast true}}]
  (let [oid (get-in request [:path-params :oid])]
    (if (= do-cast true)
      (cu/rs oid)
      oid)))

(defn charts [request ^ElmChartsFactory factory]
  (let [oid (req-oid request)
        prices (.prices @db-adapter oid)]
    (.elmCharts factory (str oid) prices)))

(def critter-purchases
  (pu/default-json-response ::critterpurchases 200
                            (fn [_ req]
                              (let [ptypes (get-in req [:path-params :ptype])
                                    ptype (cu/rs ptypes)
                                    items (.activePurchasesWithCritters @db-adapter ptype)]
                                (map #(OptionPurchaseDTO. %) items)))))

(def risclines
  (pu/default-json-response ::risclines 200
                            (fn [_ req]
                              (let [oid (req-oid req)]
                                (.riscLines @nordnet-adapter oid)))
                            :om-json false))

(def fetch-optionpurchases
  (pu/default-json-response ::fetchoptionpurchases 200
                            (fn [_ req]
                              (let [ptype (cu/rs (get-in req [:path-params :ptype]))
                                    purchases (.stockOptionPurchases @db-adapter ptype 1)]
                                (map #(OptionPurchaseWithSalesDTO. % calculator) purchases)))))

(def days
  (pu/default-json-response ::days 200
                            (fn [_ req]
                              (charts req factory))))

(def weeks
  (pu/default-json-response ::weeks 200
                            (fn [_ req]
                              (charts req factory-weeks))))

(def months
  (pu/default-json-response ::months 200
                            (fn [_ req]
                              (charts req factory-months))))

(def calls
  (pu/redirect-json-response ::calls
                             (fn [req]
                               (let [oid (req-oid req :do-cast false)]
                                 (.calls @nordnet-adapter oid)))))

(def puts
  (pu/redirect-json-response ::puts
                             (fn [req]
                               (let [oid (req-oid req :do-cast false)]
                                 (.puts @nordnet-adapter oid)))))

(def calcoptionprice
  (pu/default-json-response ::calcoptionprice 200
                            (fn [_ req]
                              (let [ticker (get-in req [:path-params :ticker])
                                    sp (cu/rs (get-in req [:path-params :stockprice]))
                                    price (.calcRiscOptionPrice @nordnet-adapter ticker sp)]
                                {:value price}))
                            :om-json false))

(def calcriscstockprices
  (pu/default-json-response ::calcriscstockprices 200
                            (fn [body req]
                              (prn "body: " body ", req: " req)
                              (.calcRiscStockprices @nordnet-adapter body))
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


;; (comment check-implied-vol [ox]
;;          (if (= (.isPresent (.getIvBuy ox)) true)
;;            (if (= (.isPresent (.getIvSell ox)) true)
;;              true
;;              false)
;;            false))

;; (comment valid? [ox]
;;          (if (> (.getBuy ox) 0)
;;            (if (> (.getSell ox) 0)
;;              (if (= (check-implied-vol ox) true)
;;                (.isPresent (.getBreakEven ox)))
;;              false)
;;            false))

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
