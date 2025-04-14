import { ilo } from "./ilo";
import { RawMessage, ScoredMessage } from "./types";
import { readFileByLine } from "./utils";

async function main() {
	const output = Bun.file("./files/1.scoredmessages.jsonl");
	Bun.write(output, ""); // Clear the file before writing
	const writer = output.writer();

	let i = 0;

	await readFileByLine("./files/aggregated.jsonl", line => {
		if (line.trim() === "") {
			return;
		}

		const message: RawMessage = JSON.parse(line);

		const { score: messageScore } = ilo.makeScorecard(message.content);

		const sentences = ilo.makeScorecards(message.content);

		const scoredMessage: ScoredMessage = {
			id: message.id,
			score: messageScore,
			sentences: sentences
				.map(sentence => ({
					score: sentence.score,
					words: sentence.cleaned
				}))
				.filter(sentence => sentence.words.length > 0)
		};

		writer.write(JSON.stringify(scoredMessage) + "\n");

		if (i++ % 1000 === 0) {
			console.log(`Processed ${i} messages`);
		}
	});

	writer.flush();
	writer.end();
}

main();
