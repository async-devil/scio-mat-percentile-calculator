export class TranslationController {
	private readonly defaultLanguage = "cs";

	private selectedLanguage = this.defaultLanguage;

	constructor() {
		const queryLanguage = this.getLanguageFromURLQuery();

		this.language =
			queryLanguage ||
			localStorage.getItem("language") ||
			navigator.language.substring(0, 2) ||
			this.defaultLanguage;

		this.translate();
	}

	private getLanguageFromURLQuery(): string | null {
		const url = new URL(window.location.href);

		const queryParams = new URLSearchParams(url.search);

		return queryParams.get("language");
	}

	public set language(language: string) {
		this.selectedLanguage = language;

		localStorage.setItem("language", language);
	}

	private async loadTranslation(lang: string): Promise<{ [key: string]: string }> {
		const response = await fetch(`translations/${lang}.json`);

		// If language not found in the translations folder
		if (response.status === 404) {
			this.language = this.defaultLanguage;
			return await this.loadTranslation(this.defaultLanguage);
		}

		const translation: { [key: string]: string } = await response.json();

		return translation;
	}

	private translateElement(element: HTMLElement, translations: { [key: string]: string }) {
		const key = element.dataset.i18n;

		if (key && translations[key]) {
			element.textContent = translations[key];
		}
	}

	public translate() {
		void this.loadTranslation(this.selectedLanguage).then((translations) => {
			const elements = document.querySelectorAll("[data-i18n]");
			return elements.forEach((element) =>
				this.translateElement(element as HTMLElement, translations)
			);
		});
	}
}
