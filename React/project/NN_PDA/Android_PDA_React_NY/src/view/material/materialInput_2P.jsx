import { makeStyles, IconButton, Backdrop, CircularProgress, Button, Dialog, DialogTitle } from '@material-ui/core';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Clear } from '@material-ui/icons';
import colors from '../../commons/colors';
import COMMON_MESSAGE from '../../commons/message';
import AcsBadgeButton from '../../components/acsBadgeButton';
import AcsTextField from '../../components/acsTextField';
import AcsDataGrid from '../../components/acsDataGrid';
import AcsCheckBox from '../../components/acsCheckBox';
import AcsDialog from '../../components/acsDialog';
import AcsDialogCustom from '../../components/acsDialogCustom';

const PDA_API_GETDATE_URL = process.env.REACT_APP_PDA_API_GETDATE_URL;
const PDA_API_GENERAL_URL = process.env.REACT_APP_PDA_API_GENERAL_URL;

const PROC_PK_PDA_IV01_1_Init_D = 'U_PK_PDA_IV01_1_Init_D'; // 초기화
const PROC_PK_PDA_IV01_1_L      = 'U_PK_PDA_IV01_1_L';      // 거래명세서 스캔
const PROC_PK_PDA_IV01_2_L      = 'U_PK_PDA_IV01_2_L';      // 부품표 스캔
const PROC_PK_PDA_IV01_11_L     = 'U_PK_PDA_IV01_11_L';     // 위치스캔 (적재위치 표시)
const PROC_PK_PDA_IV01_3_L      = 'U_PK_PDA_IV01_3_L';      // 위치스캔 (품번 표시)
const PROC_PK_PDA_IV01_4_L      = 'U_PK_PDA_IV01_4_L';      // 위치스캔 (수량 표시)
const RPOC_PK_PDA_IV01_1_1_S    = 'U_PK_PDA_IV01_1_1_S';    // 리스트에 데이터 추가
const PROC_PK_PDA_IV01_D        = 'U_PK_PDA_IV01_1_D';      // 선택삭제
const PROC_PK_PDA_IV01_3_S      = 'U_PK_PDA_IV01_3_S';      // 입고확정 (입고수량 잔량여부 확인)
const PROC_PK_PDA_IV01_7_L      = 'U_PK_PDA_IV01_7_L';      // 입고확정 (잔량 표시)
const PROC_PK_PDA_IV01_2_S      = 'U_PK_PDA_IV01_2_S';      // 입고확정

let msg = '';
let inv_id; // 부품표 스캔시 던져지는 매개변수
let transInDate; // '-' 뺀 입고일자

// 스타일
const useStyle = makeStyles((theme) => ({
    root: {
        margin: '70px 10px 10px 10px',
        zIndex: 0,
    },
    text: {
        marginTop: '10px',
        width: '100%',
    },
    backdrop: {
        zIndex: 9999,
    },
    textDisabled: {
        '& .MuiInputBase-root.Mui-disabled': {
            backgroundColor: colors.PLight,
        },
    },
    half: {
        width: '49.4%',
        marginTop: '10px',
    },
    halfMargin: {
        marginRight: '3px',
    },
    select: {
        width: '100%',
        marginTop: '80px',
        marginBottom: '5px',
    },
    marginBottom: {
        marginBottom: '5px',
    },
    marginRight: {
        marginRight: '3px',
    },
    flexDiv: {
        display: 'flex',
        marginTop: '10px',
    },
    checkBoxMargin: {
        '& .MuiTypography-body1': {
            width: '30px',
        },
        margin: '0px',
    },
    button: {
        marginTop: '10px',
        color: 'white',
        textTransform: 'none',
        height: '50px',
    },
    flexButton: {
        color: 'white',
        textTransform: 'none',
        height: '50px',
    },
    customDialog: {
        '& .MuiDialog-paperWidthSm': {
            margin: '10px',
            width: '700px',
        },
    },
    customDialogTitle: {
        '& .MuiTypography-h6': {
            fontSize: '1rem',
        },
        backgroundColor: '#f7b13d',
        color: 'white',
        padding: '10px',
    },
    customDialogRoot: {
        padding: '10px',
        width: '93.3%',
        height: '100%',
        margin: 'auto',
    },
    dataGridOdd: {
        '& .MuiDataGrid-row.Mui-odd': {
            backgroundColor: 'Whitesmoke',
        },
    },
    dataGridMargin: {
        marginTop: '10px',
    },
}));

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

function MaterialInput_2P() {
    const classes = useStyle(); // CSS 스타일
    const [dialogOpen, setDialogOpen] = useState(false); // 다이얼로그 (메시지창)
    const [dialogCustomOpen, setDialogCustomOpen] = useState(false); // 다이얼로그 (메시지창)
    const [dialogOkay, setDialogOkay] = useState(''); // 확인, 삭제 구분
    const [backdropOpen, setBackdropOpen] = useState(false); // 대기
    const pda_id = localStorage.getItem('PDA_ID'); // 사용자 ID
    const pda_plant_id = localStorage.getItem('PDA_PLANT_ID'); // 공장 ID
    const pda_mac_address = localStorage.getItem('PDA_MAC_ADDRESS'); // PDA Mac Address
    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []); // WebView에서 받아온 데이터
    const scanLocationRef = useRef('tradingStatement'); // 바코드 스캔 위치
    const [inDate, setInDate] = useState(''); // 입고일자
    const [inputDateDisabled, setInputDateDisabled] = useState(false); // 입고일자 Disabled
    const [, updateState] = useState(); // forceUpdate
    const forceUpdate = useCallback(() => updateState({}), []); // forceUpdate
    const tradingStatementRef = useRef(''); // 거래명세서 Text
    const [tradingStatementDisabled, setTradingStatementDisabled] = useState(false); // 거래명세서 Disabled
    const partBarcodeRef = useRef(''); // 부품표 Text
    const [partBarcodeDisabled, setPartBarcodeDisabled] = useState(false); // 부품표 Text Disabled
    const [radioState, setRadioState] = useState('select'); // 위치선택 라디오 버튼
    const radioStateRef = useRef('select'); // 위치선택 라디오 버튼 Ref
    const locationScanRef = useRef(''); // 위치스캔 Text
    const [textLoadingPosition, setTextLoadingPosition] = useState(''); // 적재위치 Text
    const [textPartId, setTextPartId] = useState(''); // 품번 Text
    const [textLotNo, setTextLotNo] = useState(''); // Lot No Text
    const [textTotalQty, setTextTotalQty] = useState(0); // 총수량 Text
    const [textUnitQty, setTextUnitQty] = useState(0); // 입고수량 Text
    const inQtyRef = useRef(''); // 입고개수 Text
    const [inQtyAllChecked, setInQtyAllChecked] = useState(false); // 체크박스 전체입고여부
    const [addListBtnDisabled, setAddListBtnDisabled] = useState(true); // 추가 버튼 Disabled
    const [sumList1, setSumList1] = useState([]); // 리스트 목록
    const lotListRef = useRef([]);
    const [selectionModel, setSelectionModel] = useState([]); // 체크박스에 체크된 것들
    const [openInputCompelteFlagColumnNot0Form, setOpenInputCompelteFlagColumnNot0Form] = useState(false); // 경고메시지 다이얼로그 - [확정 버튼 클릭시 FLAG 값이 "0"이 아닐때 경고메시지 팝업창]
    const [sumList2, setSumList2] = useState([]); // 리스트 목록 (확정 버튼 클릭시 FLAG 값이 "0"이 아닐때)

    // 화면 처음 로드시
    // 쓰레기 데이터 존재하면 삭제
    // WebView에서 스캔 데이터 받는 이벤트
    useEffect(() => {
        // 오늘 날짜 불러오기
        fetch(PDA_API_GETDATE_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setInDate(
                    data[0].value.substring(0, 4) +
                        '-' +
                        data[0].value.substring(5, 7) +
                        '-' +
                        data[0].value.substring(8, 10)
                );
            })
            .catch((data) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                setDialogOpen(true);
                vibration();
                return;
            });

        // 쓰레기 데이터 존재하면 삭제
        initData();

        document.addEventListener('message', onMessage);

        // React Native WebView로 Wifi 신호 강도 데이터 요청
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GET_WIFI_CURRENT_SIGNAL_STRENGTH' }));
        }

        return () => {
            // 쓰레기 데이터 존재하면 삭제
            initData();

            console.log('handle 지움');
            document.removeEventListener('message', onMessage);
        };
    }, []);

    // 입고일자 활성화
    useEffect(() => {
        if (sumList1.length === 0) {
            setInputDateDisabled(false);
        }
    }, [sumList1]);

    // 라디오버튼 변경시 Ref 지정 - [이동]
    useEffect(() => {
        radioStateRef.current = radioState;
    }, [radioState]);

    // 쓰레기 데이터 존재하면 삭제
    const initData = () => {
        const requestOption = getRequestOptions(PROC_PK_PDA_IV01_1_Init_D, getRequestParam(pda_mac_address, pda_id));

        setBackdropOpen(true);
        fetch(PDA_API_GENERAL_URL, requestOption)
            .then((res) => res.json())
            .then((data) => {
                // 사용자 메시지 처리
                if (data.returnUserMessage !== null) {
                    msg = data.returnUserMessage;
                    setDialogOpen(true);
                    vibration();
                    setBackdropOpen(false);
                    return;
                }
                // 에러 메시지 처리
                else if (data.returnErrorMsg !== null) {
                    msg = data.returnErrorMsg;
                    setDialogOpen(true);
                    vibration();
                    setBackdropOpen(false);
                    return;
                }
                // 결과 처리
                else {
                    setBackdropOpen(false);
                    return;
                }
            })
            .catch((data) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
    };

    // React Native WebView 에서 데이터 가져오기
    // 바코드 스캔 이벤트
    const ReadData = (e) => {
        const type = JSON.parse(e.data).type;
        console.log('ReadData : ', type);

        // Wifi 신호 강도 불러오기
        if (type === 'GET_WIFI_CURRENT_SIGNAL_STRENGTH') {
            const { wifiCurrentSignalStrength, type } = JSON.parse(e.data);

            console.log('Wifi 신호 강도 [자재입고]', wifiCurrentSignalStrength);

            if (wifiCurrentSignalStrength <= -85) {
                msg = '무선랜 신호가 약하거나 끊겼습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
        }
        // 바코드 스캔시 이벤트
        else if (type === 'SCANDATA') {
            const { scannedData, scannedLabelType, type } = JSON.parse(e.data);
            console.log('스캔한 바코드 = ' + scannedData.data);

            // 거래명세서 스캔
            if (scanLocationRef.current === 'tradingStatement') {
                if (scannedData.data === '') {
                    msg = '거래명세서를 스캔해주세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                } else {
                    barcodeInfo(scannedData.data, '', 'tradingStatement');
                }
            }
            // 부품표 스캔
            else if (scanLocationRef.current === 'partList') {
                if (scannedData.data.length === 25) {
                    if (lotListRef.current.length > 0) {
                        const duplicatedObj = lotListRef.current.filter(
                            (data) => data['PART_BARCODE'] === scannedData.data
                        );

                        if (duplicatedObj.length > 0) {
                            msg = '리스트에 등록된 바코드 입니다.!';
                            setDialogOpen(true);
                            vibration();
                            return;
                        } else {
                            inv_id = scannedData.data.substring(3, 10);
                            let substringValue;

                            for (let i = 0; inv_id.length; i++) {
                                substringValue = inv_id.substring(i, i + 1);

                                if (substringValue.toString() !== '0') {
                                    inv_id = inv_id.substring(i);
                                    barcodeInfo(scannedData.data.substring(17), scannedData.data, 'partList');
                                    return;
                                }
                            }
                        }
                    } else {
                        inv_id = scannedData.data.substring(3, 10);
                        let substringValue;

                        for (let i = 0; inv_id.length; i++) {
                            substringValue = inv_id.substring(i, i + 1);

                            if (substringValue.toString() !== '0') {
                                inv_id = inv_id.substring(i);
                                barcodeInfo(scannedData.data.substring(17), scannedData.data, 'partList');
                                return;
                            }
                        }
                    }
                } else {
                    msg = '부품표/입고표 바코드가 아닙니다.';
                    setDialogOpen(true);
                    vibration();
                    partBarcodeRef.current.value = '';
                    return;
                }
            }
            // 위치 스캔
            else if (locationScanRef.current.value === '') {
                if (tradingStatementRef.current.value === '') {
                    msg = '거래명세서를 스캔해주세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (partBarcodeRef.current.value === '') {
                    msg = '부품표를 스캔해주세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (scannedData.data === '') {
                    msg = '위치정보를 스캔해주세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                } else {
                    if (scannedData.data.length === 25) {
                        msg = '위치정보를 스캔해주세요.';
                        setDialogOpen(true);
                        vibration();
                        return;
                    } else {
                        barcodeInfo(scannedData.data, '', 'locationScan');
                    }
                }
            } else {
                return;
            }
        }
    };

    // 바코드 스캔 처리
    const barcodeInfo = (scanData, partBarcode, gubun) => {
        console.log('barcaodeInfo', gubun);
        // 거래명세서
        if (gubun === 'tradingStatement') {
            if (scanData === '' || pda_plant_id === '') {
                msg = '거래명세서 또는 공장정보가 없습니다.';
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            } else {
                const requestOption = getRequestOptions(PROC_PK_PDA_IV01_1_L, getRequestParam(scanData, pda_plant_id));

                setBackdropOpen(true);
                fetch(PDA_API_GENERAL_URL, requestOption)
                    .then((res) => res.json())
                    .then((data) => {
                        // 사용자 메시지 처리
                        if (data.returnUserMessage !== null) {
                            msg = data.returnUserMessage;
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            tradingStatementRef.current.value = '';
                            return;
                        }
                        // 에러 메시지 처리
                        else if (data.returnErrorMsg !== null) {
                            msg = data.returnErrorMsg;
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            tradingStatementRef.current.value = '';
                            return;
                        }
                        // 결과 처리
                        else {
                            tradingStatementRef.current.value = scanData;
                            setTradingStatementDisabled(true);
                            scanLocationRef.current = 'partList';
                        }
                        setBackdropOpen(false);
                    })

                    .catch((data) => {
                        msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    });
            }
        }
        // 부품표
        else if (gubun === 'partList') {
            const requestOption = getRequestOptions(
                PROC_PK_PDA_IV01_2_L,
                getRequestParam(tradingStatementRef.current.value, scanData, inv_id, pda_plant_id)
            );

            setBackdropOpen(true);
            fetch(PDA_API_GENERAL_URL, requestOption)
                .then((res) => res.json())
                .then((data) => {
                    // 사용자 메시지 처리
                    if (data.returnUserMessage !== null) {
                        msg = data.returnUserMessage;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        partBarcodeRef.current.value = '';
                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        partBarcodeRef.current.value = '';
                        return;
                    }
                    // 결과 처리
                    else {
                        partBarcodeRef.current.value = partBarcode;
                        setPartBarcodeDisabled(true);
                        scanLocationRef.current = 'locationScan';
                        locationScanRef.current.focus();
                    }
                    setBackdropOpen(false);
                })
                .catch((data) => {
                    msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                    setDialogOpen(true);
                    vibration();
                    setBackdropOpen(false);
                    return;
                });
        }
        // 위치스캔
        else if (gubun === 'locationScan') {
            // 적재위치 (보관처) 표시 ===============================================================================================================================
            const requestOption1 = getRequestOptions(
                PROC_PK_PDA_IV01_11_L,
                getRequestParam(scanData, pda_plant_id, inv_id)
            );

            setBackdropOpen(true);
            fetch(PDA_API_GENERAL_URL, requestOption1)
                .then((res) => res.json())
                .then((data) => {
                    // 사용자 메시지 처리
                    if (data.returnUserMessage !== null) {
                        msg = data.returnUserMessage;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        reset('scanData');
                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        reset('scanData');
                        return;
                    }
                    // 결과 처리
                    else {
                        const tmpArray = JSON.parse(data.returnValue[0]);

                        locationScanRef.current.value = scanData;
                        setTextLoadingPosition(tmpArray[0]['LOC_ID']);
                        reset('qty');

                        // 품목코드, Lot No 표시 =========================================================================================================
                        const requestOption2 = getRequestOptions(
                            PROC_PK_PDA_IV01_3_L,
                            getRequestParam(inv_id, pda_plant_id)
                        );

                        fetch(PDA_API_GENERAL_URL, requestOption2)
                            .then((res) => res.json())
                            .then((data) => {
                                // 사용자 메시지 처리
                                if (data.returnUserMessage !== null) {
                                    msg = data.returnUserMessage;
                                    setDialogOpen(true);
                                    vibration();
                                    setBackdropOpen(false);
                                    setAddListBtnDisabled(true);
                                    reset('scanData');
                                    return;
                                }
                                // 에러 메시지 처리
                                else if (data.returnErrorMsg !== null) {
                                    msg = data.returnErrorMsg;
                                    setDialogOpen(true);
                                    vibration();
                                    setBackdropOpen(false);
                                    setAddListBtnDisabled(true);
                                    reset('scanData');
                                    return;
                                }
                                // 결과 처리
                                else {
                                    const tmpArray = JSON.parse(data.returnValue[0]);

                                    setTextPartId(tmpArray[0]['PART_ID']);
                                    setTextLotNo(partBarcodeRef.current.value.substring(17));

                                    // 총수량, 입고수량, 입고개수 표시 ==============================================================================================================================================================
                                    let unit_qty = partBarcodeRef.current.value.substring(10, 17);
                                    let substringValue;

                                    for (let i = 0; unit_qty.length; i++) {
                                        substringValue = unit_qty.substring(i, i + 1);

                                        if (substringValue.toString() !== '0') {
                                            unit_qty = unit_qty.substring(i);
                                            break;
                                        }
                                    }

                                    const requestOption3 = getRequestOptions(
                                        PROC_PK_PDA_IV01_4_L,
                                        getRequestParam(
                                            tradingStatementRef.current.value,
                                            partBarcodeRef.current.value.substring(17),
                                            pda_plant_id,
                                            inv_id
                                        )
                                    );

                                    fetch(PDA_API_GENERAL_URL, requestOption3)
                                        .then((res) => res.json())
                                        .then((data) => {
                                            // 사용자 메시지 처리
                                            if (data.returnUserMessage !== null) {
                                                msg = data.returnUserMessage;
                                                setDialogOpen(true);
                                                vibration();
                                                setBackdropOpen(false);
                                                setAddListBtnDisabled(true);
                                                reset('scanData');
                                                return;
                                            }
                                            // 에러 메시지 처리
                                            else if (data.returnErrorMsg !== null) {
                                                msg = data.returnErrorMsg;
                                                setDialogOpen(true);
                                                vibration();
                                                setBackdropOpen(false);
                                                setAddListBtnDisabled(true);
                                                reset('scanData');
                                                return;
                                            }
                                            // 결과 처리
                                            else {
                                                const tmpArray = JSON.parse(data.returnValue[0]);

                                                setTextTotalQty(tmpArray[0]['IN_QTY']);
                                                setTextUnitQty(unit_qty);
                                                inQtyRef.current.value = '1';
                                                inQtyRef.current.focus();
                                                setAddListBtnDisabled(false);
                                                scanLocationRef.current = 'inQty';
                                                partBarcodeRef.current.focus();
                                            }
                                            setBackdropOpen(false);
                                        })
                                        .catch((data) => {
                                            msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                                            setDialogOpen(true);
                                            vibration();
                                            setBackdropOpen(false);
                                            return;
                                        });
                                }
                                setBackdropOpen(false);
                            })
                            .catch((data) => {
                                msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                                setDialogOpen(true);
                                vibration();
                                setBackdropOpen(false);
                                return;
                            });
                    }
                    setBackdropOpen(false);
                })
                .catch((data) => {
                    msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                    setDialogOpen(true);
                    vibration();
                    setBackdropOpen(false);
                    return;
                });
        } else {
            return;
        }
    };

    // 초기화
    const reset = (gubun) => {
        if (gubun === 'scanData') {
            locationScanRef.current.value = '';
            setTextLoadingPosition('');
            setTextPartId('');
            setTextLotNo('');
            setTextTotalQty(0);
            setTextUnitQty(0);
            inQtyRef.current.value = '';
            setAddListBtnDisabled(true);
            scanLocationRef.current = 'locationScan';
        } else if (gubun === 'qty') {
            setTextLotNo('');
            setTextTotalQty(0);
            setTextUnitQty(0);
            inQtyRef.current.value = '';
        } else if (gubun === 'listAdd') {
            partBarcodeRef.current.value = '';
            setPartBarcodeDisabled(false);
            locationScanRef.current.value = '';
            setTextLoadingPosition('');
            setTextPartId('');
            setTextLotNo('');
            setTextTotalQty(0);
            setTextUnitQty(0);
            inQtyRef.current.value = '';
            setInQtyAllChecked(false);
            setAddListBtnDisabled(true);
            setInputDateDisabled(true);
            scanLocationRef.current = 'partList';
        } else if (gubun === 'all') {
            if (sumList1.length > 0) {
                partBarcodeRef.current.value = '';
                setPartBarcodeDisabled(false);
                locationScanRef.current.value = '';
                setTextLoadingPosition('');
                setTextPartId('');
                setTextLotNo('');
                setTextTotalQty(0);
                setTextUnitQty(0);
                inQtyRef.current.value = '';
                setInQtyAllChecked(false);
                setAddListBtnDisabled(true);
                scanLocationRef.current = 'partList';
            } else {
                tradingStatementRef.current.value = '';
                setTradingStatementDisabled(false);
                partBarcodeRef.current.value = '';
                setPartBarcodeDisabled(false);
                locationScanRef.current.value = '';
                setTextLoadingPosition('');
                setTextPartId('');
                setTextLotNo('');
                setTextTotalQty(0);
                setTextUnitQty(0);
                inQtyRef.current.value = '';
                setInQtyAllChecked(false);
                setAddListBtnDisabled(true);
                scanLocationRef.current = 'tradingStatement';
            }
        }
        // 입고 확정후 초기화
        else {
            tradingStatementRef.current.value = '';
            setTradingStatementDisabled(false);
            partBarcodeRef.current.value = '';
            setPartBarcodeDisabled(false);
            locationScanRef.current.value = '';
            setTextLoadingPosition('');
            setTextPartId('');
            setTextLotNo('');
            setTextTotalQty(0);
            setTextUnitQty(0);
            inQtyRef.current.value = '';
            setInQtyAllChecked(false);
            setAddListBtnDisabled(true);
            setSumList1([]);
            lotListRef.current = [];
            setSumList2([]);
            setSelectionModel([]);
            scanLocationRef.current = 'tradingStatement';
            setRadioState('select');
        }
    };

    // 리스트 데이터 삭제
    const removeListData = () => {
        const newSumList = [...sumList1];
        const newLotList = [...lotListRef.current];

        selectionModel.forEach((selected) => {
            const removeIDX = newSumList.findIndex((data) => selected === data.id);
            newSumList.splice(removeIDX, 1);

            const removeLotListIDX = newLotList.findIndex((data) => selected === data.PART_BARCODE);
            newLotList.splice(removeLotListIDX, 1);
        });

        setSelectionModel([]);
        setSumList1(newSumList);
        lotListRef.current = newLotList;
        setBackdropOpen(false);
    };

    // PDA 진동
    const vibration = () => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'VIBRATION' }));
        }
    };

    const eventhandler = {
        // 다이얼로그 (메시지창) 닫기
        handleClose: (e) => {
            setDialogOpen(false);
        },

        // 다이얼로그 커스텀 닫기 이벤트
        dialogOnCancel: (e) => {
            setDialogCustomOpen(false);
        },

        // 다이얼로그 커스텀 확인 이벤트
        dialogOnOkay: (e) => {
            setDialogCustomOpen(false);

            // 삭제
            if (dialogOkay === 'delete') {
                selectionModel.forEach((selected) => {
                    let selectedIndex = sumList1.findIndex((data) => selected === data.id);

                    const requestOption = getRequestOptions(
                        PROC_PK_PDA_IV01_D,
                        getRequestParam(
                            sumList1[selectedIndex]['PART_ID'],
                            sumList1[selectedIndex]['QTY'],
                            sumList1[selectedIndex]['LOT_NO'],
                            sumList1[selectedIndex]['LOCATION'],
                            sumList1[selectedIndex]['DATE'],
                            pda_mac_address,
                            pda_id,
                            pda_plant_id
                        )
                    );

                    setBackdropOpen(true);
                    fetch(PDA_API_GENERAL_URL, requestOption)
                        .then((res) => res.json())
                        .then((data) => {
                            // 사용자 메시지 처리
                            if (data.returnUserMessage !== null) {
                                msg = data.returnUserMessage;
                                setDialogOpen(true);
                                vibration();
                                setBackdropOpen(false);
                                return;
                            }
                            // 에러 메시지 처리
                            else if (data.returnErrorMsg !== null) {
                                msg = data.returnErrorMsg;
                                setDialogOpen(true);
                                vibration();
                                setBackdropOpen(false);
                                return;
                            }
                            // 결과 처리
                            else {
                                removeListData();
                            }
                        })
                        .catch((data) => {
                            msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            return;
                        });
                });
            }
            // 입고확정
            else if (dialogOkay === 'complete') {
                const requestOption = getRequestOptions(
                    PROC_PK_PDA_IV01_3_S,
                    getRequestParam(tradingStatementRef.current.value, pda_plant_id)
                );

                setBackdropOpen(true);
                fetch(PDA_API_GENERAL_URL, requestOption)
                    .then((res) => res.json())
                    .then((data) => {
                        // 사용자 메시지 처리
                        if (data.returnUserMessage !== null) {
                            msg = data.returnUserMessage;
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            return;
                        }
                        // 에러 메시지 처리
                        else if (data.returnErrorMsg !== null) {
                            msg = data.returnErrorMsg;
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            return;
                        }
                        // 결과 처리
                        else {
                            const tmpArray = JSON.parse(data.returnValue[0]);

                            if (tmpArray[0]['FLAG'] === '0') {
                                const requestOption = getRequestOptions(
                                    PROC_PK_PDA_IV01_2_S,
                                    getRequestParam(
                                        transInDate,
                                        tradingStatementRef.current.value,
                                        pda_mac_address,
                                        pda_id,
                                        pda_plant_id
                                    )
                                );

                                fetch(PDA_API_GENERAL_URL, requestOption)
                                    .then((res) => res.json())
                                    .then((data) => {
                                        // 사용자 메시지 처리
                                        if (data.returnUserMessage !== null) {
                                            msg = data.returnUserMessage;
                                            setDialogOpen(true);
                                            vibration();
                                            setBackdropOpen(false);
                                            return;
                                        }
                                        // 에러 메시지 처리
                                        else if (data.returnErrorMsg !== null) {
                                            msg = data.returnErrorMsg;
                                            setDialogOpen(true);
                                            vibration();
                                            setBackdropOpen(false);
                                            return;
                                        } else {
                                            msg = '입고확정 완료되었습니다.';
                                            setDialogOpen(true);
                                            setInputDateDisabled(false);
                                            reset('completeReset');
                                        }
                                        setBackdropOpen(false);
                                    })
                                    .catch((data) => {
                                        msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                                        setDialogOpen(true);
                                        vibration();
                                        setBackdropOpen(false);
                                        return;
                                    });
                            } else {
                                setOpenInputCompelteFlagColumnNot0Form(true);
                            }
                            setBackdropOpen(false);
                        }
                    })
                    .catch((data) => {
                        msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    });
            }
            // 무시하고 확정
            else {
                const requestOption = getRequestOptions(
                    PROC_PK_PDA_IV01_2_S,
                    getRequestParam(
                        transInDate,
                        tradingStatementRef.current.value,
                        pda_mac_address,
                        pda_id,
                        pda_plant_id
                    )
                );

                setBackdropOpen(true);
                fetch(PDA_API_GENERAL_URL, requestOption)
                    .then((res) => res.json())
                    .then((data) => {
                        // 사용자 메시지 처리
                        if (data.returnUserMessage !== null) {
                            msg = data.returnUserMessage;
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            return;
                        }
                        // 에러 메시지 처리
                        else if (data.returnErrorMsg !== null) {
                            msg = data.returnErrorMsg;
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            return;
                        } else {
                            msg = '입고확정 완료되었습니다.';
                            setDialogOpen(true);
                            setInputDateDisabled(false);
                            reset('completeReset');
                        }
                        setBackdropOpen(false);
                    })
                    .catch((data) => {
                        msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    });
            }
        },

        // 입고일자 변경시 이벤트
        onInputDateChange: (e) => {
            if (e.target.value === '') {
                msg = '입고일자를 선택해주세요.';
                setDialogOpen(true);
                vibration();
                return;
            } else {
                setInDate(e.target.value);
                forceUpdate();
            }
        },

        // 거래명세서 X 버튼 이벤트
        onBtnClearTradingStatement: (e) => {
            if (tradingStatementDisabled) {
                return;
            } else {
                tradingStatementRef.current.value = '';
                scanLocationRef.current = 'tradingStatement';
            }
        },

        // 거래명세서 키인
        onTradingStatementKeyUp: (e) => {
            const scanData = e.target.value;

            if (e.keyCode === 13) {
                if (scanData === '') {
                    msg = '거래명세서를 입력해주세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                } else {
                    barcodeInfo(scanData, '', 'tradingStatement');
                }
            }
        },

        // 부품표 X 버튼 이벤트
        onBtnClearPartBarcode: (e) => {
            if (partBarcodeDisabled) {
                return;
            } else {
                partBarcodeRef.current.value = '';
                scanLocationRef.current = 'partList';
            }
        },

        // 부품표 키인
        onPartBarcodeKeyUp: (e) => {
            const scanData = e.target.value;

            if (e.keyCode === 13) {
                if (tradingStatementRef.current.value === '') {
                    msg = '거래명세서부터 입력해주세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                } else {
                    if (scanData === '') {
                        msg = '부품표를 입력해주세요.';
                        setDialogOpen(true);
                        vibration();
                        return;
                    } else {
                        if (scanData.length === 25) {
                            if (lotListRef.current.length > 0) {
                                const duplicatedObj = lotListRef.current.filter(
                                    (data) => data['PART_BARCODE'] === scanData
                                );

                                if (duplicatedObj.length > 0) {
                                    msg = '리스트에 등록된 바코드 입니다.!';
                                    setDialogOpen(true);
                                    vibration();
                                    return;
                                } else {
                                    inv_id = scanData.substring(3, 10);
                                    let substringValue;

                                    for (let i = 0; inv_id.length; i++) {
                                        substringValue = inv_id.substring(i, i + 1);

                                        if (substringValue.toString() !== '0') {
                                            inv_id = inv_id.substring(i);
                                            barcodeInfo(scanData.substring(17), scanData, 'partList');
                                            return;
                                        }
                                    }
                                }
                            } else {
                                inv_id = scanData.substring(3, 10);
                                let substringValue;

                                for (let i = 0; inv_id.length; i++) {
                                    substringValue = inv_id.substring(i, i + 1);

                                    if (substringValue.toString() !== '0') {
                                        inv_id = inv_id.substring(i);
                                        barcodeInfo(scanData.substring(17), scanData, 'partList');
                                        return;
                                    }
                                }
                            }
                        } else {
                            msg = '부품표/입고표 바코드가 아닙니다.';
                            setDialogOpen(true);
                            vibration();
                            partBarcodeRef.current.value = '';
                            return;
                        }
                    }
                }
            }
        },

        // 위치스캔 X 버튼 이벤트
        onBtnClearLocationScan: (e) => {
            locationScanRef.current.value = '';
            scanLocationRef.current = 'locationScan';
        },

        // 위치스캔 키인
        onPartLocationScanKeyUp: (e) => {
            const scanData = e.target.value;

            if (e.keyCode === 13) {
                if (tradingStatementRef.current.value === '') {
                    msg = '거래명세서를 입력해주세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (partBarcodeRef.current.value === '') {
                    msg = '부품표를 입력해주세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (scanData === '') {
                    msg = '위치정보를 입력해주세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                } else {
                    if (scanData.length === 25) {
                        msg = '정확한 위치정보를 입력하세요.';
                        setDialogOpen(true);
                        vibration();
                        return;
                    } else {
                        barcodeInfo(scanData, '', 'locationScan');
                    }
                }
            }
        },

        // 입고개수 X 버튼 이벤트
        onBtnClearBarcode: (e) => {
            inQtyRef.current.value = '';
            scanLocationRef.current = 'inQty';
        },

        // 체크박스 전체 클릭 이벤트
        onCheckbox_inQtyAllChanged: (e) => {
            if (e.target.checked) {
                setInQtyAllChecked(true);
            } else {
                setInQtyAllChecked(false);
            }
        },

        // 리스트에 데이터 추가 이벤트
        onAddListBtnClick: (e) => {
            if (
                tradingStatementRef.current.value !== '' &&
                partBarcodeRef.current.value !== '' &&
                locationScanRef.current.value !== '' &&
                textLoadingPosition !== '' &&
                textPartId !== '' &&
                textLotNo !== '' &&
                textTotalQty !== '' &&
                textUnitQty !== '' &&
                inQtyRef.current.value !== ''
            ) {
                let in_qty = 0;
                let loc_id = null;

                if (inQtyAllChecked) {
                    if (textTotalQty !== '') {
                        in_qty = parseInt(textTotalQty);
                    } else {
                        msg = '스캔된 수량이 없습니다.';
                        setDialogOpen(true);
                        vibration();
                        return;
                    }
                } else {
                    if (inQtyRef.current.value !== '' && textUnitQty !== '') {
                        in_qty = parseInt(inQtyRef.current.value) * parseInt(textUnitQty);
                    } else {
                        msg = '수량을 입력하거나 전체를 선택하세요.';
                        setDialogOpen(true);
                        vibration();
                        return;
                    }
                }
                if (textLoadingPosition !== '') {
                    loc_id = textLoadingPosition;
                } else {
                    msg = '스캔된 대표로케이터가 없습니다.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (parseInt(textTotalQty) < parseInt(in_qty)) {
                    msg = '입력한 수량이 총 수량보다 큽니다.';
                    setDialogOpen(true);
                    vibration();
                    inQtyRef.current.value = '';
                    inQtyRef.current.focus();
                    return;
                } else {
                    const transInDateArray = inDate.split('-');
                    transInDate = transInDateArray[0] + transInDateArray[1] + transInDateArray[2];

                    const requestOption = getRequestOptions(
                        RPOC_PK_PDA_IV01_1_1_S,
                        getRequestParam(
                            transInDate, //이동일자
                            textPartId, // 품번
                            in_qty, // 수량
                            textLotNo,
                            loc_id,
                            tradingStatementRef.current.value,
                            partBarcodeRef.current.value,
                            textUnitQty,
                            inQtyRef.current.value,
                            pda_mac_address,
                            pda_id,
                            pda_plant_id
                        )
                    );

                    setBackdropOpen(true);
                    fetch(PDA_API_GENERAL_URL, requestOption)
                        .then((res) => res.json())
                        .then((data) => {
                            // 사용자 메시지 처리
                            if (data.returnUserMessage !== null) {
                                msg = data.returnUserMessage;
                                setDialogOpen(true);
                                vibration();
                                setBackdropOpen(false);
                                return;
                            }
                            // 에러 메시지 처리
                            else if (data.returnErrorMsg !== null) {
                                msg = data.returnErrorMsg;
                                setDialogOpen(true);
                                vibration();
                                setBackdropOpen(false);
                                return;
                            }
                            // 결과 처리
                            else {
                                setSumList1(
                                    [
                                        {
                                            id: partBarcodeRef.current.value,
                                            PART_ID: textPartId,
                                            LOT_NO: textLotNo,
                                            QTY: in_qty,
                                            LOCATION: loc_id,
                                            DATE: transInDate,
                                        },
                                    ],
                                    ...sumList1
                                );
                                lotListRef.current = [
                                    {
                                        PART_BARCODE: partBarcodeRef.current.value,
                                    },
                                    ...lotListRef.current,
                                ];
                            }
                            setBackdropOpen(false);
                            reset('listAdd');
                        })
                        .catch((data) => {
                            msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            return;
                        });
                }
            } else {
                msg = '비어있는 항목이 존재합니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
        },

        // 텍스트 초기화 이벤트
        onResetBtnClick: (e) => {
            reset('all');
        },

        // 리스트에서 하나 또는 여러 행을 체크시 이벤트
        onSelectionModelChange: (e) => {
            setSelectionModel([...e.selectionModel]);
        },

        // 삭제 버튼 이벤트
        onDeleteBtnClick: (e) => {
            const length = selectionModel.length;

            if (length === 0) {
                msg = '삭제할 데이터가 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            msg = '삭제하시겠습니까?';
            setDialogCustomOpen(true);
            setDialogOkay('delete');
        },

        // 입고확정 버튼 이벤트
        onInputCompleteBtnClick: (e) => {
            if (sumList1.length === 0) {
                msg = '데이터가 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            msg = '입고확정하시겠습니까?';
            setDialogCustomOpen(true);
            setDialogOkay('complete');
        },

        // 경고메시지 팝업창 로드 - [확정 버튼 클릭시 FLAG 값이 "0"이 아닐때 경고메시지 팝업창]
        onInputCompelteFlagColumnNot0FormEntered: (e) => {
            const requestOption = getRequestOptions(
                PROC_PK_PDA_IV01_7_L,
                getRequestParam(tradingStatementRef.current.value, pda_plant_id)
            );

            setBackdropOpen(true);
            fetch(PDA_API_GENERAL_URL, requestOption)
                .then((res) => res.json())
                .then((data) => {
                    // 사용자 메시지 처리
                    if (data.returnUserMessage !== null) {
                        msg = data.returnUserMessage;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    }
                    // 결과 처리
                    else {
                        const tmpArray = JSON.parse(data.returnValue[0]);

                        setSumList2([
                            {
                                id: tmpArray[0]['LOT_NO'],
                                PART_ID: tmpArray[0]['품번'],
                                LOT_NO: tmpArray[0]['LOT_NO'],
                                QTY: tmpArray[0]['수량'],
                                INPUT_QTY: tmpArray[0]['입고'],
                            },
                        ]);
                    }
                    setBackdropOpen(false);
                })
                .catch((data) => {
                    msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                    setDialogOpen(true);
                    vibration();
                    setBackdropOpen(false);
                    return;
                });
        },

        // 경고메시지 팝업창 팝업창 입고화면 돌아가기 버튼 이벤트 - [확정 버튼 클릭시 FLAG 값이 "0"이 아닐때 경고메시지 팝업창]
        onUseInputCompelteFlagColumnNot0CloseClick: (e) => {
            setOpenInputCompelteFlagColumnNot0Form(false);
            setSumList2([]);
        },

        // 경고메시지 팝업창 팝업창 무시하고 확정 버튼 이벤트 - [확정 버튼 클릭시 FLAG 값이 "0"이 아닐때 경고메시지 팝업창]
        onUseInputCompelteFlagColumnNot0CompleteClick: (e) => {
            setOpenInputCompelteFlagColumnNot0Form(false);

            msg = '무시하고 확정합니다.';
            setDialogCustomOpen(true);
            setDialogOkay('inputCompelteFlagColumnNot0Complete');
            setSumList2([]);
        },
    };

    let columns1;
    let columns2;

    // DataGrid1 Header 컬럼 데이터
    columns1 = [
        { field: 'PART_ID', headerName: '품번', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'Lot No', width: 100, headerAlign: 'left', align: 'left' },
        { field: 'QTY', headerName: '수량', width: 70, headerAlign: 'right', align: 'right' },
        { field: 'LOCATION', headerName: '위치', width: 110, headerAlign: 'left', align: 'left' },
        { field: 'DATE', headerName: '일자', width: 90, headerAlign: 'left', align: 'left' },
    ];

    // DataGrid2 Header 컬럼 데이터
    columns2 = [
        { field: 'PART_ID', headerName: '품번', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'Lot No', width: 100, headerAlign: 'left', align: 'left' },
        { field: 'QTY', headerName: '수량', width: 70, headerAlign: 'right', align: 'right' },
        { field: 'INPUT_QTY', headerName: '입고', width: 70, headerAlign: 'right', align: 'right' },
    ];

    return (
        <>
            <div className={classes.root}>
                <AcsTextField
                    className={`${classes.marginRight} ${classes.marginBottom} ${classes.text}`}
                    label={'입고일자'}
                    id="txtInputDate"
                    type="date"
                    value={inDate}
                    endAdornment={<Clear />}
                    disabled={inputDateDisabled}
                    style={{ backgroundColor: inputDateDisabled ? colors.PLight : colors.white }}
                    onChange={eventhandler.onInputDateChange}
                />

                <AcsTextField
                    className={`${classes.marginBottom} ${classes.text}`}
                    label={'거래명세서'}
                    id="txtTradingStatement"
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={eventhandler.onBtnClearTradingStatement}
                                style={{ padding: '0px 7px 0px 0px', left: '15px', height: '20px' }}
                                disableRipple={true}
                                disableFocusRipple={true}
                            >
                                <Clear />
                            </IconButton>
                        ),
                        inputProps: {
                            ref: tradingStatementRef,
                        },
                    }}
                    disabled={tradingStatementDisabled}
                    style={{ backgroundColor: tradingStatementDisabled ? colors.PLight : colors.white }}
                    onKeyUp={eventhandler.onTradingStatementKeyUp}
                />
                <AcsTextField
                    className={`${classes.marginBottom} ${classes.text}`}
                    label={'부품표'}
                    id="txtPartBarcode"
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={eventhandler.onBtnClearPartBarcode}
                                style={{ padding: '0px 7px 0px 0px', left: '15px', height: '20px' }}
                                disableRipple={true}
                                disableFocusRipple={true}
                            >
                                <Clear />
                            </IconButton>
                        ),
                        inputProps: {
                            ref: partBarcodeRef,
                        },
                    }}
                    disabled={partBarcodeDisabled}
                    style={{ backgroundColor: partBarcodeDisabled ? colors.PLight : colors.white }}
                    onKeyUp={eventhandler.onPartBarcodeKeyUp}
                />
                <AcsTextField
                    className={`${classes.marginBottom} ${classes.half} ${classes.halfMargin}`}
                    label={'위치스캔'}
                    id="txtLocationScan"
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={eventhandler.onBtnClearLocationScan}
                                style={{ padding: '0px 7px 0px 0px', left: '15px', height: '20px' }}
                                disableRipple={true}
                                disableFocusRipple={true}
                            >
                                <Clear />
                            </IconButton>
                        ),
                        inputProps: {
                            ref: locationScanRef,
                        },
                    }}
                    onKeyUp={eventhandler.onPartLocationScanKeyUp}
                />
                <AcsTextField
                    className={`${classes.marginBottom} ${classes.half} ${classes.textDisabled}`}
                    label={'적재위치'}
                    id="txtLoadingPosition"
                    disabled
                    value={textLoadingPosition}
                />
                <AcsTextField
                    className={`${classes.marginBottom} ${classes.half} ${classes.halfMargin} ${classes.textDisabled}`}
                    label={'품목코드'}
                    id="txtPartId"
                    disabled
                    value={textPartId}
                />
                <AcsTextField
                    className={`${classes.marginBottom} ${classes.half} ${classes.textDisabled}`}
                    label={'Lot No'}
                    id="txtLotNo"
                    disabled
                    value={textLotNo}
                />
                <div className={`${classes.flexDiv}`}>
                    <AcsTextField
                        className={`${classes.marginRight} ${classes.textDisabled}`}
                        label={'총수량'}
                        id="txtTotalQty"
                        disabled
                        value={textTotalQty}
                    />
                    <AcsTextField
                        className={`${classes.textDisabled}`}
                        label={'입고수량'}
                        id="txtUnitQty"
                        disabled
                        value={textUnitQty}
                    />
                    <Clear style={{ margin: '10px 0px 0px 0px' }} />
                    <AcsTextField
                        label={'입고개수'}
                        id="txtInQty"
                        type="number"
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={eventhandler.onBtnClearBarcode}
                                    style={{ left: '10px', height: '20px', padding: '0px' }}
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                >
                                    <Clear />
                                </IconButton>
                            ),
                            inputProps: {
                                ref: inQtyRef,
                            },
                        }}
                    />
                    <AcsCheckBox
                        className={`${classes.checkBoxMargin}`}
                        label={'전체'}
                        id="checkbox_inQtyAll"
                        checked={inQtyAllChecked}
                        onChange={eventhandler.onCheckbox_inQtyAllChanged}
                    />
                </div>
                <div className={`${classes.flexDiv}`}>
                    <Button
                        className={`${classes.flexButton} ${classes.marginRight}`}
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: addListBtnDisabled ? 'lightgray' : '#f7b13d' }}
                        disabled={addListBtnDisabled}
                        onClick={eventhandler.onAddListBtnClick}
                    >
                        {'추가'}
                    </Button>
                    <Button
                        className={`${classes.flexButton} ${classes.marginRight}`}
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: 'gray' }}
                        onClick={eventhandler.onResetBtnClick}
                    >
                        {'정정'}
                    </Button>
                </div>
                <AcsDataGrid
                    className={`${classes.dataGridOdd} ${classes.dataGridMargin}`}
                    cols={columns1}
                    rows={sumList1}
                    height="150px"
                    checkboxSelection={true}
                    onSelectionModelChange={eventhandler.onSelectionModelChange}
                />
                <Button
                    className={`${classes.button} ${classes.half} ${classes.halfMargin}`}
                    fullWidth
                    variant="contained"
                    style={{ backgroundColor: 'gray' }}
                    onClick={eventhandler.onDeleteBtnClick}
                >
                    {'삭제'}
                </Button>
                <AcsBadgeButton
                    className={`${classes.button} ${classes.half}`}
                    badgeContent={sumList1.length}
                    fullWidth
                    variant="contained"
                    style={{ backgroundColor: '#f7b13d' }}
                    onClick={eventhandler.onInputCompleteBtnClick}
                >
                    {'입고확정'}
                </AcsBadgeButton>
                {/* 입고확정 버튼 클릭시 프로시저 실행 컬럼 FLAG 값이 "0"이 아닐때 띄우는 팝업창 */}
                <Dialog
                    className={`${classes.customDialog}`}
                    open={openInputCompelteFlagColumnNot0Form}
                    onEntered={eventhandler.onInputCompelteFlagColumnNot0FormEntered}
                >
                    <DialogTitle className={`${classes.customDialogTitle}`}>
                        {'거래명세서와 입고수량이 일치하지 않습니다.'}
                    </DialogTitle>
                    <div className={classes.customDialogRoot}>
                        <AcsDataGrid cols={columns2} rows={sumList2} height="250px"></AcsDataGrid>
                        <div className={`${classes.flexDiv}`}>
                            <Button
                                className={`${classes.flexButton} ${classes.marginRight}`}
                                fullWidth
                                variant="contained"
                                style={{ backgroundColor: 'gray' }}
                                onClick={eventhandler.onUseInputCompelteFlagColumnNot0CloseClick}
                            >
                                {'돌아가기'}
                            </Button>
                            <Button
                                className={`${classes.flexButton}`}
                                fullWidth
                                variant="contained"
                                style={{ backgroundColor: '#f7b13d' }}
                                onClick={eventhandler.onUseInputCompelteFlagColumnNot0CompleteClick}
                            >
                                {'무시하고 확정'}
                            </Button>
                        </div>
                    </div>
                </Dialog>

                {/* 메시지 박스 */}
                <AcsDialog message={msg} open={dialogOpen} handleClose={eventhandler.handleClose}></AcsDialog>

                {/* 메시지 박스 (CUSTOM) */}
                <AcsDialogCustom message={msg} open={dialogCustomOpen} handleClose={eventhandler.dialogOnCancel}>
                    <Button
                        onClick={eventhandler.dialogOnOkay}
                        style={{ backgroundColor: '#f7b13d', color: 'white' }}
                        fullWidth
                        variant="contained"
                    >
                        {'확인'}
                    </Button>
                </AcsDialogCustom>

                {/* 화면 대기 */}
                <Backdrop className={classes.backdrop} open={backdropOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </>
    );
}

export default MaterialInput_2P;
