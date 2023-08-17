import React, { useState, useEffect, useRef, useContext } from "react";
import Marquee from "react-fast-marquee";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BubbleBackground } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../../RecoveyContext";

const HomePage = () => {
  const { menuFlag, setMenuFlag } = useContext(AppContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="homepage">
      <BubbleBackground />
      <div className="hero">
        <div className="column-one">
          <h1>Prog Diary</h1>
          <p>
            This project was born from the hope of being able to direct people
            in the best possible way who would like to start programming but
            don't know where to start.
          </p>
          <p>
            On this site you will be able to see the descriptions of all the
            most used programming languages from 2000 to today, their uses and
            evolutions in the usage statistics, to evaluate which is the best
            language to learn now!
          </p>
          <p className="slogan">LET'S CODE</p>
        </div>
        <div className="column-two">
          <div className="circle-icon">
            <FontAwesomeIcon icon={faBook} />
          </div>
          <div className="circle-info">
            <div
              className="info-field one"
              onClick={() => {
                setMenuFlag(1);
              }}
            >
              <img src="./images/languages.png" alt="" />
              <p>discover languages</p>
            </div>
            <div className="info-field two">
              <div className="second-color"></div>
            </div>
            <div
              className="info-field three"
              onClick={() => {
                setMenuFlag(2);
              }}
            >
              <img src="./images/usages.jpg" alt="" />
              <p>find your branch</p>
            </div>
            <div
              className="info-field four"
              onClick={() => {
                setMenuFlag(3);
              }}
            >
              <img src="./images/statisticsp.png" alt="" />
              <div className="color-cover"></div>

              <p>check statistics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
