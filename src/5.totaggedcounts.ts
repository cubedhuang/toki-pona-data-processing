import { getTimestamp } from 'discord-snowflake';

import { Tag } from './lib/tag';
import { TaggedCounts, TaggedMessage, TaggedWordCounts } from './types';
import { fileAddon, readFileByLine } from './utils';

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
	const years: Record<number, Record<string, Record<Tag, number>>> = {};

	let i = 0;

	await readFileByLine(`./files/4.tagged${fileAddon}.jsonl`, (line) => {
		if (line.trim() === '') {
			return;
		}

		const message: TaggedMessage = JSON.parse(line);

		let year: string;

		if (fileAddon === '.poki') {
			year = message.id.split('-')[0];
		} else {
			const date = new Date(getTimestamp(message.id as `${bigint}`));
			year = date.getFullYear().toString();
		}

		if (!(year in years)) {
			years[year] = {};
		}
		const words = years[year];

		for (const sentence of message.sentences) {
			for (const taggedWord of sentence.words) {
				const word = taggedWord.word.text.toLowerCase();

				// if (word === 'jo' && taggedWord.tag === 'modifier') {
				// 	console.log(
				// 		sentence.words.map((w) => w.word.text).join(' ')
				// 	);
				// }

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

	const output: TaggedCounts = {};

	for (const [year, words] of Object.entries(years).sort(
		([yearA], [yearB]) => Number(yearA) - Number(yearB)
	)) {
		const sortedWords = Object.entries(words)
			.sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
			.map(([word, counts]) => ({
				word,
				counts,
				total: Object.values(counts).reduce((a, b) => a + b, 0)
			}))
			.filter(({ total }) => total >= 30);

		output[year] = Object.fromEntries(sortedWords.map((w) => [w.word, w]));
	}

	await Bun.write(
		`./files/5.taggedcounts${fileAddon}.json`,
		JSON.stringify(output, null, 2)
	);
}

main();
