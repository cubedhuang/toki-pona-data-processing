export async function readFileByLine(
	filePath: string | URL,
	onLineRead: (line: string) => void,
	onFinish?: () => void
) {
	const foo = Bun.file(filePath);

	const stream = foo.stream();
	const decoder = new TextDecoder();

	let remainingData = '';

	for await (const chunk of stream) {
		const str = decoder.decode(chunk);

		remainingData += str; // Append the chunk to the remaining data

		// Split the remaining data by newline character
		let lines = remainingData.split(/\r?\n/);
		// Loop through each line, except the last one
		while (lines.length > 1) {
			// Remove the first line from the array and pass it to the callback
			onLineRead(lines.shift()!);
		}
		// Update the remaining data with the last incomplete line
		remainingData = lines[0];
	}

	return onFinish?.();
}
