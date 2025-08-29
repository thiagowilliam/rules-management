// services/rulesApi.ts
import { IRulesDto, RulesResponse } from '../types/Rules';

export class RulesApiService {
  private static baseUrl = process.env.REACT_APP_API_URL || '/api';

  // Método para obter todas as regras (já existente)
  static async getRules(): Promise<RulesResponse> {
    const response = await fetch(`${this.baseUrl}/rules`);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar regras');
    }
    
    return response.json();
  }

  // Método para salvar todas as regras alteradas
  static async saveRules(rules: IRulesDto[]): Promise<RulesResponse> {
    const response = await fetch(`${this.baseUrl}/rules`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: rules }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha ao salvar regras');
    }

    return response.json();
  }

  // Método para salvar todas as regras (enviando array completo)
  static async saveRules(rules: IRulesDto[]): Promise<RulesResponse> {
    const response = await fetch(`${this.baseUrl}/rules`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: rules }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha ao salvar regras');
    }

    return response.json();
  }
}