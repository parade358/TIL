import { TextField } from "@material-ui/core";
import React from "react";

const AcsTextField = React.memo(function AcsTextField({ value, inputRef, ...props }) {
  return <TextField autoComplete='off' {...props} value={value} inputRef={inputRef} />;
});

export default AcsTextField;

AcsTextField.defaultProps = {
  variant: "outlined",
  size: "small",
  letterCase: "none",
  InputLabelProps: { shrink: true, style: { fontWeight: "bold", color: "#000", minWidth: "max-content" } },
};

const makeSetCase = {
  upper: letter => letter.toUpperCase(),
  lower: letter => letter.toLowerCase(),
};