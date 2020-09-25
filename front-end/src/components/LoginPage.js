import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, Typography } from "@material-ui/core";

const LoginPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
              error={true}
              label="Username"
              fullWidth
              onChange={(event) => setUsername(event.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              error={true}
              label="Password"
              fullWidth
              onChange={(event) => setPassword(event.target.value)}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default LoginPage;
