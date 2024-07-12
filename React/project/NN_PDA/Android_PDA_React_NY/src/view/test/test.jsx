import { useRef, useState, useEffect, useCallback } from 'react';
import { makeStyles, Tabs, Tab, IconButton, Backdrop, CircularProgress, Button } from '@material-ui/core';


const useStyle = makeStyles((theme) => ({
    root: {
        margin: '70px 10px 10px 10px',
        zIndex: 0,
    },
    text: {
        '& .PrivateNotchedOutline-legendNotched-24': {
            zIndex: 0,
        },
        marginTop: '10px',
        width: '100%',
    },
    backdrop: {
        zIndex: 9999,
    },
    half: {
        width: '49.5%',
        marginTop: '10px',
    },
    halfMargin: {
        marginRight: '3px',
    },
    select: {
        width: '100%',
        marginTop: '80px',
    },
    selectStorage: {
        width: '100%',
        marginTop: '10px',
    },
    marginBottom: {
        marginBottom: '5px',
    },
    checkBoxMargin: {
        margin: '0px',
        marginTop: '-20px',
    },
    tabsDiv: {
        width: '100%',
        position: 'fixed',
        left: '0px',
        right: '0px',
        bottom: '0px',
        backgroundColor: '#f7b13d',
        borderTop: '5px solid white',
        zIndex: 99,
    },
    tabs: {
        '& .MuiTabs-indicator': {
            backgroundColor: 'white',
            top: '0px',
            height: '0px',
        },
        '& .MuiTab-wrapped': {
            padding: '0px',
        },
        '& .MuiTab-wrapper': {
            display: 'block',
            height: '100%',
        },
    },
    tab: {
        display: 'block',
        height: '100%',
        padding: '10px',
        paddingTop: '12px',
        textTransform: 'none',
    },
    customStyleOnTab: {
        fontSize: '1rem',
        color: 'white',
    },
    activeTab: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#f7b13d',
        backgroundColor: 'white',
    },
    button: {
        marginTop: '10px',
        color: 'white',
        textTransform: 'none',
        height: '50px',
    },
    dataGridOdd: {
        '& .MuiDataGrid-row.Mui-odd': {
            backgroundColor: 'Whitesmoke',
        },
    },
}));


export default function Test () {

    const classes = useStyle(); // CSS 스타일

    // PDA 진동
    const vibration = () => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'VIBRATION' }));
        }
    };

    // PDA 카메라 ON
    const camera = () => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CAMERA' }));
        }
    };



    return(
    <>
        <div className={classes.root}>
            <button onClick={vibration}>진동</button>
            <button onClick={camera}>카메라</button>
        </div>
    </>
    )
}