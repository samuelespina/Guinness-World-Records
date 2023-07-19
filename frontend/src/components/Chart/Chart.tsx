import React from "react";
import { Bar } from "react-chartjs-2";
import { ChartProps } from "./Chart.types";
import "chart.js/auto";

const Chart = (props: ChartProps) => {
  return (
    <div className="chart">
      <Bar data={props.chartInfo.chartData} />
    </div>
  );
};

export default Chart;
