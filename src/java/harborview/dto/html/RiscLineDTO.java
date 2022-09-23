package harborview.dto.html;


import critter.stockoption.StockOptionRisc;

import java.util.Optional;

public class RiscLineDTO {
    private final StockOptionRisc risc;

    public RiscLineDTO(StockOptionRisc risc) {
        this.risc = risc;
    }

    public String getTicker() {
        return risc.getOptionTicker();
    }

    public double getBe() {
        Optional<Double> be = risc.getBreakEven();
        return be.isPresent() ? be.get() : 0;
    }

    public double getRiscStockPrice() {
        return risc.getStockPrice();
    }

    public double getRiscOptionPrice() {
        return risc.getOptionPrice();
    }

    public double getBid() {
        return risc.getBuy();
    }

    public double getAsk() {
        return risc.getSell();
    }

    public double getRisc() {
        return 0; //price.getCurrentRisc();
    }

}
