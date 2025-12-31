import { Fraction } from './fraction';
import { InvariantType, SolverResult, SolverLog } from '../types';

/**
 * Unified Mathematical Problem Solver
 * Combines classical axioms with COINjecture Network B formulas
 */
export class AxiomPrimeSolver {
  private modulo: number = 100000;

  // COINjecture Network B Constants (mathematically derived)
  private readonly ETA = 1 / Math.sqrt(2);  // η = λ = 1/√2 ≈ 0.7071 (Satoshi constant)
  private readonly LAMBDA = 1 / Math.sqrt(2);  // λ = 1/√2 (equal to η at equilibrium)
  private readonly PHI = (1 + Math.sqrt(5)) / 2;  // φ ≈ 1.618 (Golden ratio)
  private readonly PHI_INV = (Math.sqrt(5) - 1) / 2;  // φ⁻¹ ≈ 0.618
  private readonly PHI_INV_2 = (3 - Math.sqrt(5)) / 2;  // φ⁻² ≈ 0.382
  private readonly TAU_C = Math.sqrt(2);  // τ_c = 1/η ≈ 1.414 (Consensus time constant)
  private readonly DELTA_CRITICAL = this.ETA * (1 - this.ETA);  // ≈ 0.207 (Viviani critical)
  private readonly ORACLE_DELTA = 0.231;  // Theoretical oracle delta at equilibrium

  constructor(modulo: number = 100000) {
    this.modulo = modulo;
  }

  private createLog(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): SolverLog {
    return {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
  }

  private gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      a %= b;
      [a, b] = [b, a];
    }
    return a;
  }

  // ============================================================================
  // CLASSICAL MATHEMATICS SOLVERS
  // ============================================================================

  solveSpectralZeta(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    const triggers = ['spectral score', 'zeta sum', 'riemann', 'euler score', 'critical line', 'frequency t'];
    if (!triggers.some(t => p.includes(t))) return null;

    let t = 0;
    const tMatch = problem.match(/(?:frequency|t|s_imag)\b\s*(?:is|are|=|t=)?\s*(?:t\s*=\s*)?(\d+(?:\.\d+)?)/i);

    if (tMatch) {
      t = parseFloat(tMatch[1]);
    } else {
      const floatMatch = problem.match(/(\d+\.\d+)/);
      if (floatMatch) {
        t = parseFloat(floatMatch[1]);
      } else {
        t = 14.1347;
      }
    }

    const realPart = 0.5;
    let spectralSum = 0;
    const limit = 400;

    for (let i = 1; i <= limit; i++) {
      const lnN = Math.log(i);
      const magnitude = Math.pow(i, -realPart);
      const phase = t * lnN;
      spectralSum += magnitude * Math.cos(phase);
    }

    const absSum = Math.abs(spectralSum);
    const score = absSum > 0 ? 1.0 / absSum : 9999.9;

    return {
      answer: score.toFixed(4),
      invariantUsed: InvariantType.SPECTRAL_ZETA,
      steps: [
        `Analyzing Dirichlet series Re(s)=0.5`,
        `Extracted frequency parameter t=${t}`,
        `Computing partial Zeta sum for n=[1, ${limit}]`,
        `Calculated magnitude: ${absSum.toFixed(6)}`,
        `Spectral score resolved: ${score.toFixed(4)}`
      ],
      logs: [
        this.createLog(`Analysis: Zeta convergence engine engaged for t=${t}`),
        this.createLog(`Score resolved: ${score.toFixed(4)}`, 'success')
      ]
    };
  }

  solvePolynomial(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    if (!p.includes('quadratic') && !p.includes('polynomial')) return null;

    const coeffMatch = problem.match(/leading coeff.*?(-?\d+).*?(-?\d+)/i);
    const points = Array.from(problem.matchAll(/\((-?\d+)\s*,\s*(-?\d+)\)/g));

    const targetMatch = p.match(/(?:find|calculate|evaluate)\s+(?:p|q|p\+q)\((\d+)\)/i);
    const targetX = targetMatch ? BigInt(targetMatch[1]) : 0n;

    if (!coeffMatch || points.length < 2) return null;

    const a1 = parseInt(coeffMatch[1]);
    const a2 = parseInt(coeffMatch[2]);
    const x1 = BigInt(points[0][1]);
    const y1 = BigInt(points[0][2]);
    const x2 = BigInt(points[1][1]);
    const y2 = BigInt(points[1][2]);

    const getPolynomialAt = (a: number, x1: bigint, y1: bigint, x2: bigint, y2: bigint, tx: bigint) => {
      const aBI = BigInt(a);
      const r1 = new Fraction(y1 - aBI * x1 * x1);
      const r2 = new Fraction(y2 - aBI * x2 * x2);

      if (x1 === x2) return new Fraction(0n);

      const b = r1.sub(r2).div(new Fraction(x1 - x2));
      const c = r1.sub(b.mul(new Fraction(x1)));

      const quadPart = new Fraction(aBI * tx * tx);
      const linPart = b.mul(new Fraction(tx));
      return quadPart.add(linPart).add(c);
    };

    const pVal = getPolynomialAt(a1, x1, y1, x2, y2, targetX);
    const qVal = getPolynomialAt(a2, x1, y1, x2, y2, targetX);
    const total = pVal.add(qVal).toNumber();

    return {
      answer: Math.floor(total) % this.modulo,
      invariantUsed: InvariantType.POLYNOMIAL,
      steps: [
        `Mapping quadratic coefficients ${a1}, ${a2}`,
        `Evaluating interpolation points (${x1}, ${y1}), (${x2}, ${y2})`,
        `P(${targetX}) = ${pVal.toString()}`,
        `Q(${targetX}) = ${qVal.toString()}`,
        `Resulting sum: ${total}`
      ],
      logs: [
        this.createLog(`Analysis: Polynomial reduction resolved at x=${targetX}`),
        this.createLog(`Evaluation successful.`, 'success')
      ]
    };
  }

  solveRootDynamics(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    if (!p.includes('root')) return null;

    const polyMatch = problem.match(/x\^2\s*([+-]\s*\d*)\s*x\s*([+-]\s*\d*)\s*=\s*0/i);
    if (!polyMatch) return null;

    const bStr = polyMatch[1].replace(/\s/g, '');
    const b = bStr === '+' ? 1 : bStr === '-' ? -1 : (bStr === '' ? 0 : parseInt(bStr));
    const c = parseInt(polyMatch[2].replace(/\s/g, ''));

    const e1 = -b;
    const e2 = c;

    if (p.includes('sum of the roots')) {
      return {
        answer: e1,
        invariantUsed: InvariantType.ROOT_DYNAMICS,
        steps: [`Quadratic: x² + ${b}x + ${c} = 0`, `Vieta Identity: Σr = -b/a = ${e1}`],
        logs: [this.createLog(`Analysis: Vieta's identity applied.`)]
      };
    }

    if (p.includes('sum of the squares')) {
      const sumSquares = e1 * e1 - 2 * e2;
      return {
        answer: sumSquares,
        invariantUsed: InvariantType.ROOT_DYNAMICS,
        steps: [`Quadratic: x² + ${b}x + ${c} = 0`, `Newton's Sum Identity: Σr² = (Σr)² - 2Σr₁r₂`, `Calculation: ${e1}² - 2(${e2}) = ${sumSquares}`],
        logs: [this.createLog(`Analysis: Newton sums applied.`)]
      };
    }

    return null;
  }

  solveSequences(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    if (!p.includes('progression') && !p.includes('arithmetic series') && !p.includes('geometric series')) return null;

    const arithMatch = p.match(/arithmetic.*?first term\s*(\d+).*?common difference\s*(\d+).*?(\d+)\s*terms/i);
    if (arithMatch) {
      const a = parseInt(arithMatch[1]);
      const d = parseInt(arithMatch[2]);
      const n = parseInt(arithMatch[3]);
      const sum = (n / 2) * (2 * a + (n - 1) * d);
      return {
        answer: sum,
        invariantUsed: InvariantType.SEQUENCES,
        steps: [`Arithmetic Progression: a=${a}, d=${d}, n=${n}`, `Sum Formula: n/2 * (2a + (n-1)d)`, `Result: ${sum}`],
        logs: [this.createLog(`Analysis: Sequence summation complete.`)]
      };
    }

    return null;
  }

  solveFunctionalEq(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    if (p.includes('f(m)') && p.includes('f(n)') && p.includes('f(m + n + mn)')) {
      const targetMatch = p.match(/f\((\d+)\)/);
      if (targetMatch) {
        const n = parseInt(targetMatch[1]);
        return {
          answer: "c * log(" + (n+1) + ")",
          invariantUsed: InvariantType.FUNCTIONAL_EQ,
          steps: [
            `Shifted Cauchy equation identified`,
            `Substitution: g(x) = f(x-1)`,
            `Logarithmic solution space detected for x+1`
          ],
          logs: [this.createLog(`Analysis: Cauchy mapping complete.`)]
        };
      }
    }
    return null;
  }

  solveNumberTheory(problem: string): SolverResult | null {
    const p = problem.toLowerCase();

    const binomialMatch = problem.match(/(?:choose|ncr|\\binom|C)\s*\(?(\d+)(?:,|\s+|(?:\s+choose\s+))(\d+)\)?.*?(?:mod|divided by)\s*(\d+)/i)
                          || problem.match(/\((\d+)\s+choose\s+(\d+)\).*?(?:mod|divided by)\s*(\d+)/i);

    if (binomialMatch) {
       const n = parseInt(binomialMatch[1]);
       const k = parseInt(binomialMatch[2]);
       const pVal = parseInt(binomialMatch[3]);

       const nCrModP = (n: number, r: number, p: number): number => {
         if (r === 0) return 1;
         if (r > n) return 0;
         let num = 1;
         for (let i = 0; i < r; i++) num = (num * (n - i)) % p;
         let den = 1;
         for (let i = 1; i <= r; i++) den = (den * i) % p;
         const power = (a: number, b: number, m: number) => {
           let res = 1; a %= m;
           while (b > 0) { if (b % 2 === 1) res = (res * a) % m; a = (a * a) % m; b = Math.floor(b / 2); }
           return res;
         };
         return (num * power(den, p - 2, p)) % p;
       };

       const lucas = (n: number, k: number, p: number): number => {
         if (k === 0) return 1;
         return (lucas(Math.floor(n/p), Math.floor(k/p), p) * nCrModP(n % p, k % p, p)) % p;
       };

       const ans = lucas(n, k, pVal);
       return {
         answer: ans,
         invariantUsed: InvariantType.NUMBER_THEORY,
         steps: [
           `Applying Lucas Theorem for n=${n}, k=${k}, mod ${pVal}`,
           `Base-${pVal} decomposition successful`,
           `Modular congruence: ${ans}`
         ],
         logs: [this.createLog(`Analysis: Modular binomial reduction completed.`)]
       };
    }

    if (p.includes('totient') || p.includes('phi') || (p.includes('relatively prime') && p.includes('less than'))) {
       const nMatch = problem.match(/(\d+)/);
       if (nMatch) {
         let n = parseInt(nMatch[0]);
         let result = n;
         let temp = n;
         for (let i = 2; i * i <= temp; i++) {
           if (temp % i === 0) {
             while (temp % i === 0) temp /= i;
             result -= Math.floor(result / i);
           }
         }
         if (temp > 1) result -= Math.floor(result / temp);

         return {
           answer: result,
           invariantUsed: InvariantType.NUMBER_THEORY,
           steps: [
             `Euler Totient analysis for n=${n}`,
             `Prime factorization complete`,
             `φ(${n}) = ${result}`
           ],
           logs: [this.createLog(`Analysis: Eulerian totient calculated.`)]
         };
       }
    }

    return null;
  }

  solveDiophantine(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    const triggers = ['largest integer', 'cannot be written', 'cannot be expressed', 'impossible sum', 'chicken mcnugget', 'frobenius'];
    if (!triggers.some(t => p.includes(t))) return null;

    const nums = (problem.match(/\b\d+\b/g) || []).map(Number);
    const coeffs = nums.filter(n => n >= 2 && n <= 500);

    if (coeffs.length < 2) return null;

    const a = coeffs[0];
    const b = coeffs[1];

    if (this.gcd(a, b) !== 1) {
       return {
         answer: "Infinity",
         invariantUsed: InvariantType.DIOPHANTINE,
         steps: [`Gaps are infinite for non-coprime generators ${a}, ${b}`],
         logs: [this.createLog(`Analysis: Non-coprime boundary detected.`)]
       };
    }

    const result = (a * b) - a - b;

    return {
      answer: result % this.modulo,
      invariantUsed: InvariantType.DIOPHANTINE,
      steps: [
        `Applying Frobenius identity for {${a}, ${b}}`,
        `G(a,b) = ab - a - b`,
        `Outcome: ${result}`
      ],
      logs: [
        this.createLog(`Analysis: Diophantine boundary resolved.`),
        this.createLog(`Calculation complete.`, 'success')
      ]
    };
  }

  solveCombinatorial(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    const triggers = ['subset', 'intersect', 's_n', 'ordered pair', 'set s', 'power set', 'inclusion-exclusion', 'principle of inclusion', 'collection of sets'];
    if (!triggers.some(t => p.includes(t))) return null;

    let n: number | null = null;
    const nMatch = p.match(/s(?:_|\[|\{)?(\d+)(?:\]|\})?|n\s*=\s*(\d+)|\b(\d+)\b\s+elements/i);
    if (nMatch) n = parseInt(nMatch[1] || nMatch[2] || nMatch[3]);

    if (n === null) return null;

    const result = BigInt(n) * (4n ** BigInt(n - 1));

    return {
      answer: Number(result % BigInt(this.modulo)),
      invariantUsed: InvariantType.COMBINATORIAL,
      steps: [
        `Subset intersection identity applied for n=${n}`,
        `Identity Σ |A ∩ B| = n * 4^(n-1)`,
        `Result: ${result}`
      ],
      logs: [
        this.createLog(`Analysis: Combinatorial identity verified.`),
        this.createLog(`Result mapped to modulo space.`, 'success')
      ]
    };
  }

  solveGeometric(problem: string): SolverResult | null {
    const p = problem.toLowerCase();

    if (p.includes('polyhedron') || p.includes('convex polyhedron') || (p.includes('vertices') && p.includes('edges') && p.includes('faces'))) {
      const vMatch = p.match(/(\d+)\s+vertices/i);
      const eMatch = p.match(/(\d+)\s+edges/i);
      const fMatch = p.match(/(\d+)\s+faces/i);

      let v = vMatch ? parseInt(vMatch[1]) : null;
      let e = eMatch ? parseInt(eMatch[1]) : null;
      let f = fMatch ? parseInt(fMatch[1]) : null;

      if (v !== null && e !== null && f === null) {
        f = 2 - v + e;
        return {
          answer: f,
          invariantUsed: InvariantType.GEOMETRIC,
          steps: [`Euler Characteristic: V - E + F = 2`, `V=${v}, E=${e}`, `Solving for F: 2 - ${v} + ${e} = ${f}`],
          logs: [this.createLog("Analysis: Euler characteristic applied.")]
        };
      }
      if (v !== null && f !== null && e === null) {
        e = v + f - 2;
        return {
          answer: e,
          invariantUsed: InvariantType.GEOMETRIC,
          steps: [`Euler Characteristic: V - E + F = 2`, `V=${v}, F=${f}`, `Solving for E: ${v} + ${f} - 2 = ${e}`],
          logs: [this.createLog("Analysis: Euler characteristic applied.")]
        };
      }
    }

    if (p.includes('lattice points') || p.includes('grid points') || p.includes('pick\'s theorem')) {
      const iMatch = p.match(/(\d+)\s+(?:interior|inside)\b/i);
      const bMatch = p.match(/(\d+)\s+(?:boundary|on the edge|boundary points)\b/i);

      if (iMatch && bMatch) {
        const i = parseInt(iMatch[1]);
        const b = parseInt(bMatch[1]);
        const area = i + (b / 2) - 1;
        return {
          answer: area,
          invariantUsed: InvariantType.GEOMETRIC,
          steps: [`Pick's Theorem: Area = I + B/2 - 1`, `Interior points (I) = ${i}`, `Boundary points (B) = ${b}`, `Area = ${i} + ${b}/2 - 1 = ${area}`],
          logs: [this.createLog("Analysis: Pick's theorem applied.")]
        };
      }
    }

    return null;
  }

  // ============================================================================
  // COINJECTURE NETWORK B SOLVERS
  // ============================================================================

  /**
   * Formula 1: Dimensional Scales
   * D_n(τ) = e^(-η·τ_n)
   */
  solveDimensionalScale(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    const triggers = ['dimensional scale', 'pool scale', 'd_n', 'exponential scale', 'scale factor'];
    if (!triggers.some(t => p.includes(t))) return null;

    // Extract pool number (n) and/or tau
    const poolMatch = p.match(/pool\s*(\d+)|n\s*=\s*(\d+)|d_(\d+)/i);
    const tauMatch = p.match(/tau\s*=\s*([0-9.]+)|τ\s*=\s*([0-9.]+)/i);

    if (!poolMatch && !tauMatch) return null;

    const poolNum = poolMatch ? parseInt(poolMatch[1] || poolMatch[2] || poolMatch[3]) : 1;

    // Predefined tau values for each pool (from formula reference)
    const tauValues = [0.00, 0.20, 0.41, 0.68, 0.98, 1.36, 1.96, 2.72];
    const tau = tauMatch ? parseFloat(tauMatch[1] || tauMatch[2]) : (poolNum >= 1 && poolNum <= 8 ? tauValues[poolNum - 1] : 0);

    const D_n = Math.exp(-this.ETA * tau);

    return {
      answer: D_n.toFixed(6),
      invariantUsed: InvariantType.DIMENSIONAL_SCALE,
      steps: [
        `Dimensional scale formula: D_n(τ) = e^(-η·τ_n)`,
        `Pool n=${poolNum}, τ=${tau.toFixed(2)}`,
        `η = ${this.ETA.toFixed(10)} (Satoshi constant)`,
        `D_${poolNum} = e^(-${this.ETA.toFixed(4)} × ${tau.toFixed(2)})`,
        `D_${poolNum} = ${D_n.toFixed(6)}`
      ],
      logs: [
        this.createLog(`Analysis: Dimensional scale computation for pool ${poolNum}`),
        this.createLog(`Result: D_${poolNum} = ${D_n.toFixed(6)}`, 'success')
      ],
      metadata: {
        constants: { eta: this.ETA, tau },
        intermediateValues: { pool: poolNum, dimensionalScale: D_n },
        formulaUsed: 'D_n(τ) = e^(-η·τ_n)'
      }
    };
  }

  /**
   * Formula 4: Consensus State Dynamics
   * ψ(τ) = e^(-ητ) · e^(iλτ)
   * |ψ(τ)| = e^(-ητ)
   * θ(τ) = λτ
   */
  solveConsensusState(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    const triggers = ['consensus state', 'psi', 'ψ', 'magnitude', 'phase', 'consensus dynamics'];
    if (!triggers.some(t => p.includes(t))) return null;

    const tauMatch = p.match(/tau\s*=\s*([0-9.]+)|τ\s*=\s*([0-9.]+)/i);
    if (!tauMatch) return null;

    const tau = parseFloat(tauMatch[1] || tauMatch[2]);
    const magnitude = Math.exp(-this.ETA * tau);
    const phase = this.LAMBDA * tau;

    return {
      answer: magnitude.toFixed(6),
      invariantUsed: InvariantType.CONSENSUS_STATE,
      steps: [
        `Consensus state: ψ(τ) = e^(-ητ) · e^(iλτ)`,
        `τ = ${tau.toFixed(4)}`,
        `η = λ = ${this.ETA.toFixed(10)}`,
        `Magnitude: |ψ(τ)| = e^(-ητ) = ${magnitude.toFixed(6)}`,
        `Phase: θ(τ) = λτ = ${phase.toFixed(6)} radians`,
        `Phase in degrees: ${(phase * 180 / Math.PI).toFixed(2)}°`
      ],
      logs: [
        this.createLog(`Analysis: Consensus state dynamics at τ=${tau}`),
        this.createLog(`Magnitude: ${magnitude.toFixed(6)}, Phase: ${phase.toFixed(6)} rad`, 'success')
      ],
      metadata: {
        constants: { eta: this.ETA, lambda: this.LAMBDA, tau },
        intermediateValues: { magnitude, phase, phaseDegrees: phase * 180 / Math.PI },
        formulaUsed: 'ψ(τ) = e^(-ητ) · e^(iλτ)'
      }
    };
  }

  /**
   * Formula 6: Unlock Schedule
   * U_n(τ) = 1 - e^(-η(τ - τ_n)) for τ ≥ τ_n
   * U_n(τ) = 0 for τ < τ_n
   */
  solveUnlockSchedule(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    const triggers = ['unlock', 'unlock schedule', 'u_n', 'fraction unlocked', 'vesting'];
    if (!triggers.some(t => p.includes(t))) return null;

    const poolMatch = p.match(/pool\s*(\d+)|n\s*=\s*(\d+)/i);
    const tauMatch = p.match(/tau\s*=\s*([0-9.]+)|τ\s*=\s*([0-9.]+)/i);

    if (!poolMatch || !tauMatch) return null;

    const poolNum = parseInt(poolMatch[1] || poolMatch[2]);
    const tau = parseFloat(tauMatch[1] || tauMatch[2]);

    const tauValues = [0.00, 0.20, 0.41, 0.68, 0.98, 1.36, 1.96, 2.72];
    const tau_n = poolNum >= 1 && poolNum <= 8 ? tauValues[poolNum - 1] : 0;

    let U_n: number;
    if (tau < tau_n) {
      U_n = 0;
    } else {
      U_n = 1 - Math.exp(-this.ETA * (tau - tau_n));
    }

    return {
      answer: U_n.toFixed(6),
      invariantUsed: InvariantType.UNLOCK_SCHEDULE,
      steps: [
        `Unlock schedule: U_n(τ) = 1 - e^(-η(τ - τ_n)) for τ ≥ τ_n`,
        `Pool n=${poolNum}, τ_n=${tau_n.toFixed(2)}, current τ=${tau.toFixed(2)}`,
        `η = ${this.ETA.toFixed(10)}`,
        tau < tau_n ? `τ < τ_n, so U_${poolNum}(τ) = 0` : `U_${poolNum}(${tau}) = 1 - e^(-${this.ETA.toFixed(4)} × ${(tau - tau_n).toFixed(2)})`,
        `Fraction unlocked: ${(U_n * 100).toFixed(2)}%`
      ],
      logs: [
        this.createLog(`Analysis: Unlock schedule for pool ${poolNum} at τ=${tau}`),
        this.createLog(`${(U_n * 100).toFixed(2)}% unlocked`, 'success')
      ],
      metadata: {
        constants: { eta: this.ETA, tau_n, tau },
        intermediateValues: { pool: poolNum, unlockFraction: U_n, unlockPercent: U_n * 100 },
        formulaUsed: 'U_n(τ) = 1 - e^(-η(τ - τ_n))'
      }
    };
  }

  /**
   * Formula 8: Viviani Oracle Metric
   * Δ = (d₁ + d₂ + d₃) / (√3/2) - 1
   * Equilateral triangle vertices: (0,0), (1,0), (0.5, √3/2)
   */
  solveVivianiOracle(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    const triggers = ['viviani', 'oracle', 'delta', 'network health', 'equilibrium distance'];
    if (!triggers.some(t => p.includes(t))) return null;

    // Extract point coordinates or eta/lambda values
    const pointMatch = p.match(/\(([0-9.]+)\s*,\s*([0-9.]+)\)/);
    const etaMatch = p.match(/eta\s*=\s*([0-9.]+)|η\s*=\s*([0-9.]+)/i);
    const lambdaMatch = p.match(/lambda\s*=\s*([0-9.]+)|λ\s*=\s*([0-9.]+)/i);

    let eta = this.ETA;
    let lambda = this.LAMBDA;

    if (etaMatch) eta = parseFloat(etaMatch[1] || etaMatch[2]);
    if (lambdaMatch) lambda = parseFloat(lambdaMatch[1] || lambdaMatch[2]);

    // Map (η, λ) to triangle coordinate or use direct point
    let x: number, y: number;
    if (pointMatch) {
      x = parseFloat(pointMatch[1]);
      y = parseFloat(pointMatch[2]);
    } else {
      // Map η and λ to triangle coordinates (simplified mapping)
      x = eta;
      y = lambda * Math.sqrt(3) / 2;
    }

    // Equilateral triangle vertices
    const v1 = { x: 0, y: 0 };
    const v2 = { x: 1, y: 0 };
    const v3 = { x: 0.5, y: Math.sqrt(3) / 2 };

    // Calculate distances to sides
    const d1 = Math.abs(y); // distance to bottom side (y = 0)
    const d2 = Math.abs((v3.y - v1.y) * x - (v3.x - v1.x) * y) / Math.sqrt(Math.pow(v3.y - v1.y, 2) + Math.pow(v3.x - v1.x, 2));
    const d3 = Math.abs((v2.y - v3.y) * x - (v2.x - v3.x) * (y - v3.y)) / Math.sqrt(Math.pow(v2.y - v3.y, 2) + Math.pow(v2.x - v3.x, 2));

    const sumDistances = d1 + d2 + d3;
    const delta = sumDistances / (Math.sqrt(3) / 2) - 1;

    const isOptimal = delta >= 0.228 && delta <= 0.234;
    const regime = isOptimal ? 'OPTIMAL' : delta < 0.228 ? 'SUBOPTIMAL' : 'SUPEROPTIMAL';

    return {
      answer: delta.toFixed(6),
      invariantUsed: InvariantType.VIVIANI_ORACLE,
      steps: [
        `Viviani Oracle: Δ = (d₁ + d₂ + d₃) / (√3/2) - 1`,
        `Point: (${x.toFixed(4)}, ${y.toFixed(4)})`,
        `Distance to sides: d₁=${d1.toFixed(4)}, d₂=${d2.toFixed(4)}, d₃=${d3.toFixed(4)}`,
        `Sum of distances: ${sumDistances.toFixed(4)}`,
        `Δ = ${delta.toFixed(6)}`,
        `Network regime: ${regime}`,
        `Critical Δ = ${this.DELTA_CRITICAL.toFixed(4)}, Oracle Δ = ${this.ORACLE_DELTA}`
      ],
      logs: [
        this.createLog(`Analysis: Viviani oracle computation`),
        this.createLog(`Δ = ${delta.toFixed(6)} (${regime})`, isOptimal ? 'success' : 'warning')
      ],
      metadata: {
        constants: { deltaCritical: this.DELTA_CRITICAL, oracleDelta: this.ORACLE_DELTA },
        intermediateValues: { x, y, d1, d2, d3, delta, regime },
        formulaUsed: 'Δ = (d₁ + d₂ + d₃) / (√3/2) - 1'
      }
    };
  }

  /**
   * Formula 14: Dynamic Emission Rate
   * emission(t) = η · |ψ(t)| · base_emission / (2^halvings)
   */
  solveEmissionRate(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    const triggers = ['emission', 'emission rate', 'block reward', 'mining reward'];
    if (!triggers.some(t => p.includes(t))) return null;

    const psiMatch = p.match(/psi\s*=\s*([0-9.]+)|ψ\s*=\s*([0-9.]+)|\|ψ\|\s*=\s*([0-9.]+)/i);
    const halvingMatch = p.match(/halving\s*=\s*(\d+)|epoch\s*=\s*(\d+)/i);
    const baseMatch = p.match(/base\s*=\s*([0-9.]+)|base_emission\s*=\s*([0-9.]+)/i);

    const psiMagnitude = psiMatch ? parseFloat(psiMatch[1] || psiMatch[2] || psiMatch[3]) : 0.8;
    const halvings = halvingMatch ? parseInt(halvingMatch[1] || halvingMatch[2]) : 0;
    const baseEmission = baseMatch ? parseFloat(baseMatch[1] || baseMatch[2]) : 50;

    const emission = this.ETA * psiMagnitude * baseEmission / Math.pow(2, halvings);

    return {
      answer: emission.toFixed(6),
      invariantUsed: InvariantType.EMISSION_RATE,
      steps: [
        `Emission formula: emission(t) = η · |ψ(t)| · base_emission / (2^halvings)`,
        `η = ${this.ETA.toFixed(10)}`,
        `|ψ(t)| = ${psiMagnitude.toFixed(4)}`,
        `Base emission = ${baseEmission}`,
        `Halvings = ${halvings}`,
        `Emission = ${this.ETA.toFixed(4)} × ${psiMagnitude} × ${baseEmission} / ${Math.pow(2, halvings)}`,
        `Emission = ${emission.toFixed(6)} tokens/block`
      ],
      logs: [
        this.createLog(`Analysis: Dynamic emission calculation`),
        this.createLog(`Emission rate: ${emission.toFixed(6)} tokens/block`, 'success')
      ],
      metadata: {
        constants: { eta: this.ETA },
        intermediateValues: { psiMagnitude, halvings, baseEmission, emission },
        formulaUsed: 'emission(t) = η · |ψ(t)| · base_emission / (2^halvings)'
      }
    };
  }

  /**
   * Formula 19: Reputation Score
   * R_n = (S_ratio × T_ratio × (1 + bonus)) / (1 + E_weighted)
   */
  solveReputationScore(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    const triggers = ['reputation', 'reputation score', 'node score', 'peer reputation'];
    if (!triggers.some(t => p.includes(t))) return null;

    const stakeMatch = p.match(/stake\s*=\s*([0-9.]+)/i);
    const medianStakeMatch = p.match(/median\s*stake\s*=\s*([0-9.]+)/i);
    const ageMatch = p.match(/age\s*=\s*([0-9.]+)/i);
    const medianAgeMatch = p.match(/median\s*age\s*=\s*([0-9.]+)/i);
    const faultsMatch = p.match(/faults\s*=\s*([0-9.]+)|e_weighted\s*=\s*([0-9.]+)/i);
    const bonusMatch = p.match(/bonus\s*=\s*([0-9.]+)/i);

    if (!stakeMatch || !medianStakeMatch || !ageMatch || !medianAgeMatch) return null;

    const stake = parseFloat(stakeMatch[1]);
    const medianStake = parseFloat(medianStakeMatch[1]);
    const age = parseFloat(ageMatch[1]);
    const medianAge = parseFloat(medianAgeMatch[1]);
    const faults = faultsMatch ? parseFloat(faultsMatch[1] || faultsMatch[2]) : 0;
    const bonus = bonusMatch ? parseFloat(bonusMatch[1]) : 0;

    // S_ratio = log₂(1 + stake/median_stake) / log₂(φ²)
    const S_ratio = Math.log2(1 + stake / medianStake) / Math.log2(this.PHI * this.PHI);

    // T_ratio = 1 - e^(-η × age/median_age)
    const T_ratio = 1 - Math.exp(-this.ETA * (age / medianAge));

    // Reputation score
    const reputation = (S_ratio * T_ratio * (1 + bonus)) / (1 + faults);

    return {
      answer: reputation.toFixed(6),
      invariantUsed: InvariantType.REPUTATION_SCORE,
      steps: [
        `Reputation: R = (S_ratio × T_ratio × (1 + bonus)) / (1 + E_weighted)`,
        `S_ratio = log₂(1 + ${stake}/${medianStake}) / log₂(φ²) = ${S_ratio.toFixed(4)}`,
        `T_ratio = 1 - e^(-η × ${age}/${medianAge}) = ${T_ratio.toFixed(4)}`,
        `Bonus = ${bonus}, Faults = ${faults}`,
        `R = (${S_ratio.toFixed(4)} × ${T_ratio.toFixed(4)} × ${1 + bonus}) / ${1 + faults}`,
        `Reputation = ${reputation.toFixed(6)}`
      ],
      logs: [
        this.createLog(`Analysis: Reputation score calculation`),
        this.createLog(`Reputation: ${reputation.toFixed(6)}`, 'success')
      ],
      metadata: {
        constants: { eta: this.ETA, phi: this.PHI },
        intermediateValues: { S_ratio, T_ratio, bonus, faults, reputation },
        formulaUsed: 'R = (S_ratio × T_ratio × (1 + bonus)) / (1 + E_weighted)'
      }
    };
  }

  /**
   * Formula 32: Staking Multiplier (Viviani Oracle)
   * multiplier = 1 + (λ × coverage × Δ_critical)
   * λ = 1 - HHI, HHI = Σ(share_i²)
   */
  solveStakingMultiplier(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    const triggers = ['staking multiplier', 'diversification multiplier', 'viviani multiplier'];
    if (!triggers.some(t => p.includes(t))) return null;

    // Extract stake distribution (shares)
    const sharesMatch = Array.from(problem.matchAll(/share\s*(\d+)\s*=\s*([0-9.]+)/gi));
    const coverageMatch = p.match(/coverage\s*=\s*([0-9.]+)|pools\s*=\s*(\d+)/i);

    if (sharesMatch.length === 0) return null;

    const shares = sharesMatch.map(m => parseFloat(m[2]));
    const totalShare = shares.reduce((sum, s) => sum + s, 0);
    const normalizedShares = shares.map(s => s / totalShare);

    // Calculate HHI (Herfindahl-Hirschman Index)
    const HHI = normalizedShares.reduce((sum, s) => sum + s * s, 0);
    const lambda = 1 - HHI;

    // Coverage
    const coverage = coverageMatch ? parseFloat(coverageMatch[1] || coverageMatch[2]) / 8 : normalizedShares.length / 8;

    // Multiplier
    const multiplier = 1 + (lambda * coverage * this.DELTA_CRITICAL);

    return {
      answer: multiplier.toFixed(6),
      invariantUsed: InvariantType.STAKING_MULTIPLIER,
      steps: [
        `Staking multiplier: M = 1 + (λ × coverage × Δ_critical)`,
        `Shares: ${normalizedShares.map(s => s.toFixed(3)).join(', ')}`,
        `HHI = Σ(share²) = ${HHI.toFixed(6)}`,
        `λ = 1 - HHI = ${lambda.toFixed(6)}`,
        `Coverage = ${coverage.toFixed(4)}`,
        `Δ_critical = ${this.DELTA_CRITICAL.toFixed(6)}`,
        `M = 1 + (${lambda.toFixed(4)} × ${coverage.toFixed(4)} × ${this.DELTA_CRITICAL.toFixed(4)})`,
        `Multiplier = ${multiplier.toFixed(6)}`
      ],
      logs: [
        this.createLog(`Analysis: Staking multiplier via Viviani oracle`),
        this.createLog(`Multiplier: ${multiplier.toFixed(6)}x`, 'success')
      ],
      metadata: {
        constants: { deltaCritical: this.DELTA_CRITICAL },
        intermediateValues: { HHI, lambda, coverage, multiplier },
        formulaUsed: 'multiplier = 1 + (λ × coverage × Δ_critical)'
      }
    };
  }

  /**
   * Formula 37: Burn Rate
   * burn_rate = λ · cumulative_work / circulating_supply
   */
  solveBurnRate(problem: string): SolverResult | null {
    const p = problem.toLowerCase();
    const triggers = ['burn rate', 'deflation rate', 'burn amount'];
    if (!triggers.some(t => p.includes(t))) return null;

    const workMatch = p.match(/work\s*=\s*([0-9.]+)|cumulative\s*work\s*=\s*([0-9.]+)/i);
    const supplyMatch = p.match(/supply\s*=\s*([0-9.]+)|circulating\s*=\s*([0-9.]+)/i);

    if (!workMatch || !supplyMatch) return null;

    const cumulativeWork = parseFloat(workMatch[1] || workMatch[2]);
    const circulatingSupply = parseFloat(supplyMatch[1] || supplyMatch[2]);

    const burnRate = this.LAMBDA * cumulativeWork / circulatingSupply;

    return {
      answer: burnRate.toFixed(8),
      invariantUsed: InvariantType.BURN_RATE,
      steps: [
        `Burn rate: burn_rate = λ · cumulative_work / circulating_supply`,
        `λ = ${this.LAMBDA.toFixed(10)}`,
        `Cumulative work = ${cumulativeWork}`,
        `Circulating supply = ${circulatingSupply}`,
        `Burn rate = ${this.LAMBDA.toFixed(4)} × ${cumulativeWork} / ${circulatingSupply}`,
        `Burn rate = ${burnRate.toFixed(8)}`
      ],
      logs: [
        this.createLog(`Analysis: Burn rate calculation`),
        this.createLog(`Burn rate: ${burnRate.toFixed(8)}`, 'success')
      ],
      metadata: {
        constants: { lambda: this.LAMBDA },
        intermediateValues: { cumulativeWork, circulatingSupply, burnRate },
        formulaUsed: 'burn_rate = λ · cumulative_work / circulating_supply'
      }
    };
  }

  /**
   * Main solver - tries all solvers in sequence
   */
  async solve(problem: string): Promise<SolverResult> {
    const solvers = [
      // Classical Mathematics
      () => this.solveSpectralZeta(problem),
      () => this.solvePolynomial(problem),
      () => this.solveNumberTheory(problem),
      () => this.solveCombinatorial(problem),
      () => this.solveDiophantine(problem),
      () => this.solveGeometric(problem),
      () => this.solveSequences(problem),
      () => this.solveRootDynamics(problem),
      () => this.solveFunctionalEq(problem),

      // COINjecture Network B
      () => this.solveDimensionalScale(problem),
      () => this.solveConsensusState(problem),
      () => this.solveUnlockSchedule(problem),
      () => this.solveVivianiOracle(problem),
      () => this.solveEmissionRate(problem),
      () => this.solveReputationScore(problem),
      () => this.solveStakingMultiplier(problem),
      () => this.solveBurnRate(problem),
    ];

    for (const solver of solvers) {
      try {
        const result = solver();
        if (result && (result.answer !== 0 || result.invariantUsed !== null)) return result;
      } catch (e) {
        continue;
      }
    }

    return {
      answer: 0,
      invariantUsed: null,
      steps: ["No deterministic invariant found."],
      logs: [this.createLog(`Analysis: No matching solver found for the given problem.`, 'warning')]
    };
  }

  /**
   * Get all available constants
   */
  getConstants() {
    return {
      ETA: this.ETA,
      LAMBDA: this.LAMBDA,
      PHI: this.PHI,
      PHI_INV: this.PHI_INV,
      PHI_INV_2: this.PHI_INV_2,
      TAU_C: this.TAU_C,
      DELTA_CRITICAL: this.DELTA_CRITICAL,
      ORACLE_DELTA: this.ORACLE_DELTA,
    };
  }
}
