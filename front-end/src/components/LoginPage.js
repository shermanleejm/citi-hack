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
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CryptoAES from "crypto-js/aes";
import Base64 from "crypto-js/enc-base64";
import CryptoENC from "crypto-js/enc-utf8";
import sha256 from "crypto-js/sha256";
import { green } from "@material-ui/core/colors";

const LoginPage = (props) => {
  useLayoutEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_IP + "/getNonce")
      .then((r) => r.json())
      .then((data) => {
        setValues({
          nonce: data,
        });
      });
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    nonce: "",
  });

  return (
    <div>
      <Typography>{username}</Typography>
      <Typography>{password}</Typography>
      <div style={{ width: "60%", margin: "auto", paddingTop: "32px" }}>
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
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
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
              onClick={() => {
                // var ciphertext = CryptoAES.encrypt(username, values.nonce);
                // var _ciphertext = CryptoAES.decrypt(
                //   ciphertext.toString(),
                //   values.nonce
                // );
                // console.log(_ciphertext.toString(CryptoENC));
                var hashedPassword = sha256(password, values.nonce);
                console.log(hashedPassword.toString());
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default LoginPage;
