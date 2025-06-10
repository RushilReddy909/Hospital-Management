import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/Home";
import Profile from "./pages/Account";
import SidebarLayout from "./components/SidebarLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminOnly from "./components/AdminOnly";
import Admin from "./pages/Admin";
import Appointments from "./pages/Appointments";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/appointment" element={<Appointments />} />
        </Route>
        <Route element={<AdminOnly />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
      </Routes>
    </>
  );
};

export default App;
