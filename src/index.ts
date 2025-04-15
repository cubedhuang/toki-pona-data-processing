// test

import { tagWords } from './lib/tag';
import { parseSentence } from './parse/parser';
import { Tree } from './parse/types';

type ProcessedSentence =
	| {
			tree: Tree;
			fail: false;
	  }
	| {
			tree: null;
			fail: true;
	  };

function processSentence(sentence: string[]): ProcessedSentence {
	try {
		const results = parseSentence(sentence);
		return { tree: results[0].tree, fail: false };
	} catch (e) {
		return { tree: null, fail: true };
	}
}
