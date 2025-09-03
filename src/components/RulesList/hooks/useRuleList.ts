/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  IRulesDto,
  Rule,
} from 'src/modules/Contextual/services/Rules/dtos/Rules.dto';

interface UseRulesLogicProps {
  rulesResponse: IRulesDto[] | undefined;
}

interface UseRulesLogicReturn {
  selectedIntegrationId: string | null;
  selectedRuleId: string | null;
  allRules: Rule[];
  totalRules: number;
  selectedRule: Rule | undefined;
  premiumRules: Rule[];
  normalRules: Rule[];
  customRules: Rule[];
  selectedIntegration: IRulesDto | undefined;
  handleRuleSelect: (ruleId: string) => void;
  handleItemSelect: (integrationId: string) => void;
}

export const useRulesLogic = ({ 
  rulesResponse 
}: UseRulesLogicProps): UseRulesLogicReturn => {
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  // Auto-seleciona a primeira integração quando os dados carregam
  useEffect(() => {
    if (rulesResponse?.length && !selectedIntegrationId) {
      setSelectedIntegrationId(rulesResponse[0].id);
    }
  }, [rulesResponse, selectedIntegrationId]);

  // Memoiza a integração selecionada
  const selectedIntegration = useMemo(() => 
    rulesResponse?.find((integration) => 
      integration.id === selectedIntegrationId
    ),
    [rulesResponse, selectedIntegrationId]
  );

  // Memoiza todas as regras para melhor performance
  const allRules: Rule[] = useMemo(() => 
    selectedIntegration?.rules || [],
    [selectedIntegration]
  );

  const totalRules = allRules.length;

  // Memoiza a regra selecionada
  const selectedRule = useMemo(() => 
    allRules.find((rule: Rule) => rule.ruleId === selectedRuleId),
    [allRules, selectedRuleId]
  );

  // Auto-seleciona a primeira regra quando a integração muda
  useEffect(() => {
    if (allRules.length && !selectedRuleId) {
      setSelectedRuleId(allRules[0].ruleId);
    }
  }, [allRules, selectedRuleId]);

  // Separa regras premium, normais e customizadas com memoização
  const { premiumRules, normalRules, customRules } = useMemo(() => {
    const premium = allRules.filter(rule => rule.premium === true);
    const normal = allRules.filter(rule => rule.premium === false && !rule.codename?.includes('CUSTOM'));
    const custom = allRules.filter(rule => rule.codename?.includes('CUSTOM'));
    
    return { 
      premiumRules: premium, 
      normalRules: normal,
      customRules: custom
    };
  }, [allRules]);

  // Handlers otimizados com useCallback
  const handleRuleSelect = useCallback((ruleId: string) => {
    setSelectedRuleId(ruleId);
  }, []);

  const handleItemSelect = useCallback((integrationId: string) => {
    setSelectedIntegrationId(integrationId);
    // Reset rule selection when integration changes
    setSelectedRuleId(null);
  }, []);

  return {
    selectedIntegrationId,
    selectedRuleId,
    allRules,
    totalRules,
    selectedRule,
    premiumRules,
    normalRules,
    customRules,
    selectedIntegration,
    handleRuleSelect,
    handleItemSelect,
  };
};