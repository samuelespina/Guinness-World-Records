import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { BubbleBackground, InputComponent } from "../../components";

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
        res.data.token
          ? (localStorage.setItem("jwt", res.data.token), navigate("/"))
          : ""
      )
      .catch((err) => problemText.current.classList.add("active"));
  };

  return (
    <div className="sign-up-page">
      <BubbleBackground />
      <div className="form">
        <h1>Signup</h1>
        <div className="input">
          <InputComponent
            value={user_name}
            setValue={setUser_name}
            ChecksOn={false}
            fieldName="username"
          />
        </div>

        <div className="input">
          <InputComponent
            value={email}
            ChecksOn={false}
            fieldName="email"
            setValue={setEmail}
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

        <p className="problemText" ref={problemText}>
          There is a problem, try later...
        </p>
      </div>
    </div>
  );
};

export default SignUp;
