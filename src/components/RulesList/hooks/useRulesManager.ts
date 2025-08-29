// hooks/useRulesManager.ts
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IRulesDto, Rule, UpdateRuleActionParams, RulesResponse } from '../types/Rules';

interface UseRulesManagerProps {
  initialData: RulesResponse | undefined;
  queryKey: string[];
}

export const useRulesManager = ({ initialData, queryKey }: UseRulesManagerProps) => {
  const [localRules, setLocalRules] = useState<IRulesDto[]>([]);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const queryClient = useQueryClient();

  // Sincroniza com os dados iniciais quando chegam do servidor
  useEffect(() => {
    if (initialData?.data) {
      setLocalRules(initialData.data);
      setHasLocalChanges(false);
    }
  }, [initialData?.data]);

  // Atualiza uma regra específica dentro de um ruleset
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

  // Mutation para salvar todas as alterações no servidor
  const saveRulesMutation = useMutation({
    mutationFn: async (rules: IRulesDto[]) => {
      const response = await fetch('/api/rules', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: rules }),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar regras');
      }

      return response.json();
    },
    onSuccess: (savedData) => {
      // Atualiza o cache do React Query com os dados salvos
      queryClient.setQueryData(queryKey, savedData);
      
      // Remove as marcações de "isChanged" localmente
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
    },
    onError: (error) => {
      console.error('Erro ao salvar regras:', error);
      // Aqui você pode mostrar uma notificação de erro
    }
  });

  // Função para salvar as alterações
  const saveChanges = useCallback(() => {
    if (hasLocalChanges) {
      saveRulesMutation.mutate(localRules);
    }
  }, [hasLocalChanges, localRules, saveRulesMutation]);

  // Função para descartar alterações locais
  const discardChanges = useCallback(() => {
    if (initialData?.data) {
      setLocalRules(initialData.data);
      setHasLocalChanges(false);
    }
  }, [initialData?.data]);

  // Função para obter uma regra específica
  const getRule = useCallback((rulesetId: string, ruleId: string): Rule | undefined => {
    const ruleset = localRules.find(rs => rs.id === rulesetId);
    return ruleset?.rules.find(rule => rule.ruleId === ruleId);
  }, [localRules]);

  return {
    rules: localRules,
    hasLocalChanges,
    isLoading: saveRulesMutation.isPending,
    error: saveRulesMutation.error,
    updateRuleAction,
    saveChanges,
    discardChanges,
    getRule
  };
};