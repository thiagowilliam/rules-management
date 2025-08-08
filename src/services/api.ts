import axios from 'axios';
import type { Rule, Integration } from '../types';
import { rules, integrations } from '../data/mockData';

// Configuração do axios
const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// Simulação de delay para APIs
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const rulesApi = {
  getRules: async (): Promise<Rule[]> => {
    await delay(800); // Simula latência
    return rules;
  },

  getRuleById: async (id: string): Promise<Rule | null> => {
    await delay(300);
    return rules.find(rule => rule.id === id) || null;
  },

  updateRule: async (id: string, updates: Partial<Rule>): Promise<Rule> => {
    await delay(500);
    const ruleIndex = rules.findIndex(rule => rule.id === id);
    if (ruleIndex === -1) {
      throw new Error('Rule not found');
    }
    rules[ruleIndex] = { ...rules[ruleIndex], ...updates };
    return rules[ruleIndex];
  }
};

export const integrationsApi = {
  getIntegrations: async (): Promise<Integration[]> => {
    await delay(500);
    return integrations;
  }
};

export default api;