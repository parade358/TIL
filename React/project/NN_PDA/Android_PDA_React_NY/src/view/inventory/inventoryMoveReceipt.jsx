import { makeStyles, Tabs, Tab, IconButton, Backdrop, CircularProgress, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Clear } from '@material-ui/icons';
import colors from '../../commons/colors';
import COMMON_MESSAGE from '../../commons/message';
import AcsTabPanel from '../../components/acsTabPanel';
import AcsTextField from './../../components/acsTextField';
import AcsDataGrid from './../../components/acsDataGrid';
import AcsSelect from './../../components/acsSelect';
import AcsBadgeButton from './../../components/acsBadgeButton';
import AcsRadioButton from '../../components/acsRadioButton';
import AcsCheckBox from './../../components/acsCheckBox';
import AcsDialog from '../../components/acsDialog';
import AcsDialogCustom from '../../components/acsDialogCustom';

const PDA_API_GETDATE_URL = process.env.REACT_APP_PDA_API_GETDATE_URL;
const PDA_API_GENERAL_URL = process.env.REACT_APP_PDA_API_GENERAL_URL;

const PROC_PK_PDA_REALIV09_2_D = 'U_PK_PDA_RealIV09_2_D'; // 임시저장된 목록 존재하면 초기화
const PROC_PK_PDA_REALIV09_2_L = 'U_PK_PDA_RealIV09_2_L'; // 이동창고 조회
const PROC_PK_PDA_REALIV09_3_L = 'U_PK_PDA_RealIV09_3_L'; // 이동위치 조회
const PROC_PK_PDA_REALIV09_1_L = 'U_PK_PDA_REALIV09_1_L'; // 입고표 정보조회
const PROC_PK_PDA_REALIV09_4_L = 'U_PK_PDA_RealIV09_4_L'; // 이동위치 검증
const PROC_PK_PDA_REALIV09_1_S = 'U_PK_PDA_RealIV09_1_S'; // 리스트 추가
const PROC_PK_PDA_REALIV09_1_D = 'U_PK_PDA_RealIV09_1_D'; // 리스트 삭제
const PROC_PK_PDA_REALIV09_3_S = 'U_PK_PDA_RealIV09_3_S'; // 이동확정
const PROC_PK_PDA_REALIV09_5_L = 'U_PK_PDA_RealIV09_5_L'; // 처리이력 조회

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
    threeHalf: {
        width: '32.8%',
        marginTop: '10px',
    },
    threeHalfMargin: {
        marginRight: '3px',
    },
    textDisabled: {
        '& .MuiInputBase-root.Mui-disabled': {
            backgroundColor: colors.PLight,
        },
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
        marginBottom: '5px',
    },
    marginRight: {
        marginRight: '3px',
    },
    flexDiv: {
        display: 'flex',
        marginTop: '10px',
    },
    flexDivStorage: {
        display: 'flex',
        marginTop: '-5px',
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

// 창고 배열
const storageArray = (obj) => {
    return obj.map((data) => ({
        label: data.LOC_NAME,
        value: data.LOC_ID,
    }));
};

// 창고 배열 (SUB_LOC_ID)
const locationSubLocIdArray = (obj) => {
    return obj.map((data) => ({
        label: data.SUB_LOC_ID,
        value: data.SUB_LOC_ID,
    }));
};

// 창고 배열 (Column1)
const locationColumn1Array = (obj) => {
    return obj.map((data) => ({
        label: data.Column1,
        value: data.Column1,
    }));
};

// 일자 '-' 자르기
function transDateSplitArray(date) {
    const transDateArray = date.split('-');
    return transDateArray[0] + transDateArray[1] + transDateArray[2];
}

function InventoryMoveReceipt() {
    const classes = useStyle(); // CSS 스타일
    const nowDateRef = useRef(''); // 이동일자 Text
    const [tabsValue, setTabsValue] = useState(0); // Tabs 구분
    const [resestTabsValue, setResestTabsValue] = useState(1); // 이동 탭에서 이동 진행 중인 품번이 있을 경우 초기화한 후 이동할 Tabs
    const tabsValueRef = useRef(0);
    const [dialogOpen, setDialogOpen] = useState(false); // 다이얼로그 (메시지창)
    const [dialogCustomOpen, setDialogCustomOpen] = useState(false); // 다이얼로그 커스텀 (메시지창)
    const [dialogCustomrRestOpen, setDialogCustomrResetOpen] = useState(false); // 다이얼로그 커스텀 (메시지창) - 이동 탭에서 이동 진행 중인 품번이 있을 경우 초기화 여부 묻는 Dialog
    const [dialogOkay, setDialogOkay] = useState(''); // 확인, 삭제 구분
    const [backdropOpen, setBackdropOpen] = useState(false); // 대기
    const pda_id = localStorage.getItem('PDA_ID'); // 사용자 ID
    const pda_plant_id = localStorage.getItem('PDA_PLANT_ID'); // 공장 ID
    const pda_mac_address = localStorage.getItem('PDA_MAC_ADDRESS'); // PDA Mac Address
    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []); // WebView에서 받아온 데이터
    const onMessageGubunRef = useRef(''); // WebView로 데이터 요청 후 작업에 대한 구분
    const scanLocationRef = useRef('barcode'); // 바코드 스캔 위치
    // ===========================================================================================================================
    // 이동 Tabs state
    const barcodeRef = useRef(''); // 바코드 Text
    const textPartIdRef = useRef(''); // 품번 Text Ref
    const textLotNoRef = useRef(''); // Lot No Text Ref
    const textCurrentLocationRef = useRef(''); // 현재위치 Text Ref
    const comboBoxMoveStorageRef = useRef([]); // 이동창고 ComboBox Ref
    const [selectedComboBoxMoveStorage, setSelectedComboBoxMoveStorage] = useState({ value: '', label: '' }); // 선택된 이동창고 comboBox
    const selectedComboBoxMoveStorageValueRef = useRef(''); // 선택된 이동창고 value Ref
    const [radioState, setRadioState] = useState('select'); // 라디오 버튼
    const radioStateRef = useRef('select'); // 라디오 버튼 Ref
    const comboBoxMoveLocationStorageRef = useRef([]); // 이동위치 comboBox Ref
    const [selectedComboBoxMoveLocationStorage, setSelectedComboBoxMoveLocationStorage] = useState({
        value: '',
        label: '',
    }); // 선택된 이동위치 comboBox
    const selectedComboBoxMoveLocationStorageValueRef = useRef(''); // 선택된 이동위치 value Ref
    const moveLocationStorageRef = useRef(''); // 이동위치 Text Ref
    const textTotalQtyRef = useRef(0); // 총수량 Text Ref
    const textUnitQtyRef = useRef(0); // 이동수량 Text Ref
    const moveQtyRef = useRef(''); // 이동개수 Text
    const [moveQtyAllCheck, setMoveQtyAllCheck] = useState(false); // 체크박스 체크여부
    const moveQtyAllCheckRef = useRef(false); // 체크박스 체크여부 Ref
    const [addListBtnDisabled, setAddListBtnDisabled] = useState(true); // 추가 버튼 Disabled
    const [sumList1, setSumList1] = useState([]); // 리스트 목록
    const sumList1Ref = useRef([]); // 리스트 목록 Ref
    const lotListRef = useRef([]);
    // ===========================================================================================================================
    // 처리 Tabs state
    const moveDateRef = useRef(''); // 이동일자 Text Ref
    const [, updateState] = useState(); // forceUpdate
    const forceUpdate = useCallback(() => updateState({}), []); // forceUpdate
    const [sumList2, setSumList2] = useState([]); // 리스트 목록
    // ===========================================================================================================================

    // 화면 처음 로드시
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

        // 임시저장된 목록 존재하면 초기화
        initData();

        // webView 데이터 요청
        webViewPostMessage();

        return () => {
            // 임시저장된 목록 존재하면 초기화
            initData();

            console.log('handle 지움');
            document.removeEventListener('message', onMessage);
        };
    }, []);

    // Tab 변경시 이벤트
    useEffect(() => {
        tabsValueRef.current = tabsValue;

        // 이동 Tabs
        if (tabsValue === 0) {
            reset('이동탭로드');
            onMessageGubunRef.current = '이동탭로드';
            // webView 데이터 요청
            webViewPostMessage();
        }
        // 처리 Tabs
        else {
            reset('처리탭로드');
            onMessageGubunRef.current = '처리탭로드';
            // webView 데이터 요청
            webViewPostMessage();
        }
    }, [tabsValue]);

    // 이동창고 변경시 value Ref 지정 - [이동]
    useEffect(() => {
        selectedComboBoxMoveStorageValueRef.current = selectedComboBoxMoveStorage.value;

        if (selectedComboBoxMoveStorage.value !== '') {
            onMessageGubunRef.current = '이동창고변경';
            // webView 데이터 요청
            webViewPostMessage();
        }
    }, [selectedComboBoxMoveStorage]);

    // 라디오버튼 변경시 Ref 지정 - [이동]
    useEffect(() => {
        radioStateRef.current = radioState;
    }, [radioState]);

    // 이동창고 변경시 value Ref 지정 - [이동]
    useEffect(() => {
        selectedComboBoxMoveLocationStorageValueRef.current = selectedComboBoxMoveLocationStorage.value;
    }, [selectedComboBoxMoveLocationStorage]);

    // 전체이동 체크박스 체크시 Ref 지정 - [이동]
    useEffect(() => {
        moveQtyAllCheckRef.current = moveQtyAllCheck;
    }, [moveQtyAllCheck]);

    // 리스트 목록 변경시 Ref 지정 - [이동]
    useEffect(() => {
        sumList1Ref.current = sumList1;
    }, [sumList1]);

    // webView 데이터 요청
    const webViewPostMessage = () => {
        // React Native WebView로 Wifi 신호 강도 데이터 요청
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GET_WIFI_CURRENT_SIGNAL_STRENGTH' }));
        }
    };

    const reset = (gubun) => {
        if (gubun === '이동탭로드') {
            barcodeRef.current.value = '';
            textPartIdRef.current = '';
            textLotNoRef.current = '';
            textCurrentLocationRef.current = '';
            comboBoxMoveStorageRef.current = [];
            setSelectedComboBoxMoveStorage({ value: '', label: '' });
            setRadioState('select');
            comboBoxMoveLocationStorageRef.current = [];
            setSelectedComboBoxMoveLocationStorage({ value: '', label: '' });
            moveLocationStorageRef.current.value = '';
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            moveQtyRef.current.value = '';
            setMoveQtyAllCheck(false);
            setAddListBtnDisabled(true);
            setSumList1([]);
            lotListRef.current = [];
        } else if (gubun === '처리탭로드') {
            setSumList2([]);
        } else if (gubun === 'reset') {
            barcodeRef.current.value = '';
            textPartIdRef.current = '';
            textLotNoRef.current = '';
            textCurrentLocationRef.current = '';
            moveLocationStorageRef.current.value = '';
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            moveQtyRef.current.value = '';
            setAddListBtnDisabled(true);
            setMoveQtyAllCheck(false);
            //window.scrollTo({top: 0});
        } else if (gubun === '리스트추가완료') {
            barcodeRef.current.value = '';
            textPartIdRef.current = '';
            textLotNoRef.current = '';
            textCurrentLocationRef.current = '';
            moveLocationStorageRef.current.value = '';
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            moveQtyRef.current.value = '';
            setAddListBtnDisabled(true);
            setMoveQtyAllCheck(false);
            //window.scrollTo({top: 0});
        } else if (gubun === 'complete') {
            barcodeRef.current.value = '';
            textPartIdRef.current = '';
            textLotNoRef.current = '';
            textCurrentLocationRef.current = '';
            setRadioState('select');
            moveLocationStorageRef.current.value = '';
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            moveQtyRef.current.value = '';
            setMoveQtyAllCheck(false);
            setAddListBtnDisabled(true);
            setSumList1([]);
            lotListRef.current = [];
        }
    };

    // React Native WebView 에서 데이터 가져오기
    const ReadData = (e) => {
        const type = JSON.parse(e.data).type;
        console.log('ReadData : ', type);

        // Wifi 신호 강도 불러오기
        if (type === 'GET_WIFI_CURRENT_SIGNAL_STRENGTH') {
            const { wifiCurrentSignalStrength, type } = JSON.parse(e.data);
            console.log('Wifi 신호 강도 [입고표이동]', wifiCurrentSignalStrength);
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
                // 이동 Tabs
                if (tabsValueRef.current === 0) {
                    if (onMessageGubunRef.current === '이동탭로드') {
                        // 이동창고 조회
                        loadMoveStorage();
                    } else if (onMessageGubunRef.current === '이동창고변경') {
                        // 이동위치 조회
                        loadMoveLocation();
                    } else if (onMessageGubunRef.current === '리스트추가') {
                        // 리스트에 데이터 추가
                        saveDataAddDataList();
                    } else if (onMessageGubunRef.current === '리스트삭제') {
                        // 리스트에서 데이터 삭제
                        deleteDataList();
                    } else if (onMessageGubunRef.current === '이동확정') {
                        // 이동확정
                        moveComplete();
                    }
                }
                // 처리 Tabs
                else {
                    if (onMessageGubunRef.current === '처리탭로드' || onMessageGubunRef.current === '이동일자변경') {
                        // 처리이력 조회
                        loadProcessHistoryData();
                    }
                }
            }
        }
        // 바코드 스캔시 이벤트
        else if (type === 'SCANDATA') {
            const { scannedData, scannedLabelType, type } = JSON.parse(e.data);
            console.log('스캔한 바코드 = ' + scannedData.data);

            if (tabsValueRef.current === 0) {
                // 바코드 스캔
                if (scanLocationRef.current === 'barcode') {
                    if (scannedData.data.length !== 25) {
                        msg = '올바른 입고표가 아닙니다.';
                        setDialogOpen(true);
                        vibration();
                        return;
                    }
                    if (lotListRef.current.length > 0) {
                        const duplicatedObj = lotListRef.current.filter((data) => data['BARCODE'] === scannedData.data);

                        if (duplicatedObj.length > 0) {
                            msg = '리스트에 등록된 바코드 입니다.!';
                            setDialogOpen(true);
                            vibration();
                            return;
                        } else {
                            // 입고표 정보조회
                            showInfo(scannedData.data);
                        }
                    } else {
                        // 입고표 정보조회
                        showInfo(scannedData.data);
                    }
                }
                // 이동위치 스캔
                else if (scanLocationRef.current === 'location') {
                    moveLocationStorageRef.current.value = scannedData.data;
                    // 위치 바코드 검증
                    checkToLocation(scannedData.data);
                }
            }
        }
    };

    // 임시저장된 목록 존재하면 초기화
    const initData = () => {
        const requestOption = getRequestOptions(PROC_PK_PDA_REALIV09_2_D, getRequestParam(pda_mac_address, pda_id));

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
                    if (dialogOkay === '이동중인품번초기화') {
                        setTabsValue(resestTabsValue);
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

    // 이동창고 조회
    const loadMoveStorage = () => {
        const requestOption = getRequestOptions(PROC_PK_PDA_REALIV09_2_L, getRequestParam(pda_plant_id));

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

                    const tmpMoveStorageArray = storageArray(tmpArray);

                    comboBoxMoveStorageRef.current = tmpMoveStorageArray;

                    if (tmpMoveStorageArray.length > 0) {
                        setSelectedComboBoxMoveStorage(tmpMoveStorageArray[0]);
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

    // 이동위치 조회
    const loadMoveLocation = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_REALIV09_3_L,
            getRequestParam(selectedComboBoxMoveStorageValueRef.current, pda_plant_id)
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
                    let isColumn1 = 'Column1' in tmpArray[0]; // Column1 컬럼 존재 여부
                    let isSubLocId = 'SUB_LOC_ID' in tmpArray[0]; // SUB_LOC_ID 컬럼 존재 여부

                    if (tmpArray.length !== 0) {
                        // Column1 컬럼 존재시
                        if (isColumn1) {
                            const tmpCurrentToLocationArray1 = locationColumn1Array(tmpArray);

                            comboBoxMoveLocationStorageRef.current = tmpCurrentToLocationArray1;

                            if (tmpCurrentToLocationArray1.length > 0) {
                                setSelectedComboBoxMoveLocationStorage(tmpCurrentToLocationArray1[0]);
                            }
                        } else {
                            // SUB_LOC_ID 컬럼 존재시
                            if (isSubLocId) {
                                const tmpCurrentToLocationArray2 = locationSubLocIdArray(tmpArray);

                                comboBoxMoveLocationStorageRef.current = tmpCurrentToLocationArray2;

                                if (tmpCurrentToLocationArray2.length > 0) {
                                    setSelectedComboBoxMoveLocationStorage(tmpCurrentToLocationArray2[0]);
                                }
                            }
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

    // 입고표 정보조회
    const showInfo = (scanData) => {
        let unit_qty = scanData.substring(10, 17);
        let substringValue;

        for (let i = 0; unit_qty.length; i++) {
            substringValue = unit_qty.substring(i, i + 1);

            if (substringValue.toString() !== '0') {
                unit_qty = unit_qty.substring(i);
                break;
            }
        }

        const requestOption = getRequestOptions(PROC_PK_PDA_REALIV09_1_L, getRequestParam(scanData, pda_plant_id));

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

                    barcodeRef.current.value = scanData;
                    textPartIdRef.current = tmpArray[0]['PART_ID'];
                    textLotNoRef.current = tmpArray[0]['LOT_NO'];
                    textCurrentLocationRef.current = tmpArray[0]['SUB_LOCATION_ID'];
                    textTotalQtyRef.current = tmpArray[0]['INV_QTY'];
                    textUnitQtyRef.current = unit_qty;
                    moveQtyRef.current.value = '1';
                    moveQtyRef.current.focus();
                    window.scrollTo({ top: 240 });
                    setAddListBtnDisabled(false);
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

    // 위치 바코드 검증 (이동위치)
    const checkToLocation = (scanData) => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_REALIV09_4_L,
            getRequestParam(selectedComboBoxMoveStorageValueRef.current, scanData, pda_plant_id)
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

                    if (tmpArray[0]['Column1'] === '1') {
                        msg = '스캔한 위치가 [사용 중]입니다. 이 위치로 이동합니까?';
                        setDialogCustomOpen(true);
                        setDialogOkay('스캔한위치사용');
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

    // 리스트에 데이터 추가
    const saveDataAddDataList = () => {
        let move_qty = 0;
        const lot_no = barcodeRef.current.value.substring(17);

        if (moveQtyAllCheckRef.current) {
            if (textTotalQtyRef.current !== '') {
                move_qty = parseInt(textTotalQtyRef.current);
            } else {
                msg = '수량정보가 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
        } else {
            if (moveQtyRef.current.value !== '' && textUnitQtyRef.current !== '') {
                move_qty = parseInt(moveQtyRef.current.value) * parseInt(textUnitQtyRef.current);
            } else {
                msg = '수량을 입력하거나 전체를 선택하세요.';
                setDialogOpen(true);
                vibration();
                return;
            }
        }
        let loc_id = '';
        if (radioStateRef.current === 'select') {
            if (comboBoxMoveLocationStorageRef.current.length === 0) {
                msg = '보관처 정보가 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            loc_id = selectedComboBoxMoveLocationStorageValueRef.current;
        } else {
            if (moveLocationStorageRef.current.value === '') {
                msg = '이동위치를 선택하거나 스캔하세요.';
                setDialogOpen(true);
                vibration();
                return;
            }
            loc_id = moveLocationStorageRef.current.value;
        }
        if (
            barcodeRef.current.value === '' ||
            textPartIdRef.current === '' ||
            textLotNoRef.current === '' ||
            textCurrentLocationRef.current === '' ||
            textTotalQtyRef.current === '' ||
            textUnitQtyRef.current === ''
        ) {
            msg = '비어있는 항목이 있습니다.';
            setDialogOpen(true);
            vibration();
            return;
        } else {
            if (parseInt(textTotalQtyRef.current) < move_qty) {
                msg = '입력한 수량이 총 수량보다 큽니다.';
                setDialogOpen(true);
                vibration();
                moveQtyRef.current.value = '';
                moveQtyRef.current.focus();
                return;
            } else {
                let transNowDate = transDateSplitArray(nowDateRef.current);

                const requestOption = getRequestOptions(
                    PROC_PK_PDA_REALIV09_1_S,
                    getRequestParam(
                        transNowDate,
                        textCurrentLocationRef.current,
                        loc_id,
                        lot_no,
                        textPartIdRef.current,
                        move_qty,
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
                            setSumList1([
                                {
                                    id: barcodeRef.current.value,
                                    PART_ID: textPartIdRef.current,
                                    LOT_NO: lot_no,
                                    MOVE_QTY: move_qty,
                                    CURRENT_LOCATION: textCurrentLocationRef.current,
                                    MOVE_LOCATION: loc_id,
                                },
                                ...sumList1,
                            ]);
                            lotListRef.current = [
                                {
                                    BARCODE: barcodeRef.current.value,
                                },
                                ...lotListRef.current,
                            ];

                            reset('리스트추가완료');
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

    // 리스트에서 데이터 삭제
    const deleteDataList = () => {
        let transNowDate = transDateSplitArray(nowDateRef.current);

        const requestOption = getRequestOptions(
            PROC_PK_PDA_REALIV09_1_D,
            getRequestParam(
                transNowDate,
                sumList1Ref.current[0]['CURRENT_LOCATION'],
                sumList1Ref.current[0]['MOVE_LOCATION'],
                sumList1Ref.current[0]['LOT_NO'],
                sumList1Ref.current[0]['PART_ID'],
                sumList1Ref.current[0]['MOVE_QTY'],
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
                    setSumList1([]);
                    lotListRef.current = [];

                    // 이동위치 조회
                    loadMoveLocation();
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

    // 이동확정
    const moveComplete = () => {
        let transNowDate = transDateSplitArray(nowDateRef.current);

        const requestOption = getRequestOptions(
            PROC_PK_PDA_REALIV09_3_S,
            getRequestParam(
                sumList1Ref.current[0]['CURRENT_LOCATION'],
                sumList1Ref.current[0]['MOVE_LOCATION'],
                sumList1Ref.current[0]['PART_ID'],
                transNowDate,
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
                    msg = '이동확정이 완료되었습니다. 입고표 재발행 프로그램에서 입고표를 재발행하시기 바랍니다.';
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

    // 처리이력 조회
    const loadProcessHistoryData = () => {
        let moveDate = transDateSplitArray(moveDateRef.current);

        const requestOption = getRequestOptions(
            PROC_PK_PDA_REALIV09_5_L,
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
                        tmpArray[0]['품번'] === '' &&
                        tmpArray[0]['품명'] === '' &&
                        tmpArray[0]['LOT_NO'] === '' &&
                        tmpArray[0]['단위'] === '' &&
                        tmpArray[0]['이동량'] === '' &&
                        tmpArray[0]['이동위치'] === '' &&
                        tmpArray[0]['처리시각'] === ''
                    ) {
                        msg = '지정한 날짜에 대한 처리이력이 없습니다.';
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    }
                    sumArray = tmpArray.map((data) => ({
                        id: data.품번 + data.이동위치 + data.처리시각,
                        PART_ID: data.품번,
                        PART_NAME: data.품명,
                        LOT_NO: data.LOT_NO,
                        UNIT: data.단위,
                        MOVE_QTY: data.이동량,
                        MOVE_LOCATION: data.이동위치,
                        PROCESS_TIME: data.처리시각,
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

    // Tabs 변경시 이벤트
    const handleChange = (event, newValue) => {
        if (newValue === 1) {
            if (tabsValue === 0) {
                if (sumList1.length > 0) {
                    msg = '현재 이동 진행 중인 품번이 있습니다. 초기화하시겠습니까?';
                    setDialogCustomrResetOpen(true);
                    setDialogOkay('이동중인품번초기화');
                    setResestTabsValue(newValue);
                    return;
                }
            }
        }
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

            if (dialogOkay === 'moveComplete') {
                reset('complete');
            }
            setDialogOkay('');
        },

        // 다이얼로그 커스텀 닫기 이벤트
        dialogOnCancel: (e) => {
            setDialogCustomOpen(false);
            setDialogCustomrResetOpen(false);

            if (dialogOkay === '스캔한위치사용') {
                moveLocationStorageRef.current.value = '';
            }
            setDialogOkay('');
        },

        // 다이얼로그 커스텀 확인 이벤트
        dialogOnOkay: (e) => {
            setDialogCustomOpen(false);
            setDialogCustomrResetOpen(false);

            // 이동 탭에서 다른 탭으로 변경시 초기화
            if (dialogOkay === '이동중인품번초기화') {
                // 임시데이터 삭제
                initData();
            }
            // 이동 탭 리스트 데이터 삭제
            else if (dialogOkay === 'delete') {
                onMessageGubunRef.current = '리스트삭제';
                // webView 데이터 요청
                webViewPostMessage();
            }
            // 이동 탭 이동확정
            else if (dialogOkay === 'moveComplete') {
                onMessageGubunRef.current = '이동확정';
                // webView 데이터 요청
                webViewPostMessage();
            }
        },

        // 이동 Tabs 이벤트 =========================================
        // 바코드 X 버튼 이벤트
        onBtnClearBarcode: (e) => {
            barcodeRef.current.value = '';
        },

        // 바코드 키인 이벤트
        onBarcodeKeyUp: (e) => {
            const scanData = e.target.value;

            if (e.keyCode === 13) {
                if (scanData.length !== 25) {
                    msg = '올바른 입고표가 아닙니다.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (lotListRef.current.length > 0) {
                    const duplicatedObj = lotListRef.current.filter((data) => data['BARCODE'] === scanData);

                    if (duplicatedObj.length > 0) {
                        msg = '리스트에 등록된 바코드 입니다.!';
                        setDialogOpen(true);
                        vibration();
                        return;
                    } else {
                        // 입고표 정보조회
                        showInfo(scanData);
                    }
                } else {
                    // 입고표 정보조회
                    showInfo(scanData);
                }
            }
        },

        // 이동창고 선택시 이벤트
        onCmb_moveStorageChanged: (e) => {
            const tmpdata = comboBoxMoveStorageRef.current.filter((data) => data.value === e.target.value);
            setSelectedComboBoxMoveStorage(tmpdata[0]);
        },

        // 라디오 버튼 클릭 이벤트
        onRadioChanged: (e) => {
            const gubun = e.target.value;

            if (gubun === 'select') {
                moveLocationStorageRef.current.value = '';
                scanLocationRef.current = 'barcode';
            } else {
                moveLocationStorageRef.current.value = '';
                scanLocationRef.current = 'location';
            }
            setRadioState(e.target.value);
        },

        // 이동위치 선택시 이벤트
        onCmb_moveLocationStorageChanged: (e) => {
            const tmpdata = comboBoxMoveLocationStorageRef.current.filter((data) => data.value === e.target.value);
            setSelectedComboBoxMoveLocationStorage(tmpdata[0]);
        },

        // 이동위치 X 버튼 이벤트
        onBtnClearMoveLocationStorage: (e) => {
            moveLocationStorageRef.current.value = '';
        },

        // 이동개수 X 버튼 이벤트
        onBtnClearMoveQty: (e) => {
            moveQtyRef.current.value = '';
        },

        // 체크박스 전체 클릭 이벤트
        onCheckbox_moveQtyAllChanged: (e) => {
            if (e.target.checked) {
                setMoveQtyAllCheck(true);
            } else {
                setMoveQtyAllCheck(false);
            }
        },

        // 리스트에 데이터 추가 이벤트
        onAddListBtnClick: (e) => {
            if (sumList1.length > 0) {
                msg = '저장된 항목을 확정하고 다른 자재를 이동하세요.';
                setDialogOpen(true);
                vibration();
                return;
            }
            onMessageGubunRef.current = '리스트추가';
            // webView 데이터 요청
            webViewPostMessage();
        },

        // 텍스트 초기화 이벤트
        onResetBtnClick: (e) => {
            reset('reset');
        },

        // 삭제 버튼 이벤트
        onDeleteBtnClick: (e) => {
            if (sumList1.length === 0) {
                msg = '삭제할 데이터가 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            msg = '삭제하시겠습니까?';
            setDialogCustomOpen(true);
            setDialogOkay('delete');
        },

        // 이동확정 버튼 이벤트
        onMoveCompleteBtnClick: (e) => {
            if (sumList1.length === 0) {
                msg = '데이터가 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            msg = '이동확정합니다.';
            setDialogCustomOpen(true);
            setDialogOkay('moveComplete');
        },
        // =========================================================

        // 처리 Tabs 이벤트 =========================================
        // 이동일자 변경시 이벤트
        onMoveDateChange: (e) => {
            if (e.target.value === '') {
                msg = '이동일자를 선택해주세요.';
                setDialogOpen(true);
                vibration();
                return;
            } else {
                moveDateRef.current = e.target.value;
                forceUpdate();

                setSumList2([]);
                onMessageGubunRef.current = '이동일자변경';
                // webView 데이터 요청
                webViewPostMessage();
            }
        },
        // =========================================================
    };

    // 라디오 버튼 데이터
    const dataList = [
        { label: '이동위치선택', value: 'select' },
        { label: '이동위치스캔', value: 'scan' },
    ];

    let columns1;
    let columns2;

    // DataGrid1 Header 컬럼 데이터
    columns1 = [
        { field: 'PART_ID', headerName: '품번', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'LOT NO', width: 100, headerAlign: 'left', align: 'left' },
        { field: 'MOVE_QTY', headerName: '이동량', width: 80, headerAlign: 'right', align: 'right' },
        { field: 'CURRENT_LOCATION', headerName: '현재위치', width: 110, headerAlign: 'left', align: 'left' },
        { field: 'MOVE_LOCATION', headerName: '이동위치', width: 110, headerAlign: 'left', align: 'left' },
    ];

    // DataGrid2 Header 컬럼 데이터
    columns2 = [
        { field: 'PART_ID', headerName: '품번', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'PART_NAME', headerName: '품명', width: 200, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'LOT NO', width: 100, headerAlign: 'left', align: 'left' },
        { field: 'UNIT', headerName: '단위', width: 60, headerAlign: 'left', align: 'left' },
        { field: 'MOVE_QTY', headerName: '이동량', width: 80, headerAlign: 'right', align: 'right' },
        { field: 'MOVE_LOCATION', headerName: '이동위치', width: 180, headerAlign: 'left', align: 'left' },
        { field: 'PROCESS_TIME', headerName: '처리시각', width: 200, headerAlign: 'left', align: 'left' },
    ];

    return (
        <>
            <div className={classes.root}>
                {/* ================================================================================== */}
                {/* 이동 */}
                <AcsTabPanel value={tabsValue} index={0}>
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text}`}
                        label={'바코드'}
                        id="txtBarcode"
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={eventhandler.onBtnClearBarcode}
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
                    <div className={`${classes.flexDiv}`}>
                        <AcsTextField
                            className={`${classes.marginBottom} ${classes.marginRight} ${classes.textDisabled}`}
                            label={'품번'}
                            id="txtPartId"
                            disabled
                            value={textPartIdRef.current}
                        />
                        <AcsTextField
                            className={`${classes.marginBottom} ${classes.marginRight} ${classes.textDisabled}`}
                            label={'Lot No'}
                            id="txtLotNo"
                            disabled
                            value={textLotNoRef.current}
                        />
                        <AcsTextField
                            className={`${classes.marginBottom} ${classes.textDisabled}`}
                            label={'현재위치'}
                            id="txtCurrentLocation"
                            disabled
                            value={textCurrentLocationRef.current}
                        />
                    </div>
                    <AcsSelect
                        className={`${classes.selectStorage} ${classes.marginBottom}`}
                        labelText={'이동창고'}
                        id="cmb_moveStorage"
                        data={comboBoxMoveStorageRef.current}
                        value={selectedComboBoxMoveStorage.value}
                        onChange={eventhandler.onCmb_moveStorageChanged}
                        MenuProps={{
                            style: {
                                height: '400px',
                            },
                        }}
                    />
                    <AcsRadioButton dataList={dataList} value={radioState} onChange={eventhandler.onRadioChanged} />
                    <div className={`${classes.flexDivStorage}`}>
                        <AcsSelect
                            className={`${classes.selectStorage} ${classes.marginBottom}`}
                            labelText={'창고'}
                            id="cmb_moveLocationStorage"
                            data={comboBoxMoveLocationStorageRef.current}
                            value={selectedComboBoxMoveLocationStorage.value}
                            onChange={eventhandler.onCmb_moveLocationStorageChanged}
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
                            id="txtMoveLocationStorage"
                            disabled={radioState === 'select' && true}
                            style={{ backgroundColor: radioState === 'select' && colors.PLight }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={eventhandler.onBtnClearMoveLocationStorage}
                                        style={{ padding: '0px 7px 0px 0px', left: '15px', height: '20px' }}
                                        disableRipple={true}
                                        disableFocusRipple={true}
                                    >
                                        <Clear />
                                    </IconButton>
                                ),
                                inputProps: {
                                    ref: moveLocationStorageRef,
                                },
                            }}
                        />
                    </div>
                    <div className={`${classes.flexDiv}`}>
                        <AcsTextField
                            className={`${classes.marginRight} ${classes.textDisabled}`}
                            label={'총수량'}
                            id="txtTotalQty"
                            disabled
                            value={textTotalQtyRef.current}
                        />
                        <AcsTextField
                            className={`${classes.marginRight} ${classes.textDisabled}`}
                            label={'이동수량'}
                            id="txtUnitQty"
                            disabled
                            value={textUnitQtyRef.current}
                        />
                        <Clear style={{ margin: '10px 0px 0px 0px' }} />
                        <AcsTextField
                            label={'이동개수'}
                            id="txtMoveQty"
                            type="number"
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={eventhandler.onBtnClearMoveQty}
                                        style={{ left: '10px', height: '20px', padding: '0px' }}
                                        disableRipple={true}
                                        disableFocusRipple={true}
                                    >
                                        <Clear />
                                    </IconButton>
                                ),
                                inputProps: {
                                    ref: moveQtyRef,
                                },
                            }}
                        />
                        <AcsCheckBox
                            className={`${classes.checkBoxMargin}`}
                            label={'전체'}
                            id="checkbox_moveQtyAll"
                            checked={moveQtyAllCheck}
                            onChange={eventhandler.onCheckbox_moveQtyAllChanged}
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
                        className={`${classes.dataGridOdd} ${classes.dataGridMargin}`}
                        cols={columns1}
                        rows={sumList1}
                        height="150px"
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
                        onClick={eventhandler.onMoveCompleteBtnClick}
                    >
                        {'이동확정'}
                    </AcsBadgeButton>
                </AcsTabPanel>
                {/* ================================================================================== */}
                {/* 처리 */}
                <AcsTabPanel value={tabsValue} index={1}>
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text}`}
                        label={'이동일자'}
                        id="txtMoveDate"
                        type="date"
                        value={moveDateRef.current}
                        onChange={eventhandler.onMoveDateChange}
                    />
                    <AcsDataGrid className={`${classes.dataGridOdd}`} cols={columns2} rows={sumList2} height="350px" />
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
                                    {'이동'}
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
                                    {'처리'}
                                </span>
                            }
                        />
                    </Tabs>
                </div>
                <div style={{ display: 'inline-block', width: '100%', height: '50px' }}></div>

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
            </div>
        </>
    );
}

export default InventoryMoveReceipt;
