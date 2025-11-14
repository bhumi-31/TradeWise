import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Holdings Portfolio",
    },
  },
};

export function VerticalGraph({ data }) {
  // ✅ Check if data exists and is array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-muted p-5">
        <p>No data available for chart</p>
      </div>
    );
  }

  // ✅ Prepare chart data from holdings
  const chartData = {
    labels: data.map((stock) => stock.name),
    datasets: [
      {
        label: "Current Value (₹)",
        data: data.map((stock) => (stock.price * stock.qty).toFixed(2)),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Investment Value (₹)",
        data: data.map((stock) => (stock.avg * stock.qty).toFixed(2)),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
}