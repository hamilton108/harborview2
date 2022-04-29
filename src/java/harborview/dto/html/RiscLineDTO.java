package harborview.dto.html;


import critter.stockoption.StockOptionPrice;

import java.util.Optional;

public class RiscLineDTO {
    private final StockOptionPrice price;

    public RiscLineDTO(StockOptionPrice price) {
        this.price = price;
    }

    public String getTicker() {
        return price.getTicker();
    }

    public double getBe() {
        Optional<Double> be = price.getBreakEven();
        return be.isPresent() ? be.get() : 0;
    }

    public double getRiscStockPrice() {
        Optional<Double> p = price.getCurrentRiscStockPrice();
        return p.isPresent() ? p.get(): 0;
    }

    public double getRiscOptionPrice() {
        return price.getCurrentRiscOptionValue();
    }

    public double getBid() {
        return price.getBuy();
    }

    public double getAsk() {
        return price.getSell();
    }

    public double getRisc() {
        return price.getCurrentRisc();
    }

}
