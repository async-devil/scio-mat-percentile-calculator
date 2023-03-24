export function greeting(text: string) {
	const div = document.getElementById("greeting");

	if (!div) throw new Error("div with id 'greeting' not found");

	div.innerHTML = text;
}
