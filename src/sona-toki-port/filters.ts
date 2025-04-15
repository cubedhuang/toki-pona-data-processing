// TypeScript equivalent of Filters.py (refactored to use instance methods)

import {
	ALLOWABLES,
	ALL_PUNCT,
	ALL_PUNCT_RANGES_STR,
	ALPHABET,
	CONSONANTS,
	FALSE_POS_ALPHABETIC,
	FALSE_POS_SYLLABIC,
	NIMI_PU_SYNONYMS,
	NIMI_UCSUR,
	VOWELS,
	wordsByTag,
	wordsByUsage
} from './constants';
import { LinkuBooks, LinkuUsageCategory, LinkuUsageDate } from './types';
import { prepDictionary } from './utils';

/**
 * Base Filter interface
 */
export interface Filter {
	filter(token: string): boolean;
}

/**
 * Filter using regular expressions
 */
export class RegexFilter implements Filter {
	protected pattern: RegExp;

	constructor(pattern: RegExp) {
		this.pattern = pattern;
	}

	filter(token: string): boolean {
		return Boolean(
			token.match(
				new RegExp(`^${this.pattern.source}$`, this.pattern.flags)
			)
		);
	}
}

/**
 * Filter based on membership in a set
 */
export class MemberFilter implements Filter {
	protected tokens: Set<string>;

	constructor(tokens: Set<string>) {
		this.tokens = tokens;
	}

	filter(token: string): boolean {
		return this.tokens.has(token.toLowerCase());
	}

	/**
	 * Create a new filter by adding or removing tokens
	 */
	withModifications(add?: Set<string>, sub?: Set<string>): MemberFilter {
		const newTokens = new Set(this.tokens);

		if (add) {
			for (const token of add) {
				newTokens.add(token);
			}
		}

		if (sub) {
			for (const token of sub) {
				newTokens.delete(token);
			}
		}

		return new MemberFilter(newTokens);
	}
}

/**
 * Filter based on whether all characters are in a given set
 */
export class SubsetFilter implements Filter {
	protected tokens: Set<string>;

	constructor(tokens: Set<string>) {
		this.tokens = tokens;
	}

	filter(token: string): boolean {
		const tokenChars = new Set(token.toLowerCase().split(''));

		for (const char of tokenChars) {
			if (!this.tokens.has(char)) {
				return false;
			}
		}

		return true;
	}
}

/**
 * Miscellaneous tokens that are allowed
 */
export class Miscellaneous extends MemberFilter {
	constructor() {
		super(prepDictionary(ALLOWABLES));
	}
}

/**
 * Words that would match Syllabic but are words in other languages
 */
export class FalsePosSyllabic extends MemberFilter {
	constructor() {
		super(prepDictionary(FALSE_POS_SYLLABIC));
	}
}

/**
 * Words that would match Alphabetic but are words in other languages
 */
export class FalsePosAlphabetic extends MemberFilter {
	constructor() {
		super(prepDictionary(FALSE_POS_ALPHABETIC));
	}
}

/**
 * Check if a token is a valid proper name based on capitalization
 */
export class ProperName implements Filter {
	filter(token: string): boolean {
		const firstCapitalized = token[0] === token[0].toUpperCase();
		const allCaps = token === token.toUpperCase();

		return firstCapitalized && !allCaps;
	}
}

/**
 * Check if a token is a valid name according to Toki Pona rules
 */
export class PuName implements Filter {
	filter(token: string): boolean {
		return (
			token ===
			token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()
		);
	}
}

/**
 * Create filters for words by Linku usage
 */
export function createNimiLinkuByUsage(
	usage: number,
	date?: LinkuUsageDate
): MemberFilter {
	const words = wordsByUsage(usage, date);
	return new MemberFilter(prepDictionary(words));
}

/**
 * Create filters for words by Linku tag
 */
export function createNimiLinkuByTag(
	tag: 'usage_category' | 'book',
	category: LinkuUsageCategory | LinkuBooks
): MemberFilter {
	const words = wordsByTag(tag, category);
	return new MemberFilter(prepDictionary(words));
}

// Predefined Linku filters (factory functions)
export function createNimiPu(): MemberFilter {
	return createNimiLinkuByTag('book', 'pu');
}

export function createNimiKuSuli(): MemberFilter {
	return createNimiLinkuByTag('book', 'ku suli');
}

export function createNimiKuLili(): MemberFilter {
	return createNimiLinkuByTag('book', 'ku lili');
}

export function createNimiLinkuCore(): MemberFilter {
	return createNimiLinkuByTag('usage_category', 'core');
}

export function createNimiLinkuCommon(): MemberFilter {
	return createNimiLinkuByTag('usage_category', 'common');
}

export function createNimiLinkuUncommon(): MemberFilter {
	return createNimiLinkuByTag('usage_category', 'uncommon');
}

export function createNimiLinkuObscure(): MemberFilter {
	return createNimiLinkuByTag('usage_category', 'obscure');
}

export function createNimiLinkuSandbox(): MemberFilter {
	return createNimiLinkuByTag('usage_category', 'sandbox');
}

/**
 * Common synonyms for pu words
 */
export class NimiPuSynonyms extends MemberFilter {
	constructor() {
		super(prepDictionary(NIMI_PU_SYNONYMS));
	}
}

/**
 * UCSUR words
 */
export class NimiUCSUR extends MemberFilter {
	constructor() {
		super(prepDictionary(NIMI_UCSUR));
	}
}

/**
 * Check if a token follows Toki Pona phonotactic rules
 */
export class Phonotactic extends RegexFilter {
	constructor() {
		super(
			new RegExp(
				`^((^[${VOWELS}]|[klmnps][${VOWELS}]|[jt][aeou]|[w][aei])(n(?![mn]))?)+$|^n$`,
				'i'
			)
		);
	}
}

/**
 * Check if a token follows Toki Pona syllabic structure
 */
export class Syllabic extends RegexFilter {
	constructor() {
		super(
			new RegExp(
				`^(?:^[${VOWELS}]n?)?(?:[${CONSONANTS}][${VOWELS}]n?)*$|^n$`,
				'i'
			)
		);
	}
}

/**
 * Check if a token uses only Toki Pona alphabet characters
 */
export class Alphabetic extends SubsetFilter {
	constructor() {
		super(new Set(ALPHABET));
	}
}

/**
 * Alternative implementation using regex
 */
export class AlphabeticRe extends RegexFilter {
	constructor() {
		super(new RegExp(`[${ALPHABET}]+`, 'i'));
	}
}

/**
 * Check if a token is entirely numeric
 */
export class Numeric implements Filter {
	filter(msg: string): boolean {
		return /^\d+$/.test(msg);
	}
}

/**
 * Check if a token is entirely punctuation
 */
export class Punctuation implements Filter {
	protected punctSet = new Set(...ALL_PUNCT);

	filter(token: string): boolean {
		for (const char of token) {
			if (!this.punctSet.has(char)) {
				return false;
			}
		}
		return true;
	}
}

/**
 * Check if a token is entirely punctuation (regex version)
 */
export class PunctuationRe extends RegexFilter {
	constructor() {
		super(new RegExp(`[${ALL_PUNCT_RANGES_STR}]+`));
	}
}

/**
 * Add minimum and maximum length constraints to a filter
 */
export class Len implements Filter {
	protected minlen: number;
	protected maxlen: number;
	protected baseFilter: Filter;

	constructor(filter: Filter, min: number = 0, max: number = 0) {
		this.minlen = min;
		this.maxlen = max;
		this.baseFilter = filter;
	}

	filter(token: string): boolean {
		const tokenLen = token.length;

		if (this.minlen > 0 && tokenLen < this.minlen) {
			return false;
		}

		if (this.maxlen > 0 && tokenLen > this.maxlen) {
			return false;
		}

		return this.baseFilter.filter(token);
	}
}

/**
 * Combine multiple filters with OR logic
 */
export class Or implements Filter {
	protected filters: Filter[];

	constructor(...filters: Filter[]) {
		if (filters.length < 2) {
			throw new Error('Provide at least two Filters to Or constructor.');
		}
		this.filters = filters;

		// Optimize MemberFilters if possible
		this.optimizeMemberFilters();
	}

	private optimizeMemberFilters(): void {
		const memberFilters = this.filters.filter(
			(f) => f instanceof MemberFilter
		) as MemberFilter[];
		const otherFilters = this.filters.filter(
			(f) => !(f instanceof MemberFilter)
		);

		if (memberFilters.length >= 2) {
			// Combine all member filters into one
			const allTokens = new Set<string>();
			for (const filter of memberFilters) {
				filter['tokens'].forEach((token) => allTokens.add(token));
			}

			const combinedMemberFilter = new MemberFilter(allTokens);

			// Replace multiple MemberFilters with a single combined one
			this.filters = [...otherFilters, combinedMemberFilter];
		}
	}

	filter(token: string): boolean {
		for (const filter of this.filters) {
			if (filter.filter(token)) {
				return true;
			}
		}
		return false;
	}
}

/**
 * Combine multiple filters with AND logic
 */
export class And implements Filter {
	protected filters: Filter[];

	constructor(...filters: Filter[]) {
		if (filters.length < 2) {
			throw new Error('Provide at least two Filters to And constructor.');
		}
		this.filters = filters;
	}

	filter(token: string): boolean {
		for (const filter of this.filters) {
			if (!filter.filter(token)) {
				return false;
			}
		}
		return true;
	}
}

/**
 * Negate a filter's result
 */
export class Not implements Filter {
	protected baseFilter: Filter;

	constructor(filter: Filter) {
		this.baseFilter = filter;
	}

	filter(token: string): boolean {
		return !this.baseFilter.filter(token);
	}
}

/**
 * Filter that always passes
 */
export class Pass implements Filter {
	filter(_token: string): boolean {
		return true;
	}
}

/**
 * Filter that always fails
 */
export class Fail implements Filter {
	filter(_token: string): boolean {
		return false;
	}
}

// Convenience derived filter classes with length restrictions
export class LongProperName extends Len {
	constructor() {
		super(new ProperName(), 2); // min length 2, no max
	}
}

export class LongPhonotactic extends Len {
	constructor() {
		super(new Phonotactic(), 3); // min length 3, no max
	}
}

export class LongSyllabic extends Len {
	constructor() {
		super(new Syllabic(), 3); // min length 3, no max
	}
}

export class LongAlphabetic extends Len {
	constructor() {
		super(new Alphabetic(), 3); // min length 3, no max
	}
}
