module.exports = {
  globals: {
    expect: true
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    mocha: true
  },
  extends: [
    'standard',
    'plugin:chai-expect/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'operator-linebreak': ['error', 'before'],
    'space-before-function-paren': 'off'
  }
}
