package harborview.dto.html.options;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import critterrepos.beans.options.OptionPurchaseBean;
import oahu.exceptions.BinarySearchException;
import oahu.financial.OptionCalculator;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OptionPurchaseWithSalesDTO {

    private final OptionPurchaseBean purchase;
    private final OptionCalculator calculator;

    public OptionPurchaseWithSalesDTO(OptionPurchaseBean purchase,
                                      OptionCalculator calculator) {
        this.purchase = purchase;
        this.calculator = calculator;
    }

    public int getOid() {
        return purchase.getOid();
    }
    public String getStock() {
        return purchase.getTicker();
    }
    public String getOt() {
        return purchase.getOptionType();
    }
    public String getTicker() {
        return purchase.getOptionName();
    }

    @JsonGetter("pdate")
    public String getPurchaseDate() {
        return toString(purchase.getLocalDx());
    }
    public String getExp() {
        return toString(purchase.getExpiry());
    }
    public long getDays() {
        return getDaysCached();
    }
    public double getPrice() {
        return purchase.getPrice();
    }
    public double getBid() {
        return purchase.getBuyAtPurchase();
    }
    public double getSpot() {
        return purchase.getSpotAtPurchase();
    }

    @JsonGetter("pvol")
    public long getPurchaseVolume() {
        return purchase.getVolume();
    }

    @JsonGetter("svol")
    public long getVolumeSold() {
        return purchase.volumeSold();
    }
    /*
    public double getIv() {
        try {
            var t = getDaysCached() / 365.0;
            var iv = purchase.getOptionType().equals("c") ?
                    calculator.ivCall(getSpot(), purchase.getX(), t, getBid()) :
                    calculator.ivPut(getSpot(), purchase.getX(), t, getBid());
            return doubleToDecimal(iv);
        }
        catch (BinarySearchException ex) {
            return -1.0;
        }
    }
     */

    @JsonIgnore
    private String toString(LocalDate ld) {
        return String.format("%d-%d-%d", ld.getYear(), ld.getMonthValue(), ld.getDayOfMonth());
    }

    /*
    @JsonIgnore
    private double doubleToDecimal(double v) {
        return (Math.round(v * 1000.0)) / 1000.0;
    }
     */
    private long days = -1;
    @JsonIgnore
    private long getDaysCached() {
        if (days < 0.0) {
            var d0 = purchase.getLocalDx();
            var d1 = purchase.getExpiry();
            days = ChronoUnit.DAYS.between(d0, d1);
        }
        return days;
    }
}
