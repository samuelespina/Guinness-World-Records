export interface ChartIterface {
  chartData: {
    labels: Array<number>;
    datasets: {
      label: string;
      data: Array<number>;
      backgroundColor: Array<string>;
      borderColor: string;
      borderWidth: number;
    }[];
  };
}

export interface ChartProps {
  chartInfo: ChartIterface;
}
