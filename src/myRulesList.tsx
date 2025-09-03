import React, { useState, useEffect, useMemo } from 'react';

import { IRulesDto } from '../dtos/Rules.dto';
import RulesDetails from '../RulesDetails';

import { RulesContainer, RuleListContainer, RuleItem } from './styles';

interface RulesListProps {
  selectedIntegration: IRulesDto | undefined;
}

const RulesList: React.FC<RulesListProps> = ({ selectedIntegration }) => {
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  // Buscar dados das regras da integração atual
  const allRules = selectedIntegration?.rules || [];
  const totalRules = allRules.length || 0;

  // Buscar a rule selecionada pelos dados completos
  const selectedRule = useMemo(() => 
    allRules.find(rule => rule.ruleId === selectedRuleId),
    [allRules, selectedRuleId]
  );

  // Selecionar automaticamente a primeira rule quando mudar a integração ou quando não há nenhuma selecionada
  useEffect(() => {
    if (allRules.length > 0 && !selectedRuleId) {
      setSelectedRuleId(allRules[0].ruleId);
    }
  }, [allRules, selectedRuleId]);

  // Resetar seleção quando mudar de integração
  useEffect(() => {
    if (allRules.length > 0) {
      setSelectedRuleId(allRules[0].ruleId);
    }
  }, [selectedIntegration?.id]);

  const handleRuleSelect = (ruleId: string): void => {
    setSelectedRuleId(ruleId);
  };

  // Se não há integração selecionada, não renderiza nada
  if (!selectedIntegration) {
    return null;
  }

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
                key={rule.ruleId}
                onClick={() => handleRuleSelect(rule.ruleId)}
                style={{
                  backgroundColor: selectedRuleId === rule.ruleId ? '#1890ff' : 'transparent',
                  color: selectedRuleId === rule.ruleId ? 'white' : 'inherit'
                }}
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
                key={rule.ruleId}
                onClick={() => handleRuleSelect(rule.ruleId)}
                style={{
                  backgroundColor: selectedRuleId === rule.ruleId ? '#1890ff' : 'transparent',
                  color: selectedRuleId === rule.ruleId ? 'white' : 'inherit'
                }}
              >
                <p>{rule.codename}</p>
              </RuleItem>
            ))}
          </>
        )}
      </RuleListContainer>

      {selectedRule && (
        <RulesDetails selectedRule={selectedRule} />
      )}
    </RulesContainer>
  );
};

export default RulesList;