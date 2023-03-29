export class TranslationController {
	private selectedLanguage = this.initLanguage();

	constructor() {
		this.translate();
	}

	private initLanguage() {
		return localStorage.getItem("language") || navigator.language.substring(0, 2) || "en";
	}

	public set language(language: string) {
		this.selectedLanguage = language;

		localStorage.setItem("language", language);
	}

	private async loadTranslation(lang: string): Promise<{ [key: string]: string }> {
		const response = await fetch(`translations/${lang}.json`);

		// If language not found in the translations folder
		if (response.status === 404) return await this.loadTranslation("en");

		const translation: { [key: string]: string } = await response.json();

		return translation;
	}

	private translateElement(element: HTMLElement, translations: { [key: string]: string }) {
		const key = element.dataset.i18n;

		if (key && translations[key]) {
			element.textContent = translations[key];
		}
	}

	private translate() {
		void this.loadTranslation(this.selectedLanguage).then((translations) => {
			const elements = document.querySelectorAll("[data-i18n]");
			return elements.forEach((element) =>
				this.translateElement(element as HTMLElement, translations)
			);
		});
	}
}
