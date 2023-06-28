import React, { useContext, useEffect, useRef, useState } from "react";
import { RecoveryContext } from "../../RecoveyContext";
import axios from "axios";
import { useNavigate } from "react-router";

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
      <h1>Recovery password</h1>
      <label htmlFor=" validation_code">validation code</label>
      <input
        type="text"
        placeholder="insert your validation code"
        onChange={(e) => {
          setValidationCode(e.target.value);
        }}
      />
      <button
        value={"submit"}
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
      <p style={{ border: "3px solid red" }}>email by ricovery : {email}</p>
    </div>
  );
};

export default RecoveryPassword;
