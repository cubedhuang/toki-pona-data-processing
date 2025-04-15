// test

import { tagWords } from './lib/tag';
import { parseSentence } from './parse/parser';
import { Tree } from './parse/types';

const text =
	'a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a li a a a mute'.split(
		' '
	);

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

console.log(processSentence(text));
