module.exports = {
	env: {
		es2021: true,
		node: true,
		jest: true,
	},
	extends: [
		'airbnb-base',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: [
		'@typescript-eslint',
	],
	rules: {
		indent: [
			'error',
			'tab',
		],
		'linebreak-style': 'off',
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				ts: 'never',
				tsx: 'never',
				js: 'never',
				jsx: 'never',
			},
		],
		'max-len': 'off',
		'no-tabs': 'off',
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: [
					'.js',
					'.ts',
				],
			},
		},
	},
};
