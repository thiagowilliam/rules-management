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

  // RulesModal - Função handleSave corrigida
const handleSave = () => {
  try {
    console.log('[RulesModal] Iniciando salvamento...');
    
    // Objeto para armazenar os parâmetros atualizados
    const updatedParameters: Record<string, any> = {};
    
    // Debug: Verificar se temos parâmetros
    console.log('[RulesModal] Parameters:', parameter);
    console.log('[RulesModal] inputRefs.current:', inputRefs.current);
    
    // Percorrer todos os parâmetros e coletar seus valores
    parameter.forEach((param, index) => {
      const inputRef = inputRefs.current[param.name];
      
      console.log(`[RulesModal] Param ${index}:`, param.name, 'Ref:', inputRef);
      
      if (inputRef) {
        const value = inputRef.getValue();
        const paramName = inputRef.getParameterName();
        
        console.log(`[RulesModal] Valor coletado para ${paramName}:`, value);
        
        updatedParameters[paramName] = value;
      } else {
        console.warn(`[RulesModal] Ref NÃO encontrado para ${param.name}`);
        
        // FALLBACK: Se ref não existe, tenta usar valor padrão do param
        if (param.value !== undefined) {
          updatedParameters[param.name] = param.value;
          console.log(`[RulesModal] Usando valor padrão para ${param.name}:`, param.value);
        }
      }
    });
    
    console.log('[RulesModal] updatedParameters final:', updatedParameters);
    
    // Verificar se temos dados para salvar
    const hasData = Object.keys(updatedParameters).length > 0;
    
    if (!hasData) {
      console.warn('[RulesModal] Nenhum parâmetro coletado! Cancelando salvamento.');
      // Opcional: Mostrar toast/alerta para o usuário
      return;
    }
    
    // Converter para JSON string (formato esperado pelos customParameters)
    const customParametersJson = JSON.stringify(updatedParameters);
    console.log('[RulesModal] JSON a ser salvo:', customParametersJson);
    
    // Salvar usando o rulesManager
    rulesManager.updateRuleParameters(rule.ruleId, customParametersJson);
    
    console.log('[RulesModal] Parâmetros salvos com sucesso!');
    
    // Fechar o modal
    onCloseModal();
  } catch (error) {
    console.error('[RulesModal] Erro ao salvar parâmetros:', error);
    // Opcional: Mostrar toast/alerta de erro para o usuário
  }
};

// Função para debug - adicionar temporariamente
const debugInputs = () => {
  console.log('=== DEBUG INPUTS ===');
  parameter.forEach(param => {
    const ref = inputRefs.current[param.name];
    console.log(`Param: ${param.name}`);
    console.log(`Ref existe:`, !!ref);
    if (ref) {
      console.log(`getValue():`, ref.getValue?.());
      console.log(`getParameterName():`, ref.getParameterName?.());
    }
    console.log('---');
  });
};

// Para usar o debug, adicione um botão temporário no JSX:
// <button onClick={debugInputs}>Debug Inputs</button>

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