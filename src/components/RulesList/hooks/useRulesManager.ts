import { useState, useCallback, useEffect } from 'react';
import {
  IRulesDto,
  Rule,
  UpdateRuleActionParams,
} from 'src/modules/Contextual/services/Rules/dtos/Rules.dto';

interface UseRulesManagerProps {
  initialData: IRulesDto[] | undefined;
  queryKey: string[];
}

export const useRulesManager = ({ initialData }: UseRulesManagerProps) => {
  const [localRules, setLocalRules] = useState<IRulesDto[]>([]);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  useEffect(() => {
    if (initialData) {
      setLocalRules(initialData);
      setHasLocalChanges(false);
    }
  }, [initialData]);

  const updateRuleAction = useCallback((params: UpdateRuleActionParams) => {
    const { rulesetId, ruleId, updates } = params;

    setLocalRules(prevRules => {
      return prevRules.map(ruleset => {
        if (ruleset.id === rulesetId) {
          return {
            ...ruleset,
            rules: ruleset.rules.map(rule => {
              if (rule.ruleId === ruleId) {
                const updatedRule = {
                  ...rule,
                  ...updates,
                  isChanged: true,
                };

                // Aplicar validações condicionais
                if ('active' in updates && !updates.active) {
                  // Se active for false, desabilitar markAsUnauthorized e markAsFraud
                  updatedRule.markAsUnauthorized = false;
                  updatedRule.markAsFraud = false;
                } else {
                  // Se markAsUnauthorized for true, markAsFraud deve ser false
                  if ('markAsUnauthorized' in updates && updates.markAsUnauthorized) {
                    updatedRule.markAsFraud = false;
                  }
                  // Se markAsFraud for true, markAsUnauthorized deve ser false
                  if ('markAsFraud' in updates && updates.markAsFraud) {
                    updatedRule.markAsUnauthorized = false;
                  }
                }

                return updatedRule;
              }
              return rule;
            });
          };
        }
        return ruleset;
      });
    });

    setHasLocalChanges(true);
  }, []);

  const getRule = useCallback((
    rulesetId: string, 
    ruleId: string
  ): Rule | undefined => {
    const ruleset = localRules.find(rs => rs.id === rulesetId);
    return ruleset?.rules.find(rule => rule.ruleId === ruleId);
  }, [localRules]);

  const getLocalRules = useCallback(() => {
    return localRules;
  }, [localRules]);

  const resetToOriginal = useCallback(() => {
    if (initialData) {
      setLocalRules(initialData);
      setHasLocalChanges(false);
    }
  }, [initialData]);

  const markAsSaved = useCallback(() => {
    setLocalRules(prevRules => 
      prevRules.map(ruleset => ({
        ...ruleset,
        rules: ruleset.rules.map(rule => ({
          ...rule,
          isChanged: false,
        })),
      }))
    );
    setHasLocalChanges(false);
  }, []);

  return {
    rules: localRules,
    hasLocalChanges,
    updateRuleAction,
    getRule,
    getLocalRules,
    resetToOriginal,
    markAsSaved,
  };
};