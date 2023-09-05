import { SubmitResultsInterface } from "../../pages/SignUp/SubmitResultsInterface.types";

export interface InputComponentInterface {
  value: string;
  ChecksOn: boolean;
  fieldName: string;
  look?: boolean;
  submitResults?: SubmitResultsInterface;
  setValue: (value: string) => void;
  setIsValid?: (value: boolean) => void;
}
