// TypeScript equivalent of Scorers.py (refactored to use instance methods)

import { Filter, Pass } from './filters';
import { Number, Scorecard } from './types';

/**
 * Base Scorer interface
 */
export interface Scorer {
	score(tokens: string[], filters: Filter[]): Number;
}

/**
 * Meta-scorer that softens scores of short messages
 */
export class Soften implements Scorer {
	private baseScorer: Scorer;

	constructor(scorer: Scorer) {
		this.baseScorer = scorer;
	}

	/**
	 * Sigmoid function to scale scores based on token count
	 */
	protected sigmoid(n: number): Number {
		return 1 / (1 + Math.exp(-(0.3 * (n - 1))));
	}

	score(tokens: string[], filters: Filter[]): Number {
		let percentage = this.baseScorer.score(tokens, filters);
		const lenTokens = tokens.length;
		percentage = Math.pow(percentage, this.sigmoid(lenTokens));
		return percentage;
	}
}

/**
 * Simple pass/fail scorer - matches score 1, non-matches score 0
 */
export class PassFail implements Scorer {
	/**
	 * Score a single token
	 */
	protected scoreToken(token: string, filters: Filter[]): Number {
		for (const filter of filters) {
			if (filter.filter(token)) {
				return 1;
			}
		}
		return 0;
	}

	score(tokens: string[], filters: Filter[]): Number {
		if (!tokens.length) {
			return 1;
		}

		let totalScore = 0;
		const lenTokens = tokens.length;

		for (const token of tokens) {
			totalScore += this.scoreToken(token, filters);
		}

		return lenTokens ? totalScore / lenTokens : 0;
	}
}

/**
 * Scorer that weights filters based on their position in the list
 */
export class Scaling implements Scorer {
	/**
	 * Score a single token
	 */
	protected scoreToken(
		token: string,
		filters: Filter[],
		scale: number
	): Number {
		for (let i = 0; i < filters.length; i++) {
			if (filters[i].filter(token)) {
				return scale - i;
			}
		}
		return 0;
	}

	score(tokens: string[], filters: Filter[]): Number {
		if (!tokens.length) {
			return 1;
		}

		let totalScore = 0;
		const lenFilters = filters.length;
		const maxScore = tokens.length * lenFilters;

		for (const token of tokens) {
			totalScore += this.scoreToken(token, filters, lenFilters);
		}

		return maxScore ? totalScore / maxScore : 0;
	}
}

/**
 * Scorer that allows tokens to "vote" on nearby tokens
 */
export class Voting extends Scaling {
	private prereq: Filter;
	private threshold: number;

	constructor(prereq: Filter = new Pass(), threshold: number = 0) {
		super();
		this.prereq = prereq;
		this.threshold = threshold;
	}

	score(tokens: string[], filters: Filter[]): Number {
		if (!tokens.length) {
			return 1;
		}

		if (tokens.length < 4) {
			return super.score(tokens, filters);
		}

		const lenFilters = filters.length;
		const maxScore = tokens.length * lenFilters;

		// Score each token
		const scores: Number[] = [];
		for (const token of tokens) {
			const score = this.scoreToken(token, filters, lenFilters);
			scores.push(score);
		}

		// Copy scores before modifying
		const copiedScores = [...scores];

		// Apply voting logic
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			const score = copiedScores[i];

			if (score > this.threshold) {
				continue;
			}

			if (!this.prereq.filter(token)) {
				continue;
			}

			// Get neighbors
			const start = Math.max(i - 2, 0);
			const end = Math.min(i + 1, scores.length - 1);
			const neighbors = [
				...copiedScores.slice(start, i),
				...copiedScores.slice(i + 1, end + 1)
			];

			// Average neighbor scores
			if (neighbors.length > 0) {
				scores[i] =
					neighbors.reduce((sum, val) => sum + val, 0) /
					neighbors.length;
			}
		}

		const totalScore = scores.reduce((sum, val) => sum + val, 0);
		return maxScore ? totalScore / maxScore : 0;
	}
}

/**
 * PassFail with softened scoring for short messages
 */
export class SoftPassFail extends Soften {
	constructor() {
		super(new PassFail());
	}
}

/**
 * Scaling with softened scoring for short messages
 */
export class SoftScaling extends Soften {
	constructor() {
		super(new Scaling());
	}
}

/**
 * Voting with softened scoring for short messages
 */
export class SoftVoting extends Soften {
	constructor(prereq: Filter = new Pass(), threshold: number = 0) {
		super(new Voting(prereq, threshold));
	}
}

/**
 * Base SentenceScorer interface
 */
export interface SentenceScorer {
	score(scorecards: Scorecard[]): Scorecard[];
}

/**
 * No-op sentence scorer that returns unchanged scorecards
 */
export class SentNoOp implements SentenceScorer {
	score(scorecards: Scorecard[]): Scorecard[] {
		return scorecards;
	}
}

/**
 * Sentence scorer that averages scores across all sentences
 */
export class SentAvg implements SentenceScorer {
	score(scorecards: Scorecard[]): Scorecard[] {
		if (!scorecards.length) {
			return scorecards;
		}

		const total = scorecards.reduce((sum, card) => sum + card.score, 0);
		const avg = total / scorecards.length;

		return scorecards.map((card) => ({
			...card,
			score: avg
		}));
	}
}

/**
 * Sentence scorer that creates a weighted average based on token count
 */
export class SentWeightedAvg implements SentenceScorer {
	score(scorecards: Scorecard[]): Scorecard[] {
		if (!scorecards.length) {
			return scorecards;
		}

		let weightedTotal = 0;
		let totalLen = 0;

		for (const card of scorecards) {
			const cardlen = card.cleaned.length;
			const cardscore = card.score;

			weightedTotal += cardlen * cardscore;
			totalLen += cardlen;
		}

		const weightedAvg = totalLen > 0 ? weightedTotal / totalLen : 0;

		return scorecards.map((card) => ({
			...card,
			score: weightedAvg
		}));
	}
}
