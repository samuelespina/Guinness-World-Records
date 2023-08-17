export interface InputComponentInterface {
  value: string;
  ChecksOn: boolean;
  fieldName: string;
  look?: boolean;
  setValue: (value: string) => void;
  setIsValid?: (value: boolean) => void;
}
