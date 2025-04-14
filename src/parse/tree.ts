import { labels } from './consts';
import type { Token } from './lex';
import type { Branch, Label, Labelled, Leaf, Rose, Tree, Word } from './types';

const labelSet = new Set(labels);
function isLabel(x: string): x is Label {
	return labelSet.has(x as Label);
}

function validateLabel(x: string): Label {
	if (!isLabel(x)) {
		throw new Error(`Invalid label: ${x}`);
	}
	return x;
}

export function catSource(...args: (Tree | string | undefined | null)[]) {
	return args
		.map((x) => (typeof x === 'string' ? x : x ? x.source : undefined))
		.filter((x) => x)
		.join(' ');
}

export function makeWord([token]: [Token]): Word {
	return {
		index: token.index,
		text: token.value
	};
}

export function makeLeaf(label: Label): (tokens: [Token, Tree]) => Leaf {
	validateLabel(label);
	return ([token, aux]: [Token, Tree | undefined]) => ({
		type: 'leaf',
		word: makeWord([token]),
		aux,
		label,
		source: token.value
	});
}

export function makeLabelled(
	label: Label
): (tree: [Tree, Tree | undefined]) => Labelled {
	validateLabel(label);
	return ([tree, aux]: [Tree, Tree | undefined]) => ({
		type: 'labelled',
		tree,
		aux,
		label,
		source: tree.source
	});
}

export function makeBranch(label: Label): (trees: [Tree, Tree]) => Branch {
	validateLabel(label);
	return ([left, right]: [Tree, Tree]) => {
		return {
			type: 'branch',
			left,
			right,
			label,
			source: catSource(left, right)
		};
	};
}

export function makeRose(label: Label): (children: [Tree[]]) => Rose {
	validateLabel(label);
	return ([children]: [Tree[]]) => {
		return {
			type: 'rose',
			children,
			label,
			source: catSource(...children)
		};
	};
}

export function makeRoseOptional(label: Label): (children: [Tree[]]) => Tree {
	validateLabel(label);
	return ([children]: [Tree[]]) => {
		if (children.length === 1) {
			return children[0];
		}
		return {
			type: 'rose',
			children,
			label,
			source: catSource(...children)
		};
	};
}

export function makeRoseFromBranch(
	label: Label
): (trees: [Tree, Tree]) => Rose {
	validateLabel(label);
	return ([left, right]: [Tree, Tree]) => {
		if (right.type === 'rose') {
			return {
				type: 'rose',
				children: [left, ...right.children],
				label,
				source: catSource(left, right)
			};
		}

		return {
			type: 'rose',
			children: [left, right],
			label,
			source: catSource(left, right)
		};
	};
}
