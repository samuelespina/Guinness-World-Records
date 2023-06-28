import { createContext } from "react";

export interface RecoveryContent {
  email: string;
  setEmail: (value: string) => void;
}

export const RecoveryContext = createContext<RecoveryContent>({
  email: "",
  setEmail: (value: "") => {}, //perchè le parentesi graffe?
});
