import React from 'react';
import { Rule } from '../types/Rule';
import { RuleItem } from './RuleItem';

interface RulesSectionProps {
  title: string;
  rules: Rule[];
  selectedRuleId: string | null;
  onRuleSelect: (ruleId: string) => void;
  emptyMessage?: string;
}

export const RulesSection: React.FC<RulesSectionProps> = ({
  title,
  rules,
  selectedRuleId,
  onRuleSelect,
  emptyMessage = "Nenhuma regra encontrada"
}) => {
  if (rules.length === 0) {
    return null;
  }

  return (
    <>
      <Title>{title}</Title>
      <RulesContainer>
        {rules.map((rule: Rule) => (
          <RuleItem
            key={rule.rule_id}
            rule={rule}
            isSelected={selectedRuleId === rule.rule_id}
            onClick={onRuleSelect}
          />
        ))}
      </RulesContainer>
    </>
  );
};