package harborview.dto.html.options;

import com.fasterxml.jackson.annotation.JsonIgnore;
import critterrepos.utils.DateUtils;
import oahu.financial.StockOption;
import oahu.financial.StockOptionPrice;
import oahu.financial.StockPrice;

import java.time.LocalDate;
import java.util.Optional;

public class OptionDTO {
    private final StockOptionPrice price;

    public OptionDTO(StockOptionPrice price) {
        this.price = price;
    }

    @JsonIgnore
    public StockPrice getStockPrice() {
        return price.getStockPrice();
    }

    @JsonIgnore
    public StockOptionPrice getStockOptionPrice() {
        return price;
    }

    @JsonIgnore
    public boolean isCall() {
        return price.getDerivative().getOpType() == StockOption.OptionType.CALL;
    }

    public String getTicker() {
        return price.getTicker();
    }

    public double getX() {
        return price.getDerivative().getX();
    }

    public double getDays() {
        return price.getDays();
    }

    public double getBuy() {
        return price.getBuy();
    }

    public double getSell() {
        return price.getSell();
    }

    public String getExpiry() {
        LocalDate ld = price.getDerivative().getExpiry();
        return DateUtils.localDateToStr(ld);
    }


    private double getIv(boolean isBuy) {
        Optional<Double> iv = isBuy ? price.getIvBuy() : price.getIvSell();
        return iv.orElse(0.0);
    }
    public double getIvBuy() {
        return getIv(true);
    }

    public double getIvSell() {
        return getIv(false);
    }

    public double getBrEven() {
        return price.getBreakEven().orElse(0.0);
    }
}
