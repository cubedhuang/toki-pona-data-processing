import { Ilo, SentNoOp, createCorpusConfig } from "./sona-toki-port";

const corpusConfig = createCorpusConfig();
export const ilo = new Ilo(
	corpusConfig.preprocessors,
	corpusConfig.cleaners,
	corpusConfig.ignoring_filters,
	corpusConfig.scoring_filters,
	corpusConfig.scorer,
	corpusConfig.passing_score,
	corpusConfig.empty_passes,
	new SentNoOp(),
	corpusConfig.word_tokenizer,
	corpusConfig.sent_tokenizer
);
