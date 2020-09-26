import React, { useState, useEffect, useLayoutEffect, Component } from "react";
import { useCookies, withCookies, Cookies } from "react-cookie";
import axios from "axios";
import { Card, Grid, Typography, Paper, Button } from "@material-ui/core";

const HomePage = (props) => {
  const [cookies, setCookies] = useCookies(["username"]);
  const [username, setUsername] = useState(cookies.username);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const result = await axios(
        process.env.REACT_APP_BACKEND_IP + "/getUserData?username=" + username
      );

      setUserData(result.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  function displayAccount(account) {
    return (
      <Grid item>
        <Paper
          style={{
            width: "50%",
            margin: "auto",
            padding: "8px",
            textAlign: "center",
          }}
        >
          <Typography variant="h4">${account.amount}</Typography>
          <Typography variant="h6">{account.name}</Typography>
          <Typography variant="h6">{account.id}</Typography>
        </Paper>
      </Grid>
    );
  }

  function displayOptions() {
    return (
      <div style={{ width: "50%", margin: "auto", textAlign: "center" }}>
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="center"
        >
          <Grid item md={4} sm={4} lg={4}>
            <Button onClick={() => props.setPageToShow(3)}>Transfer</Button>
          </Grid>
          <Grid item md={4} sm={4} lg={4}>
            <Button onClick={() => props.setPageToShow(4)}>Stocks</Button>
          </Grid>
          <Grid item md={4} sm={4} lg={4}>
            <Button onClick={() => props.setPageToShow(5)}>CREDIT CARD</Button>
          </Grid>
        </Grid>
      </div>
    );
  }

  

  function displayHistory() {
    return (
      <div>
        {userData.previousLocations.map((location) => {
          let compoundArray = location["compound_code"].split(" ");
          let len = compoundArray.length;
          let country = compoundArray[len - 1];
          let latlng = location["latlng"];
          return (
            <Paper style={{ width: "50%", margin: "auto", padding: "16px" }}>
              <Grid container direction="row" justify="space-between">
                <Grid item>
                  {country}
                  <br />
                  {latlng}
                </Grid>
                <Grid item>
                  <Button>report</Button>
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {isLoading == false && (
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
          spacing={2}
          style={{ marginTop: "32px" }}
        >
          {userData.accounts.map((account) => displayAccount(account))}
          {displayOptions()}
          <Grid
            item
            style={{ width: "50%", margin: "auto", marginTop: "64px" }}
          >
            <Typography variant="h5">
              Last known locations of transfer
            </Typography>
          </Grid>

          {displayHistory()}
        </Grid>
      )}
    </div>
  );
};

export default HomePage;
