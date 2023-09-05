import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { AppContext } from "../../AppContext";
import { BubbleBackground, InputComponent } from "../../components";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
  const { email } = useContext(AppContext);
  const [password, setPassword] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const showError = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    axios
      .post("http://localhost:8081/reset-password", { password, email })
      .then((res) => res.data && showError.current.classList.add("active"))
      .catch((err) => console.log("DIOOOOOOO", err));
  };

  return (
    <div className="reset-password">
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
        <h1>Reset your password</h1>
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
          className={`submit ${isValid ? "active" : "inactive"}`}
          onClick={() => {
            if (isValid) {
              handleSubmit();
            }
          }}
        >
          submit
        </button>

        <p className="problemText" ref={showError} style={{ color: "black" }}>
          your password has been updated, go back to the
          <a
            onClick={() => {
              navigate("/login");
            }}
          >
            {" "}
            login page
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
