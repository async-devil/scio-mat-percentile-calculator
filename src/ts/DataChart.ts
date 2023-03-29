import { Chart } from "chart.js/auto";

export class DataChart {
	private canvas = document.getElementById("data-chart") as HTMLCanvasElement;
	private chart?: Chart;

	public draw(percentileCount: { [score: number]: number }, userScore: number) {
		if (this.chart) this.chart.destroy();

		const labels = Object.keys(percentileCount).sort((a, b) => parseInt(a) - parseInt(b));
		//? If min value of x dataset isn't 0, point index value is shifted
		const xValueCorrection = parseInt(labels[0]);

		this.chart = new Chart(this.canvas, {
			type: "line",
			data: {
				labels,
				datasets: [
					{
						data: Object.values(percentileCount),
						fill: false,
						borderColor: "rgb(75, 192, 192)",
						tension: 0.1,
					},
				],
			},
			options: {
				scales: {
					x: {
						title: {
							display: true,
							text: "Score",
						},
					},
					y: {
						title: {
							display: true,
							text: "Amount of people",
						},
					},
				},
				plugins: {
					legend: {
						display: false,
					},
					annotation: {
						annotations: {
							verticalLine: {
								type: "line",
								xMin: userScore - xValueCorrection,
								xMax: userScore - xValueCorrection,
								borderColor: "red",
								borderWidth: 1,
							},
						},
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								return `${context.parsed.y} people achieved ${
									context.parsed.x + xValueCorrection
								} score`;
							},
						},
					},
				},
			},
		});
	}
}
