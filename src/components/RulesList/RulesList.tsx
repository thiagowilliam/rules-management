import React from 'react';
import { IRulesDto, Rule } from 'src/modules/Contextual/services/Rules/dtos/Rules.dto';
import RulesDetails from '../RulesDetails';
import { RulesSection } from './RulesSection';
import {
  RulesContainer,
  RuleListContainer,
  TotalRulesNumber,
} from './styles';

// Interface que recebe tudo do hook - sem duplicar lógica
interface RulesListProps {
  selectedIntegration: IRulesDto | undefined;
  rules: Rule[];
  premiumRules: Rule[];
  customRules: Rule[];
  totalRules: number;
  selectedRuleId: string | null;
  selectedRule: Rule | undefined;
  onRuleSelect: (ruleId: string) => void;
}

const RulesList: React.FC<RulesListProps> = ({ 
  selectedIntegration,
  rules,
  premiumRules,
  customRules,
  totalRules,
  selectedRuleId,
  selectedRule,
  onRuleSelect
}) => {
  return (
    <RulesContainer>
      <RuleListContainer>
        <TotalRulesNumber>{totalRules} Regras ativadas</TotalRulesNumber>

        {premiumRules.length > 0 && (
          <RulesSection
            title="Regras Premium"
            rules={premiumRules}
            selectedRuleId={selectedRuleId}
            onRuleSelect={onRuleSelect}
          />
        )}

        {rules.length > 0 && (
          <RulesSection
            title="Regras Padrão" 
            rules={rules}
            selectedRuleId={selectedRuleId}
            onRuleSelect={onRuleSelect}
          />
        )}

        {customRules.length > 0 && (
          <RulesSection
            title="Customizadas"
            rules={customRules}
            selectedRuleId={selectedRuleId}
            onRuleSelect={onRuleSelect}
          />
        )}
      </RuleListContainer>

      {selectedRule && <RulesDetails selectedRule={selectedRule} />}
    </RulesContainer>
  );
};

export default RulesList;