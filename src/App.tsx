import React from "react";
import Cookies from "js-cookie";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/register";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import HomeLayout from "./layout/home";
import Initial from "./pages/Initial";
import Detail from "./pages/Detail";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Initial />}></Route>
      <Route path="/signin" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route element={<HomeLayout />}>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/detail" element={<Detail />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
