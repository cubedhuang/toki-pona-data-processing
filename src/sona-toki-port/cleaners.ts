// TypeScript equivalent of Cleaners.py (refactored to use instance methods)

/**
 * Base Cleaner interface
 */
export interface Cleaner {
	clean(token: string): string;
}

/**
 * Regular expression based cleaner
 */
export class RegexCleaner implements Cleaner {
	protected pattern: RegExp;
	protected replace: string;

	constructor(pattern: RegExp, replace: string = '') {
		this.pattern = pattern;
		this.replace = replace;
	}

	clean(token: string): string {
		return token.replace(this.pattern, this.replace);
	}
}

/**
 * Removes consecutive duplicates from an input string, ignoring case.
 *
 * The first match of any 2+ will be kept, preserving initial case.
 * For example, `FfFoo` will reduce to `Foo`, and `bBAR` will reduce to `bAR`.
 *
 * This is desirable for Toki Pona written with the Latin alphabet because strings
 * may be altered for emphasis or effect, such as in "sonaaaa" or "AAAAAA".
 */
export class ConsecutiveDuplicates implements Cleaner {
	clean(token: string): string {
		if (!token) {
			return token;
		}

		let output = token[0];
		let lastOutput = output.toLowerCase(); // ignore case in comparison

		for (let i = 1; i < token.length; i++) {
			const curChar = token[i].toLowerCase();
			if (curChar === lastOutput) {
				continue;
			}
			output += token[i]; // preserve case of string
			lastOutput = curChar;
		}

		return output;
	}
}

/**
 * Reference implementation for `ConsecutiveDuplicates` using regex
 */
export class ConsecutiveDuplicatesRe extends RegexCleaner {
	constructor() {
		super(/(.)\1+/gi, '$1');
	}
}

/**
 * Convert a string to lowercase
 */
export class Lowercase implements Cleaner {
	clean(token: string): string {
		return token.toLowerCase();
	}
}
