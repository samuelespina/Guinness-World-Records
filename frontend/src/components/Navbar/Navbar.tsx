import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

const Navbar = () => {
  const [allLanguages, setAllLanguages] = useState<Array<string>>([]);
  const [usages, setUsages] = useState<Array<string>>([]);
  const navigate = useNavigate();

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
    <header className="navbar-wrapper">
      <nav className="navbar">
        <button
          onClick={() => {
            getLanguages();
          }}
        >
          all the programming languages
        </button>
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

        <button
          onClick={() => {
            getUsages();
          }}
        >
          What do you wanna do?
        </button>
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
      </nav>
    </header>
  );
};

export default Navbar;
