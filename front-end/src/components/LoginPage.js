import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Input,
  InputLabel,
  FormControl,
  Modal,
  Paper,
  Link,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Cookies, useCookies } from "react-cookie";
import sha256 from "crypto-js/sha256";
import { green } from "@material-ui/core/colors";
import axios from "axios";

const LoginPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    nonce: props.nonce,
    status: "",
  });
  const [modalState, toggleModalState] = useState(false);
  const [cookies, setCookies] = useCookies(["authenticated", "username"]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const result = await axios(
        process.env.REACT_APP_BACKEND_IP + "/getNonce"
      );

      setValues({ nonce: result.data });
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const printModal = (
    <div>
      <Modal open={modalState} onClick={() => toggleModalState(false)}>
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
          <Paper
            style={{
              padding: "32px",
              width: "60vw",
              margin: "auto",
              textAlign: "center",
            }}
          >
            <Typography variant="h4">{values.status}</Typography>
            <Button
              onClick={() => {
                values.status == "Success" && props.setPageToShow(2);
              }}
            >
              {values.status == "Success" ? "go to home" : "try again"}
            </Button>
          </Paper>
        </div>
      </Modal>
    </div>
  );

  return (
    <div>
      <div style={{ width: "60%", margin: "auto", paddingTop: "32px" }}>
        <form>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item>
              <Typography variant="h4">
                Please login using our SuperSecureLogin
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                error={false}
                label="Username"
                fullWidth
                onChange={(event) => setUsername(event.target.value)}
              />
            </Grid>

            <Grid item>
              <FormControl fullWidth>
                <InputLabel>Password</InputLabel>
                <Input
                  error={false}
                  label="Password"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={(event) => setPassword(event.target.value)}
                />
              </FormControl>
            </Grid>

            <Grid item>
              <Button
                type="submit"
                onClick={(event) => {
                  // var ciphertext = CryptoAES.encrypt(username, values.nonce);
                  // var _ciphertext = CryptoAES.decrypt(
                  //   ciphertext.toString(),
                  //   values.nonce
                  // );
                  // console.log(_ciphertext.toString(CryptoENC));
                  event.preventDefault();
                  var hashedPassword = sha256(password, values.nonce);
                  axios(
                    process.env.REACT_APP_BACKEND_IP +
                      "/login?username=" +
                      username +
                      "&password=" +
                      hashedPassword
                  ).then((response) => {
                    console.log(response["data"][0]);
                    setValues({ status: response["data"][0] });
                    if (response["data"][0] == "Success") {
                      setCookies("authenticated", "true", {
                        expires: 0,
                      });
                      setCookies("username", username, {
                        expires: 0,
                      });
                      toggleModalState(true);
                      props.setPageToShow(2);
                    } else {
                      alert("error logging in" + values.status);
                    }
                  });
                }}
              >
                Submit
              </Button>
            </Grid>

            <Grid item>
              <Link
                style={{ cursor: "pointer" }}
                onClick={() => props.setPageToShow(1)}
              >
                New here? Register with us.
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
