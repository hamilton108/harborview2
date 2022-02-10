package harborview.dto.html.critters;

import critterrepos.beans.critters.AcceptRuleBean;
import critterrepos.beans.critters.CritterBean;
import oahu.financial.critters.Critter;

import java.util.ArrayList;
import java.util.List;

public class CritterDTO {
    private final CritterBean critter;
    private final int purchaseId;
    public CritterDTO(int purchaseId, Critter critter) {
        this.purchaseId = purchaseId;
        this.critter = (CritterBean)critter;
    }
    public int getOid() {
        return critter.getOid();
    }
    public int getVol() {
        return critter.getSellVolume();
    }
    public int getStatus() {
        return critter.getStatus();
    }
    public List<AccRuleDTO> getAccRules() {
        List<AccRuleDTO> result = new ArrayList<>();
        for (AcceptRuleBean accRule :  critter.getAcceptRules()) {
            result.add(new AccRuleDTO(purchaseId,getOid(),accRule));
        }
        return result;
    }
}
