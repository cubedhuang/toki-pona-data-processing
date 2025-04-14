import { labels } from './consts';

export type Label = (typeof labels)[number];

export type Tree = Leaf | Branch | Labelled | Rose;

export interface Word {
	index: number | undefined;
	text: string;
}

interface TreeBase {
	/**
	 * The syntactic label of this node.
	 */
	label: Label;
	/**
	 * An index correlating a binding site with the structure it binds.
	 */
	binding?: number;
	/**
	 * A letter correlating an overt verbal argument with the PROs in a serial
	 * verb.
	 */
	coindex?: string;
	/**
	 * The source text for this subtree. This is always "surface Toaq" even if the tree represents a deep structure.
	 */
	source: string;
}

export interface Leaf extends TreeBase {
	type: 'leaf';
	word: Word;
	aux?: Tree;
}

export interface Branch extends TreeBase {
	type: 'branch';
	left: Tree;
	right: Tree;
}

export interface Labelled extends TreeBase {
	type: 'labelled';
	tree: Tree;
}

export interface Rose extends TreeBase {
	type: 'rose';
	children: Tree[];
}
