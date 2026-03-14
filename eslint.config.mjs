import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,
  eslintConfigPrettier,
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'out/**',
    'build/**',
    'coverage/**',
    'next-env.d.ts',
  ]),
]);
