// components/RulesDetails.tsx
import React, { useState } from 'react';
import RuleActions from './RuleActions';
import { Rule } from '../types/Rules';

interface RulesDetailsProps {
  rule: Rule;
  rulesManager: ReturnType<typeof import('../hooks/useRulesManager').useRulesManager>;
  selectedIntegrationId: string;
}

const RulesDetails: React.FC<RulesDetailsProps> = ({ 
  rule, 
  rulesManager, 
  selectedIntegrationId 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [parsedParams, setParsedParams] = useState<any>({});

  // Tenta parsear os parâmetros customizados
  React.useEffect(() => {
    try {
      const parsed = JSON.parse(rule.customParameters || '{}');
      setParsedParams(parsed);
    } catch (error) {
      console.error('Erro ao parsear customParameters:', error);
      setParsedParams({});
    }
  }, [rule.customParameters]);

  const shouldShowElement = 
    Array.isArray(parsedParams) && parsedParams.length > 0;

  const handleModal = (open: boolean) => {
    setShowModal(open);
  };

  return (
    <DetailsContainer>
      <DetailsListContainer>
        <DetailsHeader>
          <RuleTitleWrapper>
            <IconContainer>
              <Icon
                name="laptopMobile"
                color={theme.colors.ExperianGrey900}
                width={18}
                height={14}
              />
            </IconContainer>
            <RuleTitle>
              <Typography.Label size="md">
                {i18n.t('shared.rule')} {rule.code}
              </Typography.Label>
              <p>{rule.name}</p>
            </RuleTitle>
          </RuleTitleWrapper>

          {shouldShowElement && (
            <Button
              outlined
              icon={{
                name: 'pen',
                color: theme.colors.ExperianGrey800,
                width: 17,
              }}
              textColor={theme.colors.ExperianGrey900}
              id={i18n.t('shared.editParameters')}
              onClick={() => handleModal(true)}
            />
          )}
        </DetailsHeader>

        <Modal 
          width={700} 
          onCloseClick={() => setShowModal(false)}
          show={showModal}
        >
          <RuleModal
            rule={rule}
            parameters={parsedParams}
            ruleIndex={rule.code}
          />
        </Modal>
      </DetailsListContainer>

      <DetailsHeaderDivider />

      {/* Passa o rulesManager e selectedIntegrationId para RuleActions */}
      <RuleActions 
        rule={rule} 
        rulesManager={rulesManager}
        selectedIntegrationId={selectedIntegrationId}
      />

      <DetailsListContainer>
        <RuleInfos rule={rule} />
      </DetailsListContainer>
    </DetailsContainer>
  );
};

export default RulesDetails;