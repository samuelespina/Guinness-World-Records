import { createContext } from "react";

export interface AppContext {
  email: string;
  setEmail: (value: string) => void;
  menuFlag: number;
  setMenuFlag: (value: number) => void;
}

export const AppContext = createContext<AppContext>({
  email: "",
  setEmail: (value: "") => {}, //perchè le parentesi graffe?
  menuFlag: 0,
  setMenuFlag: (value: 0) => {},
});
