// TypeScript equivalent of types.py

export type Number = number;

export interface Scorecard {
	text: string;
	tokenized: string[];
	filtered: string[];
	cleaned: string[];
	score: Number;
}

export type LinkuUsageDate =
	| "2020-04"
	| "2021-10"
	| "2022-08"
	| "2023-09"
	| "2024-09";

export type LinkuUsageCategory =
	| "core"
	| "common"
	| "uncommon"
	| "obscure"
	| "sandbox";

export type LinkuBooks = "pu" | "ku suli" | "ku lili" | "none";

export interface LinkuWord {
	id: string;
	author_verbatim: string;
	author_verbatim_source: string;
	book: string;
	coined_era: string;
	coined_year: string;
	creator: string[];
	ku_data: Record<string, number>;
	see_also: string[];
	resources: Record<string, string>;
	representations: Record<string, string | string[]>;
	source_language: string;
	usage_category: LinkuUsageCategory;
	word: string;
	deprecated: boolean;
	etymology: Array<Record<string, string>>;
	audio: Array<Record<string, string>>;
	pu_verbatim: Record<string, string>;
	usage: Record<LinkuUsageDate, number>;
	translations: Record<string, Record<string, string>>;
}
