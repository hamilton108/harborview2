(ns harborview.maunaloa.tests
  (:require
   [clojure.test :refer [deftest is]]
   [harborview.commonutils :refer [find-first close-to]]
   [harborview.maunaloa.config :as config]
   [harborview.maunaloa.ports :as ports]
   [harborview.maunaloa.adapter.nordnetadapter :as n])
  (:import
   (oahu.dto Tuple3)
   (critter.util StockOptionUtil)
   (vega.financial StockOption$OptionType)))

(def ctx (config/get-context :test))


(def test-stock {:h 458.9, :l 450.6, :c 452.6, :o 452.0, :unix-time 1677062640000})

(def test-calls
  {:stock-price test-stock
   :opx [{:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A528.02X", :days 117, :ivSell 0.1375, :sell 0.6, :buy 0.0, :ivBuy 0.05, :ot 1, :x 528.02}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A518.24X", :days 117, :ivSell 0.125, :sell 0.6, :buy 0.0, :ivBuy 0.05, :ot 1, :x 518.24}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A508.46X", :days 117, :ivSell 0.10625000000000001, :sell 0.6, :buy 0.0, :ivBuy 0.05, :ot 1, :x 508.46}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A498.68X", :days 117, :ivSell 0.09062500000000001, :sell 0.6, :buy 0.0, :ivBuy 0.05, :ot 1, :x 498.68}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A488.90X", :days 117, :ivSell 0.07187500000000001, :sell 0.6, :buy 0.0, :ivBuy 0.025, :ot 1, :x 488.9}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A479.13X", :days 117, :ivSell 0.053125000000000006, :sell 0.6, :buy 0.01, :ivBuy 0.025, :ot 1, :x 479.13}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A469.35X", :days 117, :ivSell 0.0328125, :sell 0.6, :buy 0.01, :ivBuy 0.0125, :ot 1, :x 469.35}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A459.57X", :days 117, :ivSell 0.01484375, :sell 1.7, :buy 1.1, :ivBuy 0.009375000000000001, :ot 1, :x 459.57}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A449.79X", :days 117, :ivSell -1.0, :sell 6.0, :buy 4.8, :ivBuy -1.0, :ot 1, :x 449.79}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A440.01X", :days 117, :ivSell -1.0, :sell 14.0, :buy 12.25, :ivBuy -1.0, :ot 1, :x 440.01}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A430.24X", :days 117, :ivSell -1.0, :sell 23.75, :buy 21.25, :ivBuy -1.0, :ot 1, :x 430.24}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A420.46X", :days 117, :ivSell -1.0, :sell 33.5, :buy 30.5, :ivBuy -1.0, :ot 1, :x 420.46}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A410.68X", :days 117, :ivSell -1.0, :sell 43.25, :buy 40.25, :ivBuy -1.0, :ot 1, :x 410.68}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A400.90X", :days 117, :ivSell -1.0, :sell 53.0, :buy 50.0, :ivBuy -1.0, :ot 1, :x 400.9}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A391.12X", :days 117, :ivSell -1.0, :sell 63.0, :buy 60.0, :ivBuy -1.0, :ot 1, :x 391.12}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A386.23X", :days 117, :ivSell -1.0, :sell 67.75, :buy 64.75, :ivBuy -1.0, :ot 1, :x 386.23}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A381.35X", :days 117, :ivSell -1.0, :sell 72.75, :buy 69.75, :ivBuy -1.0, :ot 1, :x 381.35}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A376.46X", :days 117, :ivSell -1.0, :sell 77.5, :buy 74.5, :ivBuy -1.0, :ot 1, :x 376.46}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A371.57X", :days 117, :ivSell -1.0, :sell 82.5, :buy 79.5, :ivBuy -1.0, :ot 1, :x 371.57}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A366.68X", :days 117, :ivSell -1.0, :sell 87.25, :buy 84.25, :ivBuy -1.0, :ot 1, :x 366.68}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3A361.79X", :days 117, :ivSell -1.0, :sell 92.25, :buy 89.25, :ivBuy -1.0, :ot 1, :x 361.79}]})
(def test-puts
  {:stock-price test-stock
   :opx [{:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M528.02X", :days 117, :ivSell 0.3046875, :sell 77.0, :buy 74.0, :ivBuy -1.0, :ot 2, :x 528.02}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M518.24X", :days 117, :ivSell 0.2796875, :sell 67.25, :buy 64.25, :ivBuy -1.0, :ot 2, :x 518.24}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M508.46X", :days 117, :ivSell 0.253125, :sell 57.5, :buy 54.5, :ivBuy -1.0, :ot 2, :x 508.46}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M498.68X", :days 117, :ivSell 0.22578125, :sell 47.75, :buy 44.75, :ivBuy -1.0, :ot 2, :x 498.68}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M488.90X", :days 117, :ivSell 0.19609375, :sell 38.0, :buy 35.0, :ivBuy -1.0, :ot 2, :x 488.9}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M479.13X", :days 117, :ivSell 0.15937500000000004, :sell 27.75, :buy 25.25, :ivBuy -1.0, :ot 2, :x 479.13}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M469.35X", :days 117, :ivSell 0.121875, :sell 17.75, :buy 16.0, :ivBuy -1.0, :ot 2, :x 469.35}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M459.57X", :days 117, :ivSell 0.08750000000000001, :sell 8.75, :buy 7.6, :ivBuy 0.07578125000000001, :ot 2, :x 459.57}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M449.79X", :days 117, :ivSell 0.0703125, :sell 3.2, :buy 2.0, :ivBuy 0.05625, :ot 2, :x 449.79}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M440.01X", :days 117, :ivSell 0.059375, :sell 0.7, :buy 0.1, :ivBuy 0.037500000000000006, :ot 2, :x 440.01}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M430.24X", :days 117, :ivSell 0.07812500000000001, :sell 0.6, :buy 0.01, :ivBuy 0.05, :ot 2, :x 430.24}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M420.46X", :days 117, :ivSell 0.1, :sell 0.6, :buy 0.0, :ivBuy 0.05, :ot 2, :x 420.46}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M410.68X", :days 117, :ivSell 0.121875, :sell 0.6, :buy 0.0, :ivBuy 0.05, :ot 2, :x 410.68}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M400.90X", :days 117, :ivSell 0.14375000000000002, :sell 0.6, :buy 0.0, :ivBuy 0.05, :ot 2, :x 400.9}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M391.12X", :days 117, :ivSell 0.16250000000000003, :sell 0.6, :buy 0.0, :ivBuy 0.1, :ot 2, :x 391.12}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M386.23X", :days 117, :ivSell 0.17500000000000002, :sell 0.6, :buy 0.0, :ivBuy 0.1, :ot 2, :x 386.23}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M381.35X", :days 117, :ivSell 0.18125000000000002, :sell 0.6, :buy 0.0, :ivBuy 0.1, :ot 2, :x 381.35}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M376.46X", :days 117, :ivSell 0.19375, :sell 0.6, :buy 0.0, :ivBuy 0.1, :ot 2, :x 376.46}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M371.57X", :days 117, :ivSell 0.20625000000000002, :sell 0.6, :buy 0.0, :ivBuy 0.1, :ot 2, :x 371.57}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M366.68X", :days 117, :ivSell 0.21250000000000002, :sell 0.6, :buy 0.0, :ivBuy 0.1, :ot 2, :x 366.68}
         {:brEven 0.0, :expiry "2023-01-20", :ticker "YAR3M361.79X", :days 117, :ivSell 0.225, :sell 0.6, :buy 0.0, :ivBuy 0.1, :ot 2, :x 361.79}]})

(defn test-options []
  (let [s (:stock-price test-calls)
        options (concat (:opx test-calls) (:opx test-puts))]
    {:stock-price s
     :opx options}))

(defn find-ticker [s coll]
  (find-first #(= (:ticker %) s) coll))

(defn mock-find-option-json []
  (let [opx (:opx (test-options))]
    (fn [ticker]
      (if-let [result (find-ticker ticker opx)]
        (do
          (prn "TICKER: " ticker)
          (prn "RESULT : " result)
          (prn "TEST-STOCK: " test-stock)
          {:stock-price test-stock :option result})
        nil))))

(defrecord TestNordnetEtradeAdapter [ctx]
  ports/Etrade
  (calls [_ oid]
    test-calls)
  (puts [_ oid]
    test-puts)
  (stockPrice [_ s]
    (:stock-price test-calls))
  (stockOptionPrice [_ s])
  (calcRiscStockprices [_ riscs]
    (map (partial n/calc-risc-stockprice 3 (mock-find-option-json)) riscs))
  (calcRiscOptionPrice [_ ticker price]
    (let [o (find-ticker ticker (:opx test-puts))]
      (prn o)
      (n/calc-option-price o price)))
  (invalidateRiscs [_]
    (n/invalidate-riscs))
  (riscLines [_ oid]
    (n/risc-lines oid)))

(def sut (TestNordnetEtradeAdapter. ctx))

(deftest util-should-detect-correct-option-type
  (let [call "YAR3A518.24X"
        put "YAR3M528.02X"
        ^Tuple3 info-call (StockOptionUtil/stockOptionInfoFromTicker call)
        ^Tuple3 info-put (StockOptionUtil/stockOptionInfoFromTicker put)]
    (is (= StockOption$OptionType/CALL (.third info-call)))
    (is (= StockOption$OptionType/PUT (.third info-put)))))

;------------------------------------------------------


(deftest yar-calc-risc-stockprices
  (do (.invalidateRiscs sut)
      (let [riscs [{:ticker "YAR3M440.01X" :risc 0.2}
                   {:ticker "YAR3F510" :risc 2.0}
                   {:ticker "YAR3F470" :risc 6.25}]
            calculated (.calcRiscStockprices sut riscs)
            yar-1 (find-ticker "YAR3M440.01X" calculated)
            yar-2 (find-ticker "YAR3F510" calculated)
            yar-3 (find-ticker "YAR3F470" calculated)
            rlines (.riscLines sut 3)]
        (is (= (count calculated) 3))
        (prn yar-1)
        (prn rlines)
        (is (= (:status yar-1) 1))
        (is (close-to (:stockprice yar-1) 444.6 0.5))
        (is (= (:status yar-2) 4))
        (is (= (:status yar-3) 4))
        (is (= (count rlines) 1))
        (let [rline (nth rlines 0)]
          (is (close-to (:bid rline) 0.1 0.01))
          (is (close-to (:ask rline) 0.7 0.01))
          (is (close-to (:riscOptionPrice rline) 0.5 0.01))
          (is (close-to (:riscStockPrice rline) 444.6 0.1))
          (is (close-to (:be rline) 442.9 0.1))))))

(deftest yar-calc-risc-option-price
  (let [ticker "YAR3M361.79X"
        price 350.0
        option-price (.calcRiscOptionPrice sut ticker price)]
    (is (close-to option-price 11.4 0.5))))


    ;; (let [yar_550 (find-ticker 550 calculated)    ; 487.4 ->  473.5   (0.85 (0.806) / 1.25 (1.295) ->  0.2 (0.289) )     - iv buy: 0.2875, iv sell: 0.31875
    ;;       yar_510 (find-ticker 510 calculated)    ; 487.4 ->    (6.0/6.9 -> )       - iv buy: 0.28125, iv sell: 0.30312
    ;;       yar_470 (find-ticker 470 calculated)]   ; 487.4 ->    (24.25/26.25 -> )   - iv buy: 0.2640625, iv sell: 0.3125
    ;;   (prn yar_550 yar_510 yar_470)
    ;;   (is (= (.size (n/get-riscs 3)) 3))
    ;;   (is (close-to (:stockprice yar_550) 468.5 0.5))
    ;;   (is (close-to (:stockprice yar_510) 483.6 0.5))
    ;;   (is (close-to (:stockprice yar_470) 481.5 0.5)))
    ;; (let [risc-lines (.riscLines sut 3)]
    ;;   (is (= (count risc-lines) 3)))
    ;; (.invalidateRiscs sut)))

;; (deftest yar-calc-risc-optionprice
;;   (let [^StockOptionPrice o (.stockOptionPrice sut "YAR2F470")]
;;     (is (not-nil? o))
;;     ;(comment "Buy: " (.getBuy o) ", sell: " (.getSell o) ", stock price: "  (-> o .getStockPrice .getCls))
;;     (let [risc (.riscStockPrice o 480.0)]
;;       (is (.isPresent risc))
;;       (is (close-to (-> risc .get .getOptionPrice) 19.1 0.2))
;;       (.invalidateRiscs sut))))

;; (deftest yar-risc-repos
;;   (is (= (.size (n/get-riscs 3)) 0))
;;   (is (= (.size (n/get-riscs 1)) 0))
;;   (let [tik-yar "YAR2F470"
;;         tik-yar-2 "YAR2F510"
;;         stock-opt-price (.yar (:factory ctx) tik-yar 470.0 26.25 24.25 487.4)
;;         demo-risc (StockOptionRisc. 487.4 24.25 stock-opt-price)
;;         stock-opt-price-2 (.yar (:factory ctx) tik-yar-2 510.0 1.25 1.295 487.4)
;;         demo-risc-2 (StockOptionRisc. 487.4 1.25 stock-opt-price-2)]
;;     (is (nil? (n/get-risc tik-yar)))
;;     (n/update-risc demo-risc)
;;     (is (not-nil? (n/get-risc tik-yar)))
;;     (let [cur-riscs (n/get-riscs 3)]
;;       (is (= (.size cur-riscs) 1))
;;       (is (not-nil? (cur-riscs tik-yar))))
;;     (n/update-risc demo-risc-2)
;;     (let [cur-riscs (n/get-riscs 3)]
;;       (is (= (.size cur-riscs) 2))
;;       (is (not-nil? (cur-riscs tik-yar-2)))))
;;   (.invalidateRiscs sut))