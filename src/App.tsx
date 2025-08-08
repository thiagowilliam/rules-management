import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Row, Col } from 'antd';
import { ThemeProvider } from 'styled-components';
import { Layout } from './components/Layout/Layout';
import { RulesList } from './components/RulesList/RulesList';
import { RuleDetails } from './components/RuleDetails/RuleDetails';
import { GlobalStyle, theme } from './styles/GlobalStyles';
import 'antd/dist/reset.css';

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  const handleRuleSelect = (ruleId: string) => {
    setSelectedRuleId(ruleId);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Layout>
          <Row gutter={24} style={{ height: '100%' }}>
            <Col xs={24} lg={8} xl={6}>
              <RulesList
                selectedRuleId={selectedRuleId}
                onRuleSelect={handleRuleSelect}
              />
            </Col>
            <Col xs={24} lg={16} xl={18}>
              <RuleDetails ruleId={selectedRuleId} />
            </Col>
          </Row>
        </Layout>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;