package harborview.factory;

import critter.stock.Stock;
import critter.stock.StockPrice;
import critter.stockoption.StockOption;
import critter.stockoption.StockOptionPrice;
import critter.util.StockOptionUtil;
import vega.financial.calculator.BlackScholes;
import vega.financial.calculator.OptionCalculator;

public class StockMarketFactory {
    private final StockOptionUtil util;
    private final OptionCalculator optionCalculator = new BlackScholes();
    public StockMarketFactory(StockOptionUtil stockOptionUtil) {
        util = stockOptionUtil;
    }
    public Stock createStock(int oid) {
        var result = new Stock();
        result.setOid(oid);
        switch (oid) {
            case 1:
                result.setCompanyName("Norsk Hydro");
                result.setTicker("NHY");
                break;
            case 2:
                result.setCompanyName("Equinor");
                result.setTicker("EQNR");
                break;
            case 3:
                result.setCompanyName("Yara");
                result.setTicker("YAR");
                break;
        }
        return result;
    }
    public StockPrice createStockPrice(int oid,
                                          double opn,
                                          double hi,
                                          double lo,
                                          double cls) {
        var result = new StockPrice();

        var stock = createStock(oid);

        result.setOpn(opn);
        result.setHi(hi);
        result.setLo(lo);
        result.setCls(cls);
        result.setStock(stock);
        result.setVolume(1000);
        result.setLocalDx(util.getCurrentDate());

        return result;
    }

    public StockOption createStockOption(String ticker,
                                         double x,
                                         StockOption.OptionType optionType,
                                         StockPrice stockPrice) {

        StockOption so = new StockOption();
        so.setTicker(ticker);
        so.setLifeCycle(StockOption.LifeCycle.FROM_HTML);
        so.setOpType(optionType);
        so.setX(x);
        so.setStockOptionUtil(util);
        so.setStock(stockPrice.getStock());
        return so;
    }

    public StockOptionPrice createStockOptionPrice(StockOption stockOption,
                                                   StockPrice stockPrice,
                                                   double bid,
                                                   double ask,
                                                   OptionCalculator optionCalculator) {

        StockOptionPrice price = new StockOptionPrice();
        price.setStockOption(stockOption);
        price.setStockPrice(stockPrice);
        price.setBuy(bid);
        price.setSell(ask);
        price.setCalculator(optionCalculator);
        return price;
    }

    public StockOptionPrice nhy() {
        StockPrice sp = createStockPrice(1, 69.52, 71.9, 68.94, 70.98);
        StockOption opt = createStockOption("NHY2L58", 58.0,
                                                StockOption.OptionType.CALL, sp);
        StockOptionPrice price = createStockOptionPrice(opt, sp, 16.00, 18.00, optionCalculator);
        return price;
    }
}
