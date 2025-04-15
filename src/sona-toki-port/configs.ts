// TypeScript equivalent of Configs.py (refactored to use instance methods)

import { Cleaner, ConsecutiveDuplicates } from './cleaners';
import {
	Alphabetic,
	And,
	FalsePosAlphabetic,
	FalsePosSyllabic,
	Filter,
	Len,
	LongAlphabetic,
	LongProperName,
	LongSyllabic,
	Miscellaneous,
	NimiUCSUR,
	Not,
	Numeric,
	Or,
	ProperName,
	PuName,
	Punctuation,
	Syllabic,
	createNimiKuLili,
	createNimiKuSuli,
	createNimiLinkuByUsage,
	createNimiLinkuObscure,
	createNimiLinkuSandbox,
	createNimiLinkuUncommon
} from './filters';
import {
	Preprocessor,
	URLs,
	createRecommendedPreprocessors
} from './preprocessors';
import { PassFail, Scorer, SoftPassFail, SoftScaling } from './scorers';
import { Tokenizer, WordTokenizerRe } from './tokenizers';
import { Number } from './types';

/**
 * Dictionary of phonomatches to exclude from corpus config
 */
const DICT_PHONOMATCHES: Set<string> = new Set([
	'aka', // also known as
	'an', // article
	'api', // API
	'i', // 1st person
	'je', // 1st person pronoun, french
	'kana', // japanese script
	'me', // 1st person singular, english
	'ne', // "no" in several languages
	'nu', // "new" in english, "now" in dutch
	'omen', // ominous
	'se', // spanish particle, english "see"
	'sole', // singular, of shoe
	'take', // acquire
	'ten', // 10
	'to', // to, too
	'u', // no u
	'we', // 1st person plural, english
	'wi' // wii and discussions of syllables
]);

/**
 * Ilo configuration interface
 */
export interface IloConfig {
	preprocessors: Preprocessor[];
	cleaners: Cleaner[];
	ignoring_filters: Filter[];
	scoring_filters: Filter[];
	scorer: Scorer;
	passing_score: Number;
	empty_passes: boolean;
	word_tokenizer?: Tokenizer;
	sent_tokenizer?: Tokenizer;
}

/**
 * Create the base configuration
 */
export function createBaseConfig(): IloConfig {
	return {
		preprocessors: [new URLs()],
		cleaners: [new ConsecutiveDuplicates()],
		ignoring_filters: [new Numeric(), new Punctuation()],
		scoring_filters: [],
		scorer: new PassFail(),
		passing_score: 0.8,
		empty_passes: true
	};
}

/**
 * Create the preference configuration
 */
export function createPrefConfig(): IloConfig {
	const nimiLinkuUsage30 = createNimiLinkuByUsage(30);
	const nimiUCSUR = new NimiUCSUR();
	const syllabic = new Syllabic();
	const falsePosSyllabic = new FalsePosSyllabic();
	const alphabetic = new Alphabetic();
	const falseAlphabetic = new FalsePosAlphabetic();
	const properName = new ProperName();

	return {
		preprocessors: createRecommendedPreprocessors(),
		cleaners: [new ConsecutiveDuplicates()],
		ignoring_filters: [new Numeric(), new Punctuation()],
		scoring_filters: [
			new Len(new Or(nimiLinkuUsage30, nimiUCSUR), 0, 15),
			new Len(new And(syllabic, new Not(falsePosSyllabic)), 3, 24),
			new Len(properName, 2, 24),
			new Len(new And(alphabetic, new Not(falseAlphabetic)), 3, 24)
		],
		scorer: new SoftScaling(),
		passing_score: 0.8,
		empty_passes: true
	};
}

/**
 * Create the corpus configuration
 */
export function createCorpusConfig(): IloConfig {
	const nimiLinkuUsage0 = createNimiLinkuByUsage(0).withModifications(
		undefined,
		DICT_PHONOMATCHES
	);
	const nimiUCSUR = new NimiUCSUR();
	const miscellaneous = new Miscellaneous();
	const syllabic = new Syllabic();
	const falsePosSyllabic = new FalsePosSyllabic();
	const alphabetic = new Alphabetic();
	const falseAlphabetic = new FalsePosAlphabetic();
	const properName = new ProperName();

	return {
		preprocessors: createRecommendedPreprocessors(),
		cleaners: [new ConsecutiveDuplicates()],
		ignoring_filters: [new Numeric(), new Punctuation()],
		scoring_filters: [
			new Len(new Or(nimiLinkuUsage0, nimiUCSUR, miscellaneous), 0, 19),
			new Len(new And(syllabic, new Not(falsePosSyllabic)), 3, 24),
			new Len(properName, 2, 24),
			new Len(new And(alphabetic, new Not(falseAlphabetic)), 3, 24)
		],
		scorer: new SoftScaling(),
		passing_score: 0.8,
		empty_passes: true
	};
}

/**
 * Create the lazy configuration
 */
export function createLazyConfig(): IloConfig {
	return {
		preprocessors: createRecommendedPreprocessors(),
		cleaners: [new ConsecutiveDuplicates()],
		ignoring_filters: [new Numeric(), new Punctuation()],
		scoring_filters: [
			new Alphabetic(),
			new NimiUCSUR(),
			new PuName(),
			new Miscellaneous()
		],
		scorer: new SoftPassFail(),
		passing_score: 0.8,
		word_tokenizer: new WordTokenizerRe(),
		empty_passes: true
	};
}

/**
 * Create the IsiPin Epiku configuration
 */
export function createIsipinEpikuConfig(): IloConfig {
	return {
		preprocessors: createRecommendedPreprocessors(),
		cleaners: [new ConsecutiveDuplicates()],
		ignoring_filters: [new Numeric(), new Punctuation()],
		scoring_filters: [
			new Or(
				createNimiKuSuli(),
				createNimiKuLili(),
				createNimiLinkuUncommon(),
				createNimiLinkuObscure(),
				createNimiLinkuSandbox()
			),
			new And(new LongSyllabic(), new Not(new FalsePosSyllabic())),
			new LongProperName(),
			new And(new LongAlphabetic(), new Not(new FalsePosAlphabetic()))
		],
		scorer: new SoftScaling(),
		passing_score: 0.8,
		empty_passes: true
	};
}
