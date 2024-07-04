import { Backdrop, Button, CircularProgress, IconButton, Tab, Tabs, makeStyles } from '@material-ui/core';
import AcsCheckBox from '../../components/acsCheckBox';
import AcsSelect from '../../components/acsSelect';
import AcsTabPanel from '../../components/acsTabPanel';
import AcsTextField from '../../components/acsTextField';
import AcsDataGrid from '../../components/acsDataGrid';
import AcsBadgeButton from '../../components/acsBadgeButton';
import AcsDialog from '../../components/acsDialog';
import AcsDialogCustom from '../../components/acsDialogCustom';
import { useCallback, useEffect, useRef, useState } from 'react';
import COMMON_MESSAGE from '../../commons/message';
import { Clear } from '@material-ui/icons';
import colors from '../../commons/colors';

const PROC_PK_PDA_DV02_2_D              = 'U_PK_PDA_DV02_2_D';              // 초기화
const PROC_PK_PDA_DV02_1_L              = 'U_PK_PDA_DV02_1_L';              // 출하처 목록 조회
const PROC_PK_PDA_DV08_2_L              = 'U_PK_PDA_DV08_2_L';              //품목정보 표시
const PROC_PK_PDA_DV08_1_S              = 'U_PK_PDA_DV08_1_S';              //목록저장
const PROC_PK_PDA_DV02_1_D              = 'U_PK_PDA_DV02_1_D';              //목록 선택삭제
const PROC_PK_PDA_DV08_2_WITH_FLAG_S    = 'U_PK_PDA_DV08_2_WITH_FLAG_S';    //확정
const PROC_PK_PDA_DV02_3_L              = 'U_PK_PDA_DV02_3_L';              //출문증재발행 조회
const PROC_PK_PDA_DV01_5_L              = 'U_PK_PDA_DV01_5_L';              //출문증 세부조회
const PROC_PK_PDA_DV02_4_S              = 'U_PK_PDA_DV02_4_S';              //출문증 업데이트

const PDA_API_GENERAL_URL = process.env.REACT_APP_PDA_API_GENERAL_URL;
const PDA_API_GETDATE_URL = process.env.REACT_APP_PDA_API_GETDATE_URL;

let msg = '';
let printFlag = 'N';

const useStyle = makeStyles((theme) => ({
    root: {
        margin: '80px 10px 10px 10px',
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
    textDisabled: {
        '& .MuiInputBase-root.Mui-disabled': {
            backgroundColor: colors.PLight,
        },
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
    marginBottom: {
        marginBottom: '10px',
    },
    marginRight: {
        marginRight: '3px',
    },
    flexDiv: {
        display: 'flex',
        marginTop: '0px',
    },
    checkBoxMargin: {
        '& .MuiTypography-body1': {
            width: '100%',
        },
        margin: '0px',
    },
    selectMargin: {
        marginRight: '0px',
    },
    half: {
        width: '49.9%',
        marginTop: '10px',
    },
    halfMargin: {
        marginRight: '3px',
    },
    threeHalf: {
        width: '32.7%',
        marginTop: '10px',
    },
    threeHalfMargin: {
        marginRight: '3px',
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
        fontSize: localStorage.getItem('PDA_LANG') === 'K' ? '1rem' : '0.8rem',
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
    flexButton: {
        color: 'white',
        textTransform: 'none',
        height: '50px',
    },
    useCloseButton: {
        marginTop: '5px',
        color: 'white',
    },
    useReflectionButton: {
        color: 'white',
        marginTop: '5px',
    },
    dataGrid1: {
        '& .dataGridRowBackgroudColor': {
            backgroundColor: 'yellow',
        },
        '& .dataGridRowBackgroudColor.Mui-selected': {
            backgroundColor: '#FAEC8C',
        },
        '& .dataGridRowBackgroudColor.Mui-selected:hover': {
            backgroundColor: '#FAEC8C',
        },
        '& .dataGridRowBackgroudColor:hover': {
            backgroundColor: 'yellow',
        },
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

// 날짜 '-' 자르기
function transDateSplitArray(date) {
    const transDateArray = date.split('-');
    return transDateArray[0] + transDateArray[1] + transDateArray[2];
};

// DB 보내기전 파라미터 생성
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

// 구분자 생성
function getRequestParam() {
    return [...arguments] //
        .map((el) => `'${el}'`)
        .join('&del;');
};

function ShipmentOutSideAuto() {

    const classes = useStyle(); // CSS 스타일
    const [tabsValue, setTabsValue] = useState(0); // Tabs 구분
    const [, updateState] = useState(); // forceUpdate
    const forceUpdate = useCallback(() => updateState({}), []); // forceUpdate
    const pda_id = localStorage.getItem('PDA_ID'); // 사용자 ID
    const [dialogOkay, setDialogOkay] = useState(''); // 확인, 삭제 구분
    const [dialogCustomOpen, setDialogCustomOpen] = useState(false); // 다이얼로그 커스텀 (메시지창)
    const [dialogCustomrRestOpen, setDialogCustomrResetOpen] = useState(false); // 다이얼로그 커스텀 (메시지창) - 이동 탭에서 이동 진행 중인 품번이 있을 경우 초기화 여부 묻는 Dialog
    const [dialogCustomrPrintFlagOpen, setDialogCustomPrintFlagOpen] = useState(false); // 다이얼로그 커스텀 (메시지창) - 출하 탭에서 출하확정을 누른 후 발행 여부 묻는 Dialog
    const [selectionModel, setSelectionModel] = useState([]); // 체크박스에 체크된 것들
    const tabsValueRef = useRef(0);
    const onMessageGubunRef = useRef('바코드현재창고'); // WebView로 데이터 요청 후 작업에 대한 구분
    const [dialogOpen, setDialogOpen] = useState(false); // 다이얼로그 (메시지창)
    const [backdropOpen, setBackdropOpen] = useState(false); // 대기
    const pda_mac_address = localStorage.getItem('PDA_MAC_ADDRESS'); // PDA Mac Address
    const nowDateRef = useRef(''); // 이동일자 Text
    const pda_plant_id = localStorage.getItem('PDA_PLANT_ID'); // 공장 ID

    const stockingTicketRef = useRef(''); // 입고표No Text
    const [stockingTicketDisabled, setStockingTicketRefDisabled] = useState(false); // 입고표No Disabled
    const [currPos, setCurrPos] = useState(''); // 현재위치
    const [procNo, setProcNo] = useState(''); // 품번
    const [lotNo, setLotNo] = useState(''); // LotNo
    const [totCnt, setTotCnt] = useState(0); // 총 수량
    const [shipmentCnt, setShipmentCnt] = useState(0); // 출하 양
    const shipmentQtyRef = useRef(''); // 출하개수 Text
    
    const handleChange = (event, newValue) => {
        // if (tabsValue === 1) {
        //     onMessageGubunRef.current = '이동일자변경';
        //     // webView 데이터 요청
        //     webViewPostMessage();
        // }
        setTabsValue(newValue);
    };

    const [selectedComboBoxBarcodeCurrentStorage, setSelectedComboBoxBarcodeCurrentStorage] = useState({
        value: '',
        label: '',
    }); // 선택된 현재창고 comboBox

    const comboBoxBarcodeCurrentStorageRef = useRef([]); // 현재창고 ComboBox
    const [moveQtyAllCheck, setMoveQtyAllCheck] = useState(false); // 체크박스 체크여부 
    const [sumList1, setSumList1] = useState([]); // 리스트 목록
    const sumList1Ref = useRef([]); // 리스트 목록 Ref
    const moveDateRef = useRef(''); // 이동일자 Text Ref
    const lotListRef = useRef([]);
    const [addListBtnDisabled, setAddListBtnDisabled] = useState(true); // 추가 버튼 Disabled
    const [sumList2, setSumList2] = useState([]); // 리스트 목록
    const selectedReissueShipmentNumberRef = useRef(''); // 출문증재발행 리스트 목록 1에서 선택한 출하번호
    const [sumList3, setSumList3] = useState([]); // 리스트 목록
    const [reissueBtnDisabled, setReissueBtnDisabled] = useState(true); // 재발행 버튼 Disabled

    // PDA 진동
    const vibration = () => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'VIBRATION' }));
        }
    };

    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []); // WebView에서 받아온 데이터

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
                nowDateRef.current =
                    data[0].value.substring(0, 4) +
                    '-' +
                    data[0].value.substring(5, 7) +
                    '-' +
                    data[0].value.substring(8, 10);
                moveDateRef.current =
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

        document.addEventListener('message', onMessage);
        // 쓰레기 데이터 존재하면 삭제
        initData();
        loadCurrentStorage();
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
    const initData = () => {
        const requestOption = getRequestOptions(PROC_PK_PDA_DV02_2_D, getRequestParam(pda_mac_address, pda_id));

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
    // webView 데이터 요청
    const webViewPostMessage = () => {
        // React Native WebView로 Wifi 신호 강도 데이터 요청
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GET_WIFI_CURRENT_SIGNAL_STRENGTH' }));
        }
    };

    // WebView에서 스캔 데이터 받는 이벤트
    useEffect(() => {
        document.addEventListener('message', onMessage);

        // webView 데이터 요청
        webViewPostMessage();

        return () => {
            console.log('handle 지움');
            document.removeEventListener('message', onMessage);
        };
    }, []);


    const ReadData = (e) => {

        const type = JSON.parse(e.data).type;

        console.log('ReadData : ', type);

        // Wifi 신호 강도 불러오기
        if (type === 'GET_WIFI_CURRENT_SIGNAL_STRENGTH') {
            const { wifiCurrentSignalStrength, type } = JSON.parse(e.data);
            console.log('Wifi 신호 강도 [조직간이전출하]', wifiCurrentSignalStrength);
            console.log(onMessageGubunRef.current);

            // wifi 신호가 약할때
            if (wifiCurrentSignalStrength <= -85) {
                msg = '무선랜 신호가 약하거나 끊겼습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }

            // wifi 신호가 정상일때
            else {
                // 출하 Tabs
                if (tabsValueRef.current === 0) {
                    if (onMessageGubunRef.current === '바코드현재창고') {
                        // 현재창고 조회
                        loadCurrentStorage();
                    } else if (onMessageGubunRef.current === '출하확정') {
                        // 출하 확정
                        shipComplete();
                    } else if (onMessageGubunRef.current === '리스트추가') {
                        // 리스트에 데이터 추가
                        saveDataAddDataList();
                    }
                } else {
                    if (onMessageGubunRef.current === '재발행') {
                        // 재발행
                        printReissuanceOfPassport();
                    } else if (onMessageGubunRef.current === '출문증재발행리스트클릭') {
                        // 출문증 세부목록조회
                        onLoadOutPageDetailData();
                    } else if (onMessageGubunRef.current === '이동일자변경') {
                        // 출문증재발행리스트 조회
                        loadProcessHistoryData();
                    }
                }
            }
        }
        // 바코드 스캔시 이벤트
        else if (type === 'SCANDATA') {
            const { scannedData, scannedLabelType, type } = JSON.parse(e.data);
            console.log('스캔한 바코드 = ' + scannedData.data);
            stockingTicketRef.current.value = scannedData.data;
            // 바코드 Tabs
            if (tabsValueRef.current === 0) {
                if (scannedData.data === '') {
                    msg = '바코드를 스캔하세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (scannedData.data.length !== 25) {
                    msg = '올바른 바코드 형식이 아닙니다.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                stockingTicketRef.current.value = scannedData.data;
                barcodeInfo(stockingTicketRef.current.value);
            }
        }
    };




    // 바코드 Tabs 바코드 스캔
    const barcodeInfo = (scanData) => {
        let barcode = scanData.toString();
        let substringValue;
        let Unit_qty = scanData.toString().substring(10, 7);

        if (scanData.length === 25) {
            for (let i = 0; Unit_qty.length; i++) {
                substringValue = Unit_qty.substring(i, i + 1);

                if (substringValue.toString() !== '0') {
                    Unit_qty = Unit_qty.substring(i);
                    break;
                }
            }
        }

        const requestOption = getRequestOptions(PROC_PK_PDA_DV08_2_L, getRequestParam(barcode, pda_plant_id));

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
                    reset('reset');
                    return;
                }
                // 에러 메시지 처리
                else if (data.returnErrorMsg !== null) {
                    msg = data.returnErrorMsg;
                    setDialogOpen(true);
                    vibration();
                    setBackdropOpen(false);
                    reset('reset');
                    return;
                }
                // 결과 처리
                else {
                    const tmpArray = JSON.parse(data.returnValue[0]);

                    console.log(tmpArray);

                    setCurrPos(tmpArray[0]['SUB_LOCATION_ID']);
                    setProcNo(tmpArray[0]['PART_ID']);
                    setLotNo(tmpArray[0]['LOT_NO']);
                    setTotCnt(parseInt(tmpArray[0]['INV_QTY']));
                    setShipmentCnt(Unit_qty);
                    shipmentQtyRef.current.value = '1';
                    setAddListBtnDisabled(false);
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
    };
    // 처리이력 조회
    const loadProcessHistoryData = () => {
        let moveDate = transDateSplitArray(moveDateRef.current);
        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV02_3_L,
            getRequestParam(moveDate, pda_mac_address, pda_id, pda_plant_id)
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

                    console.log(tmpArray);

                    let sumArray = [];

                    if (
                        tmpArray[0]['출고처'] === '' &&
                        tmpArray[0]['출고일'] === '' &&
                        tmpArray[0]['출고량'] === '' &&
                        tmpArray[0]['출고번호'] === ''
                    ) {
                        msg = '지정한 날짜에 대한 처리이력이 없습니다.';
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    }
                    sumArray = tmpArray.map((data) => ({
                        id: data.출고번호,
                        ShipFrom: data.출고처,
                        ShipDate: data.출고일,
                        ShipCnt: data.출고량,
                        ShipNo: data.출고번호,
                    }));

                    setSumList2(sumArray);
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
    };
    // 재발행
    const printReissuanceOfPassport = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV02_4_S,
            getRequestParam(selectedReissueShipmentNumberRef.current, pda_plant_id)
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
                    msg = '출문증이 발행되었습니다.';
                    setDialogOpen(true);
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
    // 현재창고 조회
    const loadCurrentStorage = () => {
        const requestOption = getRequestOptions(PROC_PK_PDA_DV02_1_L, getRequestParam(pda_plant_id));

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

                    const tmpCurrentStorageArray = currentStorageArray(tmpArray);

                    if (tabsValueRef.current === 0) {
                        comboBoxBarcodeCurrentStorageRef.current = tmpCurrentStorageArray;

                        if (tmpCurrentStorageArray.length > 0) {
                            setSelectedComboBoxBarcodeCurrentStorage(tmpCurrentStorageArray[0]);
                        }
                    }
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
    };
    // 현재창고 배열
    const currentStorageArray = (obj) => {
        return obj.map((data) => ({
            label: data.LOC_NAME,
            value: data.LOC_ID,
        }));
    };
    //저장 = 목록저장 + 리스트뷰 추가
    const saveDataAddDataList = () => {
        let in_qty = 0;
        let todo = 0;
        let to_loc_id;
        // 전체 체크박스 체크가 아닐시
        if (moveQtyAllCheck === false) {
            if (shipmentCnt !== '' && shipmentQtyRef.current.value !== '') {
                in_qty = parseInt(shipmentCnt) * parseInt(shipmentQtyRef.current.value);
            }
            // 수량이 0일때
            else {
                msg = '수량을 입력하거나 전체를 선택하세요.';
                setDialogOpen(true);
                vibration();
                return;
            }
        }
        // 전체 체크박스 체크시
        else if (moveQtyAllCheck === true) {
            // 총 수량이 0이 아닐 시
            if (totCnt !== 0) {
                in_qty = totCnt;
            }
            // 총 수량이 0일 때
            else {
                msg = '스캔된 수량이 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
        }
        if (
            stockingTicketRef.current.value === '' ||
            currPos === '' ||
            procNo === '' ||
            lotNo === '' ||
            totCnt === 0 ||
            in_qty === 0
        ) {
            msg = '비어있는 항목이 있습니다.';
            setDialogOpen(true);
            vibration();
            return;
        } else {
            if (totCnt < in_qty) {
                msg = '입력한 수량이 총 수량보다 큽니다.';
                setDialogOpen(true);
                vibration();
                shipmentQtyRef.current.value = 0;
                todo = 1;
                return;
            } else {
                //기존 저장된 현재위치와 새로 저장할 현재위치가 같거나, 기존 저장된 이동위치와 저장될 이동위치가 다르면 쳐냄
                if (sumList1.length > 0) {
                    for (let i = 0; i < sumList1.length; i++) {
                        to_loc_id = sumList1[i]['ShipFrom'];
                        if (to_loc_id != selectedComboBoxBarcodeCurrentStorage.value) {
                            console.log(selectedComboBoxBarcodeCurrentStorage.value, to_loc_id);
                            msg = '저장된 출하처와 다른 출하처입니다.';
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            reset('reset');
                            todo = 1;
                            break;
                        }
                    }
                }
                if (todo === 0) {
                    let transNowDate = transDateSplitArray(nowDateRef.current);

                    const requestOption = getRequestOptions(
                        PROC_PK_PDA_DV08_1_S,
                        getRequestParam(
                            transNowDate,
                            currPos,
                            selectedComboBoxBarcodeCurrentStorage.value,
                            lotNo,
                            procNo,
                            in_qty,
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
                                let from_loc_id; // 현재위치
                                let from_lot_no; //목록에 있는 lot
                                let from_part_id; //목록에 있는 part_id
                                let issame = false;

                                for (let i = 0; i < sumList1.length; i++) {
                                    console.log(sumList1.length);
                                    from_loc_id = sumList1[i]['CurrPos'];
                                    from_lot_no = sumList1[i]['LotNo'];
                                    from_part_id = sumList1[i]['ProdNo'];
                                    if (from_loc_id == currPos && from_lot_no == lotNo && from_part_id == procNo) {
                                        //수량만 올려줌
                                        let pre = sumList1[i]['ShipCnt'];
                                        let after = parseInt(pre) + parseInt(in_qty);
                                        sumList1[i]['ShipCnt'] = after.toString();

                                        issame = true; //같은게 있음.
                                    }
                                }
                                if (!issame) {
                                    //FROM 위치와 LOT NO랑 PART_ID가 같은 값이 없다면
                                    setSumList1([
                                        {
                                            id: stockingTicketRef.current.value,
                                            ProdNo: procNo,
                                            LotNo: lotNo,
                                            ShipCnt: in_qty,
                                            CurrPos: currPos,
                                            ShipFrom: selectedComboBoxBarcodeCurrentStorage.value,
                                        },
                                        ...sumList1,
                                    ]);

                                    lotListRef.current = [
                                        {
                                            BARCODE: stockingTicketRef.current.value,
                                        },
                                        ...lotListRef.current,
                                    ];
                                }
                                reset('reset');
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
        }
    };
    // 출하확정
    const shipComplete = () => {
        let transNowDate = transDateSplitArray(nowDateRef.current);
        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV08_2_WITH_FLAG_S,
            getRequestParam(transNowDate, pda_mac_address, pda_id, pda_plant_id, sumList1[0]['ShipFrom'], printFlag)
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
                    msg = '출하확정이 완료되었습니다.';
                    setDialogOpen(true);
                    setBackdropOpen(false);
                    setSumList1([]);
                    reset('reset');
                    printFlag = 'N';
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
    const reset = (gubun) => {
        if (gubun === 'reset') {
            stockingTicketRef.current.value = '';
            setCurrPos('');
            setProcNo('');
            setLotNo('');
            setTotCnt(0);
            setShipmentCnt('0');
            shipmentQtyRef.current.value = '0';
            setStockingTicketRefDisabled(false);
        }
    };
    // 출문증 재발행 데이터 있을시 재발행 버튼 활성화 - [출문증 재발행]
    useEffect(() => {
        if (sumList3.length > 0) {
            setReissueBtnDisabled(false);
        }
    }, [sumList3]);
    //출문증 세부목록조회
    const onLoadOutPageDetailData = (e) => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV01_5_L,
            getRequestParam(selectedReissueShipmentNumberRef.current, pda_plant_id)
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
                    setSumList3([
                        {
                            id: tmpArray[0]['품번'],
                            ProdNo: tmpArray[0]['품번'],
                            LotNo: tmpArray[0]['LOT_No'],
                            Cnt: tmpArray[0]['수량'],
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
    };
    const eventhandler = {
        // 입고창고 변경 이벤트
        onBarcodeCurrentStorageChange: (e) => {
            const tmpdata = comboBoxBarcodeCurrentStorageRef.current.filter((data) => data.value === e.target.value);
            setSelectedComboBoxBarcodeCurrentStorage(tmpdata[0]);
        },
        // 입고표 X 버튼 이벤트
        onBtnClearTradingStatement: (e) => {
            if (stockingTicketDisabled) {
                return;
            } else {
                stockingTicketRef.current.value = '';
            }
        },
        // 입고표 바코드 키인 이벤트
        onBarcodeKeyUp: (e) => {
            const scanData = e.target.value;
            console.log(e.keyCode);
            if (e.keyCode === 13) {
                if (scanData === '') {
                    msg = '바코드를 스캔하세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (scanData.length !== 25) {
                    msg = '올바른 바코드 형식이 아닙니다.';
                    setDialogOpen(true);
                    vibration();
                    return;
                } else {
                    stockingTicketRef.current.value = scanData;
                    barcodeInfo(stockingTicketRef.current.value);
                }
            }
        },
        // 출하개수 X 버튼 이벤트
        onBtnClearShipmentQty: (e) => {
            shipmentQtyRef.current.value = '';
        },
        // 체크박스 전체 클릭 이벤트
        clickCheckbox: (e, check) => {
            console.log(check);
            if (check) {
                setMoveQtyAllCheck(true);
            } else {
                setMoveQtyAllCheck(false);
            }
        },
        // 저장 버튼 이벤트
        onAddlistBtnClick: (e) => {
            onMessageGubunRef.current = '리스트추가';
            // webView 데이터 요청
            webViewPostMessage();
        },
        //정정 버튼
        onResetBtnClick: (e) => {
            reset('reset');
        },
        // 리스트에서 행 선택시 이벤트
        onSelectionModelChange: (e) => {
            setSelectionModel([...e.selectionModel]);
        },

        //삭제 버튼
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
        // 다이얼로그 커스텀 확인 이벤트
        dialogOnOkay: (e) => {
            setDialogCustomOpen(false);
            setDialogCustomrResetOpen(false);
            // 삭제

            if (dialogOkay === 'delete') {
                selectionModel.forEach((selected) => {
                    let selectedIndex = sumList1.findIndex((data) => selected === data.id);
                    let transNowDate = transDateSplitArray(nowDateRef.current);

                    const requestOption = getRequestOptions(
                        PROC_PK_PDA_DV02_1_D,
                        getRequestParam(
                            transNowDate,
                            sumList1[selectedIndex]['CurrPos'],
                            sumList1[selectedIndex]['ShipFrom'],
                            sumList1[selectedIndex]['LotNo'],
                            sumList1[selectedIndex]['ProdNo'],
                            sumList1[selectedIndex]['ShipCnt'],
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
            } // 이동 탭 이동확정
            else if (dialogOkay === 'ShipComplete') {
                onMessageGubunRef.current = '출하확정';
                // webView 데이터 요청
                webViewPostMessage();
            } else if (dialogOkay === '재발행') {
                onMessageGubunRef.current = '재발행';
                // webView 데이터 요청
                webViewPostMessage();
            }
        },
        handleClose: (e) => {
            setDialogOpen(false);
        },
        // 다이얼로그 커스텀 닫기 이벤트
        dialogOnCancel: (e) => {
            setDialogCustomPrintFlagOpen(false);
            setDialogCustomOpen(false);
            setDialogCustomrResetOpen(false);
            setDialogOkay('');
        },
        // 출하 확정 이벤트
        onShipComplete: (e) => {
            if (sumList1.length === 0) {
                msg = '데이터가 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            msg = '출하 확정합니다.';
            setDialogCustomOpen(true);
            setDialogOkay('ShipComplete');
        },
        // 출하확정 발행 버튼 이벤트
        onShipmentPrintFlagBtnClick: (e) => {
            msg = '출문증을 발행하면서 제품 출하를 확정하시겠습니까?';
            setDialogCustomPrintFlagOpen(true);
        }, // 다이얼로그 발행 예(Y) 버튼
        dialogPrintFlagOkay: (e) => {
            printFlag = 'Y';
            eventhandler.onShipComplete();
            setDialogCustomPrintFlagOpen(false);
        },
        // 다이얼로그 발행 아니요(N) 버튼
        dialogPrintFlagNo: (e) => {
            printFlag = 'N';
            eventhandler.onShipComplete();
            setDialogCustomPrintFlagOpen(false);
        },
        //-------------재발행 탭----------------------------------
        // 이동일자 변경시 이벤트
        onMoveDateChange: (e) => {
            moveDateRef.current = e.target.value;
            forceUpdate();

            setSumList2([]);
            onMessageGubunRef.current = '이동일자변경';
            // webView 데이터 요청
            webViewPostMessage();
        },
        // 리스트6 에서 한 행을 체크시 이벤트
        onReissueShipmentDateRowSelected: (e) => {
            selectedReissueShipmentNumberRef.current = e.data['id'];
            onMessageGubunRef.current = '출문증재발행리스트클릭';
            // webView 데이터 요청
            webViewPostMessage();
        },

        // 재발행 버튼 이벤트
        onReissueBtnClick: (e) => {
            if (sumList2.length === 0) {
                msg = '발행할 데이터가 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            msg = '재발행하시겠습니까?';
            setDialogCustomOpen(true);
            setDialogOkay('재발행');
        },
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
    let columns1;
    let columns2;
    let columns3;

    columns1 = [
        { field: 'ProdNo', headerName: '품번', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'LotNo', headerName: 'LOT NO', width: 140, headerAlign: 'center', align: 'center' },
        { field: 'ShipCnt', headerName: '출고량', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'CurrPos', headerName: '현재위치', width: 160, headerAlign: 'center', align: 'center' },
        { field: 'ShipFrom', headerName: '이동위치', width: 100, headerAlign: 'center', align: 'center' },
    ];
    columns2 = [
        { field: 'ShipFrom', headerName: '출고처', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'ShipDate', headerName: '출고일', width: 140, headerAlign: 'center', align: 'center' },
        { field: 'ShipCnt', headerName: '출고량', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'ShipNo', headerName: '출고번호', width: 160, headerAlign: 'center', align: 'center' },
    ];
    columns3 = [
        { field: 'ProdNo', headerName: '품번', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'LotNo', headerName: 'LOT NO', width: 140, headerAlign: 'center', align: 'center' },
        { field: 'Cnt', headerName: '수량', width: 100, headerAlign: 'center', align: 'center' },
    ];

    return (
        <>
            <div className={classes.root}>
                {/* 출하 */}
                <AcsTabPanel value={tabsValue} index={0}>
                    <AcsSelect
                        className={`${classes.marginBottom}`}
                        labelText={'입고처'}
                        id="cmbInputWH"
                        style={{ width: '100.4%' }}
                        backgroundColor={colors.white}
                        data={comboBoxBarcodeCurrentStorageRef.current}
                        value={selectedComboBoxBarcodeCurrentStorage.value}
                        MenuProps={{
                            style: {
                                height: '400px',
                            },
                        }}
                        onChange={eventhandler.onBarcodeCurrentStorageChange}
                    />
                    <AcsTextField
                        classes={`${classes.marginBottom}${classes.text}`}
                        label={'입고표바코드'}
                        id="txtInputBarcode"
                        type="text"
                        disabled={stockingTicketDisabled}
                        style={{
                            width: '100%',
                            marginBottom: '10px',
                            backgroundColor: stockingTicketDisabled ? colors.PLight : colors.white,
                        }}
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
                                ref: stockingTicketRef,
                            },
                        }}
                        onKeyUp={eventhandler.onBarcodeKeyUp}
                    />

                    <AcsTextField
                        classes={`${classes.marginBottom}`}
                        style={{ width: '100%', marginBottom: '10px' }}
                        label={'현재위치'}
                        id="txtCurrPos"
                        value={currPos}
                        disabled
                    />

                    <AcsTextField
                        classes={`${classes.marginBottom}`}
                        style={{ width: '50%', marginBottom: '10px' }}
                        label={'품번'}
                        id="txtProcNo"
                        disabled
                        value={procNo}
                    />
                    <AcsTextField
                        classes={`${classes.marginBottom}`}
                        style={{ width: '50%', marginBottom: '10px' }}
                        label={'LotNo'}
                        id="txtLotNo"
                        value={lotNo}
                        disabled
                    />
                    <div className={`${classes.flexDiv}`}>
                        <AcsTextField
                            classes={`${classes.marginBottom} ${classes.marginRight}`}
                            label={'총수량'}
                            id="txtTotCnt"
                            value={totCnt}
                            disabled
                        />
                        <AcsTextField
                            label={'출하수량'}
                            classes={`${classes.marginBottom} ${classes.marginRight}`}
                            id="txtShipmentCnt"
                            value={shipmentCnt}
                            disabled
                        />
                        <Clear style={{ margin: '10px 0px 0px 0px' }} />
                        <AcsTextField
                            label={'출하개수'}
                            classes={`${classes.marginBottom} ${classes.marginRight}`}
                            style={{ width: '25%', marginBottom: '10px' }}
                            id="txtMul"
                            type="text"
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={eventhandler.onBtnClearShipmentQty}
                                        style={{ padding: '0px 7px 0px 0px', left: '15px', height: '20px' }}
                                        disableRipple={true}
                                        disableFocusRipple={true}
                                    >
                                        <Clear />
                                    </IconButton>
                                ),
                                inputProps: {
                                    ref: shipmentQtyRef,
                                },
                            }}
                        />
                        <AcsCheckBox
                            className={`${classes.checkBoxMargin}`}
                            label={'전체'}
                            id="chk_All"
                            checked={moveQtyAllCheck}
                            onChange={eventhandler.clickCheckbox}
                        />
                    </div>
                    <div className={`${classes.flexDiv} ${classes.marginBottom}`}>
                        <Button
                            className={`${classes.marginRight} ${classes.flexButton}`}
                            fullWidth
                            variant="contained"
                            style={{ backgroundColor: addListBtnDisabled ? 'lightgray' : '#f7b13d' }}
                            disabled={addListBtnDisabled}
                            onClick={eventhandler.onAddlistBtnClick}
                        >
                            {'저장'}
                        </Button>
                        <Button
                            className={`${classes.flexButton}`}
                            fullWidth
                            variant="contained"
                            style={{ backgroundColor: 'gray' }}
                            onClick={eventhandler.onResetBtnClick}
                        >
                            {'정정'}
                        </Button>
                    </div>
                    <AcsDataGrid
                        className={`${classes.dataGridOdd} ${classes.dataGridmargin}`}
                        cols={columns1}
                        rows={sumList1}
                        checkboxSelection={true}
                        height="200px"
                        onSelectionModelChange={eventhandler.onSelectionModelChange}
                    />
                    <div>
                        <Button
                            className={`${classes.button} ${classes.half} ${classes.halfMargin}`}
                            fullWidth
                            variant="contained"
                            style={{ backgroundColor: 'gray' }}
                            onClick={eventhandler.onDeleteBtnClick}
                        >
                            {'선택삭제'}
                        </Button>
                        <AcsBadgeButton
                            className={`${classes.button} ${classes.half}`}
                            badgeContent={sumList1.length}
                            fullWidth
                            variant="contained"
                            style={{ backgroundColor: '#f7b13d' }}
                            onClick={eventhandler.onShipmentPrintFlagBtnClick}
                        >
                            {'출하확정'}
                        </AcsBadgeButton>
                    </div>
                </AcsTabPanel>

                {/* 출문증재 */}
                <AcsTabPanel value={tabsValue} index={1}>
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text}`}
                        label={'이동일자'}
                        id="txtMoveDate"
                        type="date"
                        value={moveDateRef.current}
                        onChange={eventhandler.onMoveDateChange}
                    />
                    <AcsDataGrid
                        className={`${classes.dataGridOdd}`}
                        cols={columns2}
                        rows={sumList2}
                        height="350px"
                        onRowSelected={eventhandler.onReissueShipmentDateRowSelected}
                    />
                    <AcsDataGrid className={`${classes.dataGridOdd}`} cols={columns3} rows={sumList3} height="350px" />
                    <Button
                        className={`${classes.button}`}
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: reissueBtnDisabled ? 'lightgray' : '#f7b13d' }}
                        disabled={reissueBtnDisabled}
                        onClick={eventhandler.onReissueBtnClick}
                    >
                        {'재발행'}
                    </Button>
                </AcsTabPanel>

                {/* 탭 */}
                <div className={classes.tabsDiv}>
                    <Tabs
                        value={tabsValue}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        className={classes.tabs}
                    >
                        <Tab
                            wrapped
                            label={
                                <span
                                    className={`${tabsValue === 0 ? classes.activeTab : classes.customStyleOnTab} ${
                                        classes.tab
                                    }`}
                                >
                                    {'출하'}
                                </span>
                            }
                        />
                        <Tab
                            wrapped
                            label={
                                <span
                                    className={`${tabsValue === 1 ? classes.activeTab : classes.customStyleOnTab} ${
                                        classes.tab
                                    }`}
                                >
                                    {'출문증재'}
                                </span>
                            }
                        />
                    </Tabs>
                </div>
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
                    <Button
                        onClick={eventhandler.dialogOnCancel}
                        style={{ backgroundColor: 'gray', color: 'white' }}
                        fullWidth
                        variant="contained"
                    >
                        {'취소'}
                    </Button>
                </AcsDialogCustom>
                {/* 메시지 박스 (CUSTOM) - 출하 탭에서 출하확정을 누른 후 발행 여부 묻는 Dialog */}
                <AcsDialogCustom
                    message={msg}
                    open={dialogCustomrPrintFlagOpen}
                    handleClose={eventhandler.dialogOnCancel}
                >
                    <Button
                        onClick={eventhandler.dialogPrintFlagOkay}
                        style={{ backgroundColor: '#f7b13d', color: 'white' }}
                        fullWidth
                        variant="contained"
                    >
                        {'예(Y)'}
                    </Button>
                    <Button
                        onClick={eventhandler.dialogPrintFlagNo}
                        style={{ backgroundColor: 'gray', color: 'white' }}
                        fullWidth
                        variant="contained"
                    >
                        {'아니요(N)'}
                    </Button>
                </AcsDialogCustom>
                {/* 메시지 박스 (CUSTOM) - 이동 탭에서 이동 진행 중인 품번이 있을 경우 초기화 여부 묻는 Dialog */}
                <AcsDialogCustom message={msg} open={dialogCustomrRestOpen} handleClose={eventhandler.dialogOnCancel}>
                    <Button
                        onClick={eventhandler.dialogOnOkay}
                        style={{ backgroundColor: '#f7b13d', color: 'white' }}
                        fullWidth
                        variant="contained"
                    >
                        {'초기화'}
                    </Button>
                    <Button
                        onClick={eventhandler.dialogOnCancel}
                        style={{ backgroundColor: 'gray', color: 'white' }}
                        fullWidth
                        variant="contained"
                    >
                        {'그대로 진행'}
                    </Button>
                </AcsDialogCustom>

                {/* 화면 대기 */}
                <Backdrop className={classes.backdrop} open={backdropOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div style={{ display: 'inline-block', width: '100%', height: '50px' }}></div>
            </div>
        </>
    );
}
export default ShipmentOutSideAuto;
