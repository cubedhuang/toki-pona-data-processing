// TypeScript equivalent of Preprocessors.py (refactored to use instance methods)

/**
 * Base Preprocessor interface
 *
 * Preprocessors strip content from a string prior to tokenization
 */
export interface Preprocessor {
	process(msg: string): string;
}

/**
 * Regular expression based preprocessor
 */
export class RegexPreprocessor implements Preprocessor {
	protected pattern: RegExp;
	protected replace: string;

	constructor(pattern: RegExp, replace: string = ' ') {
		this.pattern = pattern;
		this.replace = replace;
	}

	process(msg: string): string {
		return msg.replace(this.pattern, this.replace);
	}
}

// Ignorables - tokens which don't count toward accepted or total tokens

/**
 * Remove http(s) protocol URLs
 */
export class URLs extends RegexPreprocessor {
	constructor() {
		super(/https?:\/\/\S+/g);
	}
}

/**
 * Remove URLs in markdown format, replacing with corresponding text
 */
export class MarkdownURLs extends RegexPreprocessor {
	constructor() {
		super(/\[(.+?)\]\(https?:\/\/\S+\)/g, '$1');
	}
}

/**
 * Remove email addresses
 */
export class Emails extends RegexPreprocessor {
	constructor() {
		super(/\b[a-zA-Z0-9._%+-]{2,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,24}\b/gi);
	}
}

/**
 * Remove text contained in double brackets
 */
export class Reference extends RegexPreprocessor {
	constructor() {
		super(/\[\[.+\]\]/g);
	}
}

/**
 * Remove Discord emotes
 */
export class DiscordEmotes extends RegexPreprocessor {
	constructor() {
		super(/<a?:[a-zA-Z0-9_]{2,}:[0-9]{2,}>/g);
	}
}

/**
 * Remove colon-marked emotes
 */
export class ColonEmotes extends RegexPreprocessor {
	constructor() {
		super(/:[a-zA-Z0-9_]{2,}:/g);
	}
}

/**
 * Remove Discord mentions
 */
export class DiscordMentions extends RegexPreprocessor {
	constructor() {
		super(/<@[\!\&]?[0-9]{2,}>/g);
	}
}

/**
 * Remove Discord channels
 */
export class DiscordChannels extends RegexPreprocessor {
	constructor() {
		super(/<#[0-9]{2,}>/g);
	}
}

/**
 * Remove Discord special tags
 */
export class DiscordSpecial extends RegexPreprocessor {
	constructor() {
		super(/<id:[a-zA-Z0-9_]{4,}>/g);
	}
}

/**
 * Remove any contiguous text in angle brackets
 */
export class AngleBracketObject extends RegexPreprocessor {
	constructor() {
		super(/<[^<>\s]+>/g);
	}
}

// Containers - segments of input that can be removed entirely

/**
 * Remove content in single quotes
 */
export class SingleQuotes extends RegexPreprocessor {
	constructor() {
		super(/'[^']+'/gs);
	}
}

/**
 * Remove content in double quotes
 */
export class DoubleQuotes extends RegexPreprocessor {
	constructor() {
		super(/"[^"]+"/gs);
	}
}

/**
 * Remove content in backticks
 */
export class Backticks extends RegexPreprocessor {
	constructor() {
		super(/`[^`]+`/gs);
	}
}

/**
 * Remove codeblocks
 */
export class Codeblock extends RegexPreprocessor {
	constructor() {
		super(/```(?:.|\n)+?```/gs);
	}
}

/**
 * Remove spoiler-marked content (Discord spoilers)
 */
export class Spoilers extends RegexPreprocessor {
	constructor() {
		super(/\|\|(?:(?!\|\|).)+\|\|/gs);
	}
}

/**
 * Remove quoted lines starting with >
 */
export class ArrowQuote extends RegexPreprocessor {
	constructor() {
		super(/^>\ .+$/gm);
	}
}

/**
 * Combined quoting patterns
 */
export class AllQuotes extends RegexPreprocessor {
	constructor() {
		const singleQuotes = /'[^']+'/gs.source;
		const doubleQuotes = /"[^"]+"/gs.source;
		const backticks = /`[^`]+`/gs.source;
		const arrowQuote = /^>\ .+$/gm.source;

		super(
			new RegExp(
				`${singleQuotes}|${doubleQuotes}|${backticks}|${arrowQuote}`,
				'gms'
			)
		);
	}
}

/**
 * Remove emojis - would need an emoji library in a real implementation
 */
export class Emoji implements Preprocessor {
	process(msg: string): string {
		// For a full implementation, you would use a library like emoji-regex
		// This is a simplified placeholder
		return msg.replace(
			/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu,
			''
		);
	}
}

/**
 * Remove zero-width joiner and non-joiner
 */
export class ZeroWidths extends RegexPreprocessor {
	constructor() {
		super(/[\u200C-\u200D]/g);
	}
}

/**
 * Create an array of recommended preprocessors in order of application
 */
export function createRecommendedPreprocessors(): Preprocessor[] {
	return [
		new Codeblock(),
		new AngleBracketObject(),
		new Reference(),
		new MarkdownURLs(),
		new URLs(),
		new Emails(),
		new Emoji()
	];
}
