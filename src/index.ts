import { Chart } from "chart.js";

import "./scss/normalize.scss";
import "./scss/styles.scss";
import annotationPlugin from "chartjs-plugin-annotation";

import { DataChart } from "./ts/DataChart";
import { FormHandler } from "./ts/FormHandler";
import { TranslationController } from "./ts/TranslationController";

Chart.register(annotationPlugin);

const chart = new DataChart();
new FormHandler(chart);
new TranslationController();
