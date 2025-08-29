// hooks/useRulesManager.ts
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IRulesDto, Rule, UpdateRuleActionParams } from '../types/Rules';

interface UseRulesManagerProps {
  initialData: IRulesDto[] | undefined;
  queryKey: string[];
}

export const useRulesManager = ({ initialData, queryKey }: UseRulesManagerProps) => {
  const [localRules, setLocalRules] = useState<IRulesDto[]>([]);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const queryClient = useQueryClient();

  // Sincroniza com os dados iniciais quando chegam do servidor
  useEffect(() => {
    if (initialData) {
      setLocalRules(initialData);
      setHasLocalChanges(false);
    }
  }, [initialData]);

  // Atualiza uma regra específica dentro de um ruleset (apenas local)
  const updateRuleAction = useCallback((params: UpdateRuleActionParams) => {
    const { rulesetId, ruleId, updates } = params;

    setLocalRules(prevRules => {
      return prevRules.map(ruleset => {
        if (ruleset.id === rulesetId) {
          return {
            ...ruleset,
            rules: ruleset.rules.map(rule => {
              if (rule.ruleId === ruleId) {
                return {
                  ...rule,
                  ...updates,
                  isChanged: true // Marca que esta regra foi alterada
                };
              }
              return rule;
            })
          };
        }
        return ruleset;
      });
    });

    setHasLocalChanges(true);
  }, []);

  // Função para obter uma regra específica (do estado local)
  const getRule = useCallback((rulesetId: string, ruleId: string): Rule | undefined => {
    const ruleset = localRules.find(rs => rs.id === rulesetId);
    return ruleset?.rules.find(rule => rule.ruleId === ruleId);
  }, [localRules]);

  // Função para obter todas as regras locais (com alterações)
  const getLocalRules = useCallback(() => {
    return localRules;
  }, [localRules]);

  // Função para resetar para os dados originais
  const resetToOriginal = useCallback(() => {
    if (initialData) {
      setLocalRules(initialData);
      setHasLocalChanges(false);
    }
  }, [initialData]);

  // Função para marcar como salvo (remove as marcações isChanged)
  const markAsSaved = useCallback(() => {
    setLocalRules(prevRules => 
      prevRules.map(ruleset => ({
        ...ruleset,
        rules: ruleset.rules.map(rule => ({
          ...rule,
          isChanged: false
        }))
      }))
    );
    setHasLocalChanges(false);
  }, []);

  // Mutation para quando quiser salvar tudo (opcional - para uso futuro)
  const saveAllRulesMutation = useMutation({
    mutationFn: async (rules: IRulesDto[]) => {
      const { RulesApiService } = await import('../services/rulesApi');
      return RulesApiService.saveRules(rules);
    },
    onSuccess: (savedData) => {
      // Atualiza o cache do React Query
      queryClient.setQueryData(queryKey, savedData?.data || savedData);
      markAsSaved();
    },
    onError: (error) => {
      console.error('Erro ao salvar regras:', error);
    }
  });

  // Função para salvar todas as alterações (para uso futuro se necessário)
  const saveAllChanges = useCallback(() => {
    if (hasLocalChanges) {
      saveAllRulesMutation.mutate(localRules);
    }
  }, [hasLocalChanges, localRules, saveAllRulesMutation]);

  return {
    rules: localRules,
    hasLocalChanges,
    updateRuleAction,
    getRule,
    getLocalRules,
    resetToOriginal,
    markAsSaved,
    saveAllChanges,
    isSaving: saveAllRulesMutation.isPending,
    saveError: saveAllRulesMutation.error
  };
};