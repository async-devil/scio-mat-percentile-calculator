export class TranslationController {
	private readonly defaultLanguage = "cs";

	private selectedLanguage = this.defaultLanguage;

	constructor() {
		this.language = localStorage.getItem("language") || this.defaultLanguage;

		this.translate();

		this.setAvailableTranslations();
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

	private async loadAvailableLanguages() {
		const response = await fetch("translations/available-languages.json");

		const languages: { [lang: string]: string } = await response.json();

		return languages;
	}

	private setAvailableTranslations() {
		const template = (url: string, langCode: string) => {
			return `<img src="${url}" class="language-flag" width="40" height="30" alt="${langCode}" />`;
		};

		const translationsBlock = document.getElementById("translations") as HTMLElement;

		void this.loadAvailableLanguages().then((translations) => {
			// eslint-disable-next-line promise/always-return
			for (const [langCode, url] of Object.entries(translations)) {
				translationsBlock.insertAdjacentHTML("beforeend", template(url, langCode));
			}

			document.querySelectorAll(".language-flag").forEach((element) => {
				element.addEventListener("click", () => {
					this.language = element.getAttribute("alt") || this.defaultLanguage;
					this.translate();
				});
			});
		});
	}
}
