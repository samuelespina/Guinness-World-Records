import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { RecoveryContext } from "../../RecoveyContext";
import { PasswordChecks } from "../../components";
import { useNavigate } from "react-router";

const ResetPassword = () => {
  const { email } = useContext(RecoveryContext);
  const [password, setPassword] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [typeInput, setTypeInput] = useState<boolean>(false);
  const showError = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    axios
      .post("http://localhost:8081/reset-password", { password, email })
      .then((res) => showError.current.classList.add("active"))
      .catch((err) => console.log("DIOOOOOOO", err));
  };

  return (
    <div className="reset-password">
      <h1>Reset your password</h1>
      <div className="form">
        <div className="input">
          <PasswordChecks
            password={password}
            setPassword={setPassword}
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

        <p className="show-message" ref={showError}>
          La tua password è stata aggirnata, torna alla{" "}
          <p
            onClick={() => {
              navigate("/login");
            }}
          >
            pagina di login
          </p>{" "}
          ed inserisci i tuoi dati per vedere tutti i tui record preferiti
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
