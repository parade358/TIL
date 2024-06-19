import { useRef, useState, useEffect, useCallback } from 'react';
import AcsTextField from '../../components/acsTextField';
import {
    makeStyles,
    Button,
    MenuItem,
    Backdrop,
    CircularProgress,
    Select,
    colors,
    IconButton,
    Dialog,
    DialogTitle,
} from '@material-ui/core';
import AcsDataGrid from '../../components/acsDataGrid';
import COMMON_MESSAGE from '../../commons/message';
import AcsDialog from '../../components/acsDialog';
import AcsDialogCustom from '../../components/acsDialogCustom';
import { Clear } from '@material-ui/icons';
import AcsSelect from '../../components/acsSelect';

const PROC_PK_PDA_IV01_1_Init_D = 'U_PK_PDA_IV01_1_Init_D'; // 초기화
const PROC_PK_PDA_IV03_1_L = 'U_PK_PDA_IV03_1_L'; //출문증 체크
const PROC_PK_PDA_IV03_2_L = 'U_PK_PDA_IV03_2_L'; //입고표 체크
const PROC_PK_PDA_IV03_3_L = 'U_PK_PDA_IV03_3_L'; //품번 LotNo 번호 표시
const PROC_PK_PDA_IV03_4_L = 'U_PK_PDA_IV03_4_L'; //수량 표시
const PROC_PK_PDA_IV03_5_L = 'U_PK_PDA_IV03_5_L'; //위치 표시
const PROC_PK_PDA_IV03_1_S = 'U_PK_PDA_IV03_1_S'; //저장
const PROC_PK_PDA_IV03_1_D = 'U_PK_PDA_IV03_1_D'; //삭제
const PROC_PK_PDA_IV03_2_S = 'U_PK_PDA_IV03_2_S'; //입고확정
const PROC_PK_PDA_IV03_3_S = 'U_PK_PDA_IV03_3_S'; //입고시 수량 잔량 확인
let msg = '';
let substringValue;
let inv_id; // 부품표 스캔시 던져지는 매개변수
const PDA_API_GETDATE_URL = process.env.REACT_APP_PDA_API_GETDATE_URL;
const PDA_API_GENERAL_URL = process.env.REACT_APP_PDA_API_GENERAL_URL;

const useStyle = makeStyles((theme) => ({
    //스타일
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
    textDisabled: {
        '& .MuiInputBase-root.Mui-disabled': {
            backgroundColor: colors.PLight,
        },
    },
    widthMax: {
        width: '100%',
    },
    halfWidth: {
        width: '50%',
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
    form__select: {
        width: '100%',
        fontSize: '1.4rem',
    },
    select: {
        width: '100%',
        marginTop: '80px',
        marginBottom: '10px',
    },
    selectStorage: {
        width: '100%',
        marginTop: '10px',
    },
    marginBottom: {
        marginBottom: '10px',
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
        fontSize: localStorage.getItem('PDA_LANG') === 'K' ? '1rem' : '0.9rem',
        color: 'white',
    },
    activeTab: {
        fontSize: localStorage.getItem('PDA_LANG') === 'K' ? '1rem' : '0.9rem',
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
    flexButton: {
        color: 'white',
        textTransform: 'none',
        height: '50px',
    },
    dataGridOdd: {
        '& .MuiDataGrid-row.Mui-odd': {
            backgroundColor: 'Whitesmoke',
        },
    },
    dataGridMargin: {
        marginTop: '10px',
    },
    marginTop: {
        marginTop: '10px',
    },
    buttonHalf: {
        width: '60%',
    },
}));

// Request Param
function getRequestParam() {
    return [...arguments] //
        .map((el) => `'${el}'`)
        .join('&del;');
}

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

// PDA 진동
const vibration = () => {
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'VIBRATION' }));
    }
};

function TransferDefectiveStock() {
    const [dialogOpen, setDialogOpen] = useState(false); // 다이얼로그 (메시지창)
    const [dialogCustomOpen, setDialogCustomOpen] = useState(false); // 다이얼로그 (메시지창)
    const [dialogOkay, setDialogOkay] = useState(''); // 확인, 삭제 구분
    const classes = useStyle();
    const attendanceCardRef = useRef(''); // 출문증No Text
    const [attendanceCardDisabled, setAttendanceCardDisabled] = useState(false); // 출문증No Disabled
    const stockingTicketRef = useRef(''); // 입고표No Text
    const [stockingTicketDisabled, setStockingTicketRefDisabled] = useState(false); // 입고표No Disabled

    const [lotNo, setLotNo] = useState(''); // LotNo Text
    const [partId, setPartId] = useState(''); // 품번 Text
    const [partQty, setPartQty] = useState('0'); // 수량 Text
    const partinQtyRef = useRef(''); // 저장 Text
    const [selectedLocValue, setSelectedLocValue] = useState([
        {
            label: '',
            value: '',
        },
    ]); // 위치 value
    const selectedLocData = useRef(); // 위치 Data
    const [selectionModel, setSelectionModel] = useState([]); // 체크박스에 체크된 것들
    const [addListBtnDisabled, setAddListBtnDisabled] = useState(true); // 추가 버튼 Disabled
    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []); // WebView에서 받아온 데이터
    const scanLocationRef = useRef('tradingStatement'); // 바코드 스캔 위치
    const [sumList1, setSumList1] = useState([]); // 리스트 목록
    const [backdropOpen, setBackdropOpen] = useState(false); // 대기
    const pda_id = localStorage.getItem('PDA_ID'); // 사용자 ID
    const pda_plant_id = localStorage.getItem('PDA_PLANT_ID'); // 공장 ID
    const pda_mac_address = localStorage.getItem('PDA_MAC_ADDRESS'); // PDA Mac Address
    const [openInputCompelteFlagColumnNot0Form, setOpenInputCompelteFlagColumnNot0Form] = useState(false); // 경고메시지 다이얼로그 - [확정 버튼 클릭시 FLAG 값이 "0"이 아닐때 경고메시지 팝업창]
    const todayDateRef = useRef('');
    const lotListRef = useRef([]);

    //추가
    const saveData = (e) => {
        if (selectedLocValue[0].value === '' && selectedLocValue[0].name === '') {
            msg = '보관처 정보가 없습니다.';
            setDialogOpen(true);
            vibration();
            return;
        }
        if (
            attendanceCardRef.current.value === '' ||
            stockingTicketRef.current.value === '' ||
            partQty === '' ||
            partinQtyRef.current.value === ''
        ) {
            msg = '비어있는 항목이 있습니다.';
            console.log(pda_mac_address);
            setDialogOpen(true);
            vibration();
            return;
        } else {
            if (parseInt(partQty) < parseInt(partinQtyRef.current.value)) {
                msg = '입력한 수량이 총 수량보다 큽니다.';
                setDialogOpen(true);
                vibration();
                return;
            } else {
                const requestOption = getRequestOptions(
                    PROC_PK_PDA_IV03_1_S,
                    getRequestParam(
                        todayDateRef.current,
                        partId,
                        partQty,
                        lotNo,
                        selectedLocData.current,
                        attendanceCardRef.current.value,
                        stockingTicketRef.current.value,
                        pda_id,
                        pda_mac_address,
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
                        //에러 메시지 처리
                        else if (data.returnErrorMsg !== null) {
                            msg = data.returnErrorMsg;
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            return;
                        }
                        //결과 처리
                        else {
                            eventhandler.addItem();
                            reset();
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
    };

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
                todayDateRef.current =
                    data[0].value.substring(0, 4) +
                    '-' +
                    data[0].value.substring(5, 7) +
                    '-' +
                    data[0].value.substring(8, 10);
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

        return () => {
            // 쓰레기 데이터 존재하면 삭제
            initData();

            console.log('handle 지움');
            document.removeEventListener('message', onMessage);
        };
    }, []);

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
    //   이벤트
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
        } else if (type === 'SCANDATA') {
            const { scannedData, scannedLabelType, type } = JSON.parse(e.data);
            console.log('스캔한 바코드 = ' + scannedData.data);
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
            if (scanLocationRef.current === 'partList') {
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

                            for (let i = 0; inv_id.length; i++) {
                                substringValue = inv_id.substring(i, i + 1);

                                if (substringValue.toString() !== '0') {
                                    inv_id = inv_id.substring(i);
                                    barcodeInfo(scannedData.data.substring(17), scannedData.data, 'partList');
                                    if (
                                        stockingTicketRef.current.value !== '' &&
                                        attendanceCardRef.current.value !== ''
                                    ) {
                                        eventhandler.showname(scannedData.data.substring(17), inv_id);
                                        eventhandler.showqty(scannedData.data.substring(17), inv_id);
                                        eventhandler.showloc(inv_id);
                                    }

                                    return;
                                }
                            }
                        }
                    } else {
                        inv_id = scannedData.data.substring(3, 10);

                        for (let i = 0; inv_id.length; i++) {
                            substringValue = inv_id.substring(i, i + 1);

                            if (substringValue.toString() !== '0') {
                                inv_id = inv_id.substring(i);
                                barcodeInfo(scannedData.data.substring(17), scannedData.data, 'partList');
                                if (stockingTicketRef.current.value !== '' && attendanceCardRef.current.value !== '') {
                                    eventhandler.showname(scannedData.data.substring(17), inv_id);
                                    eventhandler.showqty(scannedData.data.substring(17), inv_id);
                                    eventhandler.showloc(inv_id);
                                }
                                return;
                            }
                        }
                    }
                } else {
                    msg = '부품표/입고표 바코드가 아닙니다.';
                    setDialogOpen(true);
                    vibration();
                    stockingTicketRef.current.value = '';

                    return;
                }
            }
        }
    };
    const barcodeInfo = (scanData, partBarcode, gubun) => {
        console.log('barcaodeInfo', gubun);
        // 거래명세서
        if (gubun === 'tradingStatement') {
            const requestOption = getRequestOptions(PROC_PK_PDA_IV03_1_L, getRequestParam(scanData, pda_plant_id));
            //거래명세서 체크
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
                        attendanceCardRef.current.value = '';

                        return;
                    }
                    //에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        attendanceCardRef.current.value = '';
                        return;
                    }
                    //결과 처리
                    else {
                        attendanceCardRef.current.value = scanData;
                        setAttendanceCardDisabled(true);
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
        } else if (gubun === 'partList') {
            const requestOption = getRequestOptions(
                PROC_PK_PDA_IV03_2_L,
                getRequestParam(attendanceCardRef.current.value, scanData, inv_id, pda_plant_id)
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
                        stockingTicketRef.current.value = '';

                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        stockingTicketRef.current.value = '';
                        return;
                    }
                    // 결과 처리
                    else {
                        stockingTicketRef.current.value = partBarcode;
                        setStockingTicketRefDisabled(true);
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
    const handleChange = (e) => {
        //문자 제거
        const inputText = e.target.value;
        const newText = inputText.replace(/[^0-9]/g, ''); // 숫자와 제어 문자 이외의 문자를 제거합니다.
        partinQtyRef.current.value = newText;
    };
    // 창고 위치
    const materialLocationArray = (obj) => {
        return obj.map((data) => ({
            value: data.LOC_ID,
            label: data.LOC_NAME,
        }));
    };
    const eventhandler = {
        handleClose: (e) => {
            setDialogOpen(false);
        },
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
                        PROC_PK_PDA_IV03_1_D,
                        getRequestParam(
                            sumList1[selectedIndex]['PART_ID'],
                            sumList1[selectedIndex]['QTY'],
                            sumList1[selectedIndex]['LOT_NO'],
                            sumList1[selectedIndex]['LOCATION'],
                            sumList1[selectedIndex]['DATE'],
                            pda_id,
                            pda_mac_address,
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
                            setBackdropOpen(false);
                        })
                        .catch((data) => {
                            msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            return;
                        });
                });
            } else if ('complete') {
                const requestOption = getRequestOptions(
                    PROC_PK_PDA_IV03_3_S,
                    getRequestParam(attendanceCardRef.current.value, pda_plant_id)
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
                                    PROC_PK_PDA_IV03_2_S,
                                    getRequestParam(
                                        todayDateRef.current,
                                        attendanceCardRef.current.value,
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
                                            reset();
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
            } // 무시하고 확정
            else {
                const requestOption = getRequestOptions(
                    PROC_PK_PDA_IV03_2_S,
                    getRequestParam(
                        todayDateRef.current,
                        attendanceCardRef.current.value,
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
                            reset();
                            setSumList1 = [];
                            attendanceCardRef.current.value = '';
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
        //정정
        frmReset: (e) => {
            if (sumList1.length > 0) {
                reset();
            } else {
                attendanceCardRef.current.value = '';
                reset();

                scanLocationRef.current = 'tradingStatement';
            }
        },

        //품번, LotNo, 위치 표시
        showname: (scanData, inv_id) => {
            const requestOption = getRequestOptions(PROC_PK_PDA_IV03_3_L, getRequestParam(inv_id, pda_plant_id));
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
                        setLotNo('');
                        setPartId(''); //reset

                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        setLotNo('');
                        setPartId('');
                        return;
                    }
                    // 결과 처리
                    else {
                        const tmpArray = JSON.parse(data.returnValue[0]);
                        setLotNo(scanData);
                        setPartId(tmpArray[0]['PART_ID']);
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
        //수량 표시
        showqty: (scanData, inv_id) => {
            const requestOption = getRequestOptions(
                PROC_PK_PDA_IV03_4_L,
                getRequestParam(attendanceCardRef.current.value, scanData, pda_plant_id, inv_id)
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
                        setPartQty('');

                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        setPartQty('');
                        return;
                    }
                    // 결과 처리
                    else {
                        const tmpArray = JSON.parse(data.returnValue[0]);
                        setPartQty(tmpArray[0]['IN_QTY']);
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
        //위치 표시
        showloc: (inv_id) => {
            const requestOption = getRequestOptions(PROC_PK_PDA_IV03_5_L, getRequestParam(inv_id, pda_plant_id));
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
                        setSelectedLocValue([]);
                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        setSelectedLocValue([]);
                        return;
                    }
                    // 결과 처리
                    else {
                        const tmpArray = JSON.parse(data.returnValue[0]);
                        const tmpMaterialLocationArray = materialLocationArray(tmpArray);
                        selectedLocData.current = tmpMaterialLocationArray;

                        if (tmpMaterialLocationArray.length > 0) {
                            setSelectedLocValue(tmpMaterialLocationArray[0]);
                        }
                        setAddListBtnDisabled(false);
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
        },
        //리스트 추가
        addItem: () => {
            setSumList1(
                [
                    {
                        id: stockingTicketRef.current.value,
                        PART_ID: partId,
                        QTY: partinQtyRef.current.value,
                        LOT_NO: lotNo,
                        LOCATION: selectedLocData.current,
                        DATE: todayDateRef.current,
                    },
                ],
                ...sumList1
            );
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
            } else {
            }
            msg = '입고확정하시겠습니까?';
            setDialogCustomOpen(true);
            setDialogOkay('complete');
        },
        // 출문증 X 버튼 이벤트
        onBtnClearAttendanceCard: (e) => {
            if (attendanceCardDisabled) {
                return;
            } else {
                attendanceCardRef.current.value = '';
                scanLocationRef.current = 'tradingStatement';
            }
        },
        // 출문증 키인
        onAttendanceCardKeyUp: (e) => {
            const scanData = e.target.value;
            console.log(scanData);
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
        // 입고표 X 버튼 이벤트
        onBtnClearStockingTicket: (e) => {
            if (attendanceCardDisabled) {
                return;
            } else {
                stockingTicketRef.current.value = '';
                scanLocationRef.current = 'partList';
            }
        },
        // 입고표 키인
        onStockingTicketKeyUp: (e) => {
            const scanData = e.target.value;
            if (e.keyCode === 13) {
                if (attendanceCardRef.current.value === '') {
                    msg = '거래명세서를 입력해주세요.';
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
                            msg = '유효한 부품표양식이 아닙니다.';
                            setDialogOpen(true);
                            vibration();
                            stockingTicketRef.current.value = '';
                            return;
                        }
                    }
                }
            }
        },
        // 위치 선택 이벤트
        onLocationChanged: (e) => {
            const tmpdata = selectedLocData.current.filter((data) => data.value === e.target.value);
            setSelectedLocValue(tmpdata[0]);
        },

        // 경고메시지 팝업창 팝업창 입고화면 돌아가기 버튼 이벤트 - [확정 버튼 클릭시 FLAG 값이 "0"이 아닐때 경고메시지 팝업창]
        onUseInputCompelteFlagColumnNot0CloseClick: (e) => {
            setOpenInputCompelteFlagColumnNot0Form(false);
        },

        // 경고메시지 팝업창 팝업창 무시하고 확정 버튼 이벤트 - [확정 버튼 클릭시 FLAG 값이 "0"이 아닐때 경고메시지 팝업창]
        onUseInputCompelteFlagColumnNot0CompleteClick: (e) => {
            setOpenInputCompelteFlagColumnNot0Form(false);

            msg = '무시하고 확정합니다.';
            setDialogCustomOpen(true);
            setDialogOkay();
        },
    };
    //dataGrid
    const columns1 = [
        { field: 'PART_ID', headerName: '품번', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'QTY', headerName: '수량', width: 100, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'Lot No', width: 70, headerAlign: 'right', align: 'right' },
        { field: 'LOCATION', headerName: '위치', width: 110, headerAlign: 'left', align: 'left' },
        { field: 'DATE', headerName: '일자', width: 90, headerAlign: 'left', align: 'left' },
    ];

    //정정
    const reset = (e) => {
        stockingTicketRef.current.value = '';
        setPartId('');
        setLotNo('');
        setPartQty('');
        selectedLocData.current = [];
        setSelectedLocValue([]);
    };
    return (
        <>
            <div className={classes.root}>
                {/*조직간이전불량입고*/}

                <AcsTextField
                    className={`${classes.marginBottom} ${classes.widthMax} ${classes.marginTop}`}
                    label={'출문증No'}
                    id="txtTransBCD"
                    type="text"
                    disabled={attendanceCardDisabled}
                    style={{ backgroundColor: attendanceCardDisabled ? colors.PLight : colors.white }}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={eventhandler.onBtnClearAttendanceCard}
                                style={{ padding: '0px 7px 0px 0px', left: '15px', height: '20px' }}
                                disableRipple={true}
                                disableFocusRipple={true}
                            >
                                <Clear />
                            </IconButton>
                        ),
                        inputProps: {
                            ref: attendanceCardRef,
                        },
                    }}
                    onKeyUp={eventhandler.onAttendanceCardKeyUp}
                />
                <AcsTextField
                    className={`${classes.marginBottom} ${classes.widthMax} `}
                    label={'입고표No'}
                    type="text"
                    id="txtPartBCD"
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={eventhandler.onBtnClearStockingTicket}
                                style={{ padding: '0px 7px 0px 0px', left: '15px', height: '20px' }}
                                disableRipple={true}
                                disableFocusRipple={true}
                            >
                                <Clear />
                            </IconButton>
                        ),
                        inputProps: {
                            ref: stockingTicketRef,
                        },
                    }}
                    disabled={stockingTicketDisabled}
                    style={{ backgroundColor: stockingTicketDisabled ? colors.PLight : colors.white }}
                    onKeyUp={eventhandler.onStockingTicketKeyUp}
                />

                <AcsTextField
                    className={`${classes.marginBottom} ${classes.halfWidth} `}
                    label={'품번'}
                    id="txtPartID"
                    value={partId}
                    disabled
                />
                <AcsTextField
                    className={`${classes.marginBottom} ${classes.halfWidth} `}
                    label={'LotNo'}
                    id="txtLotno"
                    value={lotNo}
                    disabled
                />

                <AcsTextField
                    className={`${classes.marginBottom} ${classes.halfWidth} `}
                    label={'수량(총)'}
                    id="txtPartQty"
                    value={partQty}
                    disabled
                />
                <AcsTextField
                    className={`${classes.marginBottom} ${classes.halfWidth} `}
                    label={'수량(저장)'}
                    id="txtPartinQty"
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
                            ref: partinQtyRef,
                        },
                    }}
                    onChange={handleChange}
                />

                <AcsSelect
                    labelText={'위치'}
                    id="txtLocation"
                    data={selectedLocData.current}
                    value={selectedLocValue.value}
                    className={`${classes.form__select}${classes.marginBottom}`}
                    style={{ width: '100.4%' }}
                    MenuProps={{
                        style: {
                            height: '400px',
                        },
                    }}
                    onChange={eventhandler.onLocationChanged}
                ></AcsSelect>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    name="insertBtn"
                    style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        width: '49.9%',
                        marginTop: '10px',
                        marginRight: '3px',
                        backgroundColor: addListBtnDisabled ? 'lightgray' : '#f7b13d',
                    }}
                    disabled={addListBtnDisabled}
                    onClick={saveData}
                >
                    추가
                </Button>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    name="updateBtn"
                    style={{
                        backgroundColor: 'gray',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        width: '49.9%',
                        marginTop: '10px',
                    }}
                    onClick={eventhandler.frmReset}
                >
                    정정
                </Button>
                <AcsDataGrid
                    className={`${classes.dataGridOdd} ${classes.dataGridMargin}`}
                    cols={columns1}
                    rows={sumList1}
                    checkboxSelection={true}
                    onSelectionModelChange={eventhandler.onSelectionModelChange}
                ></AcsDataGrid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    name="checkDeleteBtn"
                    style={{
                        backgroundColor: '#f7b13d',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        width: '49.9%',
                        marginTop: '10px',
                        marginRight: '3px',
                    }}
                    onClick={eventhandler.onDeleteBtnClick}
                >
                    선택삭제
                </Button>
                <Button
                    badgeContent={sumList1.length}
                    type="submit"
                    fullWidth
                    variant="contained"
                    name="okErrorBtn"
                    style={{
                        backgroundColor: '#f7b13d',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        width: '49.9%',
                        marginTop: '10px',
                    }}
                    onClick={eventhandler.onInputCompleteBtnClick}
                >
                    불량입고확정
                </Button>

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
                {/* 입고확정 버튼 클릭시 프로시저 실행 컬럼 FLAG 값이 "0"이 아닐때 띄우는 팝업창 */}
                <Dialog className={`${classes.customDialog}`} open={openInputCompelteFlagColumnNot0Form}>
                    <DialogTitle className={`${classes.customDialogTitle}`}>
                        {
                            '입고되지 않은 잔량이 존재합니다. 입고확정하면 이 출문증으로는 더 이상 입고할 수 없습니다. 입고확정하시겠습니까?'
                        }
                    </DialogTitle>
                    <div className={classes.customDialogRoot}>
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
                {/* 화면 대기 */}
                <Backdrop className={classes.backdrop} open={backdropOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </>
    );
}

export default TransferDefectiveStock;
