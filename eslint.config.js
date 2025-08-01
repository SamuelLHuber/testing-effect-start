import effectPlugin from "@effect/eslint-plugin"
import { fixupPluginRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import codegen from "eslint-plugin-codegen"
import _import from "eslint-plugin-import"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Import local rules files
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const localRules = require("./eslint-local-rules.cjs")
const advancedLocalRules = require("./eslint-local-rules-advanced.cjs")

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      "**/dist",
      "**/build",
      "**/docs",
      "**/*.md",
      "**/*.cjs",
      "**/*.js",
    ],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ),
  {
    plugins: {
      import: fixupPluginRules(_import),
      "sort-destructure-keys": sortDestructureKeys,
      "simple-import-sort": simpleImportSort,
      codegen,
      "@effect": effectPlugin,
      // Add local rules
      "local": { rules: localRules },
      "local-advanced": { rules: advancedLocalRules },
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: "module",
    },

    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },

      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },

    rules: {
      "codegen/codegen": "error",
      "no-fallthrough": "off",
      "no-irregular-whitespace": "off",
      "object-shorthand": "error",
      "prefer-destructuring": "off",
      "sort-imports": "off",

      "no-restricted-syntax": ["error", {
        selector:
          "CallExpression[callee.property.name='push'] > SpreadElement.arguments",
        message: "Do not use spread arguments in Array.push",
      }],

      "no-unused-vars": "off",
      "prefer-rest-params": "off",
      "prefer-spread": "off",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-unresolved": "off",
      "import/order": "off",
      "simple-import-sort/imports": "off",
      "sort-destructure-keys/sort-destructure-keys": "error",
      "deprecation/deprecation": "off",

      "@typescript-eslint/array-type": ["warn", {
        default: "generic",
        readonly: "generic",
      }],

      "@typescript-eslint/member-delimiter-style": 0,
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/consistent-type-imports": "warn",

      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],

      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/no-array-constructor": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-namespace": "off",

      "@effect/dprint": ["error", {
        config: {
          indentWidth: 2,
          lineWidth: 80,
          semiColons: "asi",
          quoteStyle: "alwaysDouble",
          trailingCommas: "onlyMultiLine",
          operatorPosition: "maintain",
          "arrowFunction.useParentheses": "force",
        },
      }],

      // @effect eslint plugin rules
      "@effect/no-import-from-barrel-package": "error",

      // Custom local rules from eslint-local-rules.cjs
      "local/no-opaque-instance-fields": "error",

      // Advanced custom rules from eslint-local-rules-advanced.cjs
      "local-advanced/no-try-catch-in-effect-gen": "error",
      "local-advanced/no-type-assertions": "error",
      "local-advanced/require-return-yield-for-errors": "error",
      "local-advanced/no-effect-runsync-in-gen": "error",
      "local-advanced/prefer-effect-constructors": "warn",
    },
  },
]
