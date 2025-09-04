/* eslint-disable @typescript-eslint/eslint/explicit-function-return-type */
import React, { useRef, useMemo } from 'react';

import ButtonX from 'src/components/dls/ButtonX';
import { ModalBody, ModalFooter, ModalHeader } from 'src/components/dls/Modal';
import Typography from 'src/components/dls/Typography';
import { i18n } from 'src/i18n';
import {
  CustomParametersParsed,
  Rule,
} from 'src/modules/Contextual/services/Rules/dtos/Rules.dto';
import { RulesList } from 'src/modules/Contextual/utils/rules';

import RulesInfoBox from '../RulesInfoBox';
import RulesInput, { RulesInputRef } from '../RulesInput';
import {
  ContainerFilterRow,
  ContainerInputs,
  Counter,
  InputWrapper,
  ParametersTitle,
} from './styles';

interface RulesModalProps {
  rule: Rule;
  ruleIndex: number;
  parameter: CustomParametersParsed[];
  rulesManager: ReturnType<
    typeof import('../hooks/useRulesManager').useRulesManager
  >;
  onCloseModal: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({
  rule,
  parameter,
  ruleIndex,
  rulesManager,
  onCloseModal,
}) => {
  const inputRefs = useRef<Record<string, RulesInputRef>>({});

  const handleSave = () => {
    try {
      const updatedParameters: Record<string, any> = {};

      parameter.forEach(param => {
        const inputRef = inputRefs.current[param.name];
        
        if (inputRef) {
          const value = inputRef.getValue();
          const paramName = inputRef.getParameterName();
          
          updatedParameters[paramName] = value;
        } else {
          console.warn('[RulesModal] Ref não encontrado para:', param.name);
        }
        
        if (param.value === undefined) {
          updatedParameters[param.name] = param.value;
        }
      });

      const hasData = Object.keys(updatedParameters).length > 0;

      if (!hasData) {
        console.warn(
          '[RulesModal] Nenhum parâmetro coletado! Cancelando salvamento.'
        );
        return;
      }

      const parametersArray = Object.entries(updatedParameters).map(
        ([name, value]) => ({
          name,
          value: String(value), // Garantir que seja string
        })
      );

      const customParametersJson = JSON.stringify(
        parametersArray.length > 0 ? parametersArray : []
      );

      rulesManager.updateRuleParameters(rule.ruleId, customParametersJson);

      onCloseModal();
    } catch (error) {
      console.error('[RulesModal] Erro ao salvar parâmetros:', error);
    }
  };

  const handleClose = () => {
    onCloseModal();
  };

  // Solução 3: Usando useMemo para organizar parâmetros com checkbox no final
  const sortedParameters = useMemo(() => {
    return [
      ...parameter.filter(item => RulesList[item.name]?.fieldType !== 'checkbox'),
      ...parameter.filter(item => RulesList[item.name]?.fieldType === 'checkbox')
    ];
  }, [parameter]);

  return (
    <>
      <ModalHeader>
        <span>{i18n.t('shared.editParameters')}</span>
      </ModalHeader>
      <ModalBody>
        <RulesInfoBox key={`${rule.name}-${ruleIndex}`} rule={rule} />

        <ParametersTitle>
          <Typography.Body size="md">
            {i18n.t('shared.parameters')}
          </Typography.Body>
        </ParametersTitle>

        <ContainerInputs>
          {/* Lista de parâmetros editáveis */}
          {sortedParameters.map((item, index) => {
            return (
              <InputWrapper key={`${item.name}-${index}`}>
                <Counter>{index + 1}</Counter>
                <RulesInput
                  ref={el => {
                    if (el) {
                      inputRefs.current[item.name] = el;
                    } else {
                      delete inputRefs.current[item.name];
                    }
                  }}
                  label={RulesList[item.name]?.label || item.name}
                  typeField={RulesList[item.name]?.fieldType}
                  placeholder={RulesList[item.name]?.placeholder}
                  data={item}
                />
              </InputWrapper>
            );
          })}
        </ContainerInputs>
      </ModalBody>

      <ModalFooter>
        <ContainerFilterRow>
          <ButtonX variant="secondary" onClick={handleClose}>
            {i18n.t('shared.close')}
          </ButtonX>
        </ContainerFilterRow>
        <ButtonX onClick={handleSave}>
          {i18n.t('shared.save')}
        </ButtonX>
      </ModalFooter>
    </>
  );
};

export default RulesModal;