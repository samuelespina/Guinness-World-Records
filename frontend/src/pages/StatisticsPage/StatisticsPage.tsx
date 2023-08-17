import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { StatisticsPageInterface } from "./StatisticsPage.types";
import { BubbleBackground, Chart } from "../../components";
import { ChartIterface } from "../../components/Chart/Chart.types";
import { AppContext } from "../../AppContext";

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
          backgroundColor: [" rgba(167, 81, 255, .5)"],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    },
  });
  const { jwt, setJwt } = useContext(AppContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (!jwt) {
      navigate("/signup");
      location.reload(); //quando dopo aver ricevuto il token si riapre una pagina delle statistiche se la variabile "jwt" è rimasta false si refresha la pagina, non va in loop perchè se all'inizio (prima di ricevere il token) "jwt" è false entra in gioco il navigate, che cambia pagina non dando modo al refresh di agire all'infinito sulla pagina delle statistiche
    }
    console.log(jwt);
  }, [jwt]);

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
              backgroundColor: [" rgba(167, 81, 255, .5)"],
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
      .post("http://localhost:8081/get-statistics", { id, token })
      .then((res) =>
        res.data ? (setJwt(true), setStatistics(res.data)) : setJwt(false)
      )
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {jwt && (
        <div className="statistics-page">
          <BubbleBackground />
          <div className="page">
            <h1>{id}</h1>
            <div className="description">
              <p className="nb">N.B.*</p>
              <p>
                These percentages stand for users who only use this programming
                language or who use this together with others
              </p>
              <p>
                if the last year in the graph is not the current year, it means
                that the language has not been used since the last year
                indicated, it has become a niche language or there are other
                languages that have replaced it
              </p>
            </div>
            {statistics ? <Chart chartInfo={chartData} /> : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;
