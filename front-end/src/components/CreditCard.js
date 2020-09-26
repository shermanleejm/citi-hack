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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
} from "@material-ui/core";
import { useCookies, withCookies, Cookies } from "react-cookie";
import sha256 from "crypto-js/sha256";
import { green } from "@material-ui/core/colors";
import axios from "axios";

function CreditCard(props) {
  const [cookies, setCookies] = useCookies(["username"]);
  const [username, setUsername] = useState(cookies.username);
  const [userData, setUserData] = useState(null);
  const [sussRecords, setSussRecords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(
      process.env.REACT_APP_BACKEND_IP +
        "/getCreditCardRecords?username=" +
        username
    );
    const fetchUserData = async () => {
      setIsLoading(true);

      const result = await axios(
        process.env.REACT_APP_BACKEND_IP +
          "/getCreditCardRecords?username=" +
          username
      );
      setUserData(result.data);
    };

    const fetchSussRecords = async () => {
      setIsLoading(true);

      const result = await axios(
        process.env.REACT_APP_BACKEND_IP +
          "/findSussRecords?username=" +
          username
      );
      var dict = {};
      result.data.map((row) => {
        dict[row[1]] = row[0];
      });
      setSussRecords(dict);
      setIsLoading(false);
    };

    fetchUserData();
    fetchSussRecords();
  }, []);

  return (
    <div style={{ width: "80%", margin: "auto", paddingTop: "32px" }}>
      {isLoading == false && (
        <div>
          <Typography variant="h4">
            These are your recent credit card purchases
          </Typography>
          <Typography variant="h5">
            Suspicious records are highlighted in
            <span style={{ color: "red" }}> red</span>
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Amount (S$)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData.map((row) => (
                  <TableRow
                    style={{
                      backgroundColor:
                        row[1] in sussRecords && sussRecords[row[1]] == row[0]
                          ? "red"
                          : "white",
                    }}
                  >
                    <TableCell>{row[0]}</TableCell>
                    <TableCell>{row[1]}</TableCell>
                    <TableCell>{row[2]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}

export default CreditCard;
