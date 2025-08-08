import React from 'react';
import { Card, Typography, Switch, Button, Spin, Alert, Collapse } from 'antd';
import { EditOutlined, DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useRule, useUpdateRule } from '../../hooks/useRules';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const Container = styled.div`
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const RuleTitle = styled(Title)`
  margin: 0 !important;
  flex: 1;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled(Title)`
  margin-bottom: 16px !important;
  font-size: 16px !important;
`;

const ActionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const ActionLabel = styled(Text)`
  font-size: 14px;
`;

const ActionSwitch = styled(Switch)<{ $color: string }>`
  .ant-switch-checked {
    background-color: ${props => props.$color === 'red' ? '#f5222d' : '#52c41a'};
  }
`;

const ParameterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

const ParameterValue = styled(Text)`
  font-weight: 600;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #8c8c8c;
  text-align: center;
`;

interface RuleDetailsProps {
  ruleId: string | null;
}

export const RuleDetails: React.FC<RuleDetailsProps> = ({ ruleId }) => {
  const { data: rule, isLoading, error } = useRule(ruleId);
  const updateRuleMutation = useUpdateRule();

  const handleActionToggle = (actionIndex: number, enabled: boolean) => {
    if (!rule) return;

    const updatedActions = [...rule.actions];
    updatedActions[actionIndex] = { ...updatedActions[actionIndex], enabled };

    updateRuleMutation.mutate({
      id: rule.id,
      updates: { actions: updatedActions }
    });
  };

  if (!ruleId) {
    return (
      <Container>
        <EmptyState>
          <Text style={{ fontSize: '16px', marginBottom: '8px' }}>
            Selecione uma regra
          </Text>
          <Text type="secondary">
            Escolha uma regra na lista à esquerda para ver seus detalhes
          </Text>
        </EmptyState>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spin size="large" />
        </div>
      </Container>
    );
  }

  if (error || !rule) {
    return (
      <Container>
        <Alert
          message="Erro ao carregar regra"
          description="Não foi possível carregar os detalhes da regra."
          type="error"
          showIcon
        />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div style={{ flex: 1 }}>
          <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>
            REGRA {rule.id.split('REGRA')[1] || rule.id}
          </Text>
          <RuleTitle level={4}>{rule.name}</RuleTitle>
        </div>
        <Button icon={<EditOutlined />}>
          Editar parâmetros
        </Button>
      </Header>

      <Section>
        <SectionTitle level={5}>Ações da regra:</SectionTitle>
        <Card size="small">
          {rule.actions.map((action, index) => (
            <ActionItem key={index}>
              <ActionLabel>{action.name}</ActionLabel>
              <ActionSwitch
                $color={action.color}
                checked={action.enabled}
                onChange={(enabled) => handleActionToggle(index, enabled)}
                loading={updateRuleMutation.isPending}
              />
            </ActionItem>
          ))}
        </Card>
      </Section>

      <Section>
        <SectionTitle level={5}>Parâmetros</SectionTitle>
        <Card size="small">
          {rule.parameters.map((parameter, index) => (
            <ParameterRow key={index}>
              <Text>{parameter.label}</Text>
              <ParameterValue>
                {parameter.value} {parameter.unit}
              </ParameterValue>
            </ParameterRow>
          ))}
        </Card>
      </Section>

      <Section>
        <SectionTitle level={5}>Informações</SectionTitle>
        <Collapse 
          expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
          size="small"
        >
          <Panel header="O que a regra faz?" key="1">
            <Text>{rule.information.whatItDoes}</Text>
          </Panel>
          <Panel header="O que acontece ao ser ativada?" key="2">
            <Text>{rule.information.whenActivated}</Text>
          </Panel>
        </Collapse>
      </Section>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Button type="primary" size="large">
          Salvar alterações
        </Button>
      </div>
    </Container>
  );
};