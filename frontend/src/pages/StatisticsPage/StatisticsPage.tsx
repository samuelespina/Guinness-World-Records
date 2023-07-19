import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { StatisticsPageInterface } from "./StatisticsPage.types";
import { Chart } from "../../components";
import { ChartIterface } from "../../components/Chart/Chart.types";

const StatisticsPage = () => {
  const { id } = useParams();
  const [statistics, setStatistics] = useState<
    Array<StatisticsPageInterface>
  >();
  const pathname = useLocation();
  const [chartData, setChartData] = useState<ChartIterface>({
    chartData: {
      labels: (statistics ? statistics : []).map((elem) => elem.year),
      datasets: [
        {
          label: "percentage of users",
          data: (statistics ? statistics : []).map((elem) => elem.percentage),
          backgroundColor: ["#d0a2ff"],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    },
  });

  useEffect(() => {
    getStatistics();
  }, [pathname]);

  useEffect(() => {
    if (statistics) {
      setChartData({
        chartData: {
          labels: statistics.map((elem) => elem.year),
          datasets: [
            {
              label: "percentage of users",
              data: statistics.map((elem) => elem.percentage),
              backgroundColor: ["#d0a2ff"],
              borderColor: "black",
              borderWidth: 2,
            },
          ],
        },
      });
    }
  }, [statistics]);

  const getStatistics = () => {
    axios
      .post("http://localhost:8081/get-statistics", { id })
      .then((res) => setStatistics(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="statistics-page">
      {statistics ? <Chart chartInfo={chartData} /> : ""}
    </div>
  );
};

export default StatisticsPage;
