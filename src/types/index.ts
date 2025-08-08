export interface Rule {
  id: string;
  name: string;
  type: 'premium' | 'normal';
  status: 'active' | 'low_confidence' | 'fraud_suspect';
  description?: string;
  isNew?: boolean;
  actions: RuleAction[];
  parameters: RuleParameter[];
  information: RuleInformation;
}

export interface RuleAction {
  name: string;
  enabled: boolean;
  color: 'red' | 'gray';
}

export interface RuleParameter {
  label: string;
  value: string;
  unit?: string;
}

export interface RuleInformation {
  whatItDoes: string;
  whenActivated: string;
}

export interface Integration {
  id: string;
  name: string;
  enabled: boolean;
}