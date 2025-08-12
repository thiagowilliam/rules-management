import React, { useState } from 'react';

import { IRulesDto } from '../dtos/Rules.dto';
import RulesDetails from '../RulesDetails';

import { RulesContainer, RuleListContainer, RuleItem } from './styles';

interface RulesListProps {
  selectedIntegration: IRulesDto | undefined;
}

const RulesList: React.FC<RulesListProps> = ({ selectedIntegration }) => {
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  const handleRuleSelect = (ruleId: string): void => {
    setSelectedRuleId(ruleId);
  };

  // Se não há integração selecionada, não renderiza nada
  if (!selectedIntegration) {
    return null;
  }

  // Buscar dados das regras da integração atual
  const allRules = selectedIntegration.rules || [];
  const totalRules = allRules.length || 0;

  // Separar regras entre premium e normais
  const premiumRules = allRules.filter(rule => rule.premium === true);
  const normalRules = allRules.filter(rule => rule.premium === false);

  return (
    <RulesContainer>
      <RuleListContainer>
        <h1>{selectedIntegration.name}</h1>
        <p>{totalRules} Regras ativadas</p>

        {Array.isArray(premiumRules) && premiumRules.length > 0 && (
          <>
            <h2>Regras Premium</h2>
            {premiumRules.map(rule => (
              <RuleItem
                key={rule.rule_id}
                onClick={() => handleRuleSelect(rule.rule_id)}
              >
                <p>{rule.codename}</p>
              </RuleItem>
            ))}
          </>
        )}

        {Array.isArray(normalRules) && normalRules.length > 0 && (
          <>
            <h2>Regras Normais</h2>
            {normalRules.map(rule => (
              <RuleItem
                key={rule.rule_id}
                onClick={() => handleRuleSelect(rule.rule_id)}
              >
                <p>{rule.codename}</p>
              </RuleItem>
            ))}
          </>
        )}
      </RuleListContainer>

      {selectedRuleId && (
        <RulesDetails ruleId={selectedRuleId} />
      )}
    </RulesContainer>
  );
};

export default RulesList;