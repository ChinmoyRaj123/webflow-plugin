import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/register";
import Home from "./pages/Home";
import HomeLayout from "./layout/home";
import Initial from "./pages/Initial";
import Detail from "./pages/Detail";
import MediaLibrary from "./pages/MediaLibrary";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Initial />}></Route>
      <Route path="/signin" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route element={<HomeLayout />}>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/detail" element={<Detail />}></Route>
        <Route path="/media-library" element={<MediaLibrary />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
