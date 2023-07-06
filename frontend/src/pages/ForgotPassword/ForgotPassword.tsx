import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { RecoveryContext } from "../../RecoveyContext";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
  const { email, setEmail } = useContext(RecoveryContext);
  const [validationCode, setValidationCode] = useState<number>(0);
  const navigate = useNavigate();

  function generateRandomNumber() {
    const min = 100000;
    const max = 999999;

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    setValidationCode(generateRandomNumber());
  }, []);

  const handleSubmit = () => {
    axios
      .post("http://localhost:8081/forgot-password", { email, validationCode })
      .then((res) =>
        res.data ? navigate("/recovery-password") : console.log(res.data)
      )
      .catch((err) => console.log("DIO3", email, err));
  };

  return (
    <div className="forgot-password-page">
      <h1>Forgot password</h1>

      <div className="form">
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
        <button
          className={`submit ${email != "" ? "active" : "inactive"}`}
          value={"submit"}
          onClick={() => {
            if (email != "") {
              handleSubmit();
            }
          }}
        >
          {validationCode}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
