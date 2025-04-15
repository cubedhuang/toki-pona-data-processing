// Example usage of the refactored sonatoki library

import {
	ConsecutiveDuplicates,
	Ilo,
	Numeric,
	PassFail,
	Punctuation,
	UNICODE_PUNCT,
	URLs,
	createBaseConfig,
	createCorpusConfig,
	createRecommendedPreprocessors
} from './sona-toki-port';

// Example 1: Using a predefined configuration
function example1() {
	// Create an Ilo instance with the CorpusConfig
	const corpusConfig = createCorpusConfig();
	const ilo = new Ilo(
		corpusConfig.preprocessors,
		corpusConfig.cleaners,
		corpusConfig.ignoring_filters,
		corpusConfig.scoring_filters,
		corpusConfig.scorer,
		corpusConfig.passing_score,
		corpusConfig.empty_passes,
		undefined, // use default sentenceScorer
		corpusConfig.word_tokenizer,
		corpusConfig.sent_tokenizer
	);

	// Check if a text is Toki Pona
	const text = 'mi moku e kili.';
	const isTokiPona = ilo.isTokiPona(text);
	console.log(`Is "${text}" Toki Pona? ${isTokiPona}`);

	// Get detailed analysis
	const scorecard = ilo.makeScorecard(text);
	console.log('Scorecard:', JSON.stringify(scorecard, null, 2));

	// Check multiple sentences
	const multiSentence = "mi moku e kili 'Fruit'. I like eating fruit.";
	const scorecards = ilo.makeScorecards(multiSentence);
	console.log('Scorecards for multiple sentences:');
	console.log(JSON.stringify(scorecards, null, 2));
	const results = ilo.areTokiPona(multiSentence);
	console.log(
		`Sentence results for "${multiSentence}": ${results.join(', ')}`
	);
}

example1();
