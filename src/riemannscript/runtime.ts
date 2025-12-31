/**
 * RiemannScript Runtime Environment
 * Built-in functions and constants
 */

import { RHComplex, RHZero, RHPulse, RHPhase, RHSpectrum, RHValue, RHOffLineError } from './types';

/**
 * Mathematical constants (from AxiomPrime Protocol)
 */
export const RH_CONSTANTS = {
  ETA: 1 / Math.sqrt(2),           // 0.7071... - The Governor
  PHI: (1 + Math.sqrt(5)) / 2,     // 1.618... - Golden ratio
  CRITICAL_LINE: 0.5,               // Re(s) = 1/2
  VIVIANI_DELTA: 0.207106781,      // Geometric safety bound
  ORACLE_DELTA: 0.231,             // Theoretical oracle delta
  PI: Math.PI,
  E: Math.E,
};

/**
 * Create a complex number
 */
export function createComplex(real: number, imag: number): RHComplex {
  return { real, imag };
}

/**
 * Complex arithmetic operations
 */
export const ComplexOps = {
  add(a: RHComplex, b: RHComplex): RHComplex {
    return { real: a.real + b.real, imag: a.imag + b.imag };
  },

  sub(a: RHComplex, b: RHComplex): RHComplex {
    return { real: a.real - b.real, imag: a.imag - b.imag };
  },

  mul(a: RHComplex, b: RHComplex): RHComplex {
    return {
      real: a.real * b.real - a.imag * b.imag,
      imag: a.real * b.imag + a.imag * b.real,
    };
  },

  div(a: RHComplex, b: RHComplex): RHComplex {
    const denom = b.real * b.real + b.imag * b.imag;
    return {
      real: (a.real * b.real + a.imag * b.imag) / denom,
      imag: (a.imag * b.real - a.real * b.imag) / denom,
    };
  },

  abs(z: RHComplex): number {
    return Math.sqrt(z.real * z.real + z.imag * z.imag);
  },

  arg(z: RHComplex): number {
    return Math.atan2(z.imag, z.real);
  },

  pow(z: RHComplex, exp: number): RHComplex {
    const r = this.abs(z);
    const theta = this.arg(z);
    const newR = Math.pow(r, exp);
    const newTheta = theta * exp;
    return {
      real: newR * Math.cos(newTheta),
      imag: newR * Math.sin(newTheta),
    };
  },

  exp(z: RHComplex): RHComplex {
    const expReal = Math.exp(z.real);
    return {
      real: expReal * Math.cos(z.imag),
      imag: expReal * Math.sin(z.imag),
    };
  },
};

/**
 * Built-in function: zeta(s)
 * Riemann zeta function (partial sum approximation)
 */
export function rh_zeta(s: RHComplex, terms: number = 1000): RHComplex {
  let sum: RHComplex = { real: 0, imag: 0 };

  for (let n = 1; n <= terms; n++) {
    // n^(-s) = exp(-s * log(n))
    const logN = Math.log(n);
    const exponent = {
      real: -s.real * logN,
      imag: -s.imag * logN,
    };
    const term = ComplexOps.exp(exponent);
    sum = ComplexOps.add(sum, term);
  }

  return sum;
}

/**
 * Built-in function: damp(value)
 * Apply η-damping: multiply imag by ETA, pin real to CRITICAL_LINE
 */
export function rh_damp(value: RHValue): RHValue {
  if (typeof value === 'object' && value !== null && 'real' in value && 'imag' in value) {
    const z = value as RHComplex;
    return {
      real: RH_CONSTANTS.CRITICAL_LINE,
      imag: z.imag * RH_CONSTANTS.ETA,
    };
  }
  if (typeof value === 'number') {
    return value * RH_CONSTANTS.ETA;
  }
  return value;
}

/**
 * Built-in function: resonate(n)
 * Prime resonance test (if n is prime, return n, else 0)
 */
export function rh_resonate(n: number): RHPulse {
  if (n < 2 || !Number.isInteger(n)) return 0;

  // Simple primality test
  if (n === 2) return n;
  if (n % 2 === 0) return 0;

  const sqrt = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= sqrt; i += 2) {
    if (n % i === 0) return 0;
  }

  return n;
}

/**
 * Built-in function: viviani_check(a, b, c)
 * Check if |a + b + c - constant| < VIVIANI_DELTA
 */
export function rh_viviani_check(a: number, b: number, c: number): boolean {
  const sum = a + b + c;
  const expected = Math.sqrt(3) / 2; // Viviani's theorem for equilateral triangle
  const delta = Math.abs(sum - expected);
  return delta < RH_CONSTANTS.VIVIANI_DELTA;
}

/**
 * Built-in function: pulse_train(height)
 * Generate approximate zeros up to height t
 * Returns array of complex numbers on critical line
 */
export function rh_pulse_train(height: number): RHSpectrum {
  // Approximate number of zeros: N(T) ≈ (T/2π)log(T/2πe) + 7/8
  const N_T = (height / (2 * Math.PI)) * Math.log(height / (2 * Math.PI * Math.E)) + 7 / 8;
  const count = Math.floor(N_T);

  const zeros: RHSpectrum = [];

  // Generate zeros with approximate spacing
  // Average spacing ≈ 2π/log(t)
  let t = 14.134725; // First zero

  for (let i = 0; i < count && t < height; i++) {
    zeros.push({
      real: RH_CONSTANTS.CRITICAL_LINE,
      imag: t,
    });

    // Approximate spacing
    const spacing = (2 * Math.PI) / Math.log(t + 1);
    t += spacing;
  }

  return zeros;
}

/**
 * Built-in function: Re(z) - Extract real part
 */
export function rh_Re(z: RHComplex): number {
  return z.real;
}

/**
 * Built-in function: Im(z) - Extract imaginary part
 */
export function rh_Im(z: RHComplex): number {
  return z.imag;
}

/**
 * Built-in function: arg(z) - Get argument/phase
 */
export function rh_arg(z: RHComplex): RHPhase {
  return ComplexOps.arg(z);
}

/**
 * Built-in function: abs(z) - Get magnitude
 */
export function rh_abs(z: RHComplex): number {
  return ComplexOps.abs(z);
}

/**
 * Check if value is on critical line
 */
export function rh_is_on_line(z: RHComplex, tolerance: number = 0.001): boolean {
  return Math.abs(z.real - RH_CONSTANTS.CRITICAL_LINE) < tolerance;
}

/**
 * Riemann-Siegel theta function approximation
 */
export function rh_theta(t: number): number {
  return (t / 2) * Math.log(t / (2 * Math.PI * Math.E)) - t / 2;
}

/**
 * Runtime environment with all built-in functions
 */
export const RH_BUILTINS = {
  // Constants
  ETA: RH_CONSTANTS.ETA,
  PHI: RH_CONSTANTS.PHI,
  CRITICAL_LINE: RH_CONSTANTS.CRITICAL_LINE,
  VIVIANI_DELTA: RH_CONSTANTS.VIVIANI_DELTA,

  // Functions
  zeta: rh_zeta,
  damp: rh_damp,
  resonate: rh_resonate,
  viviani_check: rh_viviani_check,
  pulse_train: rh_pulse_train,
  Re: rh_Re,
  Im: rh_Im,
  arg: rh_arg,
  abs: rh_abs,
  theta: rh_theta,

  // Complex operations
  complex: createComplex,
};

/**
 * Format complex number for display
 */
export function formatComplex(z: RHComplex, precision: number = 6): string {
  const real = z.real.toFixed(precision);
  const imag = z.imag.toFixed(precision);
  const sign = z.imag >= 0 ? '+' : '';
  return `${real} ${sign} ${imag}j`;
}

/**
 * Format RH value for display
 */
export function formatRHValue(value: RHValue): string {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number') return value.toString();
  if (Array.isArray(value)) {
    return `[${value.map(v => formatRHValue(v)).join(', ')}]`;
  }
  if (typeof value === 'object' && 'real' in value && 'imag' in value) {
    return formatComplex(value as RHComplex);
  }
  return String(value);
}
