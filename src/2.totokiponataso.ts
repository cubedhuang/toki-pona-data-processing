import { ScoredMessage } from './types';
import { fileAddon, readFileByLine } from './utils';

/*
sona-mute does this:

alias TPUserSentence := (
	SELECT Sentence FILTER
		.score >= 0.8 AND
		.message.is_counted AND
		.message.score > 0.1 AND
		# this affects about 0.5% of otherwise counted data
		(.len >= 3 OR .message.score >= 0.3)
		# this affects about 1.5% of otherwise counted data
		# (without the length filter, it would be 4.5%)
		# shorter sentences have fewer opportunities to be correctly scored
		# so for those, we pull in more context, the message score
		# if the entire message or like 90% of it was the sentence, no harm done
		# if it's embedded in a larger message, we get more confidence
);

alias NonTPUserSentence := (
	SELECT Sentence FILTER
		.score < 0.8 AND
		.message.is_counted
);
 */

async function main() {
	const output = Bun.file(`./files/2.tokiponataso${fileAddon}.jsonl`);
	Bun.write(output, ''); // Clear the file before writing
	const writer = output.writer();

	let i = 0;

	await readFileByLine(
		`./files/1.scoredmessages${fileAddon}.jsonl`,
		(line) => {
			if (line.trim() === '') {
				return;
			}

			const message: ScoredMessage = JSON.parse(line);

			if (message.score < 0.1) {
				return;
			}

			message.sentences = message.sentences.filter(
				(sentence) =>
					sentence.score >= 0.8 &&
					(sentence.words.length >= 3 || message.score >= 0.3)
			);

			if (message.sentences.length === 0) {
				return;
			}

			writer.write(JSON.stringify(message) + '\n');

			if (i++ % 1000 === 0) {
				console.log(`Processed ${i} messages`);
			}
		}
	);

	writer.flush();
	writer.end();
}

main();
