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
	const output = Bun.file('./files/4.tagged.jsonl');
	Bun.write(output, ''); // Clear the file before writing
	const writer = output.writer();

	let i = 0;

	await readFileByLine('./files/3.trees.jsonl', (line) => {
		if (line.trim() === '') {
			return;
		}

		const message: ParsedMessage = JSON.parse(line);

		const taggedMessage: TaggedMessage = {
			id: message.id,
			sentences: []
		};

		for (const sentence of message.sentences) {
			taggedMessage.sentences.push({ words: tagWords(sentence) });
		}

		writer.write(JSON.stringify(taggedMessage) + '\n');

		if (i++ % 1000 === 0) {
			console.log(`Processed ${i} messages`);
		}
	});

	await writer.end();
}

main();
