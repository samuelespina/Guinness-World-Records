import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";

const Navbar = () => {
  const [allLanguages, setAllLanguages] = useState<Array<string>>([]);
  const [usages, setUsages] = useState<Array<string>>([]);
  const navigate = useNavigate();
  const [menuStatus, setMenuStatus] = useState<boolean>(false);
  const [relatedLanguages, setRelatedLanguages] = useState<Array<string>>([]);

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

  const getRelatedLanguages = (usage: string) => {
    axios
      .post("http://localhost:8081/get-related-languages", { usage })
      .then((res) => setRelatedLanguages(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <header
      className={`navbar-wrapper ${menuStatus ? "active" : "inactive"}`}
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
      <div className="menu">
        <div className="navbar">
          <h2
            onClick={() => {
              getLanguages();
            }}
          >
            languages
          </h2>

          <div>
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
          </div>

          <h2
            onClick={() => {
              getUsages();
            }}
          >
            usages
          </h2>

          <div>
            {usages.map((elem) => {
              return (
                <>
                  <p
                    onClick={() => {
                      navigate("/technical-field/" + encodeURIComponent(elem));
                      getRelatedLanguages(elem);
                    }}
                  >
                    {elem}
                  </p>
                  <p>
                    {relatedLanguages.map((elem) => {
                      return (
                        <p
                          onClick={() => {
                            navigate(
                              "/programming-languages/" +
                                encodeURIComponent(elem)
                            );
                          }}
                        >
                          {elem}
                        </p>
                      );
                    })}
                  </p>
                </>
              );
            })}
          </div>

          <h2
            onClick={() => {
              getLanguages();
            }}
          >
            statistics
          </h2>

          <div>
            {allLanguages.map((elem) => {
              return (
                <p
                  onClick={() => {
                    navigate("/statistics/" + encodeURIComponent(elem));
                  }}
                >
                  {elem}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`cover ${menuStatus ? "active" : "inactive"}`}>
        <div
          className="toggle-icon-wrapper"
          onClick={() => {
            menuStatus ? setMenuStatus(false) : setMenuStatus(true);
          }}
        >
          <div className="toggle-icon">
            <div className="stick"></div>
            <div className="stick"></div>
            <div className="stick"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
