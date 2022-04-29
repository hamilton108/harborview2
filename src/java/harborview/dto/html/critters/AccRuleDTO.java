package harborview.dto.html.critters;

import critter.critterrule.AcceptRule;

import java.util.List;

public class AccRuleDTO {
    private final int purchaseId;
    private final int critId;
    private final AcceptRule accRule;
    public AccRuleDTO(int purchaseId, int critId, AcceptRule accRule) {
        this.accRule = accRule;
        this.purchaseId = purchaseId;
        this.critId = critId;
    }
    public int getOid() {
        return accRule.getOid();
    }
    public int getPid() {
        return purchaseId;
    }
    public int getCid() {
        return critId;
    }

    public int getRtyp() {
        return accRule.getRtyp();
    }
    public double getValue() {
        return accRule.getAccValue();
    }
    public boolean getActive() {
        return accRule.getActive().equals("y");
    }
    public List<DenyRuleDTO> getDnyRules() {
        return null;
    }

}
