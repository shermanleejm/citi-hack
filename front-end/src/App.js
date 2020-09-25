import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";
import "./App.css";
import LoginPage from "./components/LoginPage";
import { useCookies } from "react-cookie";

function App() {
  useEffect(() => {});

  const [authenticated, setAthenticated] = useState(false);
  const [pageToShow, setPageToShow] = useState(0);
  const [cookie, setCookie] = useCookies(["authenticated", "pageToShow"]);

  function showPage() {
    switch (pageToShow) {
      // Register page
      case 0:
        return <LoginPage setPageToShow={setPageToShow} />;

      case 1:
        return <RegisterPage setPageToShow={setPageToShow} />;

      case 2:
        return <HomePage setPageToShow={setPageToShow} />;
        break;

      default:
        break;
    }
  }

  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            SuperSecureBank
          </Typography>
          {cookie.authenticated === "true" ? (
            <Button
              color="inherit"
              onClick={() => {
                setCookie("authenticated", "false", { expires: 0 });
                setPageToShow(0);
              }}
            >
              logout
            </Button>
          ) : (
            <Button color="inherit" onClick={() => setPageToShow(0)}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {showPage()}
    </div>
  );
}

export default App;
