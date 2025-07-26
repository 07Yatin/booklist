module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Prevent undefined variables
    'no-undef': 'error',
    // Prevent unused variables
    'no-unused-vars': 'error',
    // Prevent unused imports
    'unused-imports/no-unused-imports': 'error',
    // Require error handling in catch blocks
    'no-empty': ['error', { 'allowEmptyCatch': false }],
    // Prevent console statements in production
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // Enforce consistent error handling
    'prefer-promise-reject-errors': 'error'
  },
  plugins: [
    'unused-imports'
  ]
}; 