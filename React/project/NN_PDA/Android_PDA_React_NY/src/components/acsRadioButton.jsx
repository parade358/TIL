import { FormControl, FormControlLabel, FormLabel, makeStyles, Radio, RadioGroup } from "@material-ui/core";
import React from "react";

const useStyle = makeStyles({
  root: {
    display: "block",
    width: "100%",
    fontSize:"5px",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "5px",
    marginLeft: "5px",
    fontSize:"10px",
  },

  radioButton:{
    fontSize:"5px"
  }
});

function AcsRadioButton({ groupLabel, dataList, onChange, value, disabled }) {
  const classes = useStyle();
  
  return (
    <FormControl classes={classes.root} component='fieldset' >
      {/* <FormLabel component='legend' style={{fontSize:"0.8rem",color:"#000", fontWeight:"bold"}} >{groupLabel}</FormLabel> */}
      <RadioGroup size="small" className={classes.radioGroup} variant="outlined" value={value} aria-label='radioGroup' name='radioGroup1'  onChange={onChange}>
        {dataList.map((data, i) => (
          <FormControlLabel //
            className={classes.radioButton}
            key={i}
            value={data.value}
            control={<Radio  />}
            label={
              <span style={{fontSize:"0.8rem"}}>
                 {data.label}
              </span>
              
          }
            labelPlacement='End'
            disabled={disabled}
            size="small"
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default AcsRadioButton;

AcsRadioButton.defaultProps = {
  groupLabel: "label",
  dataList: [
    { label: "Y", value: "yes" },
    { label: "N", value: "no" },
  ],
  disabled: false
};
