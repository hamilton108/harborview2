package harborview.dto.html;

import oahu.financial.StockPrice;

import com.fasterxml.jackson.annotation.JsonGetter;

public class Candlestick {
    private final double o;
    private final double h;
    private final double l;
    private final double c;

    public Candlestick(StockPrice price) {
        o = price.getOpn();
        h = price.getHi();
        l = price.getLo();
        c = price.getCls();
    }

    @JsonGetter("o")
    public double getO() {
        return o;
    }

    @JsonGetter("h")
    public double getH() {
        return h;
    }

    @JsonGetter("l")
    public double getL() {
        return l;
    }

    @JsonGetter("c")
    public double getC() {
        return c;
    }
}
