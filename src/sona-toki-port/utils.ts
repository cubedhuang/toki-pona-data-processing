// TypeScript equivalent of utils.py

const TO_ESCAPE = ['\\', '^', '[', ']', '-'];

/**
 * Prepare a dictionary of words by applying cleaners
 */
export function prepDictionary(words: Iterable<string>): Set<string> {
	const out: Set<string> = new Set();

	for (const word of words) {
		let cleaned = word.toLowerCase();
		cleaned = removeConsecutiveDuplicates(cleaned);
		out.add(cleaned);
	}

	return out;
}

/**
 * Remove consecutive duplicates from a string, ignoring case
 */
export function removeConsecutiveDuplicates(token: string): string {
	if (!token) {
		return token;
	}

	let output = token[0];
	let lastOutput = output.toLowerCase();

	for (let i = 1; i < token.length; i++) {
		const curChar = token[i].toLowerCase();
		if (curChar === lastOutput) {
			continue;
		}
		output += token[i];
		lastOutput = curChar;
	}

	return output;
}

/**
 * Escape special characters for regex patterns
 */
export function regexEscape(s: string): string {
	let result = s;
	for (const c of TO_ESCAPE) {
		result = result.replace(new RegExp(`\\${c}`, 'g'), `\\${c}`);
	}
	return result;
}

/**
 * Convert a range of code points to a Unicode range string
 */
function toRange(start: number, prev: number): string {
	if (start === prev) {
		return `\\u{${start.toString(16).padStart(8, '0')}}`;
	}
	return `\\u{${start.toString(16).padStart(8, '0')}}-\\u{${prev
		.toString(16)
		.padStart(8, '0')}}`;
}

/**
 * Find Unicode character ranges from a string of characters
 */
export function findUnicodeRanges(chars: string): string[] {
	if (!chars) {
		return [];
	}

	const sChars = [...new Set(chars)].sort();
	const ranges: string[] = [];

	let start = sChars[0].codePointAt(0) || 0;
	let prev = start;

	for (let i = 1; i < sChars.length; i++) {
		const cur = sChars[i].codePointAt(0) || 0;
		if (cur === prev + 1) {
			prev = cur;
			continue;
		}

		ranges.push(toRange(start, prev));
		start = prev = cur;
	}

	const last = sChars[sChars.length - 1].codePointAt(0) || 0;
	ranges.push(toRange(start, last));

	return ranges;
}

/**
 * Convert Unicode range strings to actual characters
 */
export function findUnicodeChars(ranges: string[]): string {
	const result: string[] = [];

	for (const item of ranges) {
		if (item.includes('-')) {
			const [startStr, endStr] = item.split('-');
			const start = parseInt(
				startStr.replace('\\u{', '').replace('}', ''),
				16
			);
			const end = parseInt(
				endStr.replace('\\u{', '').replace('}', ''),
				16
			);

			for (let codePoint = start; codePoint <= end; codePoint++) {
				result.push(String.fromCodePoint(codePoint));
			}
		} else {
			const codePoint = parseInt(
				item.replace('\\u{', '').replace('}', ''),
				16
			);
			result.push(String.fromCodePoint(codePoint));
		}
	}

	return result.join('');
}

/**
 * Create overlapping pairs from an iterable
 */
export function overlappingPairs<T>(iterable: Iterable<T>): Array<[T, T]> {
	return overlappingNtuples(iterable, 2) as Array<[T, T]>;
}

/**
 * Create overlapping n-tuples from an iterable
 */
export function overlappingNtuples<T>(
	iterable: Iterable<T>,
	n: number
): Array<T[]> {
	const arrays: T[][] = [];
	const iterator = iterable[Symbol.iterator]();

	// Initialize arrays with staggered starting points
	for (let i = 0; i < n; i++) {
		const array: T[] = [];
		let current = iterator.next();

		// Skip items for staggered start
		for (let j = 0; j < i; j++) {
			current = iterator.next();
			if (current.done) break;
		}

		// Fill the array
		while (!current.done) {
			array.push(current.value);
			current = iterator.next();
		}

		arrays.push(array);
	}

	// Find the shortest length
	const minLength = Math.min(...arrays.map((a) => a.length));

	// Create the n-tuples
	const result: Array<T[]> = [];
	for (let i = 0; i < minLength; i++) {
		const tuple: T[] = [];
		for (let j = 0; j < n; j++) {
			tuple.push(arrays[j][i]);
		}
		result.push(tuple);
	}

	return result;
}
