/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useCallback, useEffect, useState } from 'react';

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
  const [hasLocalChanges, setHasLocalChanges] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setLocalRules(initialData);
      setHasLocalChanges(false);
    }
  }, [initialData]);

  const updateRuleAction = useCallback(
    (params: UpdateRuleActionParams) => {
      const { rulesetId, ruleId, updates } = params;

      setLocalRules(prevRules => {
        return prevRules.map(ruleset => {
          if (ruleset.id === rulesetId) {
            const updatedRule = {
              ...ruleset,
              rules: ruleset.rules.map(rule => {
                if (rule.ruleId === ruleId) {
                  const updatedRule = {
                    ...rule,
                    ...updates,
                    isChanged: true,
                  };

                  if ('active' in updates && updates.active) {
                    updatedRule.markAsUnauthorized = false;
                    updatedRule.markAsFraud = false;
                  } else {
                    if (
                      'markAsUnauthorized' in updates &&
                      updates.markAsUnauthorized
                    ) {
                      updatedRule.markAsFraud = false;
                    }
                    if ('markAsFraud' in updates && updates.markAsFraud) {
                      updatedRule.markAsUnauthorized = false;
                    }
                  }

                  return updatedRule;
                }
                return rule;
              }),
            };

            return updatedRule;
          }
          return ruleset;
        });
      });

      setHasLocalChanges(true);
    },
    []
  );

  // Novo método específico para atualizar apenas customParameters
  const updateRuleParameters = useCallback(
    (ruleId: string, customParameters: string) => {
      setLocalRules(prevRules => {
        return prevRules.map(ruleset => {
          const updatedRuleset = {
            ...ruleset,
            rules: ruleset.rules.map(rule => {
              if (rule.ruleId === ruleId) {
                return {
                  ...rule,
                  customParameters,
                  isChanged: true,
                };
              }
              return rule;
            }),
          };
          return updatedRuleset;
        });
      });

      setHasLocalChanges(true);
    },
    []
  );

  const getRule = useCallback(
    (rulesetId: string, ruleId: string): Rule | undefined => {
      const ruleset = localRules.find(rs => rs.id === rulesetId);
      return ruleset?.rules.find(rule => rule.ruleId === ruleId);
    },
    [localRules]
  );

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
    updateRuleParameters, // Novo método
    getRule,
    getLocalRules,
    resetToOriginal,
    markAsSaved,
  };
};