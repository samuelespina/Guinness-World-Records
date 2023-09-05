import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { BubbleBackground, InputComponent } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { SubmitResultsInterface } from "./SubmitResultsInterface.types";

const SignUp = () => {
  const [user_name, setUser_name] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const problemText = useRef<HTMLInputElement>(null);
  const [submitResults, SetSubmitResult] = useState<SubmitResultsInterface>();

  const handleSubmit = () => {
    axios
      .post("http://localhost:8081/signup", {
        user_name,
        email,
        password,
      })
      .then(
        (res) => (
          res.data.token
            ? (localStorage.setItem("jwt", res.data.token), navigate("/"))
            : "",
          SetSubmitResult(res.data),
          res.data.userName &&
            localStorage.setItem("username", res.data.userName)
        )
      )
      .catch((err) => problemText.current.classList.add("active"));
  };

  useEffect(() => {
    console.log("submit results", submitResults);
  }, [submitResults]);

  return (
    <div className="sign-up-page">
      <BubbleBackground />
      <button
        className="home-button"
        onClick={() => {
          navigate("/");
        }}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
      <div className="form">
        <h1>Signup</h1>
        <div className="input">
          <InputComponent
            value={user_name}
            setValue={setUser_name}
            ChecksOn={false}
            fieldName="username"
            submitResults={submitResults}
          />
        </div>

        <div className="input">
          <InputComponent
            value={email}
            ChecksOn={false}
            fieldName="email"
            setValue={setEmail}
            submitResults={submitResults}
          />
        </div>

        <div className="input">
          <InputComponent
            value={password}
            ChecksOn={true}
            fieldName="password"
            setValue={setPassword}
            setIsValid={setIsValid}
          />
        </div>

        <button
          className={`submit ${
            isValid && user_name != "" && email != "" ? "active" : "inactive"
          }`}
          onClick={() => {
            if (isValid && user_name != "" && email != "") {
              handleSubmit();
            }
          }}
        >
          Signup
        </button>

        {submitResults ? (
          submitResults.registrationResult === "username already registered" ? (
            <p className="problemText active" style={{ color: "black" }}>
              username already registered,{" "}
              <a
                onClick={() => {
                  navigate("/login");
                }}
              >
                {" "}
                try to login
              </a>
            </p>
          ) : (
            ""
          )
        ) : (
          ""
        )}

        <p className="problemText" ref={problemText}>
          There is a problem, try later...
        </p>
      </div>
    </div>
  );
};

export default SignUp;
