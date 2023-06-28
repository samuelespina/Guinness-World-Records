import React, { useEffect, useState } from "react";
import { PasswordChecksInterface } from "./PasswordChecks.types";

const PasswordChecks = (props: PasswordChecksInterface) => {
  const [typeInput, setTypeInput] = useState<boolean>(false);

  const lower = /[a-z]+/;
  const upper = /[A-Z]+/;
  const number = /[0-9]+/;
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  const minLength = /^.{8,}$/;

  useEffect(() => {
    if (
      lower.test(props.password) &&
      upper.test(props.password) &&
      number.test(props.password) &&
      specialChars.test(props.password) &&
      minLength.test(props.password)
    ) {
      console.log("stronzo");
      props.setIsValid(true);
    } else {
      props.setIsValid(false);
    }
  }, [props.password]);

  return (
    <div className="password-checks">
      <label htmlFor="password">password</label>
      <input
        type={typeInput ? "text" : "password"}
        placeholder="Enter your password"
        name="password"
        onChange={(e) => {
          props.setPassword(e.target.value);
        }}
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

      <div className="validation-fields">
        <p className={lower.test(props.password) ? "active" : "inactive"}>
          At least one lowercase letter
        </p>
        <p className={upper.test(props.password) ? "active" : "inactive"}>
          At least one uppercase letter
        </p>
        <p className={number.test(props.password) ? "active" : "inactive"}>
          At least one number
        </p>
        <p
          className={specialChars.test(props.password) ? "active" : "inactive"}
        >
          At least one special character
        </p>
        <p className={minLength.test(props.password) ? "active" : "inactive"}>
          At least 8 characters
        </p>
      </div>
    </div>
  );
};

export default PasswordChecks;
