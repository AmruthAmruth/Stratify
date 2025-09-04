import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import { Pie, Doughnut, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

type ChartType = "pie" | "doughnut" | "line" | "bar";

interface ChartProps {
  type: ChartType;
  labels: string[];
  data: number[];
  title?: string;
  backgroundColors?: string[];
}

const ReusableChart: React.FC<ChartProps> = ({
  type,
  labels,
  data,
  title,
  backgroundColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
  ],
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title || "Dataset",
        data,
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  };

  switch (type) {
    case "pie":
      return <Pie data={chartData} options={options} />;
    case "doughnut":
      return <Doughnut data={chartData} options={options} />;
    case "line":
      return <Line data={chartData} options={options} />;
    case "bar":
      return <Bar data={chartData} options={options} />;
    default:
      return null;
  }
};

export default ReusableChart;