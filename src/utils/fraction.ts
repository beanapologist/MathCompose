export class Fraction {
  private numerator: bigint;
  private denominator: bigint;

  constructor(numerator: bigint | number, denominator: bigint | number = 1n) {
    this.numerator = BigInt(numerator);
    this.denominator = BigInt(denominator);

    if (this.denominator === 0n) {
      throw new Error('Denominator cannot be zero');
    }

    this.reduce();
  }

  private gcd(a: bigint, b: bigint): bigint {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b !== 0n) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  private reduce(): void {
    const g = this.gcd(this.numerator, this.denominator);
    this.numerator /= g;
    this.denominator /= g;

    if (this.denominator < 0n) {
      this.numerator = -this.numerator;
      this.denominator = -this.denominator;
    }
  }

  add(other: Fraction): Fraction {
    const num = this.numerator * other.denominator + other.numerator * this.denominator;
    const den = this.denominator * other.denominator;
    return new Fraction(num, den);
  }

  sub(other: Fraction): Fraction {
    const num = this.numerator * other.denominator - other.numerator * this.denominator;
    const den = this.denominator * other.denominator;
    return new Fraction(num, den);
  }

  mul(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.numerator,
      this.denominator * other.denominator
    );
  }

  div(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.denominator,
      this.denominator * other.numerator
    );
  }

  toNumber(): number {
    return Number(this.numerator) / Number(this.denominator);
  }

  toString(): string {
    if (this.denominator === 1n) {
      return this.numerator.toString();
    }
    return `${this.numerator}/${this.denominator}`;
  }

  getNumerator(): bigint {
    return this.numerator;
  }

  getDenominator(): bigint {
    return this.denominator;
  }
}
