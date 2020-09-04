package harborview.maunaloa.charts;

import critterrepos.beans.StockPriceBean;
import harborview.dto.html.ElmCharts;
import harborview.maunaloa.charts.ElmChartsFactory;
import oahu.financial.StockPrice;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.IsoFields;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class ElmChartsWeekFactory extends ElmChartsFactory {
    @Override
    public ElmCharts elmCharts(Collection<StockPrice> prices) {
        Map<Integer, Map<Integer, List<StockPrice>>> mx =
                prices.stream()
                        .collect(Collectors.groupingBy(s -> s.getLocalDx().getYear(),
                                Collectors.groupingBy(this::extractWeek)));

        Map<Integer, Map<Integer, List<StockPrice>>> tmx = new TreeMap<>(mx);

        List<StockPrice> pricesByWeek = new ArrayList<>();

        for (Map.Entry<Integer, Map<Integer, List<StockPrice>>> entry : tmx.entrySet()) {
            Map<Integer, List<StockPrice>> curMap = entry.getValue();
            IntStream.range(1,54).forEach(r -> {
                List<StockPrice> curWeekPrices = curMap.get(r);
                if (curWeekPrices != null) {
                    pricesByWeek.add(weekToStockPrice(curWeekPrices));
                }
            });
        }

        return super.elmCharts(pricesByWeek);
    }

    private StockPrice weekToStockPrice(List<StockPrice> weeklyPrices) {
        int sz = weeklyPrices.size();
        StockPrice firstPrice = weeklyPrices.get(0);
        if (sz == 1) {
            return firstPrice;
        }
        LocalDate dx = firstPrice.getLocalDx();
        LocalDate monday = dx.getDayOfWeek().equals(DayOfWeek.MONDAY) ? dx : dx.with(DayOfWeek.MONDAY);

        double open = firstPrice.getCls();
        double close = weeklyPrices.get(weeklyPrices.size()-1).getCls();
        Optional<StockPrice> spHi = weeklyPrices.stream().max(Comparator.comparingDouble(StockPrice::getCls));
        Optional<StockPrice> spLo = weeklyPrices.stream().min(Comparator.comparingDouble(StockPrice::getCls));

        double hi = spHi.map(StockPrice::getCls).orElseGet(() -> Double.max(open, close));
        double lo = spLo.map(StockPrice::getCls).orElseGet(() -> Double.min(open, close));

        long sumTotal = weeklyPrices.stream().mapToLong(StockPrice::getVolume).sum();
        return new StockPriceBean(monday,open,hi,lo,close,sumTotal);
    }
    private int extractWeek(StockPrice price) {
        LocalDate dx = price.getLocalDx();
        return dx.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
    }
}
