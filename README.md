# MathCompose 🧮

**Unified Mathematical Problem Solver** combining classical axioms with COINjecture Network B formulas.

## Overview

MathCompose is a comprehensive mathematical problem-solving library that unifies:

- **Classical Mathematics**: Spectral analysis, polynomials, number theory, geometry, combinatorics
- **COINjecture Network B Formulas**: Dimensional scales, consensus dynamics, tokenomics, reputation systems

All formulas are **dimensionless**, **self-referential**, and **empirically grounded**.

## Features

### 📐 Classical Mathematics Solvers

1. **Spectral Zeta** - Riemann zeta function and Dirichlet series analysis
2. **Polynomials** - Quadratic interpolation and evaluation
3. **Root Dynamics** - Vieta's formulas and Newton's sums
4. **Sequences** - Arithmetic and geometric progressions
5. **Functional Equations** - Cauchy equations and logarithmic solutions
6. **Number Theory** - Lucas theorem, Euler's totient function
7. **Diophantine** - Frobenius numbers and linear combinations
8. **Combinatorics** - Subset intersections and inclusion-exclusion
9. **Geometry** - Euler characteristic and Pick's theorem

### 🌐 COINjecture Network B Solvers

1. **Dimensional Scale** - `D_n(τ) = e^(-η·τ_n)`
2. **Consensus State** - `ψ(τ) = e^(-ητ) · e^(iλτ)`
3. **Unlock Schedule** - `U_n(τ) = 1 - e^(-η(τ - τ_n))`
4. **Viviani Oracle** - Network health metric `Δ`
5. **Emission Rate** - `emission(t) = η · |ψ(t)| · base / 2^halvings`
6. **Reputation Score** - `R = (S_ratio × T_ratio × (1+bonus)) / (1+faults)`
7. **Staking Multiplier** - `M = 1 + (λ × coverage × Δ_critical)`
8. **Burn Rate** - `burn_rate = λ · work / supply`

### 🔢 Mathematical Constants

- **η (Eta)**: `1/√2 ≈ 0.7071` - Satoshi constant (critical equilibrium)
- **λ (Lambda)**: `1/√2 ≈ 0.7071` - Coupling constant (equal to η at equilibrium)
- **φ (Phi)**: `(1+√5)/2 ≈ 1.618` - Golden ratio
- **φ⁻¹**: `(√5-1)/2 ≈ 0.618` - Inverse golden ratio
- **τ_c**: `√2 ≈ 1.414` - Consensus time constant
- **Δ_critical**: `η(1-η) ≈ 0.207` - Viviani critical delta

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Example

```typescript
import { AxiomPrimeSolver } from './src';

const solver = new AxiomPrimeSolver();

// Classical mathematics
const result1 = await solver.solve('Calculate (10 choose 3) mod 7');
console.log(result1.answer); // Uses Lucas theorem

// COINjecture formulas
const result2 = await solver.solve('What is the dimensional scale D_4 for pool 4?');
console.log(result2.answer); // Uses D_n(τ) = e^(-η·τ_n)
```

### Running Tests

```bash
npm run build
node dist/examples/test-examples.js
```

## Example Problems

### Classical Mathematics

```typescript
// Spectral Zeta
"Calculate spectral score for frequency t=14.1347"

// Polynomial
"Quadratic with leading coeff 2, 3 through points (1, 5), (2, 10). Find P+Q(100)"

// Root Dynamics
"For x^2 - 5x + 6 = 0, find sum of the roots"

// Diophantine
"What is the largest integer that cannot be expressed using 6 and 9?"

// Number Theory
"Calculate (10 choose 3) mod 7"

// Geometric
"A convex polyhedron has 8 vertices and 12 edges. How many faces?"
```

### COINjecture Network B

```typescript
// Dimensional Scale
"What is the dimensional scale D_4 for pool 4?"

// Consensus State
"Calculate the consensus state psi at tau=1.5"

// Unlock Schedule
"What fraction is unlocked for pool 3 at tau=1.0?"

// Viviani Oracle
"Calculate the Viviani oracle delta for eta=0.7 and lambda=0.7"

// Emission Rate
"Calculate emission rate with |ψ|=0.85, base_emission=50, halving=1"

// Reputation Score
"Calculate reputation for stake=1000, median stake=500, age=100, median age=50"

// Staking Multiplier
"Calculate staking multiplier for share1=0.4, share2=0.3, share3=0.3"

// Burn Rate
"Calculate burn rate with work=1000000 and supply=50000000"
```

## Architecture

```
MathCompose/
├── src/
│   ├── types/
│   │   └── index.ts          # Type definitions
│   ├── utils/
│   │   ├── fraction.ts        # Precise rational arithmetic
│   │   └── axiom-prime-solver.ts  # Main solver
│   └── index.ts               # Public API
├── examples/
│   └── test-examples.ts       # Comprehensive tests
├── package.json
├── tsconfig.json
└── README.md
```

## Solver Result Structure

```typescript
interface SolverResult {
  answer: number | string;
  invariantUsed: InvariantType | null;
  steps: string[];
  logs: SolverLog[];
  metadata?: {
    constants?: Record<string, number>;
    intermediateValues?: Record<string, number | string>;
    formulaUsed?: string;
  };
}
```

## Design Principles

All formulas adhere to three principles:

1. **Dimensionless**: Pure ratios, percentages, or dimensionless quantities
2. **Self-Referential**: Normalized against network's own state
3. **Empirically Grounded**: Derived from actual observations or mathematical theory

## Formula Compliance

- ✅ **56 formulas** documented and implemented
- ✅ **100% compliance** with dimensionless/self-referential/empirical principles
- ✅ **14 solver methods** covering both classical and modern mathematics

## Documentation

- **Formula Reference**: See `COMPLETE_FORMULA_REFERENCE.md` for full formula documentation
- **Constants**: All mathematical constants are derived, not arbitrary
- **Compliance**: Every formula has been audited for compliance

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Test
npm test
```

## API Reference

### AxiomPrimeSolver

```typescript
class AxiomPrimeSolver {
  constructor(modulo?: number);

  // Main solver
  async solve(problem: string): Promise<SolverResult>;

  // Get constants
  getConstants(): Record<string, number>;

  // Classical solvers
  solveSpectralZeta(problem: string): SolverResult | null;
  solvePolynomial(problem: string): SolverResult | null;
  solveRootDynamics(problem: string): SolverResult | null;
  solveSequences(problem: string): SolverResult | null;
  solveFunctionalEq(problem: string): SolverResult | null;
  solveNumberTheory(problem: string): SolverResult | null;
  solveDiophantine(problem: string): SolverResult | null;
  solveCombinatorial(problem: string): SolverResult | null;
  solveGeometric(problem: string): SolverResult | null;

  // COINjecture solvers
  solveDimensionalScale(problem: string): SolverResult | null;
  solveConsensusState(problem: string): SolverResult | null;
  solveUnlockSchedule(problem: string): SolverResult | null;
  solveVivianiOracle(problem: string): SolverResult | null;
  solveEmissionRate(problem: string): SolverResult | null;
  solveReputationScore(problem: string): SolverResult | null;
  solveStakingMultiplier(problem: string): SolverResult | null;
  solveBurnRate(problem: string): SolverResult | null;
}
```

### Fraction

```typescript
class Fraction {
  constructor(numerator: bigint | number, denominator?: bigint | number);

  add(other: Fraction): Fraction;
  sub(other: Fraction): Fraction;
  mul(other: Fraction): Fraction;
  div(other: Fraction): Fraction;

  toNumber(): number;
  toString(): string;
}
```

## License

MIT

## Contributing

Contributions welcome! Please ensure:
- All formulas are dimensionless, self-referential, and empirically grounded
- Tests cover new functionality
- Documentation is updated

## References

- **COINjecture Network B**: Complete Formula Reference (56 formulas)
- **Whitepaper**: "Exponential Dimensional Tokenomics: A Mathematical Framework for Multi-Scale Cryptocurrency Stability"
- **Critical Equilibrium**: η = λ = 1/√2 (unit circle constraint with balance condition)

---

**Built with mathematical rigor and unified principles** 🔬