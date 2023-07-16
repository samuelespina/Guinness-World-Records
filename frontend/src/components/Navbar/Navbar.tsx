import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

const Navbar = () => {
  const [allLanguages, setAllLanguages] = useState<Array<string>>([]);
  const [usages, setUsages] = useState<Array<string>>([]);
  const navigate = useNavigate();
  const [menuStatus, setMenuStatus] = useState<boolean>(false);

  const getLanguages = () => {
    axios
      .get("http://localhost:8081/get-programming-languages")
      .then((res) => {
        setAllLanguages(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getUsages = () => {
    axios
      .get("http://localhost:8081/get-usages")
      .then((res) => setUsages(res.data))
      .catch((err) => console.log("DIOOOOOOO", err));
  };

  return (
    <header
      className="navbar-wrapper"
      style={
        window.location.pathname === "/signup" ||
        window.location.pathname === "/login" ||
        window.location.pathname === "/forgot-password" ||
        window.location.pathname === "/recovery-password" ||
        window.location.pathname === "/reset-password"
          ? { display: "none" }
          : {}
      }
    >
      <nav className="navbar">
        <div
          className={`menu ${menuStatus ? "active" : "inactive"}`}
          onClick={() => {
            menuStatus ? setMenuStatus(false) : setMenuStatus(true);
          }}
        >
          <div className="icon">
            <div className="sticks"></div>
            <div className="sticks"></div>
            <div className="sticks"></div>
          </div>
          <p
            onClick={() => {
              getLanguages();
            }}
          >
            langudio
          </p>

          <p>
            {allLanguages.map((elem) => {
              return (
                <p
                  onClick={() => {
                    navigate(
                      "/programming-languages/" + encodeURIComponent(elem)
                    );
                  }}
                >
                  {elem}
                </p>
              );
            })}
          </p>

          <p
            onClick={() => {
              getUsages();
            }}
          >
            usages
          </p>

          <p>
            {usages.map((elem) => {
              return (
                <p
                  onClick={() => {
                    navigate("/technical-field/" + encodeURIComponent(elem));
                  }}
                >
                  {elem}
                </p>
              );
            })}
          </p>

          <p>statistics</p>
        </div>

        <div className="generals-info"></div>
      </nav>
    </header>
  );
};

export default Navbar;
