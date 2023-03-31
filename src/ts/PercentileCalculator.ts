import { InputScores } from "./FormHandler";
import { Random } from "./Random";

export class PercentileCalculator {
	private random = new Random();
	public seed;

	private scores: number[] = [];

	constructor(private inputScores: InputScores) {
		this.seed = this.random.seed;
		this.generateRandomScores();
	}

	private generateRandomScores() {
		const scores: number[] = [];

		for (let i = 0; i < this.inputScores.totalCompetitors; i += 1) {
			let score = NaN;

			// keep generating scores until a valid one is obtained (within range)
			while (
				isNaN(score) ||
				score < this.inputScores.minScore ||
				score > this.inputScores.maxScore
			) {
				score = Math.round(
					this.random.randomGaussianArbitraryMean(
						this.inputScores.minScore,
						this.inputScores.maxScore,
						this.inputScores.avgScore
					)
				);
			}

			scores.push(score);
		}

		this.scores = scores;
	}

	public getGeneralPercentileCount() {
		const counts: { [key: number]: number } = {};

		this.scores.forEach(function (x) {
			counts[x] = (counts[x] || 0) + 1;
		});

		return counts;
	}

	public getUserPercentile() {
		return (
			(this.scores.reduce((acc, curr) => (curr < this.inputScores.userScore ? acc + 1 : acc), 0) *
				100) /
			this.inputScores.totalCompetitors
		);
	}
}
