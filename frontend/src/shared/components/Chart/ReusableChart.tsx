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
  // Helper function to get CSS variable color values from the theme
  const getThemeColor = (cssVar: string, fallback: string): string => {
    if (typeof window === 'undefined') return fallback;
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(cssVar).trim();
    return value || fallback;
  };

  // Get theme colors
  const themeColors = {
    text: getThemeColor('--color-text', '#1f2937'),
    heading: getThemeColor('--color-heading', '#0f172a'),
    muted: getThemeColor('--color-muted', '#6b7280'),
    surface: getThemeColor('--color-surface', '#ffffff'),
    accent: getThemeColor('--color-accent', '#e5e7eb'),
    bg: getThemeColor('--color-background', '#f7faf9'),
  };

  const chartData = {
    labels,
    datasets: datasets || [
      {
        label: title || "Dataset",
        data: data || [],
        backgroundColor: backgroundColors,
        borderColor: themeColors.text,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    backgroundColor: "transparent",
    plugins: {
      tooltip: {
        backgroundColor: themeColors.heading,
        titleColor: themeColors.surface,
        bodyColor: themeColors.accent,
        borderColor: themeColors.muted,
        borderWidth: 1,
      },
      legend: {
        position: "bottom" as const,
        labels: {
          color: themeColors.text,
          font: {
            size: 12,
          },
          padding: 10,
        },
      },
      title: {
        display: !!title,
        text: title,
        color: themeColors.heading,
        font: {
          size: 16,
          weight: "bold" as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: type === "line" || type === "bar" ? {
      x: {
        ticks: {
          color: themeColors.text,
          font: {
            size: 11,
          },
        },
        grid: {
          color: themeColors.accent,
          lineWidth: 1,
        },
      },
      y: {
        ticks: {
          color: themeColors.text,
          font: {
            size: 11,
          },
        },
        grid: {
          color: themeColors.accent,
          lineWidth: 1,
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