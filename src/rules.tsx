import React, { useEffect, useMemo } from 'react';
import { Tabs, TabsProps } from from 'antd';
import Subheader from 'src/components/dls/Subheader';
import RulesList from 'src/components/modules/Contextual/Rules/RulesList';
import { i18n } from from 'src/i18n';
import {
  Card,
  Container,
  ModulesContainer,
  Title,
  ContainerIntegrations,
} from './styles';
import { useRules } from '../../../services/Rules/useRules';
import { useRulesLogic } from '../hooks/useRulesLogic';

const Rules: React.FC = () => {
  const { data: rulesResponse } = useRules();
  
  const {
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
  } = useRulesLogic({ rulesResponse });

  // Memoiza os itens das abas para evitar recriações desnecessárias
  const tabItems: TabsProps['items'] = useMemo(() => [
    {
      key: 'regularRules',
      label: 'Regras regulares',
      children: (
        <RulesList 
          selectedIntegration={selectedIntegration}
          rules={normalRules}
          premiumRules={premiumRules}
          customRules={[]} // Não exibe customizadas na aba regular
          totalRules={normalRules.length + premiumRules.length}
          selectedRuleId={selectedRuleId}
          selectedRule={selectedRule}
          onRuleSelect={handleRuleSelect}
        />
      ),
    },
    {
      key: 'customRules', 
      label: 'Customizadas',
      children: (
        <RulesList 
          selectedIntegration={selectedIntegration}
          rules={[]} // Não exibe regras normais na aba customizada
          premiumRules={[]} // Não exibe premium na aba customizada
          customRules={customRules}
          totalRules={customRules.length}
          selectedRuleId={selectedRuleId}
          selectedRule={selectedRule}
          onRuleSelect={handleRuleSelect}
        />
      ),
    },
  ], [selectedIntegration, normalRules, premiumRules, customRules, selectedRuleId, selectedRule, handleRuleSelect]);

  // Memoiza os botões de integração para melhor performance
  const integrationButtons = useMemo(() => 
    rulesResponse?.map((item) => (
      <button
        key={item.id}
        type="button"
        id="select-rule"
        className={selectedIntegrationId === item.id ? 'selected' : ''}
        onClick={() => handleItemSelect(item.id)}
      >
        {item.name}
      </button>
    )) || [], 
    [rulesResponse, selectedIntegrationId, handleItemSelect]
  );

  return (
    <Container>
      <Subheader title={i18n.t('shared.rules')} />
      
      <ModulesContainer>
        <Card title={i18n.t('shared.integrations')}>
          <Title>{i18n.t('shared.integrations')}</Title>
          <ContainerIntegrations>
            {integrationButtons}
          </ContainerIntegrations>
        </Card>

        <Card>
          <Title>{i18n.t('shared.ruleList')}</Title>
          <Tabs 
            defaultActiveKey="regularRules" 
            items={tabItems}
          />
        </Card>
      </ModulesContainer>
    </Container>
  );
};

export default Rules;