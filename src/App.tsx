import React, { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "./components";
import { HomePage } from "./pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AOS from "aos";

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
