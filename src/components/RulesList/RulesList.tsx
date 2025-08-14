import React from 'react';
import {
  RulesContainer,
  RulesListContainer,
  RuleItem,
  TotalRulesNumber,
  Title,
  RulesContainer as StyledRulesContainer,
  InfoRule,
  ContainerBullets
} from './styles';
import { useRulesLogic } from '../hooks/useRulesLogic';
import { RulesSection } from './RulesSection';

interface RulesListProps {
  selectedIntegration: IRulesDto | undefined;
}

const RulesList: React.FC<RulesListProps> = ({ selectedIntegration }) => {
  const rulesLogic = useRulesLogic({ selectedIntegration });

  if (!rulesLogic) {
    return null;
  }

  const {
    totalRules,
    premiumRules,
    normalRules,
    selectedRuleId,
    handleRuleSelect
  } = rulesLogic;

  return (
    <RulesContainer>
      <RulesListContainer>
        <TotalRulesNumber>
          {totalRules} Regras ativadas
        </TotalRulesNumber>

        <RulesSection
          title="Regras Premium"
          rules={premiumRules}
          selectedRuleId={selectedRuleId}
          onRuleSelect={handleRuleSelect}
        />

        <RulesSection
          title="Regras Padrão"
          rules={normalRules}
          selectedRuleId={selectedRuleId}
          onRuleSelect={handleRuleSelect}
        />
      </RulesListContainer>
      
      {selectedRule && <RulesDetails selectedRule={selectedRule} />}
    </RulesContainer>
  );
};

export default RulesList;