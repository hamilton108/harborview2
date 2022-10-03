
(ns harborview.maunaloa.repository
  (:gen-class)
  (:import
   ;(java.util ArrayList)
   (java.util Optional)
   (critter.repos StockMarketRepository)
   ;(critter.stockoption StockOptionPrice StockOptionRisc)
   (vega.financial StockOption$OptionType)))

;(def stock-option-utils (StockOptionUtil. (LocalDate/of 2022 5 25)))

;(def  (StockMarketFactory. stock-option-utils))

(def stockmarket-repos-prod nil)

(defn stockmarket-repos-test [factory]
  (reify StockMarketRepository
    (findStock [this oid]
      (.createStock factory oid))
    (findStockOption [this stockOptInfo]
      (Optional/empty))
    (activePurchasesWithCritters [this purchaseType]
      ;Int -> List<StockOptionPurchase>
      [])
    (purchasesWithSalesAll [this purchaseType status optionType]
      ;Int -> Int -> StockOption.OptionType -> List<StockOptionPurchase> 
      [])))
