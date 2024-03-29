import React, { useState, useContext } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { AuthContext } from "./contexts/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import InventoryCopilotRoutes from "./Routes.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <>
      <Router>
        <Routes>
          {/* dashboard editor routes */}

          <Route path="/" element={<Navigate to="/copilot" />} />

          {/* inventory copilot routes */}
          {isLoggedIn ? (
            <Route path="/copilot/*" element={<InventoryCopilotRoutes />} />
          ) : (
            <>
              <Route path="/copilot/login" element={<LoginPage />} />
              <Route
                path="/copilot/*"
                element={<Navigate to="/copilot/login" />}
              />
            </>
          )}
        </Routes>
      </Router>

      {/* new notification */}
      {/* <ToastContainer /> */}
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* old notification */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "#FFF",
            borderRadius: "9999px",
            color: "#333",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
};

export default App;
