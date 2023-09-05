import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../AppContext";
import axios from "axios";
import { useNavigate } from "react-router";
import { BubbleBackground, InputComponent } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { SubmitResultsInterface } from "../SignUp/SubmitResultsInterface.types";

const RecoveryPassword = () => {
  const { email } = useContext(AppContext);
  const [validationCode, setValidationCode] = useState<string>("");
  const navigate = useNavigate();
  const [submitResults, SetSubmitResult] = useState<SubmitResultsInterface>({});

  const handleSubmit = () => {
    axios
      .post("http://localhost:8081/recovery-password", {
        email,
        validationCode,
      })
      .then((res) =>
        res.data === true
          ? navigate("/reset-password")
          : SetSubmitResult(res.data)
      )
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    console.log(submitResults);
  }, [submitResults]);

  return (
    <div className="recovery-password">
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
        {" "}
        <h1>Recovery password</h1>
        <div className="input">
          <InputComponent
            value={validationCode}
            fieldName="code"
            ChecksOn={false}
            setValue={setValidationCode}
            submitResults={submitResults}
          />
        </div>
        <button
          className={`submit ${validationCode !== "" ? "active" : "inactive"}`}
          onClick={() => {
            handleSubmit();
          }}
        >
          submit
        </button>
        <p className="show-message">
          Non è stata ritrovata corrispondenza tra l'email e il codice inserito,
          riprovare
        </p>
      </div>
    </div>
  );
};

export default RecoveryPassword;
