import React, { useMemo } from 'react';

import { Tabs, TabsProps } from 'src/components/dls/Tabs';
import ButtonX from 'src/components/dls/ButtonX';
import Subheader from 'src/components/dls/Subheader';
import { useRulesLogic } from 'src/components/modules/Contextual/Rules/hooks/useRulesLogic';
import { useRulesManager } from 'src/components/modules/Contextual/Rules/hooks/useRulesManager';
import { useRules } from '../../../services/Rules/useRules';
import { i18n } from 'src/i18n';
import { 
  Rule,
  IRulesDto 
} from 'src/modules/Contextual/services/Rules/dtos/Rules.dto';
import RulesList from './RulesList';
import {
  Card,
  Container,
  ModulesContainer,
  Title,
  ContainerIntegrations,
  ContainerButton,
} from './styles';

interface CustomParameter {
  key: string;
  ruleId: string; 
  updates: object;
}

interface RulesProps {
  initialData: IRulesDto[] | undefined;
  queryKey: string[];
}

const Rules: React.FC<RulesProps> = ({ initialData, queryKey }) => {
  // Inicializar o rulesManager
  const rulesManager = useRulesManager({ initialData, queryKey });

  const {
    normalRules,
    premiumRules, 
    customRules,
    selectedRuleId,
    selectedRule,
    onRuleSelect,
    selectedIntegrationId,
  } = useRulesLogic({ rulesResponse: rulesManager.rules });

  const integrationButtons = useMemo(
    () => {
      return rulesManager.rules?.map(item => (
        <ButtonX
          key={`${item.id}`}
          type="select-rule"
          onClick={() => {/* handleItemSelect logic */}}
          className={selectedIntegrationId === item.id ? 'selected' : ''}
        >
          {item.name}
        </ButtonX>
      ));
    },
    [rulesManager.rules, selectedIntegrationId]
  );

  const hasCustomRules = customRules.length > 0;

  const tabItemsConditional: TabsProps['items'] = useMemo(() => {
    const tabs = [
      {
        key: 'regularRules',
        label: i18n.t('shared.rules'),
        children: (
          <RulesList
            rules={normalRules}
            premiumRules={premiumRules}
            customRules={customRules}
            totalRules={normalRules.length + premiumRules.length}
            selectedRuleId={selectedRuleId}
            selectedRule={selectedRule}
            onRuleSelect={onRuleSelect}
            rulesManager={rulesManager} // ✅ Passando rulesManager
            selectedIntegrationId={selectedIntegrationId}
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
            customRules={customRules}
            totalRules={customRules.length}
            selectedRuleId={selectedRuleId}
            selectedRule={selectedRule}
            onRuleSelect={onRuleSelect}
            rulesManager={rulesManager} // ✅ Passando rulesManager
            selectedIntegrationId={selectedIntegrationId}
          />
        ),
      });
    }

    return tabs;
  }, [
    normalRules,
    premiumRules,
    customRules,
    hasCustomRules,
    selectedRuleId,
    selectedRule,
    onRuleSelect,
    rulesManager,
    selectedIntegrationId,
  ]);

  return (
    <>
      <Container>
        <ModulesContainer>
          <Card title={i18n.t('shared.integrations')}>
            <ContainerIntegrations>
              {integrationButtons}
            </ContainerIntegrations>
          </Card>
        </ModulesContainer>
      </Container>

      <Container>
        <Card title={i18n.t('shared.rulesList')}>
          <Tabs
            defaultActiveKey="regularRules"
            items={tabItemsConditional}
            className="rulesTabs"
          />
        </Card>
      </Container>

      <Container>
        <ContainerButton>
          <ButtonX>{i18n.t('shared.saveChanges')}</ButtonX>
        </ContainerButton>
      </Container>
    </>
  );
};

export default Rules;