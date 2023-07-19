export interface ChartIterface {
  chartData: {
    labels: Array<number>;
    datasets: {
      label: string;
      data: Array<number>;
    }[];
  };
}

export interface ChartProps {
  chartInfo: ChartIterface;
}
