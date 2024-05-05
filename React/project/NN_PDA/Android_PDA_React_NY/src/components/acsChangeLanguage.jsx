import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "../translation/i18ninit";
import AcsSelect from "./acsSelect";

const PDA_CURRENT_PLANT_MODE = process.env.REACT_APP_PDA_CURRENT_PLANT_MODE;
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});


const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);




export default function AcsChangeLanguage(props) {
  const {t} = useTranslation();
  const language = [
    { label: t("한국어"), value: "K" },
    { label: t("영어"), value: "E" },
  ];
  

  
  const getLanguageList = language.filter((data) => {
    if (data.value === "ko") {
      return data;
    } else {
      if (data.value === PDA_CURRENT_PLANT_MODE) {
        return data;
      }else{
        if(data.value === "ko"){
          return data;
        }
      }
    }
  });

  const eventhandler = {
    onLangChanged : (e) =>{      
      i18n.changeLanguage(e.target.value);
      console.log('acsChangeLanguage', e.target.value);
      localStorage.setItem("PDA_LANG", e.target.value);
    }
  }
  return (
    <div>
      <Dialog
        onClose={props.handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.open}
        fullWidth
      >       
        <DialogContent>
          <AcsSelect labelText = {t("언어 변경")} defaultValue={localStorage.getItem("PDA_LANG")}  data={getLanguageList} onChange={eventhandler.onLangChanged}></AcsSelect>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
          {t("닫기")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
