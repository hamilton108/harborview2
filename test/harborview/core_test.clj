(ns harborview.core-test
  (:require
   [clojure.test :refer :all]
   [harborview.maunaloa.core :as c])
  (:import
   [java.time LocalDate]
   [harborview.maunaloa.charts ElmChartsFactory]
   [critterrepos.beans StockPriceBean]))

(comment
  (defn sp [y m d cls]
    (let [dx (LocalDate/of y m d)
          hi (* cls 1.05)
          lo (* cls 0.97)
          opn (* cls 0.98)]
      (StockPriceBean. dx opn hi lo cls 1000)))

  (def prices
    [(sp 2019 9 16 100.0)
     (sp 2019 9 17 102.0)
     (sp 2019 9 18 101.0)
     (sp 2019 9 19 100.0)
     (sp 2019 9 20 98.0)

     (sp 2019 9 23 100.0)
     (sp 2019 9 24 102.0)
     (sp 2019 9 25 105.0)
     (sp 2019 9 26 103.0)
     (sp 2019 9 27 103.5)

     (sp 2020 1 2 102.0)
     (sp 2020 1 3 101.5)

     (sp 2020 1 6 100.0)
     (sp 2020 1 7 98.5)
     (sp 2020 1 8 97.0)
     (sp 2020 1 9 95.5)
     (sp 2020 1 10 96.0)

     (sp 2020 1 20 94.0)
     (sp 2020 1 21 97.0)
     (sp 2020 1 22 98.0)
     (sp 2020 1 23 97.0)
     (sp 2020 1 24 96.0)

     (sp 2020 3 23 93.0)
     (sp 2020 3 24 95.0)
     (sp 2020 3 25 94.5)
     (sp 2020 3 26 97.0)
     (sp 2020 3 27 99.0)

     (sp 2021 1 4 102.0)
     (sp 2021 1 5 101.0)
     (sp 2021 1 6 103.0)
     (sp 2021 1 7 105.0)
     (sp 2021 1 8 108.0)

     (sp 2021 1 18 109.0)
     (sp 2021 1 19 112.0)
     (sp 2021 1 20 110.0)
     (sp 2021 1 21 109.0)
     (sp 2021 1 22 108.0)

     (sp 2021 5 3 112.0)
     (sp 2021 5 4 115.0)
     (sp 2021 5 5 118.0)
     (sp 2021 5 6 117.0)
     (sp 2021 5 7 120.0)])

  ;count: 42


  (deftest pricesToWeeks
    (let [py (c/prices->weeks prices)
          opn (map #(.getOpn %) py)
          hi (map #(.getHi %) py)
          lo (map #(.getLo %) py)
          cls (map #(.getCls %) py)
          vol (map #(.getVolume %) py)]
      (testing "Transform daily prices to weekly prices"
        (is (= 9 (count py))))
      (testing "Volume"
        (is (= [5000 5000 2000 5000 5000 5000 5000 5000 5000] vol)))
      (testing "Opening prices"
        (is (= [100.0 100.0 102.0 100.0 94.0 93.0 102.0 109.0 112.0] opn)))
      (testing "Highest prices"
        (is (= [102.0 105.0 102.0 100.0 98.0 99.0 108.0 112.0 120.0] hi)))
      (testing "Lowest prices"
        (is (= [98.0 100.0 101.5 95.5 94.0 93.0 101.0 108.0 112.0] lo)))
      (testing "Closing prices"
        (is (= [98.0 103.5 101.5 96.0 96.0 99.0 108.0 108.0 120.0] cls))))))