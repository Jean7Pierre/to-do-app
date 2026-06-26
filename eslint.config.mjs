import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default tseslint.config(
  // 1. Archivos ignorados
  {
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs']
  },

  // 2. Reglas base de JS y TS
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // 3. Entorno y configuración del analizador para React
  {
    languageOptions: {
      // Le decimos a ESLint que estamos en un navegador moderno
      globals: {
        ...globals.browser,
        ...globals.es2020
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true // Habilitar la comprensión de código JSX
        }
      }
    }
  },

  // 4. Integración de los Plugins de React y Vite
  {
    plugins: {
      // (Eliminamos 'react': reactPlugin)
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin
    },
    rules: {
      // (Eliminamos las reglas recomendadas y de jsx-runtime del plugin eliminado)

      // Reglas para evitar bugs con useEffect y otros hooks
      ...reactHooksPlugin.configs.recommended.rules,

      // Regla vital para que el recargo rápido (Fast Refresh) de Vite funcione perfecto
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Tu regla personalizada de TypeScript
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },

  // 5. Prettier siempre al final para apagar reglas de formato que choquen
  eslintConfigPrettier
)
