import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";
import "./App.css";

function App() {
  useEffect(() => {

  })
  const [authenticated, setAthenticated] = useState(false);
  const [pageToShow, setPageToShow] = useState(0);
  function authenticate() {

  }

  function showPage() {
    switch (pageToShow) {
      // Register page
      case 0:
        return <RegisterPage pageToShow={setPageToShow} />;
        
      case 1:
        return <HomePage />
    
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
          <Button color="inherit" onClick={() => authenticate()}>Login</Button>
        </Toolbar>
      </AppBar>

      {showPage()}

    </div>
  );
}

export default App;