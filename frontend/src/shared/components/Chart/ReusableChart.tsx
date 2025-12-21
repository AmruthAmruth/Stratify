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

interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  [key: string]: unknown;
}

interface ChartProps {
  type: ChartType;
  labels: string[];
  data?: number[];
  datasets?: ChartDataset[];
  title?: string;
  backgroundColors?: string[];
}

const ReusableChart: React.FC<ChartProps> = ({
  type,
  labels,
  data,
  datasets,
  title,
  backgroundColors = [
    "#009063",
    "#dfdcef",
    "#3b3b3b",
  ],
}) => {
  const chartData = {
    labels,
    datasets: datasets || [
      {
        label: title || "Dataset",
        data: data || [],
        backgroundColor: backgroundColors,
        borderColor: "#3b3b3b",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    backgroundColor: "#fbfbfb",
    plugins: {
      tooltip: {
        backgroundColor: "#fbfbfb",
        titleColor: "#3b3b3b",
        bodyColor: "#3b3b3b",
        borderColor: "#dfdcef",
        borderWidth: 1,
      },
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#3b3b3b",
        },
      },
      title: {
        display: !!title,
        text: title,
        color: "#3b3b3b",
      },
    },
    scales: type === "line" || type === "bar" ? {
      x: {
        ticks: {
          color: "#3b3b3b",
        },
        grid: {
          color: "#dfdcef",
        },
      },
      y: {
        ticks: {
          color: "#3b3b3b",
        },
        grid: {
          color: "#dfdcef",
        },
      },
    } : undefined,
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