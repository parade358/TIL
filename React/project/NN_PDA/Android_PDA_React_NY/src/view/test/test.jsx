import { useRef, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import AcsDialog        from '../../components/acsDialog';

const PDA_API_GENERAL_URL = process.env.REACT_APP_PDA_API_GENERAL_URL;

const PROC_PK_PDA_IMAGE_TEST_L = 'U_PK_PDA_IMAGE_TEST_L'; // 2공장 O
const PROC_PK_PDA_IMAGE_TEST_S = 'U_PK_PDA_IMAGE_TEST_S'; // 2공장 O

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

let msg = '';

// Request Option
function getRequestOptions(serviceID, serviceParam) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
        userID: localStorage.getItem('PDA_ID'),
        userPlant: localStorage.getItem('PDA_PLANT_ID'),
        serviceID: serviceID,
        serviceParam: serviceParam,
        serviceCallerEventType: 'onSubmit',
        serviceCallerEventName: 'onLoginClick',
        clientNetworkType: navigator.connection.effectiveType,
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
    };
    return requestOptions;
}

// Request Param
function getRequestParam() {
    return [...arguments] //
        .map((el) => `'${el}'`)
        .join('&del;');
}

export default function Test () {

    const classes = useStyle(); // CSS 스타일

    const [imageUrl, setImageUrl] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false); // 다이얼로그 (메시지창)
    const [image, setImage] = useState('');

    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []); // WebView에서 받아온 데이터

    useEffect(() => {
        document.addEventListener('message', onMessage);

        return () => {
            console.log('handle 지움');
            document.removeEventListener('message', onMessage);
        };
    }, []);

    

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

    // React Native WebView 에서 데이터 가져오기
    const ReadData = (e) => {
        const { imagePathData, imageSourceData } = JSON.parse(e.data);
        setImageUrl(imagePathData);
        setImage(imageSourceData);
    };

    const saveImage = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_IMAGE_TEST_S,
            getRequestParam('IMAGE2', image)
        );

        fetch(PDA_API_GENERAL_URL, requestOption)
                    .then((res) => res.json())
                    .then((data) => {
                        // 사용자 메시지 처리
                        if (data.returnUserMessage !== null) {
                            msg = data.returnUserMessage;
                            setDialogOpen(true);
                            vibration();
                            return;
                        }
                        // 에러 메시지 처리
                        else if (data.returnErrorMsg !== null) {
                            msg = data.returnErrorMsg;
                            setDialogOpen(true);
                            vibration();
                            return;
                        }
                        // 결과 처리
                        else {
                            msg = '저장성공';
                            setDialogOpen(true);
                        }
                    })

                    .catch((error) => {
                        msg = + error.message;
                        setDialogOpen(true);
                        vibration();
                        return;
                    });
    }

    const handleClose = (e) => {
        setDialogOpen(false);
    };

    const loadImage = () => {

        const requestOption = getRequestOptions(
            PROC_PK_PDA_IMAGE_TEST_L,
            getRequestParam('IMAGE')
        );

        fetch(PDA_API_GENERAL_URL, requestOption)
                    .then((res) => res.json())
                    .then((data) => {
                        // 사용자 메시지 처리
                        if (data.returnUserMessage !== null) {
                            msg = data.returnUserMessage;
                            setDialogOpen(true);
                            vibration();
                            return;
                        }
                        // 에러 메시지 처리
                        else if (data.returnErrorMsg !== null) {
                            msg = data.returnErrorMsg;
                            setDialogOpen(true);
                            vibration();
                            return;
                        }
                        // 결과 처리
                        else {

                            const tmpArray = JSON.parse(data.returnValue[0]);
                            setImage(tmpArray[0]['IMAGE_BASE64']);
                            msg = '불러오기 성공'
                            setDialogOpen(true);
                        }
                    })

                    .catch((error) => {
                        msg = + error.message;
                        setDialogOpen(true);
                        vibration();
                        return;
                    });
    }

    return(
    <>
        <div className={classes.root}>
            <button onClick={vibration}>진동</button>
            <button onClick={camera}>카메라</button>
            <button onClick={saveImage}>사진저장</button>
            <button onClick={loadImage}>사진가져오기</button>
        </div>

        <div>
            {/* 이미지가 존재하는 경우에만 이미지를 렌더링합니다 */}
      
                <div>
                    <img src={image} alt="사진" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                </div>
            
        </div>

        {/* 메시지 박스 */}
        <AcsDialog
            message={msg}
            open={dialogOpen}
            handleClose={handleClose}
        ></AcsDialog>
    </>
    )
}