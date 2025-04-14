async function main() {
	const file = Bun.file("./files/aggregated.json");
	const json = await file.json();
	const outputFile = Bun.file("./files/aggregated.jsonl");
	outputFile.write(json.map(item => JSON.stringify(item)).join("\n"));
}

main();
