import { Card, CardContent, MenuItem, Select } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useTranslation } from "react-i18next";
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


export default function AcsUserInfo(props) {
    const { t } = useTranslation();
    const getLangName = code => {
        if (code === "ko") {
            return t("한국어")
        } else if (code === "eng") {
            return t("영어")
        }
    }

    //단순 변수
    const factorys = [
        { name: t("멕시코"), value: "501", type: "mx" }
    ];

    const language = [
        { name: t("한국어"), value: "K" },
        { name: t("영어"), value: "E" },
    ];

    const getFactoryList = factorys.filter(
        (data) => data.type === PDA_CURRENT_PLANT_MODE
    );

    const setDefatulValue = (type) => {
        if (type === "FACTORY") {
            if (localStorage.getItem("PDA_PLANT_ID") !== null) {
                return localStorage.getItem("PDA_PLANT_ID");
            } else {
                return getFactoryList[0].value;
            }
        }
        return "";
    };

    return (
        <div>
            <Dialog
                onClose={props.handleClose}
                aria-labelledby="customized-dialog-title"
                open={props.open}
                fullWidth
            >

                <DialogContent>
                    <Card>
                        <CardContent>

                            <Typography variant="h5" component="h2">
                                {t("유저 정보")}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="p">
                                {t("아이디")} : {localStorage.getItem("PDA_ID")}
                            </Typography>
                            <Typography variant="body2" component="p">
                                {t("현재 언어")} : {
                                    getLangName(localStorage.getItem("PDA_LANG"))
                                }
                            </Typography>
                            <Typography variant="body2" component="p">
                                {t("로그인 공장")} : {localStorage.getItem("PDA_PLANT_ID")}
                            </Typography>

                            {/* 공장 선택 - 테스트 (배포시 없앤 후 배포) */}
                            {/* <Select
                                labelId="factory__label"
                                id="factory"
                                name="factory"
                                defaultValue={setDefatulValue("FACTORY")}
                                onChange = {(e) => localStorage.setItem("PDA_PLANT_ID", e.target.value)}
                            >
                                {getFactoryList.map((el, i) => (
                                    <MenuItem key={i} value={el.value}>
                                        {t(el.name)}
                                    </MenuItem>
                                ))}
                            </Select> */}


                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
