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
