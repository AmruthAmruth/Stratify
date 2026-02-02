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
        borderColor: "#1f2937",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    backgroundColor: "transparent",
    plugins: {
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#e5e7eb",
        bodyColor: "#e5e7eb",
        borderColor: "#1f2937",
        borderWidth: 1,
      },
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#e5e7eb",
        },
      },
      title: {
        display: !!title,
        text: title,
        color: "#e5e7eb",
      },
    },
    scales: type === "line" || type === "bar" ? {
      x: {
        ticks: {
          color: "#e5e7eb",
        },
        grid: {
          color: "#1f2937",
        },
      },
      y: {
        ticks: {
          color: "#e5e7eb",
        },
        grid: {
          color: "#1f2937",
        },
      },
    } : undefined,
  };

  switch (type) {
    case "pie":
      return (
        <div style={{ position: 'relative', height: '100%', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <Pie data={chartData} options={options} />
        </div>
      );
    case "doughnut":
      return (
        <div style={{ position: 'relative', height: '100%', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <Doughnut data={chartData} options={options} />
        </div>
      );
    case "line":
      return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
          <Line data={chartData} options={options} />
        </div>
      );
    case "bar":
      return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
          <Bar data={chartData} options={options} />
        </div>
      );
    default:
      return null;
  }
};

export default ReusableChart;