import { makeStyles, Tabs, Tab, IconButton, Backdrop, CircularProgress, Button } from '@material-ui/core';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Clear }        from '@material-ui/icons';
import colors           from '../../commons/colors';
import COMMON_MESSAGE   from '../../commons/message';
import AcsTabPanel      from '../../components/acsTabPanel';
import AcsTextField     from './../../components/acsTextField';
import AcsDataGrid      from './../../components/acsDataGrid';
import AcsSelect        from './../../components/acsSelect';
import AcsBadgeButton   from './../../components/acsBadgeButton';
import AcsRadioButton   from '../../components/acsRadioButton';
import AcsCheckBox      from './../../components/acsCheckBox';
import AcsDialog        from '../../components/acsDialog';
import AcsDialogCustom  from '../../components/acsDialogCustom';

const PDA_API_GETDATE_URL = process.env.REACT_APP_PDA_API_GETDATE_URL;
const PDA_API_GENERAL_URL = process.env.REACT_APP_PDA_API_GENERAL_URL;

const PROC_PK_PDA_DV06_1_L       = 'U_PK_PDA_DV06_1_L';     // 이동창고 조회
// const PROC_PK_PDA_DV06_2_L   = 'U_PK_PDA_DV06_2_L';      // (안쓰임)현재위치조회
// const PROC_PK_PDA_DV06_3_L   = 'U_PK_PDA_DV06_3_L';      // (안쓰임)이동창고 목록조회
const PROC_PK_PDA_DV06_4_L      = 'U_PK_PDA_DV06_4_L';      // 입고표 정보조회 (바코드 스캔) + 현재위치
const PROC_PK_PDA_DV06_6_L      = 'U_PK_PDA_DV06_6_L';      // 부품표 정보조회 (PART_ID)
const PROC_PK_PDA_DV06_7_L      = 'U_PK_PDA_DV06_7_L';      // 부품표 위치조회
// const PROC_PK_PDA_DV06_9_L   = 'U_PK_PDA_DV06_9_L';      // (안쓰임)위치 바코드 스캔시 검증절차
// const PROC_PK_PDA_DV06_10_L  = 'U_PK_PDA_DV06_10_L';     // (안쓰임)chktoloc
const PROC_PK_PDA_DV06_1_S2     = 'U_PK_PDA_DV06_1_S2';     // 목록 저장 + 이동위치 사용처리 (리스트 데이터 추가)
const PROC_PK_PDA_RealIV02_1_D  = 'U_PK_PDA_RealIV02_1_D';  // 선택 삭제
const PROC_PK_PDA_DV06_3_S      = 'U_PK_PDA_DV06_3_S';      // 이동확정
const PROC_PK_PDA_DV06_5_L      = 'U_PK_PDA_DV06_5_L';      // 처리이력 조회
const PROC_PK_PDA_DV07_4_L      = 'U_PK_PDA_DV07_4_L';      // 출문증재발행 조회
const PROC_PK_PDA_DV07_5_L      = 'U_PK_PDA_DV07_5_L';      // 출문증 세부조회
const PROC_PK_PDA_DV01_Reprt    = 'U_PK_PDA_DV01_Reprt';    // 출문증재발행 업데이트
const PROC_PK_PDA_RealIV02_2_D  = 'U_PK_PDA_RealIV02_2_D';  // initData

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
    selectMoveStorage: {
        width: '100%',
        marginTop: '20px',
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
    return [...arguments].map((el) => `'${el}'`).join('&del;');
}

// 창고 배열 (LOC_ID)
const locationLocIdArray = (obj) => {
    return obj.map((data) => ({
        label: data.LOC_NAME,
        value: data.LOC_ID,
    }));
};

// 일자 '-' 자르기
function transDateSplitArray(date) {
    const transDateArray = date.split('-');
    return transDateArray[0] + transDateArray[1] + transDateArray[2];
}

export default function InventoryMovingPartsListWarehouse() {
    // =============== 공통 state ===============
    const classes       = useStyle(); // CSS 스타일
    const nowDateRef = useRef(''); // 이동일자 Text
    const [tabsValue,               setTabsValue] = useState(0); // Tabs 구분
    const tabsValueRef = useRef(0); // 현재 탭 밸류
    const [resestTabsValue,         setResestTabsValue] = useState(1); // 이동 진행 중인 품번 초기화 후 이동 Tabs
    const [dialogOpen,              setDialogOpen] = useState(false); // 다이얼로그 (메시지창)
    const [dialogCustomOpen,        setDialogCustomOpen] = useState(false); // 다이얼로그 커스텀 (메시지창)
    const [dialogCustomrRestOpen,   setDialogCustomrRestOpen] = useState(false); // 이동 진행 중인 품번 초기화 여부 Dialog
    const [dialogOkay,              setDialogOkay] = useState(''); // 확인, 삭제 구분
    const [backdropOpen,            setBackdropOpen] = useState(false); // 대기
    const pda_id = localStorage.getItem('PDA_ID'); // 사용자 ID
    const pda_plant_id = localStorage.getItem('PDA_PLANT_ID'); // 공장 ID
    const pda_mac_address = localStorage.getItem('PDA_MAC_ADDRESS'); // PDA Mac Address
    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []); // WebView에서 받아온 데이터
    const onMessageGubunRef = useRef(''); // WebView로 데이터 요청 후 작업에 대한 구분
    const scanLocationRef = useRef(''); // 바코드 스캔 위치
    const [, updateState] = useState(); // forceUpdate
    const forceUpdate = useCallback(() => updateState({}), []); // forceUpdate

    // =============== 창고 state ===============
    const [radioState, setradioState] = useState('select'); // 라디오 버튼 (이동위치)
    const radioStateRef = useRef('select'); // 라디오 버튼 (이동위치) Ref
    const comboBoxMoveLocationStorageRef = useRef([]); // 창고 comboBox (이동위치) Ref
    const [selectedComboBoxMoveLocationStorage, setSelectedComboBoxMoveLocationStorage] = useState({
        value: '',
        label: '',
    }); // 선택된 창고 comboBox (이동위치)
    const selectedComboBoxMoveLocationStorageValueRef = useRef(''); // 선택된 창고 comboBox (이동위치) value Ref
    const moveLocationStorageRef = useRef(''); // 창고 Text (이동위치) Ref
    const [productCheck, setProductCheck] = useState(false); // 체크박스 체크여부
    const productCheckRef = useRef('N'); // 제품 식별표 프린트 여부

    // =============== 이동 state ===============
    const textCurrentLocationRef = useRef(''); // 현재위치 Text Ref
    const textMoveLocationRef = useRef(''); // 이동위치 Text Ref
    const barcodeRef = useRef(''); // 바코드 Text
    const textPartIdRef = useRef(''); // 품번 Text Ref
    const textTotalQtyRef = useRef(0); // 총수량 Text Ref
    const textUnitQtyRef = useRef(0); // 이동수량 Text Ref
    const moveQtyRef = useRef(''); // 이동개수 Text
    const [moveQtyAllCheck, setMoveQtyAllCheck] = useState(false); // 체크박스 체크여부
    const moveQtyAllCheckRef = useRef(false); // 체크박스 체크여부 Ref
    const [addListBtnDisabled, setAddListBtnDisabled] = useState(true); // 추가 버튼 Disabled
    const [sumList1, setSumList1] = useState([]); // 리스트 목록
    const sumList1Ref = useRef([]); // 리스트 목록 Ref
    const lotListRef = useRef([]); // 중복 바코드 확인 Ref

    // =============== 처리 state ===============
    const moveDateRef = useRef(''); // 이동일자 Text Ref
    const [sumList2, setSumList2] = useState([]); // 리스트 목록

    // =============== 출문증재발행 state ===============
    const shipmentDateRef = useRef(''); // 출하일자
    const [sumList6, setSumList6] = useState([]); // 출문증재발행 리스트
    const selectedReissueShipmentNumberRef = useRef(''); // 선택한 출하번호
    const [sumList7, setSumList7] = useState([]); // 출문증재발행 세부 리스트
    const [reissueBtnDisabled, setReissueBtnDisabled] = useState(true); // 재발행 버튼 Disabled

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
                shipmentDateRef.current =
                    data[0].value.substring(0, 4) +
                    '-' +
                    data[0].value.substring(5, 7) +
                    '-' +
                    data[0].value.substring(8, 10);
            })
            .catch((error) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + error.message;
                setDialogOpen(true);
                vibration();
                return;
            });

        document.addEventListener('message', onMessage);

        // 화면 초기 로드시 쓰레기 데이터 삭제
        initData();

        return () => {
            // 쓰레기 데이터 삭제
            initData();

            console.log('handle 지움');
            document.removeEventListener('message', onMessage);
        };
    }, []);

    // Tab 변경시 이벤트
    useEffect(() => {
        tabsValueRef.current = tabsValue;

        // 창고 Tabs
        if (tabsValue === 0) {
            reset('창고탭로드');
            onMessageGubunRef.current = '창고탭로드';
            // webView 데이터 요청
            webViewPostMessage();
        }
        // 이동 Tabs
        else if (tabsValue === 1) {
            reset('이동탭로드');
        }
        // 처리 Tabs
        else if (tabsValue === 2) {
            reset('처리탭로드');
            onMessageGubunRef.current = '처리탭로드';
            // webView 데이터 요청
            webViewPostMessage();
        } else {
            //출문증재발행 Tabs
            reset('reissueList');
            onMessageGubunRef.current = '출문증재발행탭로드';
            // webView 데이터 요청
            webViewPostMessage();
        }
    }, [tabsValue]);

    // 라디오 버튼 (이동위치) 변경시 Ref 지정 - [창고]
    useEffect(() => {
        radioStateRef.current = radioState;
    }, [radioState]);

    // 이동위치 변경시 value Ref 지정 - [창고]
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

    // 출문증 재발행 데이터 있을시 재발행 버튼 활성화 - [출문증 재발행]
    useEffect(() => {
        if (sumList7.length > 0) {
            setReissueBtnDisabled(false);
        }
    }, [sumList7]);

    // webView 데이터 요청
    const webViewPostMessage = () => {
        // React Native WebView로 Wifi 신호 강도 데이터 요청
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GET_WIFI_CURRENT_SIGNAL_STRENGTH' }));
        }
    };

    //초기화
    const reset = (gubun) => {
        if (gubun === '창고탭로드') {
            setradioState('select');
            textCurrentLocationRef.current = '';
            textMoveLocationRef.current = '';
        } else if (gubun === '이동탭로드' || gubun === '리스트추가완료') {
            barcodeRef.current.value = '';
            scanLocationRef.current = 'barcodeScan';
            textPartIdRef.current = '';
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            moveQtyRef.current.value = '';
            setMoveQtyAllCheck(false);
            setAddListBtnDisabled(true);
            if (gubun === '이동탭로드') {
                setSumList1([]);
                lotListRef.current = [];
            }
            if (gubun === '리스트추가완료') {
                //window.scrollTo({top: 0});
            }
        } else if (gubun === '처리탭로드') {
            setSumList2([]);
        } else if (gubun === 'reset') {
            textCurrentLocationRef.current = '';
            textMoveLocationRef.current = '';
            barcodeRef.current.value = '';
            textPartIdRef.current = '';
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            moveQtyRef.current.value = '';
            setMoveQtyAllCheck(false);
            setAddListBtnDisabled(true);
            //window.scrollTo({top: 0});
        } else if (gubun === 'reissueList') {
            setSumList6([]);
            setSumList7([]);
            setReissueBtnDisabled(true);
        }
    };

    // React Native WebView 에서 데이터 가져오기
    const ReadData = (e) => {
        const type = JSON.parse(e.data).type;
        console.log('ReadData : ', type);

        // Wifi 신호 강도 불러오기
        if (type === 'GET_WIFI_CURRENT_SIGNAL_STRENGTH') {
            const { wifiCurrentSignalStrength, type } = JSON.parse(e.data);
            console.log('Wifi 신호 강도 [부품표위치이동]', wifiCurrentSignalStrength);
            console.log(onMessageGubunRef.current);

            // wifi 신호가 약할때
            if (wifiCurrentSignalStrength <= -85) {
                if (tabsValueRef.current === 3) {
                    if (onMessageGubunRef.current === '출하일자변경') {
                        reset('reissueList');
                    } else if (onMessageGubunRef.current === '출문증재발행리스트클릭') {
                        reset('reissueList');
                    }
                }

                msg = '무선랜 신호가 약하거나 끊겼습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            // wifi 신호가 정상일때
            else {
                // 창고 Tabs
                if (tabsValueRef.current === 0) {
                    if (onMessageGubunRef.current === '창고탭로드') {
                        // 이동창고 조회
                        loadLoc();
                    }
                }
                // 이동 Tabs
                else if (tabsValueRef.current === 1) {
                    if (onMessageGubunRef.current === '리스트추가') {
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
                else if (tabsValueRef.current === 2) {
                    if (onMessageGubunRef.current === '처리탭로드' || onMessageGubunRef.current === '이동일자변경') {
                        // 처리이력 조회
                        loadProcessHistoryData();
                    }
                }
                // 출문증재발행 Tabs
                else {
                    if (onMessageGubunRef.current === '출문증재발행탭로드') {
                        // 출문증 재발행 조회
                        loadReissuanceOfPassport();
                    } else if (onMessageGubunRef.current === '출하일자변경') {
                        // 출문증 재발행 조회
                        loadReissuanceOfPassport();
                    } else if (onMessageGubunRef.current === '출문증재발행리스트클릭') {
                        // 출문증 세부목록조회
                        loadOutPageDetailData();
                    } else if (onMessageGubunRef.current === '재발행') {
                        // 재발행
                        printReissuanceOfPassport();
                    }
                }
            }
        }
        // 바코드 스캔시 이벤트
        else if (type === 'SCANDATA') {
            const { scannedData, scannedLabelType, type } = JSON.parse(e.data);
            console.log('스캔한 바코드 = ' + scannedData.data);

            // 이동 Tabs
            if (tabsValueRef.current === 1) {
                // 바코드 스캔
                if (scanLocationRef.current === 'barcodeScan') {
                    if (scannedData.data.length !== 25) {
                        msg = '올바른 바코드 형식이 아닙니다.';
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
                        }
                    }

                    // 바코드의 LOT_NO 위치 앞 두 글자 중 문자가 포함되면 부품표 정보조회
                    if (isNaN(scannedData.data.substring(17, 18)) || isNaN(scannedData.data.substring(18, 19))) {
                        showMinfo(scannedData.data);
                    }
                    // 바코드의 LOT_NO 위치 앞 두 글자가 숫자이면 입고표 정보조회
                    else {
                        showInfo(scannedData.data);
                    }
                }
            }
        }
    };

    // 화면 초기 로드시 쓰레기 데이터 삭제
    const initData = () => {
        const requestOption = getRequestOptions(PROC_PK_PDA_RealIV02_2_D, getRequestParam(pda_mac_address, pda_id));

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
            .catch((error) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + error.message;
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
    };

    // 이동창고 조회 -> 입고표 바코드 정보로 FROM 위치 설정하므로 FROM 위치는 필요없으며 바로 TO 위치 설정
    const loadLoc = () => {
        const requestOption = getRequestOptions(PROC_PK_PDA_DV06_1_L, getRequestParam(pda_plant_id));

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

                    let isLocId = 'LOC_ID' in tmpArray[0]; // SUB_LOC_ID 컬럼 존재 여부

                    if (tmpArray.length !== 0) {
                        // LOC_ID 컬럼 존재시
                        if (isLocId) {
                            const tmpCurrentToLocationArray = locationLocIdArray(tmpArray);

                            comboBoxMoveLocationStorageRef.current = tmpCurrentToLocationArray;

                            if (tmpCurrentToLocationArray.length > 0) {
                                setSelectedComboBoxMoveLocationStorage(tmpCurrentToLocationArray[0]);
                            }
                        }
                    }
                }
                setBackdropOpen(false);
            })
            .catch((error) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + error.message;
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
    };

    // 입고표 조회
    const showInfo = (scanData) => {
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

        let unit_qty = scanData.substring(10, 17);
        let substringValue2;

        for (let i = 0; unit_qty.length; i++) {
            substringValue2 = unit_qty.substring(i, i + 1);

            if (substringValue2.toString() !== '0') {
                unit_qty = unit_qty.substring(i);
                break;
            }
        }

        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV06_4_L,
            getRequestParam(textCurrentLocationRef.current, lot_no, inv_id, pda_plant_id, scanData)
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
                    textCurrentLocationRef.current = tmpArray[0]['LOCATION_ID'];
                    barcodeRef.current.value = scanData;
                    textPartIdRef.current = tmpArray[0]['PART_ID'];
                    textTotalQtyRef.current = parseInt(parseFloat(tmpArray[0]['INV_QTY']));
                    textUnitQtyRef.current = unit_qty;
                    moveQtyRef.current.value = '1';
                    moveQtyRef.current.focus();
                    window.scrollTo({ top: 140 });
                    setAddListBtnDisabled(false);
                }
                setBackdropOpen(false);
            })
            .catch((error) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + error.message;
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
    };

    // 부품표 조회 (PART_ID)
    const showMinfo = (scanData) => {
        let inv_id = scanData.substring(3, 10);
        let substringValue;

        for (let i = 0; inv_id.length; i++) {
            substringValue = inv_id.substring(i, i + 1);

            if (substringValue.toString() !== '0') {
                inv_id = inv_id.substring(i);
                break;
            }
        }

        const requestOption = getRequestOptions(PROC_PK_PDA_DV06_6_L, getRequestParam(inv_id, pda_plant_id, scanData));

        setBackdropOpen(true);
        fetch(PDA_API_GENERAL_URL, requestOption)
            .then((res) => res.json()) //json으로 파싱
            .then((data) => {
                // 사용자 메시지 처리
                if (data.returnUserMessage !== null) {
                    msg = data.returnUserMessage;
                    setDialogOpen(true);
                    vibration();
                    reset('scanFail');
                    setBackdropOpen(false);
                    return;
                }
                // 에러 메시지 처리
                else if (data.returnErrorMsg !== null) {
                    msg = data.returnErrorMsg;
                    setDialogOpen(true);
                    vibration();
                    reset('scanFail');
                    setBackdropOpen(false);
                    return;
                }
                // 결과 처리
                else {
                    const tmpArray = JSON.parse(data.returnValue[0]);
                    barcodeRef.current.value = scanData;
                    textPartIdRef.current = tmpArray[0]['PART_ID'];
                    showMloc(scanData);
                }
                setBackdropOpen(false);
            })
            .catch((error) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + error.message;
                setDialogOpen(true);
                vibration();
                reset('scanFail');
                setBackdropOpen(false);
                return;
            });
    };

    // 부품표 조회 (INV_QTY)
    const showMloc = (scanData) => {
        let inv_id = scanData.substring(3, 10);
        let substringValue1;

        for (let i = 0; i < inv_id.length; i++) {
            substringValue1 = inv_id.substring(i, i + 1);
            if (substringValue1.toString() !== '0') {
                inv_id = inv_id.substring(i);
                break;
            }
        }

        let unit_qty = scanData.substring(10, 17);
        let substringValue2;

        for (let i = 0; i < unit_qty.length; i++) {
            substringValue2 = unit_qty.substring(i, i + 1);
            if (substringValue2.toString() !== '0') {
                unit_qty = unit_qty.substring(i);
                break;
            }
        }

        let lot_no = scanData.substring(17);

        textUnitQtyRef.current = unit_qty;
        moveQtyRef.current = '1';

        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV06_7_L,
            getRequestParam(inv_id, lot_no, pda_plant_id, unit_qty, textCurrentLocationRef.current)
        );

        fetch(PDA_API_GENERAL_URL, requestOption)
            .then((res) => res.json())
            .then((data) => {
                if (data.returnUserMessage !== null) {
                    msg = data.returnUserMessage;
                    setDialogOpen(true);
                    vibration();
                    reset('scanFail');
                    return;
                } else if (data.returnErrorMsg !== null) {
                    msg = data.returnErrorMsg;
                    setDialogOpen(true);
                    vibration();
                    reset('scanFail');
                    return;
                }
                // 결과 처리
                else {
                    const tmpArray = JSON.parse(data.returnValue[0]);
                    textTotalQtyRef.current = tmpArray[0]['INV_QTY'];
                    saveDataAddDataList();
                    return;
                }
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
        if (
            textCurrentLocationRef.current === '' ||
            textMoveLocationRef.current === '' ||
            barcodeRef.current.value === '' ||
            textPartIdRef.current === '' ||
            move_qty === 0
        ) {
            msg = '비어있는 항목이나 수량을 확인하세요.';
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
                    PROC_PK_PDA_DV06_1_S2,
                    getRequestParam(
                        transNowDate,
                        textCurrentLocationRef.current,
                        textMoveLocationRef.current,
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
                                    MOVE_LOCATION: textMoveLocationRef.current,
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
                        return;
                    })
                    .catch((error) => {
                        msg = COMMON_MESSAGE.FETCH_ERROR + error.message;
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
            PROC_PK_PDA_RealIV02_1_D,
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
                }
                setBackdropOpen(false);
            })
            .catch((error) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + error.message;
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
            PROC_PK_PDA_DV06_3_S,
            getRequestParam(transNowDate, pda_mac_address, pda_id, pda_plant_id, productCheckRef.current)
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
                    msg = '이동확정이 완료되었습니다.';
                    setDialogOpen(true);
                    setBackdropOpen(false);
                    return;
                }
            })
            .catch((error) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + error.message;
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
            PROC_PK_PDA_DV06_5_L,
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
                        tmpArray[0]['LOT_NO'] === '' &&
                        tmpArray[0]['단위'] === '' &&
                        tmpArray[0]['이동량'] === '' &&
                        tmpArray[0]['이동위치'] === '' &&
                        tmpArray[0]['처리시각'] === '' &&
                        tmpArray[0]['품명'] === '' &&
                        tmpArray[0]['품번'] === ''
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
                        OUTPUT_QTY: data.이동량,
                        UNIT: data.단위,
                        MOVE_LOCATION: data.이동위치,
                        PROCESS_TIME: data.처리시각,
                    }));

                    setSumList2(sumArray);
                }
                setBackdropOpen(false);
            })
            .catch((error) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + error.message;
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
    };

    // 출문증 재발행 조회
    const loadReissuanceOfPassport = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV07_4_L,
            getRequestParam(shipmentDateRef.current, pda_mac_address, pda_id, pda_plant_id)
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
                        tmpArray[0]['출하처'] === '' &&
                        tmpArray[0]['차량'] === '' &&
                        tmpArray[0]['출하량'] === '' &&
                        tmpArray[0]['출하번호'] === ''
                    ) {
                        msg = '지정한 날짜에 대한 출문증이 없습니다.';
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    }
                    sumArray = tmpArray.map((data) => ({
                        id: data.출하번호,
                        SHIPMENT_TO: data.출하처,
                        VEHICLE: data.차량,
                        SHIPMENT_QTY: data.출하량,
                        SHIPMENT_NUMBER: data.출하번호,
                    }));

                    setSumList6(sumArray);
                }
                setBackdropOpen(false);
            })
            .catch((error) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + error.message;
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
    };

    // 출문증 세부목록 조회
    const loadOutPageDetailData = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV07_5_L,
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

                    console.log(tmpArray);

                    let sumArray = [];

                    if (tmpArray[0]['품번'] === '' && tmpArray[0]['LOT_No'] === '' && tmpArray[0]['수량'] === '') {
                        msg = '선택한 출문증에 대한 세부목록이 없습니다.';
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    }
                    sumArray = tmpArray.map((data) => ({
                        id: data.품번,
                        PART_ID: data.품번,
                        LOT_NO: data.LOT_No,
                        QTY: data.수량,
                    }));

                    setSumList7(sumArray);
                }
                setBackdropOpen(false);
            })
            .catch((error) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + error.message;
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
    };

    // 출문증 재발행
    const printReissuanceOfPassport = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV01_Reprt,
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
            .catch((error) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + error.message;
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
    };

    // Tabs 변경시 이벤트
    const handleChange = (event, newValue) => {
        console.log(radioState);
        console.log(tabsValue);
        console.log(moveLocationStorageRef.current);
        if (newValue === 1) {
            if (tabsValue === 0) {
                if (radioState === 'select') {
                    if (selectedComboBoxMoveLocationStorage.value === '') {
                        msg = '이동창고를 선택하지 않았습니다.';
                        setDialogOpen(true);
                        vibration();
                        setTabsValue(0);
                        return;
                    } else {
                        textMoveLocationRef.current = selectedComboBoxMoveLocationStorage.value;
                    }
                }
            }
        } else if (newValue === 0 || newValue === 2) {
            if (tabsValue === 1) {
                if (sumList1.length > 0) {
                    msg = '현재 이동 진행 중인 품번이 있습니다. 초기화하시겠습니까?';
                    setDialogCustomrRestOpen(true);
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
                setTabsValue(0);
            }
            setDialogOkay('');
        },

        // 다이얼로그 커스텀 닫기 이벤트
        dialogOnCancel: (e) => {
            setDialogCustomOpen(false);
            setDialogCustomrRestOpen(false);

            if (dialogOkay === '스캔한위치사용') {
                moveLocationStorageRef.current.value = '';
            }
            setDialogOkay('');
        },

        // 다이얼로그 커스텀 확인 이벤트
        dialogOnOkay: (e) => {
            setDialogCustomOpen(false);
            setDialogCustomrRestOpen(false);

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
            } else if (dialogOkay === '재발행') {
                onMessageGubunRef.current = '재발행';
                // webView 데이터 요청
                webViewPostMessage();
            }
        },

        // =========================================창고 Tabs 이벤트 =========================================

        // 이동위치선택 라디오버튼
        onRadio2Changed: (e) => {
            const gubun = e.target.value;

            if (gubun === 'select') {
                moveLocationStorageRef.current.value = '';
                scanLocationRef.current = 'currentLocation';
            } else {
                moveLocationStorageRef.current.value = '';
                scanLocationRef.current = 'moveLocation';
            }
            setradioState(e.target.value);
        },

        // 이동위치 셀렉트 선택
        onCmb_moveLocationStorageChanged: (e) => {
            const tmpdata = comboBoxMoveLocationStorageRef.current.filter((data) => data.value === e.target.value);
            setSelectedComboBoxMoveLocationStorage(tmpdata[0]);
        },

        // 제품 식별표 프린터 여부 클릭 이벤트
        clickCheckbox: (e) => {
            if (e.target.checked) {
                setProductCheck(true);
                productCheckRef.current = 'Y';
            } else {
                setProductCheck(false);
                productCheckRef.current = 'N';
            }
        },

        // ========================================= 이동 Tabs 이벤트 =========================================

        // 바코드 X 버튼 이벤트
        onBtnClearBarcode: (e) => {
            barcodeRef.current.value = '';
        },

        // 바코드 키인 이벤트
        onBarcodeKeyUp: (e) => {
            const scanData = e.target.value;

            if (e.keyCode === 13) {
                if (scanData.length !== 25) {
                    msg = '올바른 바코드 형식이 아닙니다.';
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
                        // 현재정보 표시
                        showInfo(scanData);
                    }
                } else {
                    // 현재정보 표시
                    showInfo(scanData);
                }
            }
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

        // ========================================= 처리 Tabs 이벤트 =========================================

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

        // ========================================= 출문증재발행 Tabs 이벤트 =========================================

        // 출하일자 변경시 이벤트
        onShipmentRequestDateChange: (e) => {
            if (e.target.value === '') {
                msg = '출하일자를 선택해주세요.';
                setDialogOpen(true);
                vibration();
                return;
            } else {
                shipmentDateRef.current = e.target.value;
                forceUpdate();

                reset('reissueList');
                onMessageGubunRef.current = '출하일자변경';
                // webView 데이터 요청
                webViewPostMessage();
            }
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
            if (sumList6.length === 0) {
                msg = '발행할 데이터가 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            msg = '재발행하시겠습니까?';
            setDialogCustomOpen(true);
            setDialogOkay('재발행');
        },
        // =========================================================
    };

    // 라디오 버튼 데이터 (이동위치)
    const dataList = [{ label: '이동창고선택', value: 'select' }];

    // 이동탭 그리드 컬럼 데이터
    let columns1 = [
        { field: 'PART_ID', headerName: '품번', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'LOT NO', width: 100, headerAlign: 'left', align: 'left' },
        { field: 'MOVE_QTY', headerName: '이동량', width: 80, headerAlign: 'right', align: 'right' },
        { field: 'CURRENT_LOCATION', headerName: '현재위치', width: 110, headerAlign: 'left', align: 'left' },
        { field: 'MOVE_LOCATION', headerName: '이동위치', width: 100, headerAlign: 'left', align: 'left' },
    ];

    // 처리탭 컬럼 컬럼 데이터
    let columns2 = [
        { field: 'PART_ID', headerName: '품번', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'PART_NAME', headerName: '품명', width: 200, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'LOT NO', width: 100, headerAlign: 'left', align: 'left' },
        { field: 'UNIT', headerName: '단위', width: 80, headerAlign: 'right', align: 'right' },
        { field: 'OUTPUT_QTY', headerName: '이동량', width: 60, headerAlign: 'left', align: 'left' },
        { field: 'MOVE_LOCATION', headerName: '이동위치', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'PROCESS_TIME', headerName: '처리시각', width: 120, headerAlign: 'left', align: 'left' },
    ];

    // 출문증 출하 정보 컬럼 데이터
    let columns6 = [
        { field: 'SHIPMENT_TO', headerName: '출하처', width: 180, headerAlign: 'left', align: 'left' },
        { field: 'VEHICLE', headerName: '차량', width: 80, headerAlign: 'left', align: 'left' },
        { field: 'SHIPMENT_QTY', headerName: '출하량', width: 75, headerAlign: 'right', align: 'right' },
        { field: 'SHIPMENT_NUMBER', headerName: '출하번호', width: 120, headerAlign: 'left', align: 'left' },
    ];

    // 출문증 출하품 정보 컬럼 데이터
    let columns7 = [
        { field: 'PART_ID', headerName: '품번', width: 130, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'LOT.No', width: 125, headerAlign: 'left', align: 'left' },
        { field: 'QTY', headerName: '수량', width: 80, headerAlign: 'right', align: 'right' },
    ];

    return (
        <>
            <div className={classes.root}>
                {/* ================================================================================== */}
                {/* 창고 */}
                <AcsTabPanel value={tabsValue} index={0}>
                    <AcsRadioButton dataList={dataList} value={radioState} onChange={eventhandler.onRadio2Changed} />
                    <AcsSelect
                        className={`${classes.selectStorage} ${classes.marginBottom}`}
                        labelText={'창고명'}
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
                    <AcsCheckBox
                        className={`${classes.test2}`}
                        label={'제품 식별표 프린터 여부'}
                        id="checkbox_productCheck"
                        checked={productCheck}
                        onChange={eventhandler.clickCheckbox}
                    />
                </AcsTabPanel>
                {/* ================================================================================== */}
                {/* 이동 */}
                <AcsTabPanel value={tabsValue} index={1}>
                    <div className={`${classes.flexDiv}`}>
                        <AcsTextField
                            className={`${classes.marginRight} ${classes.marginBottom} ${classes.text} ${classes.textDisabled}`}
                            label={'현재위치'}
                            id="txtCurrentLocation"
                            disabled
                            value={textCurrentLocationRef.current}
                        />
                        <AcsTextField
                            className={`${classes.marginBottom} ${classes.text} ${classes.textDisabled}`}
                            label={'이동위치'}
                            id="txtMoveLocation"
                            disabled
                            value={textMoveLocationRef.current}
                        />
                    </div>
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
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text} ${classes.textDisabled}`}
                        label={'품번'}
                        id="txtPartId"
                        disabled
                        value={textPartIdRef.current}
                    />
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
                            className={`${classes.marginRight} ${classes.flexButton}`}
                            fullWidth
                            variant="contained"
                            style={{ backgroundColor: addListBtnDisabled ? 'lightgray' : '#f7b13d' }}
                            disabled={addListBtnDisabled}
                            onClick={eventhandler.onAddListBtnClick}
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
                        className={`${classes.dataGridOdd} ${classes.dataGridMargin}`}
                        cols={columns1}
                        rows={sumList1}
                        height="200px"
                    />
                    <Button
                        className={`${classes.button} ${classes.half} ${classes.halfMargin} `}
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
                        onClick={eventhandler.onMoveCompleteBtnClick}
                    >
                        {'이동확정'}
                    </AcsBadgeButton>
                </AcsTabPanel>
                {/* ================================================================================== */}
                {/* 처리 */}
                <AcsTabPanel value={tabsValue} index={2}>
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

                {/* 출문증재 */}
                <AcsTabPanel value={tabsValue} index={3}>
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text}`}
                        label={'출하일자'}
                        id="id"
                        type="date"
                        value={shipmentDateRef.current}
                        onChange={eventhandler.onShipmentRequestDateChange}
                    />
                    <AcsDataGrid
                        className={`${classes.dataGridOdd}`}
                        cols={columns6}
                        rows={sumList6}
                        onRowSelected={eventhandler.onReissueShipmentDateRowSelected}
                    />
                    <AcsDataGrid className={`${classes.dataGridOdd}`} cols={columns7} rows={sumList7} height="200px" />
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
                                    {'창고'}
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
                                    {'이동'}
                                </span>
                            }
                        />
                        <Tab
                            wrapped
                            label={
                                <span
                                    className={`${tabsValue === 2 ? classes.activeTab : classes.customStyleOnTab} ${
                                        classes.tab
                                    }`}
                                >
                                    {'처리'}
                                </span>
                            }
                        />
                        <Tab
                            wrapped
                            label={
                                <span
                                    className={`${tabsValue === 3 ? classes.activeTab : classes.customStyleOnTab} ${
                                        classes.tab
                                    }`}
                                >
                                    {'출문증재'}
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
