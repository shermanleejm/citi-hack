import React, { useState, useEffect, useLayoutEffect } from "react";
import { useCookies, withCookies, Cookies } from "react-cookie";
import axios from "axios";
import {
  Card,
  Grid,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  TextField,
  Modal,
} from "@material-ui/core";
import sha256 from "crypto-js/sha256";

function Transfer(props) {
  const [cookies, setCookies] = useCookies(["username"]);
  const [username, setUsername] = useState(cookies.username);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [show2FA, toggle2FA] = useState(false);
  const [password, setPassword] = useState("");

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
    console.log(userData);
    return (
      <Grid item>
        <Paper
          style={{
            width: "50%",
            margin: "auto",
            padding: "8px",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            setAccount(account.id);
          }}
        >
          <Typography variant="h4">${account.amount}</Typography>
          <Typography variant="h6">{account.name}</Typography>
          <Typography variant="h6">{account.id}</Typography>
        </Paper>
      </Grid>
    );
  }

  function displaySelectAccount() {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={2}
        style={{ marginTop: "32px" }}
      >
        <Grid item>
          <Typography variant="h5" style={{ width: "50%", margin: "auto" }}>
            Please select account to transfer from
          </Typography>
        </Grid>
        {userData.accounts.map((account) => displayAccount(account))}
      </Grid>
    );
  }

  function displayPayee() {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={2}
        style={{ marginTop: "32px" }}
      >
        <Grid item>
          <Typography variant="h5" style={{ width: "50%", margin: "auto" }}>
            Please select payee
          </Typography>
        </Grid>
        <Grid item>
          <div style={{ textAlign: "center" }}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="stretch"
              spacing={2}
            >
              <Grid item>
                <FormControl style={{ width: "50%", textAlign: "left" }}>
                  <InputLabel>Payee</InputLabel>
                  <Select
                    value={payee}
                    onChange={(event) => {
                      setPayee(event.target.value);
                    }}
                  >
                    {userData.contacts.map((contact) => {
                      return <MenuItem value={contact}>{contact}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item>
                <div style={{ width: "50%", margin: "auto" }}>
                  <TextField
                    label="Amount"
                    fullWidth
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                    }}
                  />
                </div>
              </Grid>

              <Grid item>
                <Button
                  type="submit"
                  onClick={(event) => {
                    if (amount > 1.1 * userData.averageTransfer) {
                      toggle2FA(true);
                    } else {
                      var hashedPassword = sha256(password, props.nonce);
                      axios(
                        process.env.REACT_APP_BACKEND_IP +
                        "/easytransfer?username=" +
                        username +
                        "&password=" +
                        hashedPassword +
                        "&accountid=" +
                        account +
                        "&payee=" +
                        payee +
                        "&amount=" +
                        amount
                      ).then((response) => {
                        console.log(response);
                        if (response["data"] == "Success") {
                          window.location.reload(false);
                        } else {
                          alert("error verifying 2FA");
                        };
                      });
                    }
                  }}
                >
                  Transfer
                </Button>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    );
  }

  return (
    <div>
      {isLoading == false && (
        <div>
          <Modal open={show2FA} onClose={() => toggle2FA(false)}>
            <div
              style={{
                position: "fixed",
                outline: 0,
                top: "10%",
                left: "50%",
                transform: "translate(-50%, -10%)",
                backgroundColor: "#ffffff",
                margin: "auto",
              }}
            >
              <Paper>
                <Grid container direction="column">
                  <Grid item>Please perform 2FA</Grid>
                  <Grid item>
                    <TextField
                      label="Password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={(event) => {
                        event.preventDefault();
                        var hashedPassword = sha256(password, props.nonce);
                        axios(
                          process.env.REACT_APP_BACKEND_IP +
                            "/transfer?username=" +
                            username +
                            "&password=" +
                            hashedPassword +
                            "&accountid=" +
                            account +
                            "&payee=" +
                            payee +
                            "&amount=" +
                            amount
                        ).then((response) => {
                          console.log(response);
                          if (response["data"] == "Success") {
                            window.location.reload(false);
                          } else {
                            alert("error verifying 2FA");
                          }
                        });
                      }}
                    >
                      submit
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </div>
          </Modal>
          {account == "" && displaySelectAccount()}
          {account != "" && displayPayee()}
        </div>
      )}
    </div>
  );
}

export default Transfer;
