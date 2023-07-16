export interface InputComponentInterface {
  value: string;
  ChecksOn: boolean;
  fieldName: string;
  setValue: (value: string) => void;
  setIsValid?: (value: boolean) => void;
}
