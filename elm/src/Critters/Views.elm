module Critters.Views exposing
    ( accPart
    , critAccDenyTr
    , critAccTr
    , critterArea
    , critterPart
    , critterRows
    , denyPart
    , denyTr
    , details
    , purchaseToSelectItem
    , tableHeader
    , view
    )

import Common.Buttons as BTN
import Common.Html as CH
import Common.ModalDialog as DLG
import Common.Select as S
import Critters.Types
    exposing
        ( AccRule
        , AccRuleMsg(..)
        , Critter
        , CritterMsg(..)
        , DenyRule
        , DenyRuleMsg(..)
        , Model
        , Msg(..)
        , Oid(..)
        , OptionPurchase
        , OptionPurchases
        , RuleValue(..)
        , rtypDesc
        , rtypSelectItems
        )
import Html as H
import Html.Attributes as A
import Html.Events as E



{-
   <details><summary>[ 44 ] YAR8L240</summary>
       <table class="table">
           <thead>
           <tr>
               <th>Oid</th>
               <th>Sell volume</th>
               <th>Status</th>
               <th>-</th>
               <th>Acc.oid</th>
               <th>Rtyp</th>
               <th>Desc</th>
               <th>Value</th>
               <th>Active</th>
               <th>-</th>
               <th>Deny oid</th>
               <th>Rtyp</th>
               <th>Desc</th>
               <th>Value</th>
               <th>Active</th>
               <th>Memory</th>
           </tr>
           </thead>
           <tbody>


           <tr>
               <td>41</td>
               <td>10</td>
               <td>0</td>

               <td><a href="#dlg-new-accrule" class="newaccrule href-td" data-critid="41" data-puid="44">Acc</a></td>

               <td>68</td>
               <td>1</td>
               <td>Diff from watermark</td>
               <td>2.0</td>


                   <td><input data-oid="68" class="acc-active" type="checkbox" checked></td>



               <td><a href="#dlg-new-dnyrule" class="newdenyrule href-td" data-accid="68" data-puid="44">Deny</a></td>

               <td></td>
               <td></td>
               <td></td>
               <td></td>
                   <td></td>
               <td></td>
           </tr>
         </tbody>
       </table>
   </details>
-}


tableHeader : H.Html Msg
tableHeader =
    H.thead []
        [ H.tr
            []
            [ H.th [] [ H.text "Oid" ]
            , H.th [] [ H.text "Sell" ]
            , H.th [] [ H.text "Status" ]
            , H.th [] [ H.text "-" ]
            , H.th [] [ H.text "Acc.oid" ]
            , H.th [] [ H.text "Rtyp" ]
            , H.th [] [ H.text "Desc" ]
            , H.th [] [ H.text "Value" ]
            , H.th [] [ H.text "Active" ]
            , H.th [] [ H.text "-" ]
            , H.th [] [ H.text "Deny.oid" ]
            , H.th [] [ H.text "Rtyp" ]
            , H.th [] [ H.text "Desc" ]
            , H.th [] [ H.text "Value" ]
            , H.th [] [ H.text "Active" ]
            , H.th [] [ H.text "Memory" ]
            ]
        ]


critterPart : Maybe Critter -> List (H.Html Msg)
critterPart crit =
    case crit of
        Nothing ->
            [ H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            ]

        Just c ->
            [ H.td [] [ H.text (String.fromInt c.oid) ]
            , H.td [] [ H.text (String.fromInt c.sellVolume) ]
            , H.td [] [ H.text (String.fromInt c.status) ]
            , H.td [] [ H.a [ A.href "#", A.class "newaccrule href-td", E.onClick (AccRuleMsgFor (NewAccRule <| Oid c.oid)) ] [ H.text "New Acc" ] ]
            ]


accPart : Maybe AccRule -> List (H.Html Msg)
accPart acc =
    case acc of
        Nothing ->
            [ H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            ]

        Just curAcc ->
            let
                cbActive =
                    H.input
                        [ A.checked curAcc.active
                        , A.type_ "checkbox"
                        , A.attribute "data-oid" (String.fromInt curAcc.oid)
                        , E.onClick (AccRuleMsgFor (ToggleAccActive curAcc))
                        ]
                        []
            in
            [ H.td [] [ H.text (String.fromInt curAcc.oid) ]
            , H.td [] [ H.text (String.fromInt curAcc.rtyp) ]
            , H.td [] [ H.text (rtypDesc curAcc.rtyp) ]
            , H.td [] [ H.text (String.fromFloat curAcc.value) ]
            , H.td [] [ cbActive ]
            , H.td [] [ H.a [ A.href "#", A.class "newdnyrule href-td", E.onClick (DenyRuleMsgFor (NewDenyRule <| Oid curAcc.oid)) ] [ H.text "New Deny" ] ]
            ]


denyPart : Maybe DenyRule -> List (H.Html Msg)
denyPart dny =
    case dny of
        Nothing ->
            [ H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            , H.td [] [ H.text "-" ]
            ]

        Just d ->
            let
                cbActive =
                    H.input
                        [ A.checked d.active
                        , A.type_ "checkbox"
                        , A.attribute "data-oid" (String.fromInt d.oid)
                        , E.onClick (DenyRuleMsgFor (ToggleDenyActive d))
                        ]
                        []

                cbMemory =
                    H.input [ A.checked d.memory, A.type_ "checkbox" ] []

                -- , E.onClick ToggleRealTimePurchase ]
            in
            [ H.td [] [ H.text (String.fromInt d.oid) ]
            , H.td [] [ H.text (String.fromInt d.rtyp) ]
            , H.td [] [ H.text (rtypDesc d.rtyp) ]
            , H.td [] [ H.text (String.fromFloat d.value) ]
            , H.td [] [ cbActive ]
            , H.td [] [ cbMemory ]
            ]


{-| Return H.tr [][ H.td [][], .. ]
-}
critAccDenyTr : Maybe Critter -> Maybe AccRule -> Maybe DenyRule -> H.Html Msg
critAccDenyTr crit acc dny =
    let
        tdRow =
            List.concat [ critterPart crit, accPart acc, denyPart dny ]
    in
    H.tr [] tdRow


denyTr : DenyRule -> H.Html Msg
denyTr dny =
    let
        tdRow =
            List.concat [ critterPart Nothing, accPart Nothing, denyPart (Just dny) ]
    in
    H.tr [] tdRow


critAccTr : Maybe Critter -> AccRule -> List (H.Html Msg)
critAccTr crit acc =
    case acc.denyRules of
        [] ->
            let
                tdRow =
                    List.concat [ critterPart crit, accPart (Just acc), denyPart Nothing ]
            in
            [ H.tr [] tdRow ]

        [ dny ] ->
            let
                tdRow =
                    List.concat [ critterPart crit, accPart (Just acc), denyPart (Just dny) ]
            in
            [ H.tr [] tdRow ]

        x :: xs ->
            let
                firstRow =
                    critAccDenyTr crit (Just acc) (Just x)

                restRows =
                    List.map denyTr xs
            in
            firstRow :: restRows


{-| Return a list of H.tr [][ H.td [][], .. ]
-}
critterRows : Critter -> List (H.Html Msg)
critterRows crit =
    case crit.accRules of
        [] ->
            [ critAccDenyTr (Just crit) Nothing Nothing ]

        [ acc ] ->
            critAccTr (Just crit) acc

        x :: xs ->
            let
                firstRow =
                    critAccTr (Just crit) x
            in
            List.concat [ firstRow, List.concat (List.map (critAccTr Nothing) xs) ]


critterArea : OptionPurchase -> List (H.Html Msg)
critterArea opx =
    List.concat (List.map critterRows opx.critters)


details : OptionPurchase -> H.Html Msg
details opx =
    H.details []
        [ H.summary [] [ H.text ("[ " ++ String.fromInt opx.oid ++ "  ] " ++ opx.ticker) ]
        , H.table [ A.class "table" ]
            [ tableHeader
            , H.tbody [] (critterArea opx)
            ]
        ]


purchaseToSelectItem : OptionPurchase -> S.SelectItem
purchaseToSelectItem p =
    let
        oidStr =
            String.fromInt p.oid
    in
    S.SelectItem oidStr ("[ " ++ oidStr ++ " ] " ++ p.ticker)


view : Model -> H.Html Msg
view model =
    let
        clazz =
            "form-group form-group--elm"

        ps =
            List.map details model.purchases

        title =
            case model.currentPurchaseType of
                4 ->
                    "Real-time Critters"

                11 ->
                    "Paper Critters"

                _ ->
                    "-"

        (RuleValue rv) =
            model.ruleValue

        (Oid oid) =
            model.currentCritId

        (Oid accId) =
            model.currentAccId
    in
    H.div []
        [ H.div [ A.class "grid-elm" ]
            [ H.div [ A.class clazz ]
                [ BTN.button "Paper Critters" (CritterMsgFor PaperCritters) ]
            , H.div [ A.class clazz ]
                [ BTN.button "Real Time Critters" (CritterMsgFor RealTimeCritters) ]
            , H.div [ A.class clazz ]
                [ BTN.button "New Critt er" (CritterMsgFor NewCritter) ]
            , H.div [ A.class clazz ]
                [ BTN.button "Reset Cache" ResetCache ]
            , H.text title
            ]
        , H.div []
            ps
        , DLG.modalDialog ("New " ++ title)
            model.dlgNewCritter
            (CritterMsgFor DlgNewCritterOk)
            (CritterMsgFor DlgNewCritterCancel)
            [ S.makeSelect "Option: " SelectedPurchaseChanged (List.map purchaseToSelectItem model.purchases) Nothing
            , CH.makeInput "Sales volume:" SaleVolChanged model.saleVol
            ]
        , DLG.modalDialog ("New Accept Rule for crit id: " ++ String.fromInt oid)
            model.dlgNewAccRule
            (AccRuleMsgFor DlgNewAccOk)
            (AccRuleMsgFor DlgNewAccCancel)
            [ S.makeSelect "Rule Type: " SelectedRuleChanged rtypSelectItems Nothing

            -- , CH.makeInput "Value:" RuleValueChanged rv
            , CH.labelInputItem (CH.InputCaption "Value") (CH.InputType "number") (CH.InputValue rv) (CH.HtmlClass "form-control") (Just RuleValueChanged)
            ]
        , DLG.modalDialog ("New Deny Rule for acc id: " ++ String.fromInt accId)
            model.dlgNewDenyRule
            (DenyRuleMsgFor DlgNewDenyOk)
            (DenyRuleMsgFor DlgNewDenyCancel)
            [ S.makeSelect "Rule Type: " SelectedRuleChanged rtypSelectItems Nothing
            , CH.makeInput "Value:" RuleValueChanged rv
            , CH.labelCheckBox (CH.HtmlId "cb1") (CH.InputCaption "Memory") (CH.Checked model.hasMemory) ToggleHasMemory
            ]
        , DLG.alert model.dlgAlert AlertOk
        ]
