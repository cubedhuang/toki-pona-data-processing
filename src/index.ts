// test

import { tagWords } from "./lib/tag";
import { parse } from "./parse/parser";
import { Tree } from "./parse/types";

function process(message: string) {
	const sentences = message
		.split(/\.|·|:|\?|!|\n/g)
		.map(sentence => sentence.trim())
		.filter(sentence => sentence.length);
	const parses: Tree[] = [];
	const fails: string[] = [];

	for (const sentence of sentences) {
		try {
			const results = parse(sentence);
			parses.push(results[0].tree);
		} catch (e) {
			fails.push(sentence);
		}
	}

	return {
		result: parses.map(tree => tagWords(tree)),
		fails
	};
}
