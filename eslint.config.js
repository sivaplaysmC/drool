import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.es2021,
			},
		},
	},
	{
		files: ['**/*.test.js'],
		languageOptions: {
			globals: {
				...globals.mocha,
				...globals.node,
				...globals.es2021,
			},
		},
	},
	{
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'warn',
		},
	},
];
