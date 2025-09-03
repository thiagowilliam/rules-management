import React from 'react';

import { i18n } from 'src/i18n';
import { Rule } from 'src/modules/Contextual/services/Rules/dtos/Rules.dto';

import RulesDetails from '../RulesDetails';
import { RulesSection } from '../RulesSection';
import { RulesContainer, RulesListContainer, TotalRulesNumber } from './styles';

// Interface que recebe tudo do hook useRulesLogic - sem duplicar lógica
interface RulesListProps {
  rules: Rule[];
  premiumRules: Rule[];
  customRules: Rule[];
  totalRules: number;
  selectedRuleId: string | null;
  selectedRule: Rule | undefined;
  onRuleSelect: (ruleId: string) => void;
  rulesManager: ReturnType<typeof import('../../hooks/useRulesManager').useRulesManager>;
  selectedIntegrationId: string;
}

const RulesList: React.FC<RulesListProps> = ({
  rules,
  premiumRules,
  customRules,
  totalRules,
  selectedRuleId,
  selectedRule,
  onRuleSelect,
  rulesManager,
  selectedIntegrationId,
}) => {
  return (
    <RulesContainer>
      <RulesListContainer>
        <TotalRulesNumber>
          {totalRules === 1 ? (
            <>
              {totalRules} {i18n.t('shared.ruleActivated')}
            </>
          ) : (
            <>
              {totalRules} {i18n.t('shared.rulesActivated')}
            </>
          )}
        </TotalRulesNumber>

        {premiumRules.length > 0 && (
          <RulesSection
            title={i18n.t('shared.premiumRules')}
            rules={premiumRules}
            selectedRuleId={selectedRuleId}
            onRuleSelect={onRuleSelect}
          />
        )}

        {rules.length > 0 && (
          <RulesSection
            title={i18n.t('shared.defaultRules')}
            rules={rules}
            selectedRuleId={selectedRuleId}
            onRuleSelect={onRuleSelect}
          />
        )}

        {customRules.length > 0 && (
          <RulesSection
            title={i18n.t('shared.customized')}
            rules={customRules}
            selectedRuleId={selectedRuleId}
            onRuleSelect={onRuleSelect}
          />
        )}
      </RulesListContainer>

      {selectedRule && (
        <RulesDetails
          selectedRule={selectedRule}
          rulesManager={rulesManager}
          selectedIntegrationId={selectedIntegrationId}
        />
      )}
    </RulesContainer>
  );
};

export default RulesList;