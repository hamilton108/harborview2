package harborview.maunaloa.charts;

import critterrepos.beans.StockPriceBean;
import harborview.dto.html.ElmCharts;
import oahu.financial.StockPrice;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class ElmChartsMonthFactory extends ElmChartsFactory {
    @Override
    public int skipNum(int totalNum) {
        return 0;
    }
    @Override
    public ElmCharts elmCharts(Collection<StockPrice> prices) {
        Map<Integer, Map<Integer, List<StockPrice>>> tmx = treeMap(prices);
        List<StockPrice> byMonths = pricesByMonth(tmx);
        return super.elmCharts(byMonths);
    }

    List<StockPrice> pricesByMonth(Map<Integer, Map<Integer, List<StockPrice>>> treeMap) {
        List<StockPrice> result = new ArrayList<>();
        for (Map.Entry<Integer, Map<Integer, List<StockPrice>>> entry : treeMap.entrySet()) {
            Map<Integer, List<StockPrice>> curMap = entry.getValue();
            IntStream.range(1,12).forEach(r -> {
                List<StockPrice> curMonthPrices = curMap.get(r);
                if (curMonthPrices != null) {
                    result .add(monthToStockPrice(curMonthPrices));
                }
            });
        }
        return result;
    }
    Map<Integer, Map<Integer, List<StockPrice>>> treeMap(Collection<StockPrice> prices) {
        Map<Integer, Map<Integer, List<StockPrice>>> mx =
                prices.stream()
                        .collect(Collectors.groupingBy(s -> s.getLocalDx().getYear(),
                                Collectors.groupingBy(s -> s.getLocalDx().getMonth().getValue())));
        Map<Integer, Map<Integer, List<StockPrice>>> tmx = new TreeMap<>(mx);
        return tmx;
    }
    StockPrice monthToStockPrice(List<StockPrice> monthlyPrices) {
        if (monthlyPrices == null || monthlyPrices.size() == 0) {
            return new StockPriceBean(LocalDate.of(2019,1,1), 100,120,90, 110,1000000);
        }
        int sz = monthlyPrices.size();
        StockPrice firstPrice = monthlyPrices.get(0);
        if (sz == 1) {
            return firstPrice;
        }
        LocalDate dx = firstPrice.getLocalDx();
        //LocalDate monday = dx.getDayOfWeek().equals(DayOfWeek.MONDAY) ? dx : dx.with(DayOfWeek.MONDAY);
        LocalDate startDate = LocalDate.of(dx.getYear(), dx.getMonth(), 1);

        double open = firstPrice.getCls();
        double close = monthlyPrices.get(monthlyPrices.size()-1).getCls();
        Optional<StockPrice> spHi = monthlyPrices.stream().max(Comparator.comparingDouble(StockPrice::getCls));
        Optional<StockPrice> spLo = monthlyPrices.stream().min(Comparator.comparingDouble(StockPrice::getCls));

        double hi = spHi.map(StockPrice::getCls).orElseGet(() -> Double.max(open, close));
        double lo = spLo.map(StockPrice::getCls).orElseGet(() -> Double.min(open, close));

        long sumTotal = monthlyPrices.stream().mapToLong(StockPrice::getVolume).sum();
        return new StockPriceBean(startDate,open,hi,lo,close,sumTotal);
    }
}
