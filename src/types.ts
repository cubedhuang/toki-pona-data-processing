import { Tag, TaggedWord } from './lib/tag';
import { Tree } from './parse/types';

// part 1: raw data
export type RawMessage = {
	id: string;
	content: string;
	authorId: string;
};

// part 2: scored messages
export type ScoredMessage = {
	id: string;
	score: number;
	sentences: ScoredSentence[];
};
export type ScoredSentence = {
	score: number;
	words: string[];
};

// part 3: parsed messages
export type ParsedMessage = {
	id: string;
	sentences: Tree[];
};

// part 4: tagged words
export type TaggedMessage = {
	id: string;
	sentences: TaggedSentence[];
};
export type TaggedSentence = {
	words: TaggedWord[];
};

// part 5: tagged counts
// map from year to counts
export type TaggedCounts = Record<string, TaggedWordCounts[]>;
export type TaggedWordCounts = {
	word: string;
	counts: Record<Tag, number>;
	total: number;
};
