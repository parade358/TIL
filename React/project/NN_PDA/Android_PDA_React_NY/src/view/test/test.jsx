import { useState, useEffect, useCallback } from 'react';
import { makeStyles, Checkbox } from '@material-ui/core';
import AcsDialog from '../../components/acsDialog';

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
    imageContainer: {
        display: 'inline-block',
        margin: '10px',
        verticalAlign: 'top',
        position: 'relative',
        width: '100%',
        maxWidth: '300px', // 필요에 따라 최대 너비 조정
        height: 'auto', // 또는 원하는 고정 높이 설정
    },
    image: {
        maxWidth: '100%',
        maxHeight: '300px',
    },
}));

let msg = '';

const PDA_API_GENERAL_URL = process.env.REACT_APP_PDA_API_GENERAL_URL;
const PROC_PK_PDA_IMAGE_TEST_L = 'U_PK_PDA_IMAGE_TEST_L';
const PROC_PK_PDA_IMAGE_TEST_S = 'U_PK_PDA_IMAGE_TEST_S';

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
};

// Request Param
function getRequestParam() {
    return [...arguments] //
        .map((el) => `'${el}'`)
        .join('&del;');
};

export default function Test() {

    const classes = useStyle();
    const [dialogOpen,  setDialogOpen]  = useState(false);
    const [imageData,   setImageData]   = useState([]);
    const [selected,    setSelected]    = useState([]);

    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []);
    
    const handleClose = (e) => {
        setDialogOpen(false);
    };

    useEffect(() => {
        setSelected(new Array(imageData.length).fill(false));
    }, [imageData]);

    useEffect(() => {
        document.addEventListener('message', onMessage);
        return () => {
            console.log('handle 지움');
            document.removeEventListener('message', onMessage);
        };
    }, []);

    const ReadData = (e) => {
        const type = JSON.parse(e.data).type;
        const imageSourceData = JSON.parse(e.data).imageSourceData;

        if (type === 'IMAGEDATA') {
            setImageData((prevState) => [...prevState, imageSourceData]);
        }
    };
    
    const vibration = () => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'VIBRATION' }));
        }
    };

    const camera = () => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CAMERA' }));
        }
    };

    const toggleCheckbox = (index) => {
        const newSelected = [...selected];
        newSelected[index] = !newSelected[index];
        setSelected(newSelected);
    };

    const deleteSelectedImages = () => {
        const newImageData = imageData.filter((_, index) => !selected[index]);
        setImageData(newImageData);
        setSelected(new Array(newImageData.length).fill(false));
    };

    // fetch문 반복 X
    const clickSaveBtn = () => {
        imageData.forEach(imageSourceData => {
            saveImage(imageSourceData);
        });
    }

    const initImage = () => {
        setImageData([]);
    }

    const loadImage = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_IMAGE_TEST_L,
            getRequestParam(3)
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
                    setImageData([]);
                    const tmpArray = JSON.parse(data.returnValue[0]);
                    setImageData((prevState) => [...prevState, tmpArray[0]['IMAGE_BASE64']]);
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
    };

    const saveImage = (imageSourceData) => {

        // 이름 난수 만드는 부분은 api에서 처리
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');
        const randomString = Array.from({ length: 10 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 36))).join('');
        const imageName = formattedDate + randomString;

        if (imageSourceData !== '') {
            const requestOption = getRequestOptions(
                PROC_PK_PDA_IMAGE_TEST_S,
                getRequestParam(imageName, imageSourceData)
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
        else {
            msg = '저장할 이미지가 없습니다.'
            setDialogOpen(true);
        }
    }


    return (
        <>
            <div className={classes.root}>
                <button onClick={vibration}>진동</button>
                <button onClick={camera}>카메라</button>
                <button onClick={clickSaveBtn}>사진저장</button>
                <button onClick={loadImage}>사진가져오기</button>
                {/* <button onClick={saveImageFile}>사진파일저장</button> */}
                <button onClick={initImage}>초기화</button>
            </div>

            <div>
                {imageData.map((image, index) => (
                    <div key={index} className={classes.imageContainer}>
                        <Checkbox
                            checked={selected[index]}
                            onChange={() => toggleCheckbox(index)}
                            color="primary"
                        />
                        <img src={image} alt={`사진 ${index}`} className={classes.image} />
                    </div>
                ))}
                {imageData.length > 0 && (
                    <button onClick={deleteSelectedImages}>선택된 사진 삭제</button>
                )}
            </div>

            {/* 메시지 박스 */}
            <AcsDialog
                message={msg}
                open={dialogOpen}
                handleClose={handleClose}
            ></AcsDialog>
        </>
    );
};
