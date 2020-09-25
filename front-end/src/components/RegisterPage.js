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

const RegisterPage = (props) => {
  useLayoutEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_IP + "/getNonce")
      .then((r) => r.json())
      .then((data) => {
        setValues({
          nonce: data,
        });
      });
  }, []);

  const [cookies, setCookies] = useCookies(["authenticated", "username"]);
  const [values, setValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    showConfirmPassword: false,
    showPassword: false,
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div style={{ width: "60vw", margin: "auto", paddingTop: "32px" }}>
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
              Join us for a SuperSecureExperience
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              error={false}
              label="Username"
              fullWidth
              onChange={(event) => setValues({ username: event.target.value })}
            />
          </Grid>

          <Grid item>
            <FormControl fullWidth>
              <InputLabel>Password</InputLabel>
              <Input
                error={false}
                label="Password"
                fullWidth
                type={values.showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setValues({ showPassword: !values.showPassword })
                      }
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl fullWidth>
              <InputLabel>Confirm Password</InputLabel>
              <Input
                error={false}
                label="Confirm Password"
                fullWidth
                type={values.showConfirmPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setValues({
                          showConfirmPassword: !values.showConfirmPassword,
                        })
                      }
                    >
                      {values.showConfirmPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </FormControl>
          </Grid>

          {values.confirmPassword !== values.password && (
            <Typography variant="body2" style={{ color: "#FF0000" }}>
              passwords do not match
            </Typography>
          )}

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
                if (
                  values.password !== "" &&
                  values.password === values.confirmPassword
                ) {
                  var hashedPassword = sha256(values.password, values.nonce);
                  fetch(
                    process.env.REACT_APP_BACKEND_IP +
                      "/register?username=" +
                      values.username +
                      "&password=" +
                      hashedPassword
                  )
                    .then((r) => r.json())
                    .then((data) => {
                      console.log(data);
                      if (data[0] == "Success") {
                        setCookies("authenticated", "true", { expires: 0 });
                        setCookies("username", values.username, { expires: 0 });
                        props.setPageToShow(2);
                      } else {
                        alert(
                          "Sorry our servers appear to be down, please try again later"
                        );
                      }
                    });
                }
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default RegisterPage;
