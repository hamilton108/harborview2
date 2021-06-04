package harborview.dto.html;

import com.fasterxml.jackson.annotation.JsonIgnore;
import critterrepos.utils.DateUtils;
import oahu.financial.StockPrice;

public class StockPriceDTO {
    private final double o;
    private final double h;
    private final double l;
    private final double c;
    private final long unixTime;

    private final StockPrice stockPrice;

    public StockPriceDTO(StockPrice stockPrice) {
        this.stockPrice = stockPrice;
        unixTime = DateUtils.unixTime(stockPrice.getLocalDx(), stockPrice.getTm());
        this.o = stockPrice.getOpn();
        this.h = stockPrice.getHi();
        this.l = stockPrice.getLo();
        this.c = stockPrice.getCls();
    }

    public double getO() {
        return o;
    }

    public double getH() {
        return h;
    }

    public double getL() {
        return l;
    }

    public double getC() {
        return c;
    }

    public long getUnixTime() {
        return unixTime;
    }

    @JsonIgnore
    public StockPrice getStockPrice() {
        return stockPrice;
    }
}
