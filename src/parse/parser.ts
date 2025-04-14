import nearley from 'nearley';

import grammar from './grammar';
import type { Label, Tree } from './types';

export type Result = { tree: Tree; score: number };

export function parse(text: string) {
	const parser = new nearley.Parser(
		nearley.Grammar.fromCompiled(grammar)
	).feed(text);

	const results = sortResults(parser.results);

	return results;
}

function sortResults(results: Tree[]): Result[] {
	const scoredResults: Result[] = results
		.map((tree) => ({
			tree,
			score: scoreTree(tree)
		}))
		.sort((a, b) => b.score - a.score);

	const exps = scoredResults.map((sr) => Math.exp(sr.score));
	const sum = exps.reduce((a, b) => a + b, 0);

	for (let i = 0; i < scoredResults.length; i++) {
		scoredResults[i].score = exps[i] / sum;
	}

	return scoredResults;
}

const goodLabels: Label[] = [
	'ordinal',
	'preverb_phrase',
	'preposition_phrase',
	'verb_phrase_intransitive',
	'verb_phrase_transitive',
	'verb_phrase_prepositional'
];

function scoreTree(tree: Tree): number {
	let score = 0;

	if (goodLabels.includes(tree.label)) {
		score += 1;
	}

	// 'ala' and 'taso' are rare as heads
	if (
		tree.type === 'labelled' &&
		tree.label === 'head' &&
		tree.tree.type === 'leaf' &&
		['ala', 'taso'].includes(tree.tree.word.text)
	) {
		score -= 1.5;
	}

	switch (tree.type) {
		case 'leaf':
			return score;
		case 'branch':
			return score + scoreTree(tree.left) + scoreTree(tree.right);
		case 'labelled':
			return score + scoreTree(tree.tree);
		case 'rose':
			return (
				score +
				tree.children.reduce((acc, child) => acc + scoreTree(child), 0)
			);
		default:
			throw new Error(`Unexpected tree: ${tree}`);
	}
}
