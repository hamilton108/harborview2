(ns harborview.maunaloa.ports
  (:gen-class))

(defprotocol MaunaloaDB
  (tickers [this])
  (prices [this oid]))


