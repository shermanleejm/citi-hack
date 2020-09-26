import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";
import "./App.css";
import LoginPage from "./components/LoginPage";
import Transfer from "./components/Transfer";
import axios from "axios";
import { useCookies } from "react-cookie";
import CreditCard from "./components/CreditCard";

function App() {
  const [authenticated, setAthenticated] = useState(false);
  const [pageToShow, setPageToShow] = useState(0);
  const [cookie, setCookie] = useCookies(["authenticated", "pageToShow"]);
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    nonce: "",
  });

  function showPage() {
    switch (pageToShow) {
      // Register page
      case 0:
        return cookie["authenticated"] !== "true" ? (
          <LoginPage setPageToShow={setPageToShow} nonce={values.nonce} />
        ) : (
          <HomePage setPageToShow={setPageToShow} />
        );

      case 1:
        return <RegisterPage setPageToShow={setPageToShow} />;

      case 2:
        return <HomePage setPageToShow={setPageToShow} />;
        break;

      case 3:
        return <Transfer setPageToShow={setPageToShow} nonce={values.nonce} />;

      case 4:
        return <CreditCard setPageToShow={setPageToShow} nonce={values.nonce} />;
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
          <Typography
            variant="h6"
            style={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => {
              setPageToShow(2);
            }}
          >
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
