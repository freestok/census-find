module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript'
  ],
  overrides: [
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"], // could be tsconfig.json too
  },
  plugins: [
    'react'
  ],
  rules: {
  },
  ignorePatterns: [
    '.eslintrc.js',
    'src/test-utils.tsx',
    'src/setupTests.ts',
    'src/serviceWorker.ts',
    'src/reportWebVitals.ts',
    'src/react-app-env.d.ts',
  ]
}
