import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageSignIn from "./pages/SignIn";
import PageSignUp from "./pages/SignUp";
import PageForgotPassword from "./pages/ForgotPassword";
import PageVerifyCode from "./pages/VerifyAccount";
import PageChangePassword from "./pages/ChangePassword";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" index element={<PageSignIn></PageSignIn>}></Route>
      <Route path="/signup" element={<PageSignUp></PageSignUp>}></Route>
      <Route path="/forgotpassword" element={<PageForgotPassword></PageForgotPassword>}></Route>
      <Route path="/verify" element={<PageVerifyCode></PageVerifyCode>}></Route>
      <Route path="/changepassword" element={<PageChangePassword></PageChangePassword>}></Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AuthRoutes;
