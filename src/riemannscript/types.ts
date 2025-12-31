/**
 * RiemannScript (.rh) Type Definitions
 * "Code eternally on the critical manifold"
 */

/**
 * Complex number representation
 * zero: Complex zero on critical line (default Re = 0.5)
 */
export interface RHComplex {
  real: number;
  imag: number;
}

/**
 * Data types in RiemannScript
 */
export type RHZero = RHComplex;      // Complex zero on critical line
export type RHPulse = number;         // Integer (prime resonance)
export type RHPhase = number;         // Float (ψ-modulation, -π to π)
export type RHSpectrum = RHZero[];    // List of zeros

/**
 * RiemannScript value types
 */
export type RHValue = RHZero | RHPulse | RHPhase | RHSpectrum | string | boolean | null;

/**
 * Variable scope/environment
 */
export interface RHEnvironment {
  variables: Map<string, RHValue>;
  parent?: RHEnvironment;
}

/**
 * AST Node types
 */
export enum RHNodeType {
  PROGRAM = 'PROGRAM',
  VARIABLE_DECLARATION = 'VARIABLE_DECLARATION',
  ASSIGNMENT = 'ASSIGNMENT',
  FUNCTION_CALL = 'FUNCTION_CALL',
  BINARY_OP = 'BINARY_OP',
  UNARY_OP = 'UNARY_OP',
  IF_STATEMENT = 'IF_STATEMENT',
  FOR_LOOP = 'FOR_LOOP',
  FALLBACK_BLOCK = 'FALLBACK_BLOCK',
  PRINT_STATEMENT = 'PRINT_STATEMENT',
  LITERAL = 'LITERAL',
  IDENTIFIER = 'IDENTIFIER',
  COMMENT = 'COMMENT',
}

/**
 * AST Node base interface
 */
export interface RHNode {
  type: RHNodeType;
  line?: number;
}

export interface RHProgram extends RHNode {
  type: RHNodeType.PROGRAM;
  statements: RHNode[];
}

export interface RHVariableDeclaration extends RHNode {
  type: RHNodeType.VARIABLE_DECLARATION;
  varType: 'zero' | 'pulse' | 'phase' | 'spectrum';
  name: string;
  value: RHNode;
}

export interface RHAssignment extends RHNode {
  type: RHNodeType.ASSIGNMENT;
  name: string;
  value: RHNode;
}

export interface RHFunctionCall extends RHNode {
  type: RHNodeType.FUNCTION_CALL;
  name: string;
  args: RHNode[];
}

export interface RHBinaryOp extends RHNode {
  type: RHNodeType.BINARY_OP;
  operator: '+' | '-' | '*' | '/' | '>' | '<' | '==' | '!=' | 'and' | 'or';
  left: RHNode;
  right: RHNode;
}

export interface RHUnaryOp extends RHNode {
  type: RHNodeType.UNARY_OP;
  operator: '-' | 'not';
  operand: RHNode;
}

export interface RHIfStatement extends RHNode {
  type: RHNodeType.IF_STATEMENT;
  condition: RHNode;
  thenBlock: RHNode[];
  elseBlock?: RHNode[];
}

export interface RHForLoop extends RHNode {
  type: RHNodeType.FOR_LOOP;
  variable: string;
  iterable: RHNode;
  body: RHNode[];
}

export interface RHFallbackBlock extends RHNode {
  type: RHNodeType.FALLBACK_BLOCK;
  body: RHNode[];
}

export interface RHPrintStatement extends RHNode {
  type: RHNodeType.PRINT_STATEMENT;
  expressions: RHNode[];
}

export interface RHLiteral extends RHNode {
  type: RHNodeType.LITERAL;
  value: RHValue;
  valueType: 'zero' | 'pulse' | 'phase' | 'string' | 'boolean' | 'null';
}

export interface RHIdentifier extends RHNode {
  type: RHNodeType.IDENTIFIER;
  name: string;
}

export interface RHComment extends RHNode {
  type: RHNodeType.COMMENT;
  text: string;
}

/**
 * Token types for lexer
 */
export enum RHTokenType {
  // Keywords
  ZERO = 'ZERO',
  PULSE = 'PULSE',
  PHASE = 'PHASE',
  SPECTRUM = 'SPECTRUM',
  MIRROR = 'MIRROR',
  IF = 'IF',
  SPECTRAL = 'SPECTRAL',
  FOR = 'FOR',
  IN = 'IN',
  FALLBACK = 'FALLBACK',
  PRINT = 'PRINT',

  // Literals
  NUMBER = 'NUMBER',
  COMPLEX = 'COMPLEX',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',

  // Identifiers
  IDENTIFIER = 'IDENTIFIER',

  // Operators
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  ASSIGN = 'ASSIGN',
  EQ = 'EQ',
  NEQ = 'NEQ',
  GT = 'GT',
  LT = 'LT',
  GTE = 'GTE',
  LTE = 'LTE',

  // Delimiters
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  LBRACKET = 'LBRACKET',
  RBRACKET = 'RBRACKET',
  COMMA = 'COMMA',
  COLON = 'COLON',
  NEWLINE = 'NEWLINE',
  ARROW = 'ARROW',

  // Special
  COMMENT = 'COMMENT',
  EOF = 'EOF',
}

export interface RHToken {
  type: RHTokenType;
  value: string;
  line: number;
  column: number;
}

/**
 * Runtime error for off-line violations
 */
export class RHOffLineError extends Error {
  constructor(message: string) {
    super(`[OFF-LINE VIOLATION] ${message}`);
    this.name = 'RHOffLineError';
  }
}

/**
 * Quantum fallback execution result
 */
export interface RHFallbackResult {
  success: boolean;
  value: RHValue;
  damped: boolean;
  attempts: number;
}
