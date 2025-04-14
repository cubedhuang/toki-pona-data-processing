// TypeScript equivalent of ilo.py (refactored to use instance methods)

import { Cleaner } from "./cleaners";
import { Filter } from "./filters";
import { Preprocessor } from "./preprocessors";
import { Scorer, SentNoOp, SentenceScorer } from "./scorers";
import { SentTokenizer, Tokenizer, WordTokenizer } from "./tokenizers";
import { Number, Scorecard } from "./types";

/**
 * Main Ilo class for Toki Pona text analysis
 */
export class Ilo {
	private preprocessors: Preprocessor[];
	private sentTokenizer: Tokenizer;
	private wordTokenizer: Tokenizer;
	private cleaners: Cleaner[];
	private ignoringFilters: Filter[];
	private scoringFilters: Filter[];
	private scorer: Scorer;
	private sentenceScorer: SentenceScorer;
	private passingScore: Number;
	private emptyPasses: boolean;

	/**
	 * Construct a new Ilo instance
	 */
	constructor(
		preprocessors: Preprocessor[],
		cleaners: Cleaner[],
		ignoringFilters: Filter[],
		scoringFilters: Filter[],
		scorer: Scorer,
		passingScore: Number,
		emptyPasses: boolean = true,
		sentenceScorer: SentenceScorer = new SentNoOp(),
		wordTokenizer: Tokenizer = new WordTokenizer(),
		sentTokenizer: Tokenizer = new SentTokenizer()
	) {
		this.preprocessors = [...preprocessors];
		this.sentTokenizer = sentTokenizer;
		this.wordTokenizer = wordTokenizer;
		this.cleaners = [...cleaners];
		this.ignoringFilters = [...ignoringFilters];
		this.scoringFilters = [...scoringFilters];
		this.scorer = scorer;
		this.sentenceScorer = sentenceScorer;
		this.passingScore = passingScore;
		this.emptyPasses = emptyPasses;
	}

	/**
	 * Apply all preprocessors to a message
	 */
	preprocess(msg: string): string {
		let processed = msg;
		for (const p of this.preprocessors) {
			processed = p.process(processed);
		}
		return processed;
	}

	/**
	 * Tokenize a message into words
	 */
	wordTokenize(msg: string): string[] {
		return this.wordTokenizer.tokenize(msg);
	}

	/**
	 * Tokenize a message into sentences
	 */
	sentTokenize(msg: string): string[] {
		return this.sentTokenizer.tokenize(msg);
	}

	/**
	 * Clean a single token
	 */
	cleanToken(token: string): string {
		let cleaned = token;
		for (const c of this.cleaners) {
			cleaned = c.clean(cleaned);
		}
		return cleaned;
	}

	/**
	 * Clean a list of tokens
	 */
	cleanTokens(tokens: string[]): string[] {
		const cleanedTokens: string[] = [];

		for (const token of tokens) {
			const cleanedToken = this.cleanToken(token);
			if (!cleanedToken) {
				continue;
			}
			cleanedTokens.push(cleanedToken);
		}

		return cleanedTokens;
	}

	/**
	 * Check if a token should be filtered out
	 */
	private filterToken(token: string): boolean {
		for (const f of this.ignoringFilters) {
			if (f.filter(token)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Filter tokens based on ignoring filters
	 */
	filterTokens(tokens: string[]): string[] {
		const filteredTokens: string[] = [];

		for (const token of tokens) {
			if (this.filterToken(token)) {
				continue;
			}
			filteredTokens.push(token);
		}

		return filteredTokens;
	}

	/**
	 * Score tokens based on scoring filters
	 */
	scoreTokens(tokens: string[]): number {
		return this.scorer.score(tokens, this.scoringFilters);
	}

	/**
	 * Score sentences based on sentence scorer
	 */
	scoreSentences(scorecards: Scorecard[]): Scorecard[] {
		return this.sentenceScorer.score(scorecards);
	}

	/**
	 * Process a message and determine if it is Toki Pona
	 * @private
	 */
	private analyzeText(message: string): Scorecard {
		const tokenized = this.wordTokenize(message);
		const filtered = this.filterTokens(tokenized);
		const cleaned = this.cleanTokens(filtered);
		let score = this.scoreTokens(cleaned);

		if (!this.emptyPasses && cleaned.length === 0) {
			score = 0;
		}

		const scorecard: Scorecard = {
			text: message,
			tokenized,
			filtered,
			cleaned,
			score
		};

		return scorecard;
	}

	/**
	 * Preprocess a message and create a scorecard
	 */
	makeScorecard(message: string): Scorecard {
		const preprocessed = this.preprocess(message);
		return this.analyzeText(preprocessed);
	}

	/**
	 * Check if a message is Toki Pona
	 */
	isTokiPona(message: string): boolean {
		const scorecard = this.makeScorecard(message);
		return scorecard.score >= this.passingScore;
	}

	/**
	 * Process a message into sentences
	 * @private
	 */
	private analyzeSentences(message: string): Scorecard[] {
		const scorecards: Scorecard[] = [];

		for (const sentence of this.sentTokenize(message)) {
			const result = this.analyzeText(sentence);
			scorecards.push(result);
		}

		return this.scoreSentences(scorecards);
	}

	/**
	 * Create scorecards for each sentence in a message
	 */
	makeScorecards(message: string): Scorecard[] {
		const preprocessed = this.preprocess(message);
		return this.analyzeSentences(preprocessed);
	}

	/**
	 * Check if each sentence in a message is Toki Pona
	 */
	areTokiPona(message: string): boolean[] {
		const preprocessed = this.preprocess(message);
		const scorecards = this.analyzeSentences(preprocessed);
		return scorecards.map(card => card.score >= this.passingScore);
	}
}
