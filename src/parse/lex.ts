import type { Lexer } from 'nearley';

export const tokenTypes = [
	'word_particle',
	'word_content',
	'word_preposition',
	'word_preverb',
	'word_number',
	'word_modifier_only', // kin and names
	'word_unmarked_subject' // mi, sina
] as const;

export type TokenType = (typeof tokenTypes)[number];

export type Token = {
	type: TokenType;
	value: string;
	index: number;
};

export const particles = ['li', 'e', 'pi', 'la', 'en', 'o', 'anu', 'a'];
export const prepositions = ['tan', 'lon', 'sama', 'tawa', 'kepeken'];
export const preverbs = [
	'awen',
	'kama',
	'wile',
	'ken',
	'sona',
	'lukin',
	'alasa'
];
export const numbers = ['wan', 'tu', 'luka', 'mute', 'ale', 'ali'];
export const unmarkedSubjects = ['mi', 'sina'];

export class TokiPonaLexer implements Lexer {
	private i = 0;
	private text = '';

	reset(text: string) {
		this.i = 0;
		this.text = text;
	}

	next() {
		this.skipNonWord();

		if (this.i >= this.text.length) {
			return;
		}

		const index = this.i;

		while (this.i < this.text.length && this.isWord(this.text[this.i])) {
			this.i++;
		}

		const value = this.text.substring(index, this.i);

		let type: TokenType = 'word_content';

		if (particles.includes(value)) {
			type = 'word_particle';
		} else if (prepositions.includes(value)) {
			type = 'word_preposition';
		} else if (preverbs.includes(value)) {
			type = 'word_preverb';
		} else if (numbers.includes(value)) {
			type = 'word_number';
		} else if (value === 'kin' || value[0] === value[0].toUpperCase()) {
			type = 'word_modifier_only';
		} else if (unmarkedSubjects.includes(value)) {
			type = 'word_unmarked_subject';
		}

		return { type, value, index };
	}

	save() {
		return {};
	}

	formatError(token: Token) {
		return `'${token.value}' at index ${token.index}`;
	}

	has(tokenType: string) {
		return tokenTypes.includes(tokenType as TokenType);
	}

	private skipNonWord() {
		while (this.i < this.text.length && !this.isWord(this.text[this.i])) {
			this.i++;
		}
	}

	private isWord(char: string) {
		return /[a-z]/i.test(char);
	}
}
