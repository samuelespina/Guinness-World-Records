import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { PasswordChecks } from "../../components";

const SignUp = () => {
  const [user_name, setUser_name] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const problemText = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    axios
      .post("http://localhost:8081/signup", {
        user_name,
        email,
        password,
      })
      .then((res) =>
        res.data
          ? navigate("/login")
          : problemText.current.classList.add("active")
      )
      .catch((err) => problemText.current.classList.add("active"));
  };

  useEffect(() => {
    console.log(isValid);
  }, []);

  return (
    <div className="sign-up-page">
      <div className="form">
        <h1>Sign-up page</h1>
        <label htmlFor="user_name">name</label>
        <input
          type="text"
          placeholder="Enter your name"
          name="user_name"
          onChange={(e) => {
            setUser_name(e.target.value);
          }}
        />

        <label htmlFor="email">email</label>
        <input
          type="email"
          placeholder="Enter your email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <PasswordChecks
          password={password}
          setPassword={setPassword}
          setIsValid={setIsValid}
        />

        <button
          className={`submit ${
            isValid && user_name != "" && email != "" ? "active" : "inactive"
          }`}
          onClick={() => {
            if (isValid) {
              handleSubmit();
            }
          }}
        >
          Signup
        </button>

        <p className="problemText" ref={problemText}>
          There is a problem, try later...
        </p>
      </div>
    </div>
  );
};

export default SignUp;
