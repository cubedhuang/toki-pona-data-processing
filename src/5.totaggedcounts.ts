import { Tag, tagWords } from './lib/tag';
import {
	ParsedMessage,
	RawMessage,
	ScoredMessage,
	TaggedMessage
} from './types';
import { readFileByLine } from './utils';

function createCounts(): Record<Tag, number> {
	return {
		noun: 0,
		tverb: 0,
		iverb: 0,
		modifier: 0,
		particle: 0,
		preposition: 0,
		preverb: 0,
		interjection_head: 0
	};
}

async function main() {
	const words: Record<string, Record<Tag, number>> = {};

	let i = 0;

	await readFileByLine('./files/4.tagged.jsonl', (line) => {
		if (line.trim() === '') {
			return;
		}

		const message: TaggedMessage = JSON.parse(line);

		for (const sentence of message.sentences) {
			for (const taggedWord of sentence.words) {
				const word = taggedWord.word.text.toLowerCase();
				if (word in words) {
					words[word][taggedWord.tag]++;
				} else {
					words[word] = createCounts();
					words[word][taggedWord.tag] = 1;
				}
			}
		}

		if (i++ % 1000 === 0) {
			console.log(`Processed ${i} messages`);
		}
	});

	const sortedWords = Object.entries(words)
		.sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
		.map(([word, counts]) => ({
			word,
			counts,
			total: Object.values(counts).reduce((a, b) => a + b, 0)
		}))
		.filter(({ total }) => total >= 30);

	await Bun.write(
		'./files/4.taggedcounts.json',
		JSON.stringify(sortedWords, null, 2)
	);
}

main();
