package harborview.dto.html.critters;

import critterrepos.beans.critters.CritterBean;
import critterrepos.beans.options.OptionPurchaseBean;
import oahu.financial.OptionPurchase;
import oahu.financial.critters.Critter;

import java.util.ArrayList;
import java.util.List;

public class OptionPurchaseDTO {
    private final OptionPurchase purchase;

    public OptionPurchaseDTO(OptionPurchase purchase) {
        this.purchase = purchase;
    }

    public int getOid() {
        return purchase.getOid();
    }

    public String getTicker() {
        return purchase.getOptionName();
    }

    public List<CritterDTO> getCritters()  {
        List<CritterDTO> result = new ArrayList<>();
        OptionPurchaseBean bean = (OptionPurchaseBean)purchase;
        for (Critter critter : bean.getCritters()) {
            result.add(new CritterDTO(getOid(), critter));
        }
        return result;
    }

}
