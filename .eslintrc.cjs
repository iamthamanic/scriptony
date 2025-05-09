// .eslintrc.cjs
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.override.json'],
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  settings: {
    react: { version: 'detect' }
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'security',
    'jsdoc'
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended'
  ],
  rules: {
    // enforce explicit return types on functions
    '@typescript-eslint/explicit-function-return-type': 'error',
    // no more `any`
    '@typescript-eslint/no-explicit-any': 'error',
    // JSDoc rules
    'jsdoc/require-jsdoc': ['error', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: true,
        FunctionExpression: true
      }
    }],
    'jsdoc/require-param': 'error',
    'jsdoc/require-returns': 'error'
  }
}
