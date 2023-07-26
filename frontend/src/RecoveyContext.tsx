import { createContext } from "react";

export interface RecoveryContent {
  email: string;
  setEmail: (value: string) => void;
  menuFlag: number;
  setMenuFlag: (value: number) => void;
}

export const RecoveryContext = createContext<RecoveryContent>({
  email: "",
  setEmail: (value: "") => {}, //perchè le parentesi graffe?
  menuFlag: 0,
  setMenuFlag: (value: 0) => {},
});
