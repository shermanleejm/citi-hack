import React, { useState, useEffect } from "react";
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
import { green } from "@material-ui/core/colors";

const LoginPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);

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
        </Grid>
      </div>
    </div>
  );
};

export default LoginPage;
