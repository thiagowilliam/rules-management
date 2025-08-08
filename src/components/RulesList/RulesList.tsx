import React from 'react';
import { Card, Typography, Badge, Spin, Alert } from 'antd';
import { RightOutlined, DesktopOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { Rule } from '../../types';
import { useRules } from '../../hooks/useRules';

const { Title, Text } = Typography;

const Container = styled.div`
  height: 100%;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const RuleCard = styled(Card)<{ $isSelected: boolean }>`
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid ${props => props.$isSelected ? '#1890ff' : '#f0f0f0'};
  
  &:hover {
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  }

  .ant-card-body {
    padding: 16px;
  }
`;

const RuleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const RuleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RuleTitle = styled(Text)`
  font-weight: 600;
  font-size: 14px;
`;

// const RuleType = styled.div`
//   background: ${props => props.color === 'gold' ? '#fff7e6' : '#f6ffed'};
//   color: ${props => props.color === 'gold' ? '#d48806' : '#389e0d'};
//   padding: 2px 8px;
//   border-radius: 4px;
//   font-size: 12px;
//   font-weight: 500;
// `;

const StatusBadges = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const StatusBadge = styled.div<{ $status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.$status) {
      case 'active': return '#52c41a';
      case 'low_confidence': return '#faad14';
      case 'fraud_suspect': return '#f5222d';
      default: return '#d9d9d9';
    }
  }};
`;

const SectionTitle = styled(Title)`
  margin-bottom: 16px !important;
`;

interface RulesListProps {
  selectedRuleId: string | null;
  onRuleSelect: (ruleId: string) => void;
}

export const RulesList: React.FC<RulesListProps> = ({ selectedRuleId, onRuleSelect }) => {
  const { data: rules, isLoading, error } = useRules();

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spin size="large" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert
          message="Erro ao carregar regras"
          description="Não foi possível carregar a lista de regras."
          type="error"
          showIcon
        />
      </Container>
    );
  }

  const premiumRules = rules?.filter(rule => rule.type === 'premium') || [];
  const normalRules = rules?.filter(rule => rule.type === 'normal') || [];
  const totalRules = rules?.length || 0;

  const getStatusLabels = (rule: Rule) => {
    const labels = [];
    if (rule.status === 'active') labels.push('Ativada');
    if (rule.status === 'low_confidence') labels.push('Baixa confiança');
    if (rule.status === 'fraud_suspect') labels.push('Suspeita de fraude');
    return labels;
  };

  const renderRule = (rule: Rule) => (
    <RuleCard
      key={rule.id}
      size="small"
      $isSelected={selectedRuleId === rule.id}
      onClick={() => onRuleSelect(rule.id)}
    >
      <RuleHeader>
        <RuleInfo>
          <DesktopOutlined style={{ color: '#8c8c8c' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RuleTitle>{rule.id}</RuleTitle>
              {rule.isNew && <Badge color="red" text="NOVO" />}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {rule.name}
            </Text>
          </div>
        </RuleInfo>
        <RightOutlined style={{ color: '#8c8c8c' }} />
      </RuleHeader>
      
      <StatusBadges>
        {getStatusLabels(rule).map((label, index) => (
          <span key={index} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <StatusBadge $status={rule.status} />
            <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>{label}</Text>
          </span>
        ))}
      </StatusBadges>
    </RuleCard>
  );

  return (
    <Container>
      <Header>
        <Title level={4}>Lista de regras</Title>
        <Text type="secondary">{totalRules} REGRAS ATIVADAS</Text>
      </Header>

      {premiumRules.length > 0 && (
        <>
          <SectionTitle level={5}>Regras Premium</SectionTitle>
          {premiumRules.map(renderRule)}
        </>
      )}

      {normalRules.length > 0 && (
        <>
          <SectionTitle level={5}>Regras</SectionTitle>
          {normalRules.map(renderRule)}
        </>
      )}
    </Container>
  );
};