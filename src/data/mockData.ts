import type { Rule, Integration } from '../types';

export const integrations: Integration[] = [
  { id: '1', name: 'cliente_password_reset', enabled: true },
  { id: '2', name: 'cliente_password_reset', enabled: true },
  { id: '3', name: 'cliente_login', enabled: true },
  { id: '4', name: 'cliente_onboarding', enabled: true },
  { id: '5', name: 'cliente_password_reset', enabled: true },
  { id: '6', name: 'cliente_login', enabled: true },
];

export const rules: Rule[] = [
  {
    id: 'KYC01',
    name: 'Alerta de perfil laranja',
    type: 'premium',
    status: 'fraud_suspect',
    isNew: true,
    actions: [
      { name: 'Ativar', enabled: true, color: 'red' },
      { name: 'Baixa confiança', enabled: true, color: 'red' },
      { name: 'Suspeita de fraude', enabled: false, color: 'gray' }
    ],
    parameters: [
      { label: 'Score mínimo', value: '75', unit: 'pontos' },
      { label: 'Tempo de análise', value: '24', unit: 'horas' }
    ],
    information: {
      whatItDoes: 'Analisa o perfil do cliente e identifica comportamentos suspeitos baseados em machine learning.',
      whenActivated: 'Quando o score de risco do cliente ultrapassa 75 pontos em análises comportamentais.'
    }
  },
  {
    id: 'REGRA3',
    name: 'Geolocalização inconsistente',
    type: 'normal',
    status: 'fraud_suspect',
    actions: [
      { name: 'Ativar', enabled: true, color: 'red' },
      { name: 'Baixa confiança', enabled: true, color: 'red' },
      { name: 'Suspeita de fraude', enabled: false, color: 'gray' }
    ],
    parameters: [
      { label: 'Velocidade média de deslocamento', value: '800', unit: 'km/h' },
      { label: 'Tolerância temporal', value: '30', unit: 'minutos' }
    ],
    information: {
      whatItDoes: 'Calcula a velocidade média de deslocamento entre o IP da transação atual com o IP da transação anterior.',
      whenActivated: 'Quando a velocidade calculada entre duas transações consecutivas excede valores fisicamente possíveis.'
    }
  },
  {
    id: 'REGRA4',
    name: 'Fuso horário inconsistente',
    type: 'normal',
    status: 'low_confidence',
    actions: [
      { name: 'Ativar', enabled: true, color: 'red' },
      { name: 'Baixa confiança', enabled: true, color: 'red' },
      { name: 'Suspeita de fraude', enabled: false, color: 'gray' }
    ],
    parameters: [
      { label: 'Diferença máxima', value: '6', unit: 'horas' },
      { label: 'Período de análise', value: '7', unit: 'dias' }
    ],
    information: {
      whatItDoes: 'Verifica inconsistências no fuso horário das transações comparando com o histórico do usuário.',
      whenActivated: 'Quando há uma diferença significativa no fuso horário das transações em um período curto.'
    }
  },
  {
    id: 'REGRA6',
    name: 'Cookie não detectado',
    type: 'normal',
    status: 'active',
    actions: [
      { name: 'Ativar', enabled: true, color: 'red' },
      { name: 'Baixa confiança', enabled: false, color: 'gray' },
      { name: 'Suspeita de fraude', enabled: false, color: 'gray' }
    ],
    parameters: [
      { label: 'Tempo de validade', value: '30', unit: 'dias' },
      { label: 'Tolerância', value: '3', unit: 'tentativas' }
    ],
    information: {
      whatItDoes: 'Verifica se o cookie de identificação do dispositivo está presente na transação.',
      whenActivated: 'Quando uma transação é realizada sem o cookie de identificação esperado.'
    }
  },
  {
    id: 'REGRA9',
    name: 'Blocklist do efeito rede',
    type: 'normal',
    status: 'active',
    actions: [
      { name: 'Ativar', enabled: true, color: 'red' },
      { name: 'Baixa confiança', enabled: false, color: 'gray' },
      { name: 'Suspeita de fraude', enabled: true, color: 'red' }
    ],
    parameters: [
      { label: 'Threshold de ativação', value: '5', unit: 'conexões' },
      { label: 'Janela temporal', value: '1', unit: 'hora' }
    ],
    information: {
      whatItDoes: 'Identifica padrões de rede suspeitos através de análise de conexões e comportamentos correlacionados.',
      whenActivated: 'Quando múltiplas contas suspeitas compartilham características de rede similares.'
    }
  }
];