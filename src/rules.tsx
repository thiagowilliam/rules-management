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
    selectedRuleId,
    allRules,
    totalRules,
    selectedRule,
    premiumRules,
    normalRules,
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
          totalRules={totalRules}
          selectedRuleId={selectedRuleId}
          selectedRule={selectedRule}
          onRuleSelect={handleRuleSelect}
        />
      ),
    },
    {
      key: 'customRules', 
      label: 'Customizadas',
      children: <div>Customizadas</div>,
    },
  ], [selectedIntegration, normalRules, premiumRules, totalRules, selectedRuleId, selectedRule, handleRuleSelect]);

  // Memoiza os botões de integração para melhor performance
  const integrationButtons = useMemo(() => 
    rulesResponse?.map((item) => (
      <button
        key={item.id}
        type="button"
        id="select-rule"
        onClick={() => handleItemSelect(item.id)}
      >
        {item.name}
      </button>
    )) || [], 
    [rulesResponse, handleItemSelect]
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