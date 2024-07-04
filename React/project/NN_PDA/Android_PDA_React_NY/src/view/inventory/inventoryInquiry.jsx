import { makeStyles, Tabs, Tab, IconButton, Backdrop, CircularProgress, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Clear }        from '@material-ui/icons';
import colors           from '../../commons/colors';
import COMMON_MESSAGE   from '../../commons/message';
import AcsTabPanel      from '../../components/acsTabPanel';
import AcsTextField     from './../../components/acsTextField';
import AcsDataGrid      from './../../components/acsDataGrid';
import AcsSelect        from './../../components/acsSelect';
import AcsRadioButton   from '../../components/acsRadioButton';
import AcsDialog        from '../../components/acsDialog';

const PDA_API_GENERAL_URL = process.env.REACT_APP_PDA_API_GENERAL_URL;

const PROC_PK_PDA_REALIV01_1_L = 'U_PK_PDA_RealIV01_1_L'; // 현재창고 조회
const PROC_PK_PDA_REALIV01_2_L = 'U_PK_PDA_RealIV01_2_L'; // 바코드 탭 정보 조회
const PROC_PK_PDA_REALIV01_4_L = 'U_PK_PDA_RealIV01_4_L'; // 창고 조회
const PROC_PK_PDA_REALIV01_3_L = 'U_PK_PDA_RealIV01_3_L'; // 2공장 X
const PROC_PK_PDA_REALIV01_5_L = 'U_PK_PDA_RealIV01_5_L'; // 2공장 O

let msg = '';

// 스타일
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

// 현재창고 배열
const currentStorageArray = (obj) => {
    return obj.map((data) => ({
        label: data.LOC_NAME,
        value: data.LOC_ID,
    }));
};

// 창고 배열
const storageArray = (obj) => {
    return obj.map((data) => ({
        label: data.LOC_ID,
        value: data.LOC_ID,
    }));
};

function InventoryInquiry() {
    const { t } = useTranslation(); // 번역 hook
    const classes = useStyle(); // CSS 스타일
    const [tabsValue, setTabsValue] = useState(0); // Tabs 구분
    const tabsValueRef = useRef(0);
    const [dialogOpen, setDialogOpen] = useState(false); // 다이얼로그 (메시지창)
    const [backdropOpen, setBackdropOpen] = useState(false); // 대기
    const pda_plant_id = localStorage.getItem('PDA_PLANT_ID'); // 공장 ID
    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []); // WebView에서 받아온 데이터
    const onMessageGubunRef = useRef('바코드현재창고'); // WebView로 데이터 요청 후 작업에 대한 구분

    // =============== 바코드 Tabs state ===============
    const comboBoxBarcodeCurrentStorageRef = useRef([]); // 현재창고
    const [selectedComboBoxBarcodeCurrentStorage, setSelectedComboBoxBarcodeCurrentStorage] = useState({
        value: '',
        label: '',
    }); // 현재창고 comboBox
    const selectedComboBoxBarcodeCurrentStorageValueRef = useRef(''); // 선택된 현재창고 value Ref
    const barcodeRef = useRef(''); // 스캔 바코드 Text
    const [sumList1, setSumList1] = useState([]); // 리스트 목록

    // =============== 위치 Tabs state ===============
    const comboBoxLocationCurrentStorageRef = useRef([]); // 현재창고 ComboBox
    const [selectedComboBoxLocationCurrentStorage, setSelectedComboBoxLocationCurrentStorage] = useState({
        value: '',
        label: '',
    }); // 선택된 현재창고 comboBox
    const selectedComboBoxLocationCurrentStorageValueRef = useRef(''); // 선택된 현재창고 value Ref
    const [radioState, setRadioState] = useState('select'); // 라디오 버튼
    const radioStateRef = useRef('select'); // 라디오 버튼 Ref
    const comboBoxStorageRef = useRef([]); // 창고 comboBox
    const [selectedComboBoxStorage, setSelectedComboBoxStorage] = useState({ value: '', label: '' }); // 선택된 창고 comboBox
    const selectedComboBoxStorageValueRef = useRef(''); // 선택된 창고 value Ref
    const storageRef = useRef(''); // 스캔 창고 Text
    const [sumList2, setSumList2] = useState([]); // 리스트 목록

    // 화면 처음 로드시
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

    // Tab 변경시 이벤트
    useEffect(() => {
        tabsValueRef.current = tabsValue;

        // 바코드 Tabs
        if (tabsValue === 0) {
            reset();
            onMessageGubunRef.current = '바코드현재창고';
            // webView 데이터 요청
            webViewPostMessage();
        }
        // 위치 Tabs
        else if (tabsValue === 1) {
            reset();
            onMessageGubunRef.current = '위치현재창고';
            // webView 데이터 요청
            webViewPostMessage();
        }
    }, [tabsValue]);

    // 선택된 현재창고 변경시 Ref 지정 - [바코드]
    useEffect(() => {
        selectedComboBoxBarcodeCurrentStorageValueRef.current = selectedComboBoxBarcodeCurrentStorage.value;
    }, [selectedComboBoxBarcodeCurrentStorage]);

    // 선택된 현재창고 변경시 Ref 지정 - [위치]
    useEffect(() => {
        selectedComboBoxLocationCurrentStorageValueRef.current = selectedComboBoxLocationCurrentStorage.value;

        if (selectedComboBoxLocationCurrentStorage.value !== '') {
            onMessageGubunRef.current = '위치현재창고변경';
            // webView 데이터 요청
            webViewPostMessage();
        }
    }, [selectedComboBoxLocationCurrentStorage]);

    // 라디오 버튼 변경시 Ref 지정 - [위치]
    useEffect(() => {
        radioStateRef.current = radioState;

        if (tabsValueRef.current === 1) {
            if (radioState === 'select') {
                setSumList2([]);
                onMessageGubunRef.current = '창고변경/스캔';
                // webView 데이터 요청
                webViewPostMessage();
            }
        }
    }, [radioState]);

    // 선택된 창고 변경시 Ref 지정 - [위치]
    useEffect(() => {
        console.log(radioStateRef.current);
        if (radioStateRef.current === 'select') {
            selectedComboBoxStorageValueRef.current = selectedComboBoxStorage.value;

            if (selectedComboBoxStorage.value !== '') {
                setSumList2([]);
                onMessageGubunRef.current = '창고변경/스캔';
                // webView 데이터 요청
                webViewPostMessage();
            }
        }
    }, [selectedComboBoxStorage]);

    // webView 데이터 요청
    const webViewPostMessage = () => {
        // React Native WebView로 Wifi 신호 강도 데이터 요청
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GET_WIFI_CURRENT_SIGNAL_STRENGTH' }));
        }
    };

    // 초기화
    const reset = () => {
        // 바코드 Tabs
        if (tabsValueRef.current === 0) {
            comboBoxBarcodeCurrentStorageRef.current = [];
            setSelectedComboBoxBarcodeCurrentStorage({ value: '', label: '' });
            setRadioState('select');
            comboBoxStorageRef.current = [];
            setSelectedComboBoxStorage({ value: '', label: '' });
            setSumList2([]);
        }
        // 위치 Tabs
        else {
            comboBoxLocationCurrentStorageRef.current = [];
            setSelectedComboBoxLocationCurrentStorage({ value: '', label: '' });
            setSumList1([]);
        }
    };

    // React Native WebView 에서 데이터 가져오기
    const ReadData = (e) => {
        const type = JSON.parse(e.data).type;
        console.log('ReadData : ', type);

        // Wifi 신호 강도 불러오기
        if (type === 'GET_WIFI_CURRENT_SIGNAL_STRENGTH') {
            const { wifiCurrentSignalStrength, type } = JSON.parse(e.data);
            console.log('Wifi 신호 강도 [재고조회]', wifiCurrentSignalStrength);
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
                // 바코드 Tabs
                if (tabsValueRef.current === 0) {
                    if (onMessageGubunRef.current === '바코드현재창고') {
                        // 현재창고 조회
                        loadCurrentStorage();
                    } else if (onMessageGubunRef.current === '바코드스캔') {
                        // 바코드 정보 조회
                        setSumList1([]);
                        barcodeInfo(barcodeRef.current.value);
                    }
                }
                // 위치 Tabs
                else {
                    if (onMessageGubunRef.current === '위치현재창고') {
                        // 현재창고 조회
                        loadCurrentStorage();
                    } else if (onMessageGubunRef.current === '위치현재창고변경') {
                        // 창고 조회
                        setSumList2([]);
                        loadStorage();
                    } else if (onMessageGubunRef.current === '창고변경/스캔') {
                        // 위치 바코드 정보 조회
                        if (radioStateRef.current === 'select') {
                            barcodeInfo(selectedComboBoxStorageValueRef.current);
                        } else {
                            barcodeInfo(storageRef.current.value);
                        }
                    }
                }
            }
        }
        // 바코드 스캔시 이벤트
        else if (type === 'SCANDATA') {
            const { scannedData, scannedLabelType, type } = JSON.parse(e.data);
            console.log('스캔한 바코드 = ' + scannedData.data);

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
                barcodeRef.current.value = scannedData.data;
                onMessageGubunRef.current = '바코드스캔';
                // webView 데이터 요청
                webViewPostMessage();
            }
            // 위치 Tabs
            else {
                if (radioStateRef.current === 'scan') {
                    if (scannedData.data === '') {
                        msg = '위치를 스캔하세요.';
                        setDialogOpen(true);
                        vibration();
                        return;
                    }
                    storageRef.current.value = scannedData.data;
                    onMessageGubunRef.current = '창고변경/스캔';
                    // webView 데이터 요청
                    webViewPostMessage();
                }
            }
        }
    };

    // 현재창고 조회
    const loadCurrentStorage = () => {
        const requestOption = getRequestOptions(PROC_PK_PDA_REALIV01_1_L, getRequestParam(pda_plant_id));

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
                    } else {
                        comboBoxLocationCurrentStorageRef.current = tmpCurrentStorageArray;

                        if (tmpCurrentStorageArray.length > 0) {
                            setSelectedComboBoxLocationCurrentStorage(tmpCurrentStorageArray[0]);
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

    // 바코드 스캔 처리
    const barcodeInfo = (scanData) => {
        // 바코드 Tabs 바코드 스캔
        if (tabsValueRef.current === 0) {
            let lot_no = scanData.substring(17);
            let inv_id = scanData.substring(3, 10);
            let substringValue;

            for (let i = 0; inv_id.length; i++) {
                substringValue = inv_id.substring(i, i + 1);

                if (substringValue.toString() !== '0') {
                    inv_id = inv_id.substring(i);
                    break;
                }
            }

            const requestOption = getRequestOptions(
                PROC_PK_PDA_REALIV01_2_L,
                getRequestParam(selectedComboBoxBarcodeCurrentStorageValueRef.current, inv_id, lot_no, pda_plant_id)
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
                            tmpArray[0]['위치'] === '' &&
                            tmpArray[0]['품번'] === '' &&
                            tmpArray[0]['품명'] === '' &&
                            tmpArray[0]['Lot'] === '' &&
                            tmpArray[0]['재고'] === ''
                        ) {
                            msg = '스캔한 바코드에 대한 정보가 없습니다.';
                            setDialogOpen(true);
                            vibration();
                            return;
                        }
                        sumArray = tmpArray.map((data) => ({
                            id: data.위치 + data.품번 + data.Lot,
                            LOCATION_ID: data.위치,
                            PART_ID: data.품번,
                            PART_NAME: data.품명,
                            LOT_NO: data.Lot,
                            INVENTORY: data.재고,
                        }));

                        setSumList1(sumArray);
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
        // 위치 Tabs 위치 선택 / 스캔
        else {
            let requestOption;

            if (pda_plant_id !== '103') {
                requestOption = getRequestOptions(PROC_PK_PDA_REALIV01_3_L, getRequestParam(scanData, pda_plant_id));
            } else {
                requestOption = getRequestOptions(
                    PROC_PK_PDA_REALIV01_5_L,
                    getRequestParam(selectedComboBoxLocationCurrentStorageValueRef.current, scanData, pda_plant_id)
                );
            }

            setBackdropOpen(true);
            fetch(PDA_API_GENERAL_URL, requestOption)
                .then((res) => res.json())
                .then((data) => {
                    // 사용자 메시지 처리
                    if (data.returnUserMessage !== null) {
                        msg = data.returnUserMessage;
                        setDialogOpen(true);
                        vibration();
                        setSumList2([]);
                        setBackdropOpen(false);
                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setSumList2([]);
                        setBackdropOpen(false);
                        return;
                    }
                    // 결과 처리
                    else {
                        const tmpArray = JSON.parse(data.returnValue[0]);

                        console.log(tmpArray);

                        let sumArray = [];

                        if (
                            tmpArray[0]['품번'] === '' &&
                            tmpArray[0]['품명'] === '' &&
                            tmpArray[0]['Lot'] === '' &&
                            tmpArray[0]['재고'] === ''
                        ) {
                            msg = '선택/스캔한 위치에 대한 정보가 없습니다.';
                            setDialogOpen(true);
                            vibration();
                            return;
                        }
                        sumArray = tmpArray.map((data) => ({
                            id: data.품번 + data.Lot,
                            PART_ID: data.품번,
                            PART_NAME: data.품명,
                            LOT_NO: data.Lot,
                            INVENTORY: data.재고,
                        }));

                        setSumList2(sumArray);
                    }
                    setBackdropOpen(false);
                })
                .catch((data) => {
                    msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                    setDialogOpen(true);
                    vibration();
                    setSumList2([]);
                    setBackdropOpen(false);
                    return;
                });
        }
    };

    // 창고 조회 - [위치]
    const loadStorage = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_REALIV01_4_L,
            getRequestParam(selectedComboBoxLocationCurrentStorageValueRef.current, pda_plant_id)
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

                    const tmpStorageArray = storageArray(tmpArray);

                    comboBoxStorageRef.current = tmpStorageArray;

                    if (tmpStorageArray.length > 0) {
                        setSelectedComboBoxStorage(tmpStorageArray[0]);
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

    // Tabs 변경시 이벤트
    const handleChange = (event, newValue) => {
        setTabsValue(newValue);
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

        // 바코드 Tabs 이벤트 =======================================
        // 현재창고 선택시 이벤트
        onCmb_BarcodecurrentStorageChanged: (e) => {
            const tmpdata = comboBoxBarcodeCurrentStorageRef.current.filter((data) => data.value === e.target.value);
            setSelectedComboBoxBarcodeCurrentStorage(tmpdata[0]);

            // barcodeRef.current.value = "";
            // setSumList1([]);
        },

        // 바코드 X 버튼 이벤트
        onBtnClearBarcodeTabsBarcode: (e) => {
            if (e.target.value !== '') {
                barcodeRef.current.value = '';
            }
        },

        // 바코드 키인 이벤트
        onBarcodeKeyUp: (e) => {
            const scanData = e.target.value;

            if (e.keyCode === 13) {
                if (scanData === '') {
                    msg = '바코드를 스캔하세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                barcodeRef.current.value = scanData;
                onMessageGubunRef.current = '바코드스캔';
                // webView 데이터 요청
                webViewPostMessage();
            }
        },
        // =========================================================

        // 위치 Tabs 이벤트 =========================================
        // 현재창고 선택시 이벤트
        onCmb_LocationCurrentStorageChanged: (e) => {
            const selectedData = e.target.value;
            const tmpdata = comboBoxLocationCurrentStorageRef.current.filter((data) => data.value === selectedData);
            setSelectedComboBoxLocationCurrentStorage(tmpdata[0]);
        },

        // 라디오버튼 클릭 이벤트
        onRadioChanged: (e) => {
            const gubun = e.target.value;

            if (gubun === 'select') {
                storageRef.current.value = '';
                setSumList2([]);
            } else {
                setSumList2([]);
            }
            setRadioState(e.target.value);
        },

        // 창고 선택시 이벤트
        onCmb_storageChanged: (e) => {
            const tmpdata = comboBoxStorageRef.current.filter((data) => data.value === e.target.value);
            setSelectedComboBoxStorage(tmpdata[0]);
        },

        // 창고 X 버튼 이벤트
        onBtnClearStorage: (e) => {
            if (radioState === 'scan') {
                if (storageRef.current.value !== '') {
                    storageRef.current.value = '';
                    setSumList2([]);
                }
            }
        },

        // 창고 키인 이벤트
        onStorageKeyUp: (e) => {
            const scanData = e.target.value;

            if (e.keyCode === 13) {
                if (scanData === '') {
                    msg = '위치를 스캔하세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                storageRef.current.value = scanData;
                onMessageGubunRef.current = '창고변경/스캔';
                // webView 데이터 요청
                webViewPostMessage();
            }
        },
        // =========================================================
    };

    // 라디오 버튼 데이터
    const dataList = [
        { label: '위치선택', value: 'select' },
        { label: '위치스캔', value: 'scan' },
    ];

    // DataGrid1 Header 컬럼 데이터
    const columns1 = [
        { field: 'LOCATION_ID', headerName: '위치', width: 110, headerAlign: 'left', align: 'left' },
        { field: 'PART_ID', headerName: '품번', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'PART_NAME', headerName: '품명', width: 200, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'Lot', width: 110, headerAlign: 'left', align: 'left' },
        { field: 'INVENTORY', headerName: '재고', width: 95, headerAlign: 'right', align: 'right' },
    ];

    // DataGrid2 Header 컬럼 데이터
    const columns2 = [
        { field: 'PART_ID', headerName: '품번', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'PART_NAME', headerName: '품명', width: 200, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'Lot', width: 110, headerAlign: 'left', align: 'left' },
        { field: 'INVENTORY', headerName: '재고', width: 95, headerAlign: 'right', align: 'right' },
    ];

    const onTest2 = () => {
        loadCurrentStorage();
        loadStorage();
        barcodeInfo('0000123869000025016021621');
    };

    const onTest = () => {
        loadCurrentStorage();
        loadStorage();
        barcodeInfo('1Material');
    };

    return (
        <>
            <div className={classes.root}>
                {/* ================================================================================== */}
                {/* 바코드 */}
                <AcsTabPanel value={tabsValue} index={0}>
                    <AcsSelect
                        className={`${classes.select}`}
                        labelText={'현재창고'}
                        id="cmb_currentStorage"
                        backgroundColor={colors.white}
                        data={comboBoxBarcodeCurrentStorageRef.current}
                        value={selectedComboBoxBarcodeCurrentStorage.value}
                        onChange={eventhandler.onCmb_BarcodecurrentStorageChanged}
                        MenuProps={{
                            style: {
                                height: '400px',
                            },
                        }}
                    />
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text}`}
                        label={'바코드'}
                        id="txtBarcode"
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={eventhandler.onBtnClearBarcodeTabsBarcode}
                                    style={{ padding: '0px 7px 0px 0px', left: '15px', height: '20px' }}
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                >
                                    <Clear />
                                </IconButton>
                            ),
                            inputProps: {
                                ref: barcodeRef,
                            },
                        }}
                        onKeyUp={eventhandler.onBarcodeKeyUp}
                    />

                    <AcsDataGrid className={`${classes.dataGridOdd}`} cols={columns1} rows={sumList1} height="300px" />
                    <Button onClick={onTest2}>TEST</Button>
                </AcsTabPanel>

                {/* ================================================================================== */}
                {/* 위치 */}
                <AcsTabPanel value={tabsValue} index={1}>
                    <AcsSelect
                        className={`${classes.select} ${classes.marginBottom}`}
                        labelText={'현재창고'}
                        id="cmb_currentStorage"
                        backgroundColor={colors.white}
                        data={comboBoxLocationCurrentStorageRef.current}
                        value={selectedComboBoxLocationCurrentStorage.value}
                        onChange={eventhandler.onCmb_LocationCurrentStorageChanged}
                        MenuProps={{
                            style: {
                                height: '400px',
                            },
                        }}
                    />
                    <AcsRadioButton dataList={dataList} value={radioState} onChange={eventhandler.onRadioChanged} />
                    <AcsSelect
                        className={`${classes.selectStorage} ${classes.marginBottom}`}
                        labelText={'창고'}
                        id="cmb_storageLot"
                        data={comboBoxStorageRef.current}
                        value={selectedComboBoxStorage.value}
                        onChange={eventhandler.onCmb_storageChanged}
                        disabled={radioState === 'scan' && true}
                        backgroundColor={radioState === 'scan' && colors.PLight}
                        MenuProps={{
                            style: {
                                height: '400px',
                            },
                        }}
                    />
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text}`}
                        label={'창고'}
                        id="txtStorage"
                        disabled={radioState === 'select' && true}
                        style={{ backgroundColor: radioState === 'select' && colors.PLight }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={eventhandler.onBtnClearStorage}
                                    style={{ padding: '0px 7px 0px 0px', left: '15px', height: '20px' }}
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                >
                                    <Clear />
                                </IconButton>
                            ),
                            inputProps: {
                                ref: storageRef,
                            },
                        }}
                        onKeyUp={eventhandler.onStorageKeyUp}
                    />
                    <AcsDataGrid className={`${classes.dataGridOdd}`} cols={columns2} rows={sumList2} height="210px" />
                    <Button onClick={onTest}>TEST</Button>
                </AcsTabPanel>
                {/* ================================================================================== */}
                <div className={classes.tabsDiv}>
                    <Tabs
                        centered
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
                                    {'바코드'}
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
                                    {'위치'}
                                </span>
                            }
                        />
                    </Tabs>
                </div>
                <div style={{ display: 'inline-block', width: '100%', height: '50px' }}></div>

                {/* 메시지 박스 */}
                <AcsDialog
                    message={msg}
                    open={dialogOpen}
                    handleClose={eventhandler.handleClose}
                    translation={t}
                ></AcsDialog>

                {/* 화면 대기 */}
                <Backdrop className={classes.backdrop} open={backdropOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </>
    );
}

export default InventoryInquiry;
