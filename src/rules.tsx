import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsProps } from 'antd';
import Subheader from 'src/components/dls/Subheader';
import RulesDetails from 'src/components/modules/Contextual/Rules/RulesDetails';
import RulesList from 'src/components/modules/Contextual/Rules/RulesList';
import { i18n } from 'src/i18n';
import { useRules } from '../../../services/Rules/useRules';
import {
  Card,
  Container,
  ModulesContainer,
  Title,
  ContainerIntegrations,
  RulesContainer,
} from './styles';

// Interfaces baseadas na estrutura do seu mockData
interface Rule {
  rule_id: string;
  name: string;
  name_en: string;
  code: number;
  index: number;
  description: string;
  description_en: string;
  active: boolean;
  mark_as_unauthorized: boolean;
  mark_as_fraud: boolean;
  is_changed: boolean;
  is_mobile: boolean;
  custom_parameters: string;
  native: boolean;
  premium: boolean;
  codename: string;
}

interface RulesDataItem {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  domain: string;
  similarity_percentage_tolerance: number;
  hash_feature_weight_tolerance: number;
  days_to_expire_the_context: number;
  active: boolean;
  customer_has_partner_products: boolean;
  rules: Rule[];
}

const Rules: React.FC = () => {
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  const { data: rulesResponse } = useRules();

  // Verificação segura de tipo e auto-seleção do primeiro item
  useEffect(() => {
    if (
      rulesResponse && 
      Array.isArray(rulesResponse) && 
      rulesResponse.length > 0 && 
      !selectedItemId
    ) {
      const firstItem = rulesResponse[0] as RulesDataItem;
      if (firstItem?.id) {
        setSelectedItemId(firstItem.id);
      }
    }
  }, [rulesResponse, selectedItemId]);

  // Extrair as regras do item selecionado com verificação segura
  const rules = useMemo(() => {
    if (
      !rulesResponse || 
      !Array.isArray(rulesResponse) || 
      rulesResponse.length === 0 || 
      !selectedItemId
    ) {
      return [];
    }
    
    const selectedItem = rulesResponse.find(
      (item: RulesDataItem) => item.id === selectedItemId
    );
    
    return Array.isArray(selectedItem?.rules) ? selectedItem.rules : [];
  }, [rulesResponse, selectedItemId]);

  // Auto-selecionar a primeira regra quando as regras do item mudarem
  useEffect(() => {
    if (rules.length > 0) {
      const firstRule = rules[0];
      if (firstRule && typeof firstRule.rule_id === 'string') {
        setSelectedRuleId(firstRule.rule_id);
      }
    } else {
      setSelectedRuleId(null);
    }
  }, [rules]);

  // Handler para selecionar um item específico (botões)
  const handleItemSelect = (itemId: string): void => {
    if (itemId && typeof itemId === 'string') {
      setSelectedItemId(itemId);
      // Reset da regra selecionada - será auto-selecionada pelo useEffect
      setSelectedRuleId(null);
    }
  };

  // Handler para selecionar uma regra específica
  const handleRuleSelect = (ruleId: string): void => {
    if (typeof ruleId === 'string' && ruleId.length > 0) {
      setSelectedRuleId(ruleId);
    }
  };

  // Handler para selecionar a próxima regra (botão no RulesDetails)
  const handleSelectNextRule = (): void => {
    if (rules.length === 0) {
      console.warn('Nenhuma regra disponível para navegação');
      return;
    }
    
    let nextIndex = 0;
    
    if (selectedRuleId) {
      const currentIndex = rules.findIndex(rule => rule.rule_id === selectedRuleId);
      if (currentIndex >= 0) {
        nextIndex = (currentIndex + 1) % rules.length;
      }
    }
    
    const nextRule = rules[nextIndex];
    if (nextRule && nextRule.rule_id) {
      setSelectedRuleId(nextRule.rule_id);
    }
  };

  // Encontrar o item atualmente selecionado para mostrar informações
  const selectedItem = useMemo(() => {
    if (!rulesResponse || !Array.isArray(rulesResponse) || !selectedItemId) {
      return null;
    }
    return rulesResponse.find((item: RulesDataItem) => item.id === selectedItemId);
  }, [rulesResponse, selectedItemId]);

  const items: TabsProps['items'] = [
    {
      key: 'regularRules',
      label: 'Regras regulares',
      children: (
        <RulesContainer>
          <RulesList
            selectedRuleId={selectedRuleId}
            onRuleSelect={handleRuleSelect}
          />
        </RulesContainer>
      ),
    },
    {
      key: 'customRules',
      label: 'Customizadas',
      children: <CustomizadasQ />,
    },
  ];

  // Renderização com verificações de segurança
  if (!rulesResponse || !Array.isArray(rulesResponse)) {
    return (
      <Container>
        <div>Carregando dados...</div>
      </Container>
    );
  }

  if (rulesResponse.length === 0) {
    return (
      <Container>
        <div>Nenhum item encontrado</div>
      </Container>
    );
  }

  return (
    <Container>
      <Subheader title={i18n.t('shared.rules')} />
      
      <ModulesContainer>
        <Card title={i18n.t('shared.integrations')}>
          <Title>{i18n.t('shared.integrations')}</Title>
          <ContainerIntegrations>
            {/* Renderizar botões para cada item do mockData */}
            {rulesResponse.map((item: RulesDataItem) => (
              <button 
                type="button" 
                id={`select-item-${item.id}`}
                key={item.id}
                onClick={() => handleItemSelect(item.id)}
                style={{
                  margin: '4px',
                  padding: '8px 16px',
                  backgroundColor: selectedItemId === item.id ? '#1976d2' : '#f5f5f5',
                  color: selectedItemId === item.id ? 'white' : '#333',
                  border: selectedItemId === item.id ? '2px solid #1976d2' : '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: selectedItemId === item.id ? '600' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.name}
              </button>
            ))}
          </ContainerIntegrations>
          
          {/* Informações do item selecionado */}
          {selectedItem && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: '#f0f8ff', 
              borderRadius: '6px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                <strong>Item selecionado:</strong> {selectedItem.name}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                <strong>ID:</strong> {selectedItem.id} | 
                <strong> Regras:</strong> {rules.length} | 
                <strong> Ativo:</strong> {selectedItem.active ? 'Sim' : 'Não'}
              </div>
            </div>
          )}
        </Card>
      </ModulesContainer>

      <Card>
        <Title>{i18n.t('shared.rulelist')}</Title>
        <Tabs defaultActiveKey="regularRules" items={items} />
        
        {/* Detalhes da regra selecionada */}
        {selectedRuleId && (
          <RulesDetails 
            ruleId={selectedRuleId} 
            onSelectRule={handleSelectNextRule}
          />
        )}
        
        {/* Mostrar quando não há regras */}
        {rules.length === 0 && selectedItem && (
          <div style={{ 
            textAlign: 'center', 
            padding: '32px', 
            color: '#999',
            fontStyle: 'italic' 
          }}>
            O item "{selectedItem.name}" não possui regras configuradas.
          </div>
        )}
      </Card>
    </Container>
  );
};

export default Rules;