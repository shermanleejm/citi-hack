import React, { useState, useEffect, useLayoutEffect, Component } from "react";
import { useCookies, withCookies, Cookies } from "react-cookie";
import axios from "axios";

function HomePage() {
  const [cookies, setCookies] = useCookies(["username"]);
  const [username, setUsername] = useState(cookies.username);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetch(
      process.env.REACT_APP_BACKEND_IP + "/getUserData?username=" + username,
      { signal: signal }
    )
      .then((r) => r.json())
      .then((data) => {
        setUserData(data);
      });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return <div>{console.log(userData)}</div>;
}

export default HomePage;
