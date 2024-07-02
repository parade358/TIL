import { Badge, Button, makeStyles } from "@material-ui/core";
import PropTypes from 'prop-types';
import React from "react";

const useStyle = makeStyles({
  badgeButton: {
    display: "inline",
  },

  badgeSize:{
    right:"15px",
    top:"10px",
    fontSize:"1.1rem",
  }
});

function AcsBadgeButton({ badgeContent, ...props }) {
  const classes = useStyle();
  return (
    <Badge classes={{badge:classes.badgeSize}} max={9999} className={classes.badgeButton} badgeContent={badgeContent} color='secondary'>
      <Button {...props}>
        {props.children} 
      </Button>
    </Badge>
  );
}

export default AcsBadgeButton;

AcsBadgeButton.defaultProps = {
  badgeContent: 0,
};

AcsBadgeButton.propTypes = {
  children: PropTypes.string.isRequired  
};