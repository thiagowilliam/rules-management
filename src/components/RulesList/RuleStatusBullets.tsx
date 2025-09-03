import React from 'react';
import { Rule } from '../types/Rule';

interface RuleStatusBulletsProps {
  rule: Rule;
}

export const RuleStatusBullets: React.FC<RuleStatusBulletsProps> = ({ rule }) => {
  const getBulletConfig = () => {
    if (rule.active && !rule.markAsFraud) {
      return {
        enabled: { show: true, text: 'Ativada' },
        confidence: { show: true, text: 'Baixa confiança' },
        fraud: { show: false, text: '' }
      };
    }
    
    if (rule.markAsUnauthorized) {
      return {
        enabled: { show: false, text: '' },
        confidence: { show: false, text: '' },
        fraud: { show: true, text: 'Suspeita de fraude' }
      };
    }
    
    return {
      enabled: { show: false, text: '' },
      confidence: { show: false, text: '' },
      fraud: { show: false, text: '' }
    };
  };

  const config = getBulletConfig();

  return (
    <>
      {config.enabled.show && (
        <BulletEnabled>
          <BulletEnabled>{config.enabled.text}</BulletEnabled>
        </BulletEnabled>
      )}
      
      {config.confidence.show && (
        <BulletLowConfidence>
          {config.confidence.text}
        </BulletLowConfidence>
      )}
      
      {config.fraud.show && (
        <BulletFraudSuspected>
          {config.fraud.text}
        </BulletFraudSuspected>
      )}
    </>
  );
};