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

interface InputProps {
  label: string;
  typeField: FieldType;
  placeholder: string;
  data: CustomParametersParsed;
}

export interface RulesInputRef {
  getValue: () => any;
  getParameterName: () => string;
}

const TIME_UNITS: OptionProps[] = [
  { name: i18n.t('shared.seconds'), id: 'seconds' },
  { name: i18n.t('shared.minutes'), id: 'minutes' },
  { name: i18n.t('shared.hours'), id: 'hours' },
  { name: i18n.t('shared.days'), id: 'days' },
];

const RulesInput = forwardRef<RulesInputRef, InputProps>(({
  label,
  typeField,
  placeholder,
  data,
}, ref) => {
  const inputRef = useRef<InputMaskRef>(null);
  const checkboxInputRef = useRef<HTMLInputElement>(null);
  const timeUnitRef = useRef<SelectRef>(null);
  
  const [address, setAddress] = useState<CustomParametersParsed[]>(() => {
    if (typeField === FieldType.ADDRESS && data.value) {
      if (typeof data.value === 'string' && data.value.startsWith('[')) {
        try {
          return JSON.parse(data.value);
        } catch {
          return [];
        }
      }
      return Array.isArray(data.value) ? data.value : [];
    }
    return [];
  });

  const getDivider = (index: number): ReactElement => {
    if (index === address.length && address.length === 1) {
      return <></>;
    }
    return <AddressDivider />;
  };

  useEffect(() => {
    if (typeField === FieldType.INPUT && inputRef.current && data.value) {
      inputRef.current.setValue(String(data.value));
    }
    
    if (typeField === FieldType.SELECT && timeUnitRef.current && data.value) {
      timeUnitRef.current.setValue(String(data.value));
    }
  }, [data.value, typeField]);

  const handleAddButton = (): void => {
    const newAddressList = [
      ...address,
      { name: inputRef.current?.value || '', value: '' },
    ];
    setAddress(newAddressList);
  };

  // Expor métodos para o componente pai
  useImperativeHandle(ref, () => ({
    getValue: () => {
      switch (typeField) {
        case FieldType.INPUT:
          return inputRef.current?.value || '';
        case FieldType.SELECT:
          return timeUnitRef.current?.value || '';
        case FieldType.CHECKBOX:
          return checkboxInputRef.current?.checked || false;
        case FieldType.ADDRESS:
          return JSON.stringify(address);
        default:
          return '';
      }
    },
    getParameterName: () => data.name
  }), [typeField, address, data.name]);

  return (
    <InputContainer>
      {typeField === FieldType.ADDRESS && (
        <AddressInputContainer>
          <Typography.Label light>
            {i18n.t(label)}
          </Typography.Label>
          <AddressInput>
            <InputMask
              mask="\*"
              ref={inputRef}
              placeholder={i18n.t(placeholder)}
              defaultValue={data.value}
            />
            <ButtonX variant="secondary" onClick={handleAddButton}>
              {i18n.t('shared.add')}
            </ButtonX>
          </AddressInput>
        </AddressInputContainer>
      )}

      <Card>
        <AddressList>
          <Typography.Body
            size="md"
            style={{ marginBottom: theme.spacings.sm }}
          >
            {i18n.t(label)}
          </Typography.Body>
          {address.map((item, index) => (
            <>
              <Address key={`${item.name}-${index}`}>
                <p>{item.name}</p>
                <RemoveItem>{i18n.t('shared.remove')}</RemoveItem>
              </Address>
              {getDivider(index)}
            </>
          ))}
        </AddressList>
      </Card>

      {typeField === FieldType.INPUT && (
        <>
          <Typography.Label style={{ marginBottom: theme.spacings.s }} light>
            {i18n.t(label)}
          </Typography.Label>
          <InputMask
            mask="\*"
            ref={inputRef}
            placeholder={i18n.t(placeholder)}
            defaultValue={data.value}
          />
        </>
      )}

      {typeField === FieldType.SELECT && (
        <>
          <Typography.Label style={{ marginBottom: theme.spacings.s }} light>
            {i18n.t(label)}
          </Typography.Label>
          <Select
            tagRender={tagRender}
            defaultValue={data.value}
            name="select-time-unit"
            values={TIME_UNITS}
            ref={timeUnitRef}
            nameAsValue
            placeholder={i18n.t(label)}
          />
        </>
      )}

      {typeField === FieldType.CHECKBOX && (
        <Checkbox
          ref={checkboxInputRef}
          label={i18n.t(label)}
          size={16}
          defaultChecked={false}
          labelColor={theme.colors.ExperianGrey700}
        />
      )}
    </InputContainer>
  );
});

RulesInput.displayName = 'RulesInput';

export default RulesInput;