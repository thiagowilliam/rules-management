import React from 'react';
import { Rule } from '../types/Rule';

interface RuleItemProps {
  rule: Rule;
  isSelected: boolean;
  onClick: (ruleId: string) => void;
}

export const RuleItem: React.FC<RuleItemProps> = ({ rule, isSelected, onClick }) => {
  return (
    <RuleItem
      key={rule.ruleId}
      onClick={() => onClick(rule.ruleId)}
    >
      <ContainerSVG>
        <SVG src={iconLaptopMobile} />
      </ContainerSVG>
      
      <InfoRule>
        <ButtonNewRule>
          <strong>{rule.codename}</strong>
        </ButtonNewRule>
        <p>{rule.name}</p>
        
        <ContainerBullets>
          <RuleStatusBullets rule={rule} />
        </ContainerBullets>
      </InfoRule>
      
      <IconX
        name="angle-right"
        color={theme.colors.ExperianAgentasA0}
      />
    </RuleItem>
  );
};