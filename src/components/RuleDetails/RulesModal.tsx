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
      console.log('[RulesModal] Iniciando handleSave...');
      console.log('[RulesModal] Rule:', rule);
      console.log('[RulesModal] Parameters:', parameter);
      console.log('[RulesModal] InputRefs:', inputRefs.current);
      
      // Objeto para armazenar os parâmetros atualizados
      const updatedParameters: Record<string, any> = {};
      
      // Percorrer todos os parâmetros e coletar seus valores
      parameter.forEach((param) => {
        console.log(`[RulesModal] Processando parâmetro: ${param.name}`);
        
        const inputRef = inputRefs.current[param.name];
        
        if (inputRef) {
          console.log(`[RulesModal] Ref encontrado para ${param.name}`);
          
          const value = inputRef.getValue();
          const paramName = inputRef.getParameterName();
          
          console.log(`[RulesModal] Valor coletado para ${paramName}:`, value);
          
          updatedParameters[paramName] = value;
        } else {
          console.warn(`[RulesModal] Ref NÃO encontrado para ${param.name}`);
          console.log('[RulesModal] Refs disponíveis:', Object.keys(inputRefs.current));
        }
      });

      console.log('[RulesModal] Parâmetros coletados:', updatedParameters);

      // Converter para JSON string (formato esperado pelos customParameters)
      const customParametersJson = JSON.stringify(updatedParameters);
      console.log('[RulesModal] JSON gerado:', customParametersJson);

      // Atualizar os parâmetros da regra localmente
      console.log(`[RulesModal] Chamando updateRuleParameters para ruleId: ${rule.ruleId}`);
      rulesManager.updateRuleParameters(rule.ruleId, customParametersJson);

      // Fechar o modal
      onCloseModal();
      
      console.log('[RulesModal] Salvamento concluído!');
    } catch (error) {
      console.error('[RulesModal] Erro ao salvar parâmetros:', error);
    }
  };

  const handleClose = () => {
    console.log('[RulesModal] Modal fechado sem salvar');
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
        {parameter.map((item, index) => {
          console.log(`[RulesModal] Renderizando input para: ${item.name}`, item);
          
          return (
            <Card key={`${item.name}-${index}`}>
              <InputWrapper>
                <Counter>{index + 1}</Counter>
                <RulesInput
                  ref={(el) => {
                    if (el) {
                      console.log(`[RulesModal] Ref definido para: ${item.name}`);
                      inputRefs.current[item.name] = el;
                    } else {
                      console.log(`[RulesModal] Ref REMOVIDO para: ${item.name}`);
                      delete inputRefs.current[item.name];
                    }
                  }}
                  label={RulesList[item.name]?.label || item.name}
                  typeField={RulesList[item.name]?.fieldType}
                  placeholder={RulesList[item.name]?.placeholder}
                  data={item}
                />
              </InputWrapper>
            </Card>
          );
        })}
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