import React, { useState, useEffect, useRef } from "react";
import { Navbar, Footer, BubbleBackground } from "./components";
import {
  ForgotPassword,
  HomePage,
  LanguageDescription,
  LogIn,
  RecoveryPassword,
  RelatedUsagePage,
  ResetPassword,
  SignUp,
  StatisticsPage,
} from "./pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContext } from "./AppContext";

const App = () => {
  const [email, setEmail] = useState<string>("");
  const [menuFlag, setMenuFlag] = useState<number>(0);
  const [jwt, setJwt] = useState<boolean>(true);

  return (
    <AppContext.Provider
      value={{
        email,
        setEmail,
        menuFlag,
        setMenuFlag,
        jwt,
        setJwt,
      }}
    >
      <div className="app">
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/programming-languages/:id"
                element={<LanguageDescription />}
              />
              <Route
                path="/technical-field/:id"
                element={<RelatedUsagePage />}
              />
              <Route path="/statistics/:id" element={<StatisticsPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/recovery-password" element={<RecoveryPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </AppContext.Provider>
  );
};

export default App;
