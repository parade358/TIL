import { TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const AcsTextField = React.memo(function AcsTextField({ value, ...props }) {
  // const [reValue, setReValue] = useState();

  // useEffect(() => {
  //   setReValue(value);
  // }, [value]);

  // const setCase = e => {
  //   if (makeSetCase[letterCase]) {
  //     const letter = makeSetCase[letterCase](e.target.value);
  //     setReValue(letter);
  //   }
  // };

  return <TextField  autoComplete='off' {...props} value={value} />;
}
);

export default AcsTextField;

AcsTextField.defaultProps = {
  variant: "outlined",
  size: "small",
  letterCase: "none",
  InputLabelProps: { shrink: true, style:{fontWeight:"bold", color:"#000",  minWidth: "max-content"}}
};

const makeSetCase = {
  upper: letter => letter.toUpperCase(),
  lower: letter => letter.toLowerCase(),
};
