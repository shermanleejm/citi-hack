import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";

function RegisterPage = ({props}) {
  return (
    <div>
      This is register page
      <Button
        onClick={() => {
          props.setPageToShow(1);
        }}
      >
        Change
      </Button>
    </div>
  );
}

export default RegisterPage;
