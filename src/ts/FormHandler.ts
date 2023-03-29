import { DataChart } from "./DataChart";
import { PercentileCalculator } from "./PercentileCalculator";

export type InputScores = {
	maxScore: number;
	minScore: number;
	avgScore: number;
	userScore: number;
	totalCompetitors: number;
};

export class FormHandler {
	private form = document.querySelector("#form") as HTMLFormElement;

	private maxScoreInput = this.form.querySelector("#max-score") as HTMLInputElement;
	private minScoreInput = this.form.querySelector("#min-score") as HTMLInputElement;
	private avgScoreInput = this.form.querySelector("#avg-score") as HTMLInputElement;
	private userScoreInput = this.form.querySelector("#user-score") as HTMLInputElement;
	private totalCompetitorsInput = this.form.querySelector("#total-competitors") as HTMLInputElement;

	constructor(private readonly chart: DataChart) {
		this.form.addEventListener("submit", this.formEventListener.bind(this));
	}

	private formEventListener(event: SubmitEvent) {
		event.preventDefault();

		const scores: InputScores = {
			maxScore: parseFloat(this.maxScoreInput.value),
			minScore: parseFloat(this.minScoreInput.value),
			avgScore: parseFloat(this.avgScoreInput.value),
			userScore: parseFloat(this.userScoreInput.value),
			totalCompetitors: parseFloat(this.totalCompetitorsInput.value),
		};

		this.handleData(scores);
	}

	private handleData(scores: InputScores) {
		const calc = new PercentileCalculator(scores);

		console.log(calc.seed);
		this.chart.draw(calc.getGeneralPercentileCount(), scores.userScore);
	}
}
