(ns harborview.maunaloa.ports
  (:gen-class))

(defprotocol MaunaloaDB
  (invalidateDB
    [this]
    [this oid])
  (tickers [this])
  (prices [this oid]))

(defprotocol Etrade
  ;(calcStockPrices [this riscs])
  (invalidateEtrade
    [this]
    [this oid])
  (calls [this oid])
  (puts [this oid])
  (stockPrice [this oid])
  (calcRiscStockprices [this oid riscs]))


