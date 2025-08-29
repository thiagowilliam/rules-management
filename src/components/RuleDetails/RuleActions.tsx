// components/RuleActions.tsx
import React from 'react';
import { Rule } from '../types/Rules';

interface RuleActionsProps {
  rule: Rule;
  rulesManager: ReturnType<typeof import('../hooks/useRulesManager').useRulesManager>;
  selectedIntegrationId: string;
}

const RuleActions: React.FC<RuleActionsProps> = ({ 
  rule, 
  rulesManager, 
  selectedIntegrationId 
}) => {
  const { updateRuleAction, getRule } = rulesManager;

  // Obtém o estado atual da regra (local, com alterações se houver)
  const currentRule = getRule(selectedIntegrationId, rule.ruleId) || rule;

  const handleEnabledSwitch = (checked: boolean) => {
    updateRuleAction({
      rulesetId: selectedIntegrationId,
      ruleId: rule.ruleId,
      updates: { active: checked }
    });
  };

  const handleUnauthorizedSwitch = (checked: boolean) => {
    updateRuleAction({
      rulesetId: selectedIntegrationId,
      ruleId: rule.ruleId,
      updates: { markAsUnauthorized: checked }
    });
  };

  const handleFraudSwitch = (checked: boolean) => {
    updateRuleAction({
      rulesetId: selectedIntegrationId,
      ruleId: rule.ruleId,
      updates: { markAsFraud: checked }
    });
  };

  return (
    <>
      <Typography.Body size="md">
        {i18n.t('contextual.rules.ruleActions')}
      </Typography.Body>
      
      <ActionCard>
        <ActionItem>
          <p>
            {i18n.t('shared.enable')}
            {/* Opcionalmente, indica se foi alterado localmente */}
            {currentRule.isChanged && currentRule.active !== rule.active && (
              <span style={{ 
                marginLeft: '8px', 
                color: '#ff9500', 
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                •
              </span>
            )}
          </p>
          <ActionItemSwitch 
            onChange={handleEnabledSwitch} 
            checked={currentRule.active}
          />
        </ActionItem>
      </ActionCard>

      <ActionCardDivider />

      <ActionItem>
        <p>
          {i18n.t('contextual.ruleStatus.lowTrust')}
          {currentRule.isChanged && currentRule.markAsUnauthorized !== rule.markAsUnauthorized && (
            <span style={{ 
              marginLeft: '8px', 
              color: '#ff9500', 
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              •
            </span>
          )}
        </p>
        <ActionItemSwitch 
          onChange={handleUnauthorizedSwitch} 
          checked={currentRule.markAsUnauthorized}
        />
      </ActionItem>

      <ActionCardDivider />

      <ActionItem>
        <p>
          {i18n.t('contextual.ruleStatus.suspiciousOrFraud')}
          {currentRule.isChanged && currentRule.markAsFraud !== rule.markAsFraud && (
            <span style={{ 
              marginLeft: '8px', 
              color: '#ff9500', 
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              •
            </span>
          )}
        </p>
        <ActionItemSwitch 
          onChange={handleFraudSwitch} 
          checked={currentRule.markAsFraud}
        />
      </ActionItem>
    </>
  );
};

export default RuleActions;