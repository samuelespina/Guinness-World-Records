import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { PasswordChecks } from "../../components";

const LogIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const showMessage = useRef<HTMLInputElement>(null);
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleSubmit = () => {
    axios
      .post("http://localhost:8081/login", { email, password })
      .then((res) =>
        res.data === false
          ? showMessage.current.classList.add("active")
          : showMessage.current.classList.remove("active")
      )
      .catch((err) => console.log(err));
  };

  return (
    <div className="log-in-page">
      <h1>Log-in page </h1>

      <div className="form" ref={showMessage}>
        <div className="input">
          <label htmlFor="email">email</label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="input">
          <PasswordChecks
            password={password}
            setPassword={setPassword}
            setIsValid={setIsValid}
          />
        </div>
        <button
          className={`submit ${
            isValid && password != "" && email != "" ? "active" : "inactive"
          }`}
          onClick={() => {
            if (isValid && password != "" && email != "") {
              handleSubmit();
            }
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LogIn;
