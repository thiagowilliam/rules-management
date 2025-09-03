import React, { ReactElement, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import ButtonX from 'src/components/dls/ButtonX';
import Card from 'src/components/dls/Card';
import Checkbox from 'src/components/dls/Checkbox';
import { InputMask, InputMaskRef } from 'src/components/dls/InputMask';
import Select, { OptionProps, SelectRef } from 'src/components/dls/Select';
import tagRender from 'src/components/dls/Select/CustomTag';
import Typography from 'src/components/dls/Typography';
import { i18n } from 'src/i18n';
import {
  CustomParametersParsed,
  FieldType,
} from 'src/modules/Contextual/services/Rules/dtos/Rules.dto';
import theme from 'src/styles/theme';

import {
  AddressInput,
  AddressInputContainer,
  Address,
  AddressList,
  InputContainer,
  AddressDivider,
  RemoveItem,
} from './styles';

// Interface para as props do componente
interface RulesInputProps {
  label: string;
  typeField: FieldType;
  placeholder: string;
  data: CustomParametersParsed;
}

// Interface para expor métodos do componente via ref
export interface RulesInputRef {
  getValue: () => any;
  getParameterName: () => string;
}

// Opções para o select de tempo
const TIME_UNITS: OptionProps[] = [
  { name: i18n.t('shared.seconds'), id: 'seconds' },
  { name: i18n.t('shared.minutes'), id: 'minutes' },
  { name: i18n.t('shared.hours'), id: 'hours' },
  { name: i18n.t('shared.days'), id: 'days' },
];

const RulesInput = forwardRef<RulesInputRef, RulesInputProps>(({
  label,
  typeField,
  placeholder,
  data,
}, ref) => {
  // Refs para os diferentes tipos de input
  const inputRef = useRef<InputMaskRef>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<SelectRef>(null);
  
  // Estado local para o tipo ADDRESS (lista de endereços)
  const [addressList, setAddressList] = useState<CustomParametersParsed[]>([]);

  // Inicializar valores baseado no tipo de campo
  useEffect(() => {
    initializeFieldValue();
  }, [data.value, typeField]);

  // Função para inicializar valores nos campos
  const initializeFieldValue = () => {
    switch (typeField) {
      case FieldType.INPUT:
        if (inputRef.current && data.value) {
          inputRef.current.setValue(String(data.value));
        }
        break;
        
      case FieldType.SELECT:
        if (selectRef.current && data.value) {
          selectRef.current.setValue(String(data.value));
        }
        break;
        
      case FieldType.ADDRESS:
        initializeAddressList();
        break;
        
      // CHECKBOX não precisa inicialização pois usa defaultChecked
    }
  };

  // Inicializar lista de endereços
  const initializeAddressList = () => {
    if (!data.value) {
      setAddressList([]);
      return;
    }

    try {
      // Se for string JSON, fazer parse
      if (typeof data.value === 'string' && data.value.startsWith('[')) {
        const parsed = JSON.parse(data.value);
        setAddressList(Array.isArray(parsed) ? parsed : []);
      } 
      // Se já for array, usar diretamente
      else if (Array.isArray(data.value)) {
        setAddressList(data.value);
      }
      // Caso contrário, lista vazia
      else {
        setAddressList([]);
      }
    } catch (error) {
      console.error('Erro ao parsear endereços:', error);
      setAddressList([]);
    }
  };

  // Expor métodos para o componente pai via useImperativeHandle
  useImperativeHandle(ref, () => ({
    getValue: () => {
      switch (typeField) {
        case FieldType.INPUT:
          return inputRef.current?.value || '';
        case FieldType.SELECT:
          return selectRef.current?.getValue() || '';
        case FieldType.CHECKBOX:
          return checkboxRef.current?.checked || false;
        case FieldType.ADDRESS:
          return JSON.stringify(addressList);
        default:
          return '';
      }
    },
    getParameterName: () => data.name
  }), [typeField, addressList, data.name]);

  // Adicionar novo endereço à lista
  const handleAddAddress = () => {
    const inputValue = inputRef.current?.value?.trim();
    
    if (!inputValue) {
      return; // Não adicionar se estiver vazio
    }

    const newAddress: CustomParametersParsed = {
      name: inputValue,
      value: inputValue, // ou algum outro valor se necessário
    };

    setAddressList(prevList => [...prevList, newAddress]);
    
    // Limpar o input após adicionar
    if (inputRef.current) {
      inputRef.current.setValue('');
    }
  };

  // Remover endereço da lista
  const handleRemoveAddress = (index: number) => {
    setAddressList(prevList => prevList.filter((_, i) => i !== index));
  };

  // Renderizar divisor entre endereços
  const renderAddressDivider = (index: number): ReactElement => {
    // Não mostrar divisor no último item ou quando há apenas um item
    if (index === addressList.length - 1 || addressList.length === 1) {
      return <></>;
    }
    return <AddressDivider />;
  };

  // Renderizar campo do tipo ADDRESS
  const renderAddressField = () => (
    <>
      {/* Input para adicionar novos endereços */}
      <AddressInputContainer>
        <Typography.Label light>
          {i18n.t(label)}
        </Typography.Label>
        <AddressInput>
          <InputMask
            mask="\*"
            ref={inputRef}
            placeholder={i18n.t(placeholder)}
          />
          <ButtonX variant="secondary" onClick={handleAddAddress}>
            {i18n.t('shared.add')}
          </ButtonX>
        </AddressInput>
      </AddressInputContainer>

      {/* Lista de endereços adicionados */}
      <Card>
        <AddressList>
          <Typography.Body
            size="md"
            style={{ marginBottom: theme.spacings.sm }}
          >
            {i18n.t(label)}
          </Typography.Body>
          
          {addressList.map((item, index) => (
            <React.Fragment key={`${item.name}-${index}`}>
              <Address>
                <p>{item.name}</p>
                <RemoveItem onClick={() => handleRemoveAddress(index)}>
                  {i18n.t('shared.remove')}
                </RemoveItem>
              </Address>
              {renderAddressDivider(index)}
            </React.Fragment>
          ))}
        </AddressList>
      </Card>
    </>
  );

  // Renderizar campo do tipo INPUT
  const renderInputField = () => (
    <>
      <Typography.Label style={{ marginBottom: theme.spacings.s }} light>
        {i18n.t(label)}
      </Typography.Label>
      <InputMask
        mask="\*"
        ref={inputRef}
        placeholder={i18n.t(placeholder)}
        defaultValue={data.value || ''}
      />
    </>
  );

  // Renderizar campo do tipo SELECT
  const renderSelectField = () => (
    <>
      <Typography.Label style={{ marginBottom: theme.spacings.s }} light>
        {i18n.t(label)}
      </Typography.Label>
      <Select
        tagRender={tagRender}
        defaultValue={data.value}
        name="select-time-unit"
        values={TIME_UNITS}
        ref={selectRef}
        nameAsValue
        placeholder={i18n.t(label)}
      />
    </>
  );

  // Renderizar campo do tipo CHECKBOX
  const renderCheckboxField = () => (
    <Checkbox
      ref={checkboxRef}
      label={i18n.t(label)}
      size={16}
      defaultChecked={Boolean(data.value)}
      labelColor={theme.colors.ExperianGrey700}
    />
  );

  // Renderizar campo baseado no tipo
  const renderField = () => {
    switch (typeField) {
      case FieldType.ADDRESS:
        return renderAddressField();
      case FieldType.INPUT:
        return renderInputField();
      case FieldType.SELECT:
        return renderSelectField();
      case FieldType.CHECKBOX:
        return renderCheckboxField();
      default:
        return null;
    }
  };

  return (
    <InputContainer>
      {renderField()}
    </InputContainer>
  );
});

RulesInput.displayName = 'RulesInput';

export default RulesInput;