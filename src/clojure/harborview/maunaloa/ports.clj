(ns harborview.maunaloa.ports
  (:gen-class))

(defprotocol MaunaloaDB
  (invalidateDB
    [this]
    [this oid])
  (stockTickers [this])
  (prices [this oid])
  (registerAndPurchaseOption [this json])
  (activePurchasesWithCritters [this json])
  (purchaseOption [this json]))

(defprotocol Etrade
  ;(calcStockPrices [this riscs])
  (invalidateEtrade
    [this]
    [this oid])
  (calls [this oid])
  (puts [this oid])
  (stockPrice [this oid])
  (calcRiscStockprices [this oid riscs])
  (calcRiscOptionPrice [this ticker stockPrice])
  (riscLines [this oid]))


; see -> https://puredanger.github.io/tech.puredanger.com/2014/01/03/clojure-dependency-injection/