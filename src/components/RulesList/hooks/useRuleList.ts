import { useState, useEffect, useMemo } from 'react';
import { Rule } from '../types/Rule';

interface UseRulesLogicProps {
  selectedIntegration: IRulesDto | undefined;
}

export const useRulesLogic = ({ selectedIntegration }: UseRulesLogicProps) => {
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [allRules, setAllRules] = useState<Rule[]>([]);

  const totalRules = allRules.length || 0;

  const selectedRule: Rule | undefined = useMemo(() => {
    return allRules.find((rule: Rule) => rule.rule_id === selectedRuleId);
  }, [allRules, selectedRuleId]);

  const { premiumRules, normalRules } = useMemo(() => {
    const premium = allRules.filter(rule => rule.premium === true);
    const normal = allRules.filter(rule => rule.premium === false);
    return { premiumRules: premium, normalRules: normal };
  }, [allRules]);

  useEffect(() => {
    if (allRules.length > 0 && !selectedRuleId) {
      setSelectedRuleId(allRules[0].rule_id);
    }
  }, [allRules, selectedRuleId]);

  useEffect(() => {
    if (allRules.length > 0) {
      setSelectedRuleId(allRules[0].rule_id);
    }
  }, [allRules, selectedIntegration?.id]);

  const handleRuleSelect = (ruleId: string): void => {
    setSelectedRuleId(ruleId);
  };

  if (!selectedIntegration) {
    return null;
  }

  return {
    selectedRuleId,
    allRules,
    setAllRules,
    totalRules,
    selectedRule,
    premiumRules,
    normalRules,
    handleRuleSelect
  };
};