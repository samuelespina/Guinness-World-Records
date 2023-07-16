import React, { useContext, useEffect, useRef, useState } from "react";
import { RecoveryContext } from "../../RecoveyContext";
import axios from "axios";
import { useNavigate } from "react-router";
import { BubbleBackground, InputComponent } from "../../components";

const RecoveryPassword = () => {
  const { email } = useContext(RecoveryContext);
  const [validationCode, setValidationCode] = useState<string>("");
  const showMessage = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    axios
      .post("http://localhost:8081/recovery-password", {
        email,
        validationCode,
      })
      .then((res) =>
        res.data
          ? navigate("/reset-password")
          : showMessage.current.classList.add("active")
      )
      .catch((err) => console.log(err));
  };

  return (
    <div className="recovery-password">
      <BubbleBackground />
      <div className="form">
        {" "}
        <h1>Recovery password</h1>
        <div className="input">
          <InputComponent
            value={validationCode}
            fieldName="code"
            ChecksOn={false}
            setValue={setValidationCode}
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
        <p className="show-message" ref={showMessage}>
          Non è stata ritrovata corrispondenza tra l'email e il codice inserito,
          riprovare
        </p>
      </div>
    </div>
  );
};

export default RecoveryPassword;
