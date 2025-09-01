import React from 'react';
import Typography from 'src/components/ui/Typography';
import { i18n } from 'src/i18n';
import {
  ActionCard,
  ActionCardDivider,
  ActionItem,
  ActionItemSwitch,
} from './styles';

const RuleActions: React.FC<RuleActionsProps> = ({
  rule,
  rulesManager,
  selectedIntegrationId,
}) => {
  const { updateRuleAction, getRule } = rulesManager;

  const currentRule = getRule(selectedIntegrationId, rule.ruleId) || rule;
  const effectiveRule = currentRule || rule;

  const handleEnabledSwitch = (checked: boolean) => {
    updateRuleAction({
      rulesetId: selectedIntegrationId,
      ruleId: rule.ruleId,
      updates: { 
        active: checked,
        // Se desabilitar o active, também desabilita os outros
        ...(checked === false && {
          markAsUnauthorized: false,
          markAsFraud: false,
        })
      },
    });
  };

  const handleUnauthorizedSwitch = (checked: boolean) => {
    updateRuleAction({
      rulesetId: selectedIntegrationId,
      ruleId: rule.ruleId,
      updates: { 
        markAsUnauthorized: checked,
        // Se marcar como unauthorized, desmarcar fraud
        ...(checked && { markAsFraud: false })
      },
    });
  };

  const handleFraudSwitch = (checked: boolean) => {
    updateRuleAction({
      rulesetId: selectedIntegrationId,
      ruleId: rule.ruleId,
      updates: { 
        markAsFraud: checked,
        // Se marcar como fraud, desmarcar unauthorized
        ...(checked && { markAsUnauthorized: false })
      },
    });
  };

  // Condições para disabled state
  const isActive = effectiveRule.active;
  const isUnauthorizedOrFraudDisabled = !isActive;

  return (
    <>
      <Typography.Body size="md">
        {i18n.t('contextual.rules.ruleActions')}
      </Typography.Body>
      <ActionCard>
        <ActionItem>
          <p>{i18n.t('shared.enable')}</p>
          <ActionItemSwitch
            onChange={handleEnabledSwitch}
            checked={effectiveRule.active}
          />
        </ActionItem>
      </ActionCard>

      <ActionCardDivider />

      <ActionItem>
        <p>{i18n.t('contextual.ruleStatus.lowTrust')}</p>
        <ActionItemSwitch
          onChange={handleUnauthorizedSwitch}
          checked={effectiveRule.markAsUnauthorized}
          disabled={isUnauthorizedOrFraudDisabled}
        />
      </ActionItem>

      <ActionItem>
        <p>{i18n.t('contextual.ruleStatus.suspiciousFraud')}</p>
        <ActionItemSwitch
          onChange={handleFraudSwitch}
          checked={effectiveRule.markAsFraud}
          disabled={isUnauthorizedOrFraudDisabled}
        />
      </ActionItem>
    </>
  );
};

export default RuleActions;