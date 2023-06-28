import React, { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "./components";
import {
  ForgotPassword,
  HomePage,
  LogIn,
  RecoveryPassword,
  ResetPassword,
  SignUp,
} from "./pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoveryContext } from "./RecoveyContext";
import AOS from "aos";

const App = () => {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    console.log(email);
  }, [email]);

  return (
    <RecoveryContext.Provider value={{ email, setEmail }}>
      <div className="app">
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
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
    </RecoveryContext.Provider>
  );
};

export default App;
