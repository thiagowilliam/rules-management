import React, { useRef } from 'react';
import ButtonX from 'src/components/dls/ButtonX';
import Card from 'src/components/dls/Card';
import { ModalBody, ModalFooter, ModalHeader } from 'src/components/dls/Modal';
import Typography from 'src/components/dls/Typography';
import { i18n } from 'src/i18n';
import {
  CustomParametersParsed,
  Rule,
} from 'src/modules/Contextual/services/Rules/dtos/Rules.dto';
import { RulesList } from 'src/modules/Contextual/utils/rules';

import RulesInfoBox from './RulesInfoBox';
import RulesInput, { RulesInputRef } from './RulesInput';
import {
  ContainerFilterRow,
  Counter,
  InputWrapper,
  ParametersTitle,
} from './styles';

interface RulesModalProps {
  rule: Rule;
  parameter: CustomParametersParsed[];
  ruleIndex: number;
  rulesManager: ReturnType<typeof import('../hooks/useRulesManager').useRulesManager>;
  selectedIntegrationId: string;
  onCloseModal: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({
  rule,
  parameter,
  ruleIndex,
  rulesManager,
  selectedIntegrationId,
  onCloseModal,
}) => {
  // Refs para capturar os valores de cada RulesInput
  const inputRefs = useRef<Record<string, RulesInputRef>>({});

  const handleSave = () => {
    try {
      // Objeto para armazenar os parâmetros atualizados
      const updatedParameters: Record<string, any> = {};
      
      // Percorrer todos os parâmetros e coletar seus valores
      parameter.forEach((param) => {
        const inputRef = inputRefs.current[param.name];
        if (inputRef) {
          const value = inputRef.getValue();
          updatedParameters[param.name] = value;
        }
      });

      // Converter para JSON string (formato esperado pelos customParameters)
      const customParametersJson = JSON.stringify(updatedParameters);

      // Atualizar os parâmetros da regra localmente
      rulesManager.updateRuleParameters(rule.ruleId, customParametersJson);

      // Fechar o modal
      onCloseModal();
      
      console.log('Parâmetros atualizados:', {
        ruleId: rule.ruleId,
        parameters: updatedParameters,
      });
    } catch (error) {
      console.error('Erro ao salvar parâmetros:', error);
    }
  };

  const handleClose = () => {
    onCloseModal();
  };

  return (
    <>
      <ModalHeader>
        <span>{i18n.t('shared.editParameters')}</span>
      </ModalHeader>

      <ModalBody>
        {/* Informações da regra */}
        <RulesInfoBox 
          key={`${rule.name}`} 
          index={ruleIndex} 
          rule={rule} 
        />

        {/* Título dos parâmetros */}
        <ParametersTitle>
          <Typography.Body size="md">
            {i18n.t('shared.parameters')}
          </Typography.Body>
        </ParametersTitle>

        {/* Lista de parâmetros editáveis */}
        {parameter.map((item, index) => (
          <Card key={`${item.name}-${index}`}>
            <InputWrapper>
              <Counter>{index + 1}</Counter>
              <RulesInput
                ref={(el) => {
                  if (el) {
                    inputRefs.current[item.name] = el;
                  }
                }}
                label={RulesList[item.name]?.label || item.name}
                typeField={RulesList[item.name]?.fieldType}
                placeholder={RulesList[item.name]?.placeholder}
                data={item}
              />
            </InputWrapper>
          </Card>
        ))}
      </ModalBody>

      <ModalFooter>
        <ContainerFilterRow>
          <ButtonX 
            variant="secondary" 
            onClick={handleClose}
          >
            {i18n.t('shared.close')}
          </ButtonX>
          <ButtonX 
            onClick={handleSave}
          >
            {i18n.t('shared.save')}
          </ButtonX>
        </ContainerFilterRow>
      </ModalFooter>
    </>
  );
};

export default RulesModal;