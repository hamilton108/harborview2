package harborview.dto.html;

import oahu.financial.StockPrice;

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
}
