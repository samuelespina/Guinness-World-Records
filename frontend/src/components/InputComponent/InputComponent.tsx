import React, { useEffect, useRef, useState } from "react";
import { InputComponentInterface } from "./InputComponent.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, fas } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const InputComponent = (props: InputComponentInterface) => {
  const [typeInput, setTypeInput] = useState<boolean>(false);
  const [statusLabel, setStatusLabel] = useState<boolean>(false);

  const lower = /[a-z]+/;
  const upper = /[A-Z]+/;
  const number = /[0-9]+/;
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  const minLength = /^.{8,}$/;

  useEffect(() => {
    if (props.value.length !== 0) {
      setStatusLabel(true);
    } else {
      setStatusLabel(false);
    }
  }, [props.value]);

  useEffect(() => {
    if (props.ChecksOn) {
      if (
        lower.test(props.value) &&
        upper.test(props.value) &&
        number.test(props.value) &&
        specialChars.test(props.value) &&
        minLength.test(props.value)
      ) {
        props.setIsValid(true);
      } else {
        props.setIsValid(false);
      }
    }
  }, [props.value]);

  return (
    <div
      className="input-wrapper"
      style={
        props.ChecksOn
          ? { border: "1px solid rgb(230, 230, 230)", padding: "2rem" }
          : { border: "none" }
      }
    >
      <div className="input-field">
        <div className={statusLabel ? "label active" : "label inactive"}>
          <input
            type={props.ChecksOn && !typeInput ? "password" : "text"}
            onChange={(e) => {
              props.setValue(e.target.value);
            }}
          />

          <p className="placeholder">{props.fieldName}</p>
        </div>

        {props.ChecksOn ? (
          <button
            className="look"
            onClick={() => {
              typeInput ? setTypeInput(false) : setTypeInput(true);
            }}
          >
            <FontAwesomeIcon icon={typeInput ? faEye : faEyeSlash} />
          </button>
        ) : (
          ""
        )}
      </div>

      {props.ChecksOn ? (
        <div className="validation-fields">
          <p
            className={`validation-field ${
              lower.test(props.value) ? "active" : "inactive"
            }`}
          >
            At least one lowercase letter
          </p>
          <p
            className={`validation-field ${
              upper.test(props.value) ? "active" : "inactive"
            }`}
          >
            At least one uppercase letter
          </p>
          <p
            className={`validation-field ${
              number.test(props.value) ? "active" : "inactive"
            }`}
          >
            At least one number
          </p>
          <p
            className={`validation-field ${
              specialChars.test(props.value) ? "active" : "inactive"
            }`}
          >
            At least one special character
          </p>
          <p
            className={`validation-field ${
              minLength.test(props.value) ? "active" : "inactive"
            }`}
          >
            At least 8 characters
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default InputComponent;
