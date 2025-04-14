export type RawMessage = {
	id: string;
	content: string;
	authorId: string;
};

export type ScoredMessage = {
	id: string;
	score: number;
	sentences: ScoredSentence[];
};
export type ScoredSentence = {
	score: number;
	words: string[];
};
