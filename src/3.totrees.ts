import { parseSentence } from './parse/parser';
import { Tree } from './parse/types';
import { ParsedMessage, ScoredMessage, ScoredSentence } from './types';
import { fileAddon, readFileByLine } from './utils';

async function main() {
	const successOutput = Bun.file(`./files/3.trees${fileAddon}.jsonl`);
	Bun.write(successOutput, ''); // Clear the file before writing
	const successWriter = successOutput.writer();

	const failureOutput = Bun.file(
		`./files/3.trees-failures${fileAddon}.jsonl`
	);
	Bun.write(failureOutput, ''); // Clear the file before writing
	const failureWriter = failureOutput.writer();

	let i = 0;

	await readFileByLine(`./files/2.tokiponataso${fileAddon}.jsonl`, (line) => {
		if (line.trim() === '') {
			return;
		}

		const message: ScoredMessage = JSON.parse(line);

		const successes: Tree[] = [];
		const failures: ScoredSentence[] = [];

		for (const sentence of message.sentences) {
			console.log(i, sentence.words.join(' '));
			try {
				const result = parseSentence(sentence.words);
				if (!result.length) {
					failures.push(sentence);
				} else {
					successes.push(result[0].tree);
				}
			} catch (e) {
				failures.push(sentence);
			}
		}

		if (successes.length) {
			const parsedMessage: ParsedMessage = {
				id: message.id,
				sentences: successes
			};

			successWriter.write(JSON.stringify(parsedMessage) + '\n');
		}

		if (failures.length) {
			const parsedMessage: ScoredMessage = {
				id: message.id,
				score: message.score,
				sentences: failures
			};

			failureWriter.write(JSON.stringify(parsedMessage) + '\n');
		}

		if (i++ % 1000 === 0) {
			console.log(`Processed ${i} messages`);
		}
	});

	failureWriter.end();
	successWriter.end();
}

main();
