import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const LogIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const showMessage = useRef<HTMLInputElement>(null);
  const [typeInput, setTypeInput] = useState<boolean>(false);

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
    <div className="log-in-page" ref={showMessage}>
      <h1>Log-in page </h1>

      <label htmlFor="email">email</label>
      <input
        type="email"
        placeholder="Enter your email"
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor="password">password</label>
      <input
        type={typeInput ? "text" : "password"}
        placeholder="Enter your password"
        name="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button
        onMouseDown={() => {
          setTypeInput(true);
        }}
        onMouseUp={() => {
          setTypeInput(false);
        }}
      >
        guarda
      </button>
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
        Signup
      </button>
    </div>
  );
};

export default LogIn;
