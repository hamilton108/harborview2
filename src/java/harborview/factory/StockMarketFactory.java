package harborview.factory;

import critterrepos.beans.StockBean;
import critterrepos.beans.StockPriceBean;
import critterrepos.beans.options.StockOptionBean;
import critterrepos.beans.options.StockOptionPriceBean;
import critterrepos.utils.StockOptionUtils;
import oahu.financial.*;
import vega.financial.calculator.BlackScholes;

public class StockMarketFactory {
    private final StockOptionUtils utils;
    private final OptionCalculator optionCalculator = new BlackScholes();
    public StockMarketFactory(StockOptionUtils stockOptionUtils) {
        utils = stockOptionUtils;
    }
    public Stock createStock(int oid) {
        var result = new StockBean();
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
        var result = new StockPriceBean();

        var stock = createStock(oid);

        result.setOpn(opn);
        result.setHi(hi);
        result.setLo(lo);
        result.setCls(cls);
        result.setStock(stock);
        result.setVolume(1000);
        result.setLocalDx(utils.getCurrentDate());

        return result;
    }

    public StockOption createStockOption(String ticker,
                                                 double x,
                                                 StockOption.OptionType optionType,
                                                 StockPrice stockPrice) {

        StockOptionBean so = new StockOptionBean();
        so.setTicker(ticker);
        so.setLifeCycle(StockOption.LifeCycle.FROM_HTML);
        so.setOpType(optionType);
        so.setX(x);
        so.setStockOptionUtils(utils);
        so.setStock(stockPrice.getStock());
        return so;
    }

    public StockOptionPrice createStockOptionPrice(StockOption stockOption,
                                                   StockPrice stockPrice,
                                                   double bid,
                                                   double ask,
                                                   OptionCalculator optionCalculator) {

        StockOptionPriceBean price = new StockOptionPriceBean();
        price.setDerivative(stockOption);
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
