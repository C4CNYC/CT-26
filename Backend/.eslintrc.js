module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
	},
	overrides: [
		{
			files: ['test/**', 'src/**/*.spec.ts'],
			extends: ['plugin:jest/recommended'],
			rules: {
				'@typescript-eslint/unbound-method': 'off',
				'@typescript-eslint/no-unsafe-argument': 'off',
				'@typescript-eslint/no-unsafe-member-access': 'off',
				'@typescript-eslint/require-await': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/no-explicit-any': 'warn',
				'@typescript-eslint/no-unsafe-assignment': 'warn',
				'jest/unbound-method': 'error',
				'jest/expect-expect': [
					'error',
					{
						assertFunctionNames: [
							'expect',
							'request.**.expect',
							'agent[0-9]?.**.expect',
						],
					},
				],
				'jest/no-standalone-expect': [
					'error',
					{
						additionalTestBlockFunctions: ['afterEach', 'beforeAll'],
					},
				],
			},
		},
	],
	plugins: ['@typescript-eslint', 'jest', 'eslint-plugin-local-rules'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	rules: {
		'prettier/prettier': ['error', require('./.prettierrc.json')],
		'local-rules/correct-logger-context': 'error',
		'local-rules/no-typeorm-equal': 'error',
		'func-style': ['warn', 'declaration'],
		// TODO: make this error
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unsafe-call': 'warn',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ argsIgnorePattern: '^_+$' },
		],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'no-return-await': 'off',
		'@typescript-eslint/return-await': ['error', 'always'],
		'@typescript-eslint/naming-convention': [
			'warn',
			{
				selector: 'default',
				format: ['snake_case'],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow',
			},
			{
				selector: 'import',
				format: ['snake_case', 'camelCase', 'PascalCase'],
				leadingUnderscore: 'allow',
			},
			{
				selector: 'function',
				format: ['camelCase'],
			},
			{
				selector: 'method',
				format: ['camelCase'],
			},
			{
				selector: 'enumMember',
				format: ['UPPER_CASE'],
			},
			{
				selector: 'objectLiteralProperty',
				format: ['camelCase', 'snake_case'],
			},
			{
				selector: 'parameterProperty',
				format: ['camelCase'],
			},
			{
				selector: 'variable',
				format: ['snake_case', 'UPPER_CASE'],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow',
			},
			{
				selector: 'typeLike',
				format: ['PascalCase'],
			},
			{
				selector: 'property',
				format: ['camelCase', 'snake_case'],
			},
		],
	},
}
