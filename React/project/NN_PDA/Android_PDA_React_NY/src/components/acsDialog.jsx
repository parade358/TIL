import { DialogContentText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    bottomCloseButton: {
        width: '100%',
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
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

export default function AcsDialog(props) {
    return (
        <div>
            <Dialog onClose={props.handleClose} aria-labelledby="customized-dialog-title" open={props.open} fullWidth>
                <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
                    {'알림'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>{props.message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={props.handleClose}
                        style={{ backgroundColor: 'gray', color: 'white' }}
                        fullWidth
                        variant="contained"
                    >
                        {'닫기'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
