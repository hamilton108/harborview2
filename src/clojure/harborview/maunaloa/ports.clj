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
  (stockOptionPurchases [this ptype status])
  (purchaseOption [this json])
  (sellOption [this json]))

(defprotocol Etrade
  (invalidate
    [this]
    [this s])
  (calls [this s])
  (puts [this s])
  (stockPrice [this s])
  (stockOptionPrice [this s])
  (calcRiscStockprices [this s riscs])
  (calcRiscOptionPrice [this s price])
  (riscLines [this s]))


; see -> https://puredanger.github.io/tech.puredanger.com/2014/01/03/clojure-dependency-injection/