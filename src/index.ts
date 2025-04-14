// test

import { tagWords } from "./lib/tag";
import { parse } from "./parse/parser";
import { Tree } from "./parse/types";

function cleanString(content: string) {
	return content.replace(/\xad/g, "").replace(/\0/g, "");
}

export function processMessage(message: string) {
	const sentences = message
		.split(/\.|·|:|\?|!|\n/g)
		.map(sentence => sentence.trim())
		.filter(sentence => sentence.length);
	const parses: Tree[] = [];
	const fails: string[] = [];
	for (const sentence of sentences) {
		const processed = processSentence(sentence);
		if (processed.fail) {
			fails.push(sentence);
			continue;
		}
		parses.push(processed.tree);
	}
	return {
		result: parses.map(tree => tagWords(tree)),
		fails
	};
}

type ProcessedSentence =
	| {
			tree: Tree;
			fail: false;
	  }
	| {
			tree: null;
			fail: true;
	  };

function processSentence(sentence: string): ProcessedSentence {
	try {
		const results = parse(sentence);
		return { tree: results[0].tree, fail: false };
	} catch (e) {
		return { tree: null, fail: true };
	}
}
