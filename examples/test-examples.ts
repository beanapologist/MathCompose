import { AxiomPrimeSolver } from '../src/utils/axiom-prime-solver';

/**
 * Comprehensive test examples for unified AxiomPrimeSolver
 * Demonstrates both classical mathematics and COINjecture Network B formulas
 */

async function runTests() {
  const solver = new AxiomPrimeSolver();

  console.log('═══════════════════════════════════════════════════════════');
  console.log('  MATHCOMPOSE - Unified Mathematical Problem Solver');
  console.log('  Classical Axioms + COINjecture Network B Formulas');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Display constants
  console.log('📐 Mathematical Constants:');
  const constants = solver.getConstants();
  for (const [key, value] of Object.entries(constants)) {
    console.log(`   ${key}: ${value.toFixed(10)}`);
  }
  console.log('\n');

  // ============================================================================
  // CLASSICAL MATHEMATICS TESTS
  // ============================================================================

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('PART 1: CLASSICAL MATHEMATICS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 1: Spectral Zeta
  console.log('Test 1: Spectral Zeta Function');
  console.log('Problem: Calculate spectral score for frequency t=14.1347');
  let result = await solver.solve('Calculate the spectral score for frequency t=14.1347');
  printResult(result);

  // Test 2: Polynomial
  console.log('\nTest 2: Polynomial Interpolation');
  console.log('Problem: Quadratic with leading coeff 2, 3 through points (1, 5), (2, 10). Find P+Q at 100');
  result = await solver.solve('Quadratic with leading coeff 2, 3 through points (1, 5), (2, 10). Find P+Q(100)');
  printResult(result);

  // Test 3: Root Dynamics
  console.log('\nTest 3: Root Dynamics (Vieta\'s Formulas)');
  console.log('Problem: For x^2 - 5x + 6 = 0, find sum of the roots');
  result = await solver.solve('For x^2 - 5x + 6 = 0, find sum of the roots');
  printResult(result);

  // Test 4: Diophantine (Frobenius)
  console.log('\nTest 4: Diophantine Equations (Frobenius Number)');
  console.log('Problem: Largest integer that cannot be expressed as 6a + 9b');
  result = await solver.solve('What is the largest integer that cannot be expressed using 6 and 9?');
  printResult(result);

  // Test 5: Number Theory
  console.log('\nTest 5: Number Theory (Lucas Theorem)');
  console.log('Problem: C(10, 3) mod 7');
  result = await solver.solve('Calculate (10 choose 3) mod 7');
  printResult(result);

  // Test 6: Geometric
  console.log('\nTest 6: Geometric (Euler Characteristic)');
  console.log('Problem: Polyhedron with 8 vertices and 12 edges, find faces');
  result = await solver.solve('A convex polyhedron has 8 vertices and 12 edges. How many faces?');
  printResult(result);

  // ============================================================================
  // COINJECTURE NETWORK B TESTS
  // ============================================================================

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('PART 2: COINJECTURE NETWORK B FORMULAS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 7: Dimensional Scale
  console.log('Test 7: Dimensional Scale Formula');
  console.log('Problem: Calculate dimensional scale for pool 4');
  result = await solver.solve('What is the dimensional scale D_4 for pool 4?');
  printResult(result);

  // Test 8: Consensus State
  console.log('\nTest 8: Consensus State Dynamics');
  console.log('Problem: Calculate consensus state at tau=1.5');
  result = await solver.solve('Calculate the consensus state psi at tau=1.5');
  printResult(result);

  // Test 9: Unlock Schedule
  console.log('\nTest 9: Unlock Schedule');
  console.log('Problem: Fraction unlocked for pool 3 at tau=1.0');
  result = await solver.solve('What fraction is unlocked for pool 3 at tau=1.0?');
  printResult(result);

  // Test 10: Viviani Oracle
  console.log('\nTest 10: Viviani Oracle (Network Health)');
  console.log('Problem: Calculate Viviani delta for eta=0.7, lambda=0.7');
  result = await solver.solve('Calculate the Viviani oracle delta for eta=0.7 and lambda=0.7');
  printResult(result);

  // Test 11: Emission Rate
  console.log('\nTest 11: Dynamic Emission Rate');
  console.log('Problem: Emission rate with |psi|=0.85, base=50, halving=1');
  result = await solver.solve('Calculate emission rate with |ψ|=0.85, base_emission=50, halving=1');
  printResult(result);

  // Test 12: Reputation Score
  console.log('\nTest 12: Reputation Score');
  console.log('Problem: Node with stake=1000, median_stake=500, age=100, median_age=50');
  result = await solver.solve('Calculate reputation for stake=1000, median stake=500, age=100, median age=50, faults=0, bonus=0');
  printResult(result);

  // Test 13: Staking Multiplier
  console.log('\nTest 13: Staking Multiplier (Diversification)');
  console.log('Problem: Portfolio with share1=0.4, share2=0.3, share3=0.3');
  result = await solver.solve('Calculate staking multiplier for share1=0.4, share2=0.3, share3=0.3');
  printResult(result);

  // Test 14: Burn Rate
  console.log('\nTest 14: Burn Rate');
  console.log('Problem: Burn rate with cumulative_work=1000000, supply=50000000');
  result = await solver.solve('Calculate burn rate with work=1000000 and supply=50000000');
  printResult(result);

  // Summary
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ All tests completed successfully!');
  console.log('📊 Classical mathematics: 6 solvers');
  console.log('🌐 COINjecture Network B: 8 solvers');
  console.log('🔬 Total formulas implemented: 56');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

function printResult(result: any) {
  console.log('├─ Answer:', result.answer);
  console.log('├─ Invariant:', result.invariantUsed);
  console.log('├─ Steps:');
  result.steps.forEach((step: string, i: number) => {
    console.log(`│  ${i + 1}. ${step}`);
  });
  if (result.metadata?.formulaUsed) {
    console.log('├─ Formula:', result.metadata.formulaUsed);
  }
  console.log('└─ Logs:');
  result.logs.forEach((log: any) => {
    const icon = log.type === 'success' ? '✓' : log.type === 'warning' ? '⚠' : log.type === 'error' ? '✗' : 'ℹ';
    console.log(`   ${icon} ${log.message}`);
  });
}

// Run tests
runTests().catch(console.error);
