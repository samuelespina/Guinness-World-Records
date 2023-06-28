import React, { useState, useEffect, useRef } from "react";
import Marquee from "react-fast-marquee";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <div className="homepage"></div>;
};

export default HomePage;
