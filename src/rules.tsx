import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsProps } from 'antd';

import { useRules } from '../../../services/Rules/useRules';

import Subheader from 'src/components/dls/Subheader';
import RulesList from 'src/components/modules/Contextual/Rules/RulesList';

import {
  Card,
  Container,
  ModulesContainer,
  Title,
  ContainerIntegrations,
} from './styles';

const Rules: React.FC = () => {
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);

  const { data: rulesResponse } = useRules();

  // Buscar a integração selecionada pelo ID
  const selectedIntegration = useMemo(() => 
    rulesResponse?.find(integration => integration.id === selectedIntegrationId),
    [rulesResponse, selectedIntegrationId]
  );

  // Selecionar automaticamente a primeira integração quando os dados chegarem
  useEffect(() => {
    if (rulesResponse && rulesResponse.length > 0) {
      setSelectedIntegrationId(rulesResponse[0].id);
    }
  }, [rulesResponse]);

  const handleItemSelect = (integrationId: string): void => {
    setSelectedIntegrationId(integrationId);
  };

  // Separar as regras entre premium e normais da integração selecionada
  const rules = useMemo(() => {
    if (!selectedIntegration?.rules) {
      return { premiumRules: [], normalRules: [] };
    }

    const allRules = selectedIntegration.rules;
    return {
      premiumRules: allRules.filter(rule => rule.premium === true),
      normalRules: allRules.filter(rule => rule.premium === false)
    };
  }, [selectedIntegration]);

  const items: TabsProps['items'] = [
    {
      key: 'regularRules',
      label: 'Regras regulares',
      children: <RulesList selectedIntegration={selectedIntegration} />,
    },
    {
      key: 'customRules', 
      label: 'Customizadas',
      children: <></>,
    },
  ];

  return (
    <Container>
      <Subheader title={selectedIntegration?.name || ''} />

      <ModulesContainer>
        <Card title="Integrações">
          <Title>Integrações</Title>
          <ContainerIntegrations>
            {rulesResponse?.map((item, index) => (
              <button
                key={item.id}
                type="button"
                id="select-rule"
                onClick={() => handleItemSelect(item.id)}
              >
                {item.name}
              </button>
            ))}
          </ContainerIntegrations>
        </Card>

        <Card title="Regras">
          <Title>Regras</Title>
          <ContainerIntegrations>
            {selectedIntegration && (
              <Tabs defaultActiveKey="regularRules" items={items} />
            )}
          </ContainerIntegrations>
        </Card>
      </ModulesContainer>
    </Container>
  );
};

export default Rules;