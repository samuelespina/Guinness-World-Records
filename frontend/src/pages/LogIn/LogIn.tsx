import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BubbleBackground, InputComponent } from "../../components";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { SubmitResultsInterface } from "../SignUp/SubmitResultsInterface.types";

const LogIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const showMessage = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [submitResults, SetSubmitResult] = useState<SubmitResultsInterface>();

  const handleSubmit = () => {
    axios
      .post("http://localhost:8081/login", { email, password })
      .then((res) =>
        res.data.registrationResult === true
          ? (localStorage.setItem("jwt", res.data.token),
            localStorage.setItem("username", res.data.username),
            navigate("/"),
            console.log("from login page " + res.data))
          : SetSubmitResult(res.data)
      )
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    console.log("submit results", submitResults);
  }, [submitResults]);

  return (
    <div className="log-in-page">
      <BubbleBackground />
      <button
        className="home-button"
        onClick={() => {
          navigate("/");
        }}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
      <div className="form" ref={showMessage}>
        <h1>Log-in page </h1>
        <div className="input">
          <InputComponent
            value={email}
            setValue={setEmail}
            ChecksOn={false}
            fieldName="email"
            submitResults={submitResults}
          />
        </div>

        <div className="input">
          <InputComponent
            value={password}
            ChecksOn={false}
            fieldName="password"
            setValue={setPassword}
            look={true}
          />
        </div>
        <button
          className={`submit ${
            password != "" && email != "" ? "active" : "inactive"
          }`}
          onClick={() => {
            if (password != "" && email != "") {
              handleSubmit();
            }
          }}
        >
          Login
        </button>
        {submitResults ? (
          submitResults.registrationResult === "loginIssues" ? (
            <p className="problemText active" style={{ color: "black" }}>
              Did you forget your password?{" "}
              <a
                onClick={() => {
                  navigate("/forgot-password");
                }}
              >
                Reset it!
              </a>
            </p>
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default LogIn;
