"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataset,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { parseISO, format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GraphBlock({
  title,
  labels,
  datasets,
  dualAxis = false,
  rangeHours,
}: {
  title: string;
  labels: string[];
  datasets: ChartDataset<"line", number[]>[];
  dualAxis?: boolean;
  rangeHours: number;
}) {
  const curvedDatasets = datasets.map((set) => ({
    ...set,
    tension: 0.4,
  }));

  const options = {
    responsive: true,
    interaction: { mode: "index" as const, intersect: false },
    stacked: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: title },
    },
    scales: {
      x: {
        ticks: {
          callback: function (_value: unknown, index: number) {
            const label = labels[index];
            if (!label) return "";
            const date = parseISO(label);
            return rangeHours >= 24
              ? format(date, "d.M. HH:mm")
              : format(date, "HH:mm");
          },
        },
      },
      ...(dualAxis
        ? {
            y: { type: "linear" as const, position: "left" as const },
            y1: {
              type: "linear" as const,
              position: "right" as const,
              grid: { drawOnChartArea: false },
            },
          }
        : {}),
    },
  };

  return (
    <div className="bg-white rounded p-4 shadow mb-6">
      <Line data={{ labels, datasets: curvedDatasets }} options={options} />
    </div>
  );
}
