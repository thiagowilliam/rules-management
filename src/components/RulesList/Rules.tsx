// components/Rules.tsx
import React, { useMemo } from 'react';
import { useRules } from '../services/Rules/useRules';
import { useRulesManager } from '../hooks/useRulesManager';
import RulesDetails from './RulesDetails';

const Rules: React.FC = () => {
  const { data: rulesResponse, isLoading, error } = useRules();
  
  const rulesManager = useRulesManager({
    initialData: rulesResponse,
    queryKey: ['rules']
  });

  const {
    selectedIntegrationId,
    selectedRuleId,
    selectedRule,
    premiumRules,
    normalRules,
    customRules,
    selectedIntegration,
    handleRuleSelect,
    handleItemSelect,
    hasCustomRules,
    handleRuleSelect: handleRuleSelectCallback
  } = useRulesLogic({ rulesResponse: { data: rulesManager.rules } });

  const tabItemsConditional: TabsProps['items'] = useMemo(() => {
    const tabs = [
      {
        key: 'regularRules',
        label: i18n.t('shared.rules'),
        children: (
          <RulesList
            rules={normalRules}
            premiumRules={premiumRules}
            totalRules={normalRules.length + premiumRules.length}
            customRules={[]}
            selectedRuleId={selectedRuleId}
            selectedRule={selectedRule}
            onRuleSelect={handleRuleSelect}
          />
        ),
      },
    ];

    if (hasCustomRules) {
      tabs.push({
        key: 'customRules',
        label: i18n.t('shared.customized'),
        children: (
          <RulesList
            rules={[]}
            premiumRules={[]}
            totalRules={customRules.length}
            customRules={customRules}
            selectedRuleId={selectedRuleId}
            selectedRule={selectedRule}
            onRuleSelect={handleRuleSelectCallback}
          />
        ),
      });
    }

    return tabs;
  }, [
    normalRules,
    premiumRules,
    customRules,
    selectedRuleId,
    selectedRule,
    handleRuleSelect,
    handleRuleSelectCallback,
    hasCustomRules
  ]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao carregar regras</div>;
  }

  return (
    <Container>
      <Subheader title={i18n.t('shared.rules')} />

      <ModulesContainer>
        <Card title={i18n.t('shared.integrations')}>
          <Title>{i18n.t('shared.integrations')}</Title>
          <ContainerIntegrations>
            {/* Aqui renderiza os botões de integração */}
          </ContainerIntegrations>
        </Card>

        <Card>
          <Title>{i18n.t('shared.rulesList')}</Title>
          <Tabs
            defaultActiveKey="regularRules"
            items={tabItemsConditional}
            className="rulesTabs"
          />
        </Card>

        {/* Passa o rulesManager para o RulesDetails */}
        {selectedRule && (
          <RulesDetails 
            rule={selectedRule} 
            rulesManager={rulesManager}
            selectedIntegrationId={selectedIntegrationId}
          />
        )}
      </ModulesContainer>

      {/* Botões para salvar/descartar alterações */}
      {rulesManager.hasLocalChanges && (
        <div style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          display: 'flex', 
          gap: '10px' 
        }}>
          <button 
            onClick={rulesManager.discardChanges}
            disabled={rulesManager.isLoading}
          >
            Descartar Alterações
          </button>
          <button 
            onClick={rulesManager.saveChanges}
            disabled={rulesManager.isLoading}
          >
            {rulesManager.isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      )}
    </Container>
  );
};

export default Rules;