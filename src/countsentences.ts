import { ScoredMessage } from './types';
import { fileAddon, readFileByLine } from './utils';

async function main() {
	let sentenceCount = 0;
	let count = 0;
	let i = 0;

	await readFileByLine(`./files/2.tokiponataso${fileAddon}.jsonl`, (line) => {
		if (line.trim() === '') {
			return;
		}

		const message: ScoredMessage = JSON.parse(line);

		sentenceCount += message.sentences.length;
		for (const sentence of message.sentences) {
			count += sentence.words.length;
		}

		if (i++ % 1000 === 0) {
			console.log(`Processed ${i} messages`);
		}
	});

	console.log(`sentenceCount: ${sentenceCount}`);
	console.log(`count: ${count}`);
	console.log(`average: ${count / sentenceCount}`);
}

main();
