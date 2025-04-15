// TypeScript equivalent of Tokenizers.py (refactored to use instance methods)

import {
	ALL_PUNCT,
	ALL_PUNCT_RANGES_STR,
	ALL_SENTENCE_PUNCT,
	INTRA_WORD_PUNCT,
	UCSUR_CARTOUCHE_LEFT,
	UCSUR_CARTOUCHE_RIGHT,
	UCSUR_MINUS_CARTOUCHE,
	UNICODE_WHITESPACE
} from './constants';
import { regexEscape } from './utils';

/**
 * Base Tokenizer interface
 */
export interface Tokenizer {
	tokenize(s: string): string[];
}

/**
 * Set-based tokenizer
 */
export abstract class SetTokenizer implements Tokenizer {
	protected delimiters: Set<string>;

	constructor(delimiters: Set<string>) {
		this.delimiters = delimiters;
	}

	abstract tokenize(s: string): string[];
}

/**
 * Regex-based tokenizer
 */
export class RegexTokenizer implements Tokenizer {
	protected pattern: RegExp;

	constructor(pattern: RegExp) {
		this.pattern = pattern;
	}

	tokenize(s: string): string[] {
		return s
			.split(this.pattern)
			.map((word) => word.trim())
			.filter((word) => word.length > 0);
	}
}

/**
 * Word tokenizer that handles Toki Pona tokenization rules
 */
export class WordTokenizer implements Tokenizer {
	protected delimiters: Set<string>;
	protected intraWordPunct: Set<string>;

	constructor(delimiters?: Set<string>, intraWordPunct?: Set<string>) {
		this.delimiters = delimiters || new Set(ALL_PUNCT);
		this.intraWordPunct = intraWordPunct || new Set(INTRA_WORD_PUNCT);
	}

	/**
	 * Check if a character is a delimiter
	 */
	protected isDelimiter(c: string): boolean {
		return this.delimiters.has(c) || !c;
	}

	/**
	 * Add a token if it exists
	 */
	protected addToken(
		s: string,
		tokens: string[],
		lastMatch: number,
		i: number
	): void {
		if (i > lastMatch) {
			tokens.push(s.substring(lastMatch, i));
		}
	}

	/**
	 * Check if a character is a UCSUR character
	 */
	protected isUCSURChar(char: string): boolean {
		// This is a placeholder - in a real implementation we would check
		// if the character is in the NIMI_UCSUR range
		return false;
	}

	/**
	 * Convert a string into tokens
	 */
	protected toTokens(s: string): string[] {
		const tokens: string[] = [];
		const slen = s.length;
		let i = 0;
		let didSkip = false;

		while (i < slen) {
			// Handle contiguous punctuation
			let lastMatch = i;
			while (i < slen && this.isDelimiter(s[i])) {
				i++;
			}
			this.addToken(s, tokens, lastMatch, i);

			// Handle contiguous writing characters
			lastMatch = i;
			while (i < slen && !this.isDelimiter(s[i])) {
				didSkip = false;

				// Special handling for UCSUR characters
				if (this.isUCSURChar(s[i])) {
					this.addToken(s, tokens, lastMatch, i);
					tokens.push(s[i]);
					i++;
					lastMatch = i;
					continue;
				}

				const nextChar = i + 1 < slen ? s[i + 1] : '';
				if (this.intraWordPunct.has(nextChar)) {
					didSkip = true;
					i += 2;
					continue;
				}

				i++;
			}

			if (didSkip) {
				this.addToken(s, tokens, lastMatch, i - 1);
				lastMatch = i - 1;
				while (i < slen && this.isDelimiter(s[i])) {
					i++;
				}
			}

			this.addToken(s, tokens, lastMatch, i);
		}

		return tokens;
	}

	/**
	 * Tokenize a string into words
	 */
	tokenize(s: string): string[] {
		if (!s) {
			return [];
		}

		const tokens: string[] = [];
		const candidates = s.split(/\s+/);

		for (const candidate of candidates) {
			const results = this.toTokens(candidate);
			tokens.push(...results);
		}

		return tokens;
	}
}

/**
 * Word tokenizer using regex
 */
export class WordTokenizerRe extends RegexTokenizer {
	constructor() {
		super(new RegExp(`([${ALL_PUNCT_RANGES_STR}]+|\\s+)`, 'g'));
	}
}

/**
 * Sentence tokenizer - FIXED VERSION
 */
export class SentTokenizer implements Tokenizer {
	protected delimiters: Set<string>;
	protected intraWordPunct: Set<string>;
	protected allPunct: Set<string>;

	constructor(
		delimiters?: Set<string>,
		intraWordPunct?: Set<string>,
		allPunct?: Set<string>
	) {
		this.delimiters = delimiters || new Set([...ALL_SENTENCE_PUNCT, '\n']);
		this.intraWordPunct = intraWordPunct || new Set(INTRA_WORD_PUNCT);
		this.allPunct =
			allPunct || new Set([...ALL_PUNCT, ...UNICODE_WHITESPACE]);
	}

	tokenize(s: string): string[] {
		if (!s) {
			return [];
		}

		// Split directly on newlines first to ensure line breaks are respected
		const lines = s.split('\n');
		const tokens: string[] = [];

		for (const line of lines) {
			// Skip empty lines
			if (!line.trim()) {
				continue;
			}

			// For each line, extract sentences
			let currentSentence = '';
			let i = 0;
			const lineLength = line.length;

			while (i < lineLength) {
				currentSentence += line[i];

				// Handle UCSUR cartouche special case
				if (line[i] === UCSUR_CARTOUCHE_LEFT) {
					const rightI = line.indexOf(UCSUR_CARTOUCHE_RIGHT, i);
					if (rightI > 0) {
						// Add the content between cartouches
						currentSentence += line.substring(i + 1, rightI + 1);
						i = rightI + 1;
						continue;
					}
				}

				// Check if the current character is a sentence delimiter
				if (this.delimiters.has(line[i])) {
					// Handle intra-word punctuation case (like periods in abbreviations)
					if (this.intraWordPunct.has(line[i])) {
						const prev = i > 0 ? line[i - 1] : '';
						const next = i + 1 < lineLength ? line[i + 1] : '';

						// If punctuation is inside a word (between two non-punctuation characters), continue
						if (
							prev &&
							next &&
							!this.allPunct.has(prev) &&
							!this.allPunct.has(next)
						) {
							i++;
							continue;
						}
					}

					// Add the current sentence if it's not empty after trimming
					const trimmedSentence = currentSentence.trim();
					if (trimmedSentence) {
						tokens.push(trimmedSentence);
					}

					// Reset current sentence
					currentSentence = '';
				}

				i++;
			}

			// Add any remaining text from the line as a sentence
			const finalSentence = currentSentence.trim();
			if (finalSentence) {
				tokens.push(finalSentence);
			}
		}

		return tokens;
	}
}

/**
 * Sentence tokenizer using regex
 */
export class SentTokenizerRe extends RegexTokenizer {
	constructor() {
		super(new RegExp(`(?<=[${regexEscape(ALL_SENTENCE_PUNCT)}])|$`, 'm'));
	}
}
