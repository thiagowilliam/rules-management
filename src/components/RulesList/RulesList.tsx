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
  totalRules: number;
  selectedRuleId: string | null;
  selectedRule: Rule | undefined;
  onRuleSelect: (ruleId: string) => void;
}

const RulesList: React.FC<RulesListProps> = ({ 
  selectedIntegration,
  rules,
  premiumRules, 
  totalRules,
  selectedRuleId,
  selectedRule,
  onRuleSelect
}) => {
  return (
    <RulesContainer>
      <RuleListContainer>
        <TotalRulesNumber>{totalRules} Regras ativadas</TotalRulesNumber>

        <RulesSection
          title="Regras Premium"
          rules={premiumRules}
          selectedRuleId={selectedRuleId}
          onRuleSelect={onRuleSelect}
        />

        <RulesSection
          title="Regras Padrão" 
          rules={rules}
          selectedRuleId={selectedRuleId}
          onRuleSelect={onRuleSelect}
        />
      </RuleListContainer>

      {selectedRule && <RulesDetails selectedRule={selectedRule} />}
    </RulesContainer>
  );
};

export default RulesList;