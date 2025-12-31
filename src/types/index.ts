export enum InvariantType {
  // Classical Mathematics
  SPECTRAL_ZETA = 'SPECTRAL_ZETA',
  POLYNOMIAL = 'POLYNOMIAL',
  ROOT_DYNAMICS = 'ROOT_DYNAMICS',
  SEQUENCES = 'SEQUENCES',
  FUNCTIONAL_EQ = 'FUNCTIONAL_EQ',
  NUMBER_THEORY = 'NUMBER_THEORY',
  DIOPHANTINE = 'DIOPHANTINE',
  COMBINATORIAL = 'COMBINATORIAL',
  GEOMETRIC = 'GEOMETRIC',

  // COINjecture Network B - Core Dimensional
  DIMENSIONAL_SCALE = 'DIMENSIONAL_SCALE',
  CONSENSUS_STATE = 'CONSENSUS_STATE',
  ALLOCATION_RATIO = 'ALLOCATION_RATIO',
  UNLOCK_SCHEDULE = 'UNLOCK_SCHEDULE',
  YIELD_RATE = 'YIELD_RATE',
  VIVIANI_ORACLE = 'VIVIANI_ORACLE',

  // COINjecture Network B - Consensus & Mining
  DIFFICULTY_ADJUSTMENT = 'DIFFICULTY_ADJUSTMENT',
  WORK_SCORE = 'WORK_SCORE',

  // COINjecture Network B - Tokenomics
  EMISSION_RATE = 'EMISSION_RATE',
  CONSENSUS_MAGNITUDE = 'CONSENSUS_MAGNITUDE',
  HALVING_SCHEDULE = 'HALVING_SCHEDULE',

  // COINjecture Network B - Network & Reputation
  REPUTATION_SCORE = 'REPUTATION_SCORE',
  STAKE_RATIO = 'STAKE_RATIO',
  AGE_RATIO = 'AGE_RATIO',

  // COINjecture Network B - Pricing & Fees
  DYNAMIC_PRICING = 'DYNAMIC_PRICING',
  FEE_MARKET = 'FEE_MARKET',

  // COINjecture Network B - Staking
  STAKING_MULTIPLIER = 'STAKING_MULTIPLIER',
  PORTFOLIO_METRICS = 'PORTFOLIO_METRICS',

  // COINjecture Network B - Deflation
  BURN_RATE = 'BURN_RATE',

  // COINjecture Network B - Network Metrics
  NETWORK_METRICS = 'NETWORK_METRICS',

  // AxiomPrime Protocol - Prime-Spectral Engine
  HARDY_Z_FUNCTION = 'HARDY_Z_FUNCTION',
  SPECTRAL_LOAD = 'SPECTRAL_LOAD',
  PSI_STABILITY = 'PSI_STABILITY',
  QUANTUM_FALLBACK = 'QUANTUM_FALLBACK',
  RIEMANN_SIEGEL_THETA = 'RIEMANN_SIEGEL_THETA',
  PRIME_SPECTRAL_ENGINE = 'PRIME_SPECTRAL_ENGINE',
  RH_EQUILIBRIUM = 'RH_EQUILIBRIUM',
}

export interface SolverLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface SolverResult {
  answer: number | string;
  invariantUsed: InvariantType | null;
  steps: string[];
  logs: SolverLog[];
  metadata?: {
    constants?: Record<string, number>;
    intermediateValues?: Record<string, number | string | boolean>;
    formulaUsed?: string;
  };
}
