import React from 'react';
import { Layout as AntLayout, Typography, Tag, Space } from 'antd';
import styled from 'styled-components';
import { useIntegrations } from '../../hooks/useRules';

const { Header, Content } = AntLayout;
const { Title } = Typography;

const StyledHeader = styled(Header)`
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  height: auto;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  min-height: calc(100vh - 80px);
`;

const IntegrationsContainer = styled.div`
  margin-top: 16px;
`;

const IntegrationTag = styled(Tag)`
  margin: 4px;
  padding: 4px 8px;
  border-radius: 4px;
`;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: integrations, isLoading: integrationsLoading } = useIntegrations();

  return (
    <AntLayout>
      <StyledHeader>
        <Title level={3} style={{ margin: 0 }}>
          Integrações
        </Title>
        <IntegrationsContainer>
          <Space size={[8, 8]} wrap>
            {integrationsLoading ? (
              <Tag>Carregando...</Tag>
            ) : (
              integrations?.map(integration => (
                <IntegrationTag 
                  key={integration.id}
                  color={integration.enabled ? 'blue' : 'default'}
                >
                  {integration.name}
                </IntegrationTag>
              ))
            )}
          </Space>
        </IntegrationsContainer>
      </StyledHeader>
      <StyledContent>
        {children}
      </StyledContent>
    </AntLayout>
  );
};