import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Room from "./views/Room";
import Login from "./views/Login";

import Header from "./Header";

export default () => {
  const [Account, setAccount] = useState(null);

  const checkLogin = async () => {
    let token = localStorage.getItem("token");

    let res = await fetch(`http://localhost:5000/check-login/${token}`);
    let data = await res.json();

    switch (data.status) {
      case "ok":
        setAccount(data.body);
        break;
      case "err":
        logout();
        break;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    if (window.location.pathname != "/login") window.location.assign("/login");
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <>
      <BrowserRouter>
        {window.location.pathname != "/login" ? (
          <Header
            username={Account?.username}
            vip={Account?.vip}
            logout={logout}
          />
        ) : null}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room user_id={Account?.id} />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
