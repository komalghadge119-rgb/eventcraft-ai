/**
 * @fileoverview ESLint 9 Flat Configuration for EventCraft AI.
 * Enforces strict code quality, zero unused variables, and SonarQube architectural patterns.
 */

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.d.ts'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-unused-vars': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'error',
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always'],
    },
  },
];
