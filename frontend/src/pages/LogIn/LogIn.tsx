import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BubbleBackground, InputComponent } from "../../components";

const LogIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const showMessage = useRef<HTMLInputElement>(null);

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
      <BubbleBackground />
      <div className="form" ref={showMessage}>
        <h1>Log-in page </h1>
        <div className="input">
          <InputComponent
            value={email}
            setValue={setEmail}
            ChecksOn={false}
            fieldName="email"
          />
        </div>

        <div className="input">
          <InputComponent
            value={password}
            ChecksOn={false}
            fieldName="password"
            setValue={setPassword}
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
      </div>
    </div>
  );
};

export default LogIn;
