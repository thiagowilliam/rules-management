import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rulesApi, integrationsApi } from '../services/api';
import type { Rule } from '../types';

export const useRules = () => {
  return useQuery({
    queryKey: ['rules'],
    queryFn: rulesApi.getRules,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useRule = (id: string | null) => {
  return useQuery({
    queryKey: ['rule', id],
    queryFn: () => id ? rulesApi.getRuleById(id) : Promise.resolve(null),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Rule> }) =>
      rulesApi.updateRule(id, updates),
    onSuccess: (updatedRule) => {
      // Atualiza o cache das regras
      queryClient.setQueryData(['rules'], (oldRules: Rule[] | undefined) => {
        if (!oldRules) return [updatedRule];
        return oldRules.map(rule => 
          rule.id === updatedRule.id ? updatedRule : rule
        );
      });
      
      // Atualiza o cache da regra específica
      queryClient.setQueryData(['rule', updatedRule.id], updatedRule);
    },
  });
};

export const useIntegrations = () => {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: integrationsApi.getIntegrations,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};