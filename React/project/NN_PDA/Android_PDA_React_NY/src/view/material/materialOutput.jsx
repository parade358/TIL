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

const PROC_PK_PDA_IV05_1_Init_D = 'U_PK_PDA_IV05_1_Init_D'; // 초기화
const PROC_PK_PDA_IV05_7_L = 'U_PK_PDA_IV05_7_L'; // 작업장별 재고조회
const PROC_PK_PDA_IV05_1_L = 'U_PK_PDA_IV05_1_L'; // 작업장 정보
const PROC_PK_PDA_IV05_6_L = 'U_PK_PDA_IV05_6_L'; // 선택된 품목명 조회
const PROC_PK_PDA_IV05_9_L = 'U_PK_PDA_IV05_9_L'; // 선택된 자재에 대한 출고처리화면 데이터 조회
const PROC_PK_PDA_IV05_3_L = 'U_PK_PDA_IV05_3_L'; // 선택된 품번이 존재하는 위치 조회
const PROC_PK_PDA_IV05_4_L = 'U_PK_PDA_IV05_4_L'; // 대표위치 스캔시 위치검증
const PROC_PK_PDA_IV05_5_L = 'U_PK_PDA_IV05_5_L'; // 바코드 스캔
const PROC_PK_PDA_IV05_1_S = 'U_PK_PDA_IV05_1_S'; // 목록 저장
const PROC_PK_PDA_IV05_1_D = 'U_PK_PDA_IV05_1_D'; // 삭제
const PROC_PK_PDA_IV05_Confirm_S = 'U_PK_PDA_IV05_Confirm_S'; // 출고확정

let msg = '';
let transOutDate = '';
let iCurIdx; //선택한 자재 index 저장(tabControl 0페이지로 넘어왔을 때 이전에 작업한 자재위치 저장)
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

// 작업장 배열
const workShopArray = (obj) => {
    return obj.map((data) => ({
        label: data.U_LINE_NAME,
        value: data.U_LINE_ID,
    }));
};

// 창고, LOT 배열
const storageLotArray = (obj) => {
    return obj.map((data) => ({
        label: data.LOCNAME,
        value: data.LOC_ID + ';' + data.LOCNAME,
    }));
};

function MaterialOutput() {
    const classes = useStyle(); // CSS 스타일
    const [tabsValue, setTabsValue] = useState(0); // Tabs 구분
    const tabsValueRef = useRef(0); // Tabs 구분 Ref
    const todayDateRef = useRef('');
    const [resestTabsValue, setResestTabsValue] = useState(1); // 출고 탭에서 출고 진행 중인 소재가 있을 경우 초기화한 후 이동할 Tabs
    const [dialogOpen, setDialogOpen] = useState(false); // 다이얼로그 (메시지창)
    const [dialogCustomOpen, setDialogCustomOpen] = useState(false); // 다이얼로그 (메시지창)
    const [dialogCustomrRestOpen, setDialogCustomrRestOpen] = useState(false); // 다이얼로그 커스텀 (메시지창) - 출고 탭에서 출고 진행 중인 소재가 있을 경우 초기화 여부 묻는 Dialog
    const [dialogOkay, setDialogOkay] = useState(''); // 확인, 삭제 구분
    const [backdropOpen, setBackdropOpen] = useState(false); // 대기
    const pda_id = localStorage.getItem('PDA_ID'); // 사용자 ID
    const pda_plant_id = localStorage.getItem('PDA_PLANT_ID'); // 공장 ID
    const pda_mac_address = localStorage.getItem('PDA_MAC_ADDRESS'); // PDA Mac Address
    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []); // WebView에서 받아온 데이터
    const onMessageGubunRef = useRef('작업장재고1'); // WebView로 데이터 요청 후 작업에 대한 구분
    const scanLocationRef = useRef('barcode'); // 바코드 스캔 위치
    // ===========================================================================================================================
    // 작업장재고 Tabs state
    const [comboBoxWorkShop, setComboBoxWorkShop] = useState([]); // 작업장 comboBox
    const [selectedComboBoxWorkShop, setSelectedComboBoxWorkShop] = useState({ value: '', label: '' }); // 선택된 작업장 comboBox
    const [sumList1, setSumList1] = useState([]); // 리스트 목록
    const [partName, setPartName] = useState(''); // 리스트에서 선택한 자재에 대한 품명
    const selectedRow = useRef(''); // 리스트에서 선택한 로우
    // ===========================================================================================================================
    // 출고 Tabs state
    const textWorkShopRef = useRef(''); // 작업장 Text Ref
    const [textPartId, setTextPartId] = useState(''); // 품번 Text
    const [radioState, setRadioState] = useState('select'); // 라디오 버튼
    const radioStateRef = useRef('select'); // 라디오 버튼 Ref
    const [comboBoxStorageLot, setComboBoxStorageLot] = useState([]); // 창고, LOT comboBox
    const [selectedComboBoxStorageLot, setSelectedComboBoxStorageLot] = useState({ value: '', label: '' }); // 선택된 창고, LOT comboBox
    const selectedComboBoxStorageLotValueRef = useRef(''); // 선택된 창고, LOT value Ref
    const locationRef = useRef(''); // 스캔 대표위치 Text
    const barcodeRef = useRef(''); // 스캔 바코드 Text
    const textLotNoRef = useRef(''); // 스캔한 바코드의 Lot No Text Ref
    const textTotalQtyRef = useRef(0); // 총수량 Text Ref
    const textUnitQtyRef = useRef(0); // 출고수량 Text Ref
    const outQtyRef = useRef(''); // 출고개수 Text
    const [outQtyAllChecked, setOutQtyAllChecked] = useState(false); // 체크박스 전체출고여부
    const outQtyAllCheckedRef = useRef(false); // 체크박스 전체출고여부 Ref
    const [addListBtnDisabled, setAddListBtnDisabled] = useState(true); // 추가 버튼 Disabled
    const sumList2Ref = useRef([]); // 리스트 목록
    const lotListRef = useRef([]);
    const selectionModelRef = useRef([]); // 체크박스에 체크된 것들 Ref
    // ===========================================================================================================================

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
        workShopDataLoad(); // 테스트
        return () => {
            // 쓰레기 데이터 존재하면 삭제
            initData();

            console.log('handle 지움');
            document.removeEventListener('message', onMessage);
        };
    }, []);

    // Tab 변경시 이벤트
    useEffect(() => {
        // 작업장재고 Tabs
        if (tabsValue === 0) {
            onMessageGubunRef.current = '작업장재고2';
            // webView 데이터 요청
            webViewPostMessage();
        }
        // 출고 Tabs
        else {
            // 선택한 자재 출고처리화면으로 넘김
            selectPartOutProcessingScreen();
        }
    }, [tabsValue]);

    // 작업장 변경시 이벤트 (작업장별 재고조회) - [작업장재고]
    useEffect(() => {
        if (selectedComboBoxWorkShop.value !== '') {
            const requestOption = getRequestOptions(
                PROC_PK_PDA_IV05_7_L,
                getRequestParam(selectedComboBoxWorkShop.value, pda_plant_id)
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
                            tmpArray[0]['소재'] === '' &&
                            tmpArray[0]['품목명'] === '' &&
                            tmpArray[0]['소요수량'] === '' &&
                            tmpArray[0]['현창재고'] === '' &&
                            tmpArray[0]['필요수량'] === '' &&
                            tmpArray[0]['창고재고'] === '' &&
                            tmpArray[0]['라인'] === ''
                        ) {
                            msg = '선택한 작업장에 대한 재고가 없습니다.';
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            return;
                        }
                        sumArray = tmpArray.map((data) => ({
                            id: data.소재,
                            PART_ID: data.소재,
                            PART_NAME: data.품목명,
                            COST_QTY: data.소요수량,
                            CURRENT_STORAGE_INVENTORY: data.현창재고,
                            REQUIRED_QTY: data.필요수량,
                            STORAGE_INNVENTORY: data.창고재고,
                            LINE: data.라인,
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
        } else {
            return;
        }
    }, [selectedComboBoxWorkShop]);

    // 작업장, 품번 변경시 이벤트 (위치 조회) - [출고]
    useEffect(() => {
        if (textWorkShopRef.current !== '' && textPartId !== '') {
            selectPartExistenceLocationLoad();
        }
    }, [textWorkShopRef.current, textPartId]);

    // 창고, LOT 변경시 Ref에 value지정 - [출고]
    useEffect(() => {
        selectedComboBoxStorageLotValueRef.current = selectedComboBoxStorageLot.value.substring(
            0,
            selectedComboBoxStorageLot.value.indexOf(';')
        );
    }, [selectedComboBoxStorageLot]);

    // 쓰레기 데이터 존재하면 삭제
    const initData = () => {
        const requestOption = getRequestOptions(PROC_PK_PDA_IV05_1_Init_D, getRequestParam(pda_mac_address, pda_id));

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
                    if (dialogOkay === '출고중인소재초기화') {
                        setTabsValue(resestTabsValue);
                        tabsValueRef.current = resestTabsValue;
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

    // webView 데이터 요청
    const webViewPostMessage = () => {
        // React Native WebView로 Wifi 신호 강도 데이터 요청
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GET_WIFI_CURRENT_SIGNAL_STRENGTH' }));
        }
    };

    // 1. React Native WebView 에서 데이터 가져오기
    // 2. 작업장 데이터 로드
    const ReadData = (e) => {
        const type = JSON.parse(e.data).type;
        console.log('ReadData : ', type);

        // Wifi 신호 강도 불러오기
        if (type === 'GET_WIFI_CURRENT_SIGNAL_STRENGTH') {
            const { wifiCurrentSignalStrength, type } = JSON.parse(e.data);

            console.log('Wifi 신호 강도 [자재출고]', wifiCurrentSignalStrength);

            // wifi 신호가 약할때
            if (wifiCurrentSignalStrength <= -85) {
                // 작업장재고 Tabs
                if (tabsValueRef.current === 0) {
                    // 처음 로드시 (작업장재고 1), Tab 변경시 (작업장재고 2)
                    if (onMessageGubunRef.current === '작업장재고1' || onMessageGubunRef.current === '작업장재고2') {
                        reset('작업장재고');
                    }
                    // 리스트에서 ROW 선택시
                    else if (onMessageGubunRef.current === '작업장재고3') {
                        setSumList1([]);
                    }
                }
                msg = '무선랜 신호가 약하거나 끊겼습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            // wifi 신호가 정상일때
            else {
                console.log(onMessageGubunRef.current);
                // 작업장재고 Tabs
                if (tabsValueRef.current === 0) {
                    // 처음 로드시 (작업장재고 1), Tab 변경시 (작업장재고 2)
                    if (onMessageGubunRef.current === '작업장재고1' || onMessageGubunRef.current === '작업장재고2') {
                        // 작업장 데이터 로드
                        workShopDataLoad();
                    }
                    // 리스트에서 ROW 선택시
                    else if (onMessageGubunRef.current === '작업장재고3') {
                        // 선택된 품목명 표시
                        selectedPartNameLoad();
                    }
                    // 선택한 자재 출고처리화면으로 넘김
                    else if (onMessageGubunRef.current === '작업장재고4') {
                        setTabsValue(1);
                        tabsValueRef.current = 1;
                    }
                }
                // 출고 Tabs
                else {
                    if (onMessageGubunRef.current === '출고2') {
                        // 목록저장, 리스트에 데이터 추가
                        saveDataAddDataList();
                    } else if (onMessageGubunRef.current === '삭제') {
                        // 선택한 데이터 목록 삭제, 리스트에 데이터 삭제
                        deleteDataList();
                    } else if (onMessageGubunRef.current === '출고확정') {
                        // 출고확정
                        complete();
                    }
                }
            }
        }
        // 바코드 스캔시 이벤트
        else if (type === 'SCANDATA') {
            const { scannedData, scannedLabelType, type } = JSON.parse(e.data);
            console.log('스캔한 바코드 = ' + scannedData.data);

            if (
                onMessageGubunRef.current === '출고1' ||
                onMessageGubunRef.current === '출고2' ||
                onMessageGubunRef.current === '삭제' ||
                onMessageGubunRef.current === '출고확정'
            ) {
                // 대표위치 스캔
                if (radioStateRef.current === 'scan') {
                    if (scanLocationRef.current === 'location') {
                        if (scannedData.data === '') {
                            msg = '대표위치를 스캔해주세요.';
                            setDialogOpen(true);
                            vibration();
                            return;
                        }
                        if (scannedData.data.length === 25) {
                            msg = '부품표를 읽었습니다. 여기는 위치바코드를 스캔하는 곳입니다.';
                            setDialogOpen(true);
                            vibration();
                            locationRef.current.value = '';
                            return;
                        }
                        if (selectedRow.current === '') {
                            msg = '품번이 비었습니다.';
                            setDialogOpen(true);
                            vibration();
                            locationRef.current.value = '';
                            return;
                        }
                        barcodeInfo(scannedData.data, 'locationScan');
                    }
                }
                // 바코드 스캔
                if (scanLocationRef.current === 'barcode') {
                    if (scannedData.data === '') {
                        msg = '바코드를 스캔해주세요.';
                        setDialogOpen(true);
                        vibration();
                        return;
                    }
                    if (scannedData.data.length !== 25) {
                        msg = '올바른 바코드 형식이 아닙니다.';
                        setDialogOpen(true);
                        vibration();
                        barcodeRef.current.value = '';
                        return;
                    }
                    if (selectedRow.current === '') {
                        msg = '품번이 비었습니다.';
                        setDialogOpen(true);
                        vibration();
                        barcodeRef.current.value = '';
                        return;
                    }
                    if (selectedComboBoxStorageLot.length === 0) {
                        msg = '저장된 보관처가 없습니다.';
                        setDialogOpen(true);
                        vibration();
                        barcodeRef.current.value = '';
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
                            barcodeInfo(scannedData.data, 'barcodeScan');
                        }
                    } else {
                        barcodeInfo(scannedData.data, 'barcodeScan');
                    }
                }
            }
        }
    };

    // 바코드 스캔 처리
    const barcodeInfo = (scanData, gubun) => {
        // 대표위치 스캔
        if (gubun === 'locationScan') {
            const requestOption = getRequestOptions(
                PROC_PK_PDA_IV05_4_L,
                getRequestParam(scanData, selectedRow.current, pda_plant_id)
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
                        locationRef.current.value = '';
                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        locationRef.current.value = '';
                        return;
                    }
                    // 결과 처리
                    else {
                        locationRef.current.value = scanData;
                        scanLocationRef.current = 'barcode';
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
        // 바코드 스캔
        else {
            let lot_no = scanData.substring(17);
            let inv_id = scanData.substring(3, 10);
            let substringValue1;

            for (let i = 0; inv_id.length; i++) {
                substringValue1 = inv_id.substring(i, i + 1);

                if (substringValue1.toString() !== '0') {
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

            let requestOption;

            if (radioStateRef.current === 'select') {
                requestOption = getRequestOptions(
                    PROC_PK_PDA_IV05_5_L,
                    getRequestParam(
                        selectedComboBoxStorageLotValueRef.current,
                        selectedRow.current,
                        inv_id,
                        lot_no,
                        pda_plant_id
                    )
                );
            } else {
                requestOption = getRequestOptions(
                    PROC_PK_PDA_IV05_5_L,
                    getRequestParam(locationRef.current.value, selectedRow.current, inv_id, lot_no, pda_plant_id)
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
                        setBackdropOpen(false);
                        barcodeRef.current.value = '';
                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        barcodeRef.current.value = '';
                        return;
                    }
                    // 결과 처리
                    else {
                        const tmpArray = JSON.parse(data.returnValue[0]);

                        barcodeRef.current.value = scanData;
                        textLotNoRef.current = tmpArray[0]['LOT_NO'];
                        textTotalQtyRef.current = tmpArray[0]['IN_QTY'];
                        textUnitQtyRef.current = unit_qty;
                        outQtyRef.current.value = '1';
                        outQtyRef.current.focus();
                        outQtyRef.current.select();
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
        }
    };

    // Tabs 변경시 이벤트
    const handleChange = (event, newValue) => {
        if (tabsValue === 0) {
            if (selectedComboBoxWorkShop.value === '') {
                msg = '작업장을 선택해주세요!';
                setDialogOpen(true);
                vibration();
                return;
            }
            if (partName === '') {
                msg = '품번을 선택해주세요!';
                setDialogOpen(true);
                vibration();
                return;
            }
            if (selectedComboBoxWorkShop.value === '' && partName === '') {
                msg = '작업장과 품번을 선택해주세요!';
                setDialogOpen(true);
                vibration();
                return;
            }
        } else {
            if (sumList2Ref.current.length > 0) {
                msg = '현재 출고 진행 중인 소재가 있습니다. 초기화하시겠습니까?';
                setDialogCustomrRestOpen(true);
                setDialogOkay('출고중인소재초기화');
                setResestTabsValue(newValue);
                return;
            }
        }
        setTabsValue(newValue);
        tabsValueRef.current = newValue;
    };

    // 작업장 데이터 로드
    const workShopDataLoad = () => {
        setPartName('');
        const requestOption = getRequestOptions(PROC_PK_PDA_IV05_1_L, getRequestParam(pda_plant_id));

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
                    const tmpWorkShopArray = workShopArray(tmpArray);
                    setComboBoxWorkShop(tmpWorkShopArray);
                    if (tmpWorkShopArray.length > 0) {
                        setSelectedComboBoxWorkShop(tmpWorkShopArray[0]);
                    }
                }
            })
            .catch((data) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + data.value + 'workShopDataLoad';
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
        reset('작업장재고');
    };

    // 선택된 품목명 표시
    const selectedPartNameLoad = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_IV05_6_L,
            getRequestParam(selectedRow.current, pda_plant_id)
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

                    setPartName(tmpArray[0]['PART_NAME']);
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

    // 선택한 자재 출고처리화면으로 넘김
    const selectPartOutProcessingScreen = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_IV05_9_L,
            getRequestParam(selectedComboBoxWorkShop.value, pda_plant_id)
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
                    textWorkShopRef.current = tmpArray[0]['REM_LOC_ID'];
                    setTextPartId(selectedRow.current);

                    // 선택된 품번이 존재하는 위치 조회
                    onMessageGubunRef.current = '출고1';
                    // webView 데이터 요청
                    webViewPostMessage();
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

    // 선택된 품번이 존재하는 위치 조회
    const selectPartExistenceLocationLoad = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_IV05_3_L,
            getRequestParam(selectedRow.current, pda_plant_id)
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
                    const tmpStorageLotArray = storageLotArray(tmpArray);

                    setComboBoxStorageLot(tmpStorageLotArray);

                    if (tmpStorageLotArray.length > 0) {
                        setSelectedComboBoxStorageLot(tmpStorageLotArray[0]);
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

    // 스캔한 바코드 목록 저장, 리스트에 데이터 추가
    const saveDataAddDataList = () => {
        let out_qty = 0;
        let loc_id = null;

        if (textWorkShopRef.current === '' || selectedRow.current === '') {
            msg = '작업장 또는 품번이 비어있습니다.';
            setDialogOpen(true);
            vibration();
            return;
        }
        if (radioStateRef.current === 'select') {
            if (selectedComboBoxStorageLotValueRef.current !== '') {
                loc_id = selectedComboBoxStorageLotValueRef.current;
            } else {
                msg = '보관처 정보가 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
        } else {
            if (locationRef.current.value !== '') {
                loc_id = locationRef.current.value;
            } else {
                msg = '보관처를 스캔하세요.';
                setDialogOpen(true);
                vibration();
                scanLocationRef.current = 'location';
                return;
            }
        }
        if (outQtyAllCheckedRef.current) {
            if (textTotalQtyRef.current !== '') {
                out_qty = parseInt(textTotalQtyRef.current);
            } else {
                msg = '수량정보가 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
        } else {
            if (outQtyRef.current.value !== '' && textUnitQtyRef.current !== '') {
                out_qty = parseInt(outQtyRef.current.value) * parseInt(textUnitQtyRef.current);
            } else {
                msg = '수량을 입력하거나 전체를 선택하세요.';
                setDialogOpen(true);
                vibration();
                return;
            }
        }
        if (
            textWorkShopRef.current === '' ||
            selectedRow.current === '' ||
            barcodeRef.current.value === '' ||
            textLotNoRef.current === '' ||
            textTotalQtyRef.current === ''
        ) {
            msg = '비어있는 항목이 있습니다.';
            setDialogOpen(true);
            vibration();
            return;
        } else {
            if (parseInt(textTotalQtyRef.current) < parseInt(out_qty)) {
                msg = '입력한 수량이 총 수량보다 큽니다.';
                setDialogOpen(true);
                vibration();
                outQtyRef.current.value = '';
                outQtyRef.current.focus();
                return;
            }
            if (sumList2Ref.current.length > 0) {
                const duplicatedLocation = sumList2Ref.current.filter((data) => data['CURRENT_LOCATION'] === loc_id);

                if (duplicatedLocation.length > 0) {
                    msg = '저장하려는 보관처가 저장된 보관처와 동일한 항목입니다. 선택삭제 후 다시 저장하세요.';
                    setDialogOpen(true);
                    vibration();
                    reset('addDataList');
                    selectPartExistenceLocationLoad();
                    return;
                }
            }
            const transOutDateArray = todayDateRef.current.split('-');
            transOutDate = transOutDateArray[0] + transOutDateArray[1] + transOutDateArray[2];

            const requestOption = getRequestOptions(
                PROC_PK_PDA_IV05_1_S,
                getRequestParam(
                    transOutDate,
                    selectedRow.current,
                    out_qty,
                    textLotNoRef.current,
                    loc_id,
                    textWorkShopRef.current,
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
                    }
                    // 결과 처리
                    else {
                        sumList2Ref.current = [
                            {
                                id: barcodeRef.current.value,
                                PART_ID: selectedRow.current,
                                QTY: out_qty,
                                LOT_NO: textLotNoRef.current,
                                CURRENT_LOCATION: loc_id,
                                WORK_SHOP: textWorkShopRef.current,
                            },
                            ...sumList2Ref.current,
                        ];
                        lotListRef.current = [
                            {
                                BARCODE: barcodeRef.current.value,
                            },
                            ...lotListRef.current,
                        ];

                        reset('addDataList');
                        selectPartExistenceLocationLoad();
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
    };

    // 선택한 데이터 목록 삭제, 리스트에 데이터 삭제
    const deleteDataList = () => {
        selectionModelRef.current.forEach((selected) => {
            let selectedIndex = sumList2Ref.current.findIndex((data) => selected === data.id);

            const requestOption = getRequestOptions(
                PROC_PK_PDA_IV05_1_D,
                getRequestParam(
                    transOutDate,
                    sumList2Ref.current[selectedIndex]['CURRENT_LOCATION'],
                    sumList2Ref.current[selectedIndex]['WORK_SHOP'],
                    sumList2Ref.current[selectedIndex]['LOT_NO'],
                    sumList2Ref.current[selectedIndex]['PART_ID'],
                    sumList2Ref.current[selectedIndex]['QTY'],
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
                        const newSumList = [...sumList2Ref.current];
                        const newLotList = [...lotListRef.current];

                        selectionModelRef.current.forEach((selected) => {
                            const removeIDX = newSumList.findIndex((data) => selected === data.id);
                            newSumList.splice(removeIDX, 1);

                            const removeLotListIDX = newLotList.findIndex((data) => selected === data.BARCODE);
                            newLotList.splice(removeLotListIDX, 1);
                        });

                        selectionModelRef.current = [];
                        sumList2Ref.current = newSumList;
                        lotListRef.current = newLotList;
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
        });
    };

    // 출고확정
    const complete = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_IV05_Confirm_S,
            getRequestParam(transOutDate, pda_mac_address, pda_id, pda_plant_id)
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
                    msg = '출고확정이 완료되었습니다.';
                    setDialogOpen(true);
                    reset('출고확정');
                    selectPartExistenceLocationLoad();
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

    // PDA 진동
    const vibration = () => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'VIBRATION' }));
        }
    };

    // 초기화
    const reset = (gubun) => {
        if (gubun === '작업장재고') {
            textWorkShopRef.current = '';
            setTextPartId('');
            setRadioState('select');
            radioStateRef.current = 'select';
            setComboBoxStorageLot([]);
            setSelectedComboBoxStorageLot({ value: '', label: '' });
            textLotNoRef.current = '';
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            setOutQtyAllChecked(false);
            outQtyAllCheckedRef.current = false;
            sumList2Ref.current = [];
            lotListRef.current = [];
            selectionModelRef.current = [];
            scanLocationRef.current = 'barcode';
        } else if (gubun === 'radioBtnChange') {
            locationRef.current.value = '';
            barcodeRef.current.value = '';
            textLotNoRef.current = '';
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            outQtyRef.current.value = '';
        } else if (gubun === 'addDataList') {
            locationRef.current.value = '';
            barcodeRef.current.value = '';
            textLotNoRef.current = '';
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            outQtyRef.current.value = '';
            setAddListBtnDisabled(true);
            if (radioStateRef.current === 'select') {
                scanLocationRef.current = 'barcode';
            } else {
                scanLocationRef.current = 'location';
            }
        } else if (gubun === '출고확정') {
            setRadioState('select');
            radioStateRef.current = 'select';
            textLotNoRef.current = '';
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            setOutQtyAllChecked(false);
            outQtyAllCheckedRef.current = false;
            sumList2Ref.current = [];
            lotListRef.current = [];
            selectionModelRef.current = [];
            scanLocationRef.current = 'barcode';
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
            setDialogCustomrRestOpen(false);
        },

        // 다이얼로그 커스텀 확인 이벤트
        dialogOnOkay: (e) => {
            setDialogCustomOpen(false);
            setDialogCustomrRestOpen(false);

            // 삭제
            if (dialogOkay === 'delete') {
                onMessageGubunRef.current = '삭제';
                // webView 데이터 요청
                webViewPostMessage();
            }
            // 출고확정
            else if (dialogOkay === 'complete') {
                onMessageGubunRef.current = '출고확정';
                // webView 데이터 요청
                webViewPostMessage();
            } else {
                if (dialogOkay === '출고중인소재초기화') {
                    // 출고 진행 중인 소재 삭제
                    initData();
                }
            }
        },

        // 작업장재고 Tabs 이벤트 ====================================
        // 작업장 선택시 이벤트
        onCmb_workShopChanged: (e) => {
            const tmpdata = comboBoxWorkShop.filter((data) => data.value === e.target.value);
            setSelectedComboBoxWorkShop(tmpdata[0]);
            setPartName('');
            selectedRow.current = '';
        },

        // 리스트에서 한 행을 체크시 이벤트
        onWorkShopInventoryRowSelected: (e) => {
            onMessageGubunRef.current = '작업장재고3';
            selectedRow.current = e.data['PART_ID'];

            iCurIdx = sumList1.findIndex((row) => row.PART_ID === selectedRow.current);

            console.log(iCurIdx);

            // webView 데이터 요청
            webViewPostMessage();
            selectedPartNameLoad();
        },

        // 선택한 품목 출고 버튼 이벤트
        onCompleteBtnClick: (e) => {
            if (selectedComboBoxWorkShop.value === '') {
                msg = '작업장을 선택해주세요!';
                setDialogOpen(true);
                vibration();
                return;
            }
            if (partName === '') {
                msg = '품번을 선택해주세요!';
                setDialogOpen(true);
                vibration();
                return;
            }
            if (selectedComboBoxWorkShop.value === '' && partName === '') {
                msg = '작업장과 품번을 선택해주세요!';
                setDialogOpen(true);
                vibration();
                return;
            }
            onMessageGubunRef.current = '작업장재고4';
            // webView 데이터 요청
            webViewPostMessage();
        },
        // =========================================================

        // 출고 Tabs 이벤트 =========================================
        // 라디오버튼 클릭 이벤트
        onRadioChanged: (e) => {
            const gubun = e.target.value;

            if (gubun === 'select') {
                setSelectedComboBoxStorageLot(comboBoxStorageLot[0]);
                locationRef.current.value = '';
                scanLocationRef.current = 'barcode';
                reset('radioBtnChange');
                selectPartExistenceLocationLoad();
            } else {
                scanLocationRef.current = 'location';
                reset('radioBtnChange');
            }
            setRadioState(e.target.value);
            radioStateRef.current = e.target.value;
        },

        // 창고, LOT 선택시 이벤트
        onCmb_storageLotChanged: (e) => {
            const tmpdata = comboBoxStorageLot.filter((data) => data.value === e.target.value);
            setSelectedComboBoxStorageLot(tmpdata[0]);
        },

        // 대표위치 X 버튼 이벤트
        onBtnClearLocation: (e) => {
            if (radioStateRef.current === 'select') {
                return;
            } else {
                scanLocationRef.current = 'location';
                locationRef.current.value = '';
            }
        },

        // 대표위치 키인
        onLocationKeyUp: (e) => {
            const scanData = e.target.value;

            if (e.keyCode === 13) {
                if (scanData === '') {
                    msg = '대표위치를 입력해주세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (scanData.length === 25) {
                    msg = '부품표를 읽었습니다. 여기는 위치바코드를 입력하는 곳입니다.';
                    setDialogOpen(true);
                    vibration();
                    locationRef.current.value = '';
                    return;
                }
                if (selectedRow.current === '') {
                    msg = '품번이 비었습니다.';
                    setDialogOpen(true);
                    vibration();
                    locationRef.current.value = '';
                    return;
                }
                barcodeInfo(scanData, 'locationScan');
            }
        },

        // 바코드 X 버튼 이벤트
        onBtnClearBarcode: (e) => {
            barcodeRef.current.value = '';
            scanLocationRef.current = 'barcode';
        },

        // 바코드 키인
        onBarcodeKeyUp: (e) => {
            const scanData = e.target.value;

            if (e.keyCode === 13) {
                if (scanData === '') {
                    msg = '바코드를 입력해주세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (scanData.length !== 25) {
                    msg = '올바른 바코드 형식이 아닙니다.';
                    setDialogOpen(true);
                    vibration();
                    barcodeRef.current.value = '';
                    return;
                }
                if (selectedRow.current === '') {
                    msg = '품번이 비었습니다.';
                    setDialogOpen(true);
                    vibration();
                    barcodeRef.current.value = '';
                    return;
                }
                if (radioStateRef.current === 'select') {
                    if (selectedComboBoxStorageLot.length === 0) {
                        msg = '저장된 보관처가 없습니다.';
                        setDialogOpen(true);
                        vibration();
                        barcodeRef.current.value = '';
                        return;
                    }
                } else {
                    if (locationRef.current.value === '') {
                        msg = '대표위치를 입력해주세요.';
                        setDialogOpen(true);
                        vibration();
                        barcodeRef.current.value = '';
                        return;
                    }
                }
                if (lotListRef.current.length > 0) {
                    const duplicatedObj = lotListRef.current.filter((data) => data['BARCODE'] === scanData);

                    if (duplicatedObj.length > 0) {
                        msg = '리스트에 등록된 바코드 입니다.!';
                        setDialogOpen(true);
                        vibration();
                        return;
                    } else {
                        barcodeInfo(scanData, 'barcodeScan');
                    }
                } else {
                    barcodeInfo(scanData, 'barcodeScan');
                }
            }
        },

        // 출고개수 X 버튼 이벤트
        onBtnClearOutQty: (e) => {
            outQtyRef.current.value = '';
        },

        // 체크박스 전체 클릭 이벤트
        onCheckbox_outQtyAllChanged: (e) => {
            if (e.target.checked) {
                setOutQtyAllChecked(true);
                outQtyAllCheckedRef.current = true;
            } else {
                setOutQtyAllChecked(false);
                outQtyAllCheckedRef.current = false;
            }
        },

        // 리스트에 데이터 추가 이벤트
        onAddListBtnClick: (e) => {
            onMessageGubunRef.current = '출고2';
            // webView 데이터 요청
            webViewPostMessage();
        },

        // 텍스트 초기화 이벤트
        onResetBtnClick: (e) => {
            locationRef.current.value = '';
            barcodeRef.current.value = '';
            textLotNoRef.current = '';
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            outQtyRef.current.value = '';
            setOutQtyAllChecked(false);
            outQtyAllCheckedRef.current = false;

            if (radioStateRef.current === 'select') {
                scanLocationRef.current = 'barcode';
            } else {
                scanLocationRef.current = 'location';
            }
            selectPartExistenceLocationLoad();
        },

        // 리스트에서 하나 또는 여러 행을 체크시 이벤트
        onSelectionModelChange: (e) => {
            selectionModelRef.current = [...e.selectionModel];
        },

        // 삭제 버튼 이벤트
        onDeleteBtnClick: (e) => {
            const length = selectionModelRef.current.length;

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

        // 출고확정 버튼 이벤트
        onOutCompleteBtnClick: (e) => {
            if (sumList2Ref.current.length === 0) {
                msg = '데이터가 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            msg = '출고확정하시겠습니까?';
            setDialogCustomOpen(true);
            setDialogOkay('complete');
        },
        // =========================================================
    };

    // 라디오 버튼 데이터
    const dataList = [
        { label: '선택', value: 'select' },
        { label: '스캔', value: 'scan' },
    ];

    let columns1;
    let columns2;

    // DataGrid1 Header 컬럼 데이터
    columns1 = [
        { field: 'PART_ID', headerName: '소재', width: 110, headerAlign: 'left', align: 'left' },
        { field: 'PART_NAME', headerName: '품목명', width: 200, headerAlign: 'left', align: 'left' },
        { field: 'COST_QTY', headerName: '소요수량', width: 85, headerAlign: 'right', align: 'right' },
        {
            field: 'CURRENT_STORAGE_INVENTORY',
            headerName: '현창재고',
            width: 85,
            headerAlign: 'right',
            align: 'right',
        },
        { field: 'REQUIRED_QTY', headerName: '필요수량', width: 85, headerAlign: 'right', align: 'right' },
        { field: 'STORAGE_INNVENTORY', headerName: '창고재고', width: 85, headerAlign: 'right', align: 'right' },
        { field: 'LINE', headerName: '라인', width: 95, headerAlign: 'left', align: 'left' },
    ];

    // DataGrid2 Header 컬럼 데이터
    columns2 = [
        { field: 'PART_ID', headerName: '품번', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'QTY', headerName: '수량', width: 90, headerAlign: 'right', align: 'right' },
        { field: 'LOT_NO', headerName: 'Lot No', width: 100, headerAlign: 'left', align: 'left' },
        { field: 'CURRENT_LOCATION', headerName: '현재위치', width: 100, headerAlign: 'left', align: 'left' },
        { field: 'WORK_SHOP', headerName: '작업장', width: 95, headerAlign: 'left', align: 'left' },
    ];

    return (
        <>
            <div className={classes.root}>
                {/* ================================================================================== */}
                {/* 작업장재고 */}
                <AcsTabPanel value={tabsValue} index={0}>
                    <AcsSelect
                        className={`${classes.select}`}
                        labelText={'작업장'}
                        id="cmb_workShop"
                        backgroundColor={colors.white}
                        data={comboBoxWorkShop}
                        value={selectedComboBoxWorkShop.value}
                        onChange={eventhandler.onCmb_workShopChanged}
                        MenuProps={{
                            style: {
                                height: '400px',
                            },
                        }}
                    />
                    <AcsDataGrid
                        className={`${classes.dataGridOdd}`}
                        cols={columns1}
                        rows={sumList1}
                        height="250px"
                        onRowSelected={eventhandler.onWorkShopInventoryRowSelected}
                    />
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text} ${classes.textDisabled}`}
                        label={'품명'}
                        id="txtPartName"
                        disabled
                        value={partName}
                    />
                    <Button
                        className={`${classes.button}`}
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: '#f7b13d' }}
                        onClick={eventhandler.onCompleteBtnClick}
                    >
                        {'선택한 품목 출고'}
                    </Button>
                </AcsTabPanel>
                {/* ================================================================================== */}
                {/* 출고 */}
                <AcsTabPanel value={tabsValue} index={1}>
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.half} ${classes.halfMargin} ${classes.textDisabled}`}
                        label={'작업장'}
                        id="txtWorkShop"
                        disabled
                        value={textWorkShopRef.current}
                    />
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.half} ${classes.textDisabled}`}
                        label={'품번'}
                        id="txtPartId"
                        disabled
                        value={textPartId}
                    />
                    <AcsRadioButton dataList={dataList} value={radioState} onChange={eventhandler.onRadioChanged} />
                    <AcsSelect
                        className={`${classes.selectStorage} ${classes.marginBottom}`}
                        labelText={'창고, LOT'}
                        id="cmb_storageLot"
                        data={comboBoxStorageLot}
                        value={selectedComboBoxStorageLot.value}
                        onChange={eventhandler.onCmb_storageLotChanged}
                        disabled={radioStateRef.current === 'scan' && true}
                        backgroundColor={radioStateRef.current === 'scan' && colors.PLight}
                        MenuProps={{
                            style: {
                                height: '400px',
                            },
                        }}
                    />
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text}`}
                        label={'대표위치'}
                        id="txtLocation"
                        disabled={radioStateRef.current === 'select' && true}
                        style={{ backgroundColor: radioStateRef.current === 'select' && colors.PLight }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={eventhandler.onBtnClearLocation}
                                    style={{ padding: '0px 7px 0px 0px', left: '15px', height: '20px' }}
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                >
                                    <Clear />
                                </IconButton>
                            ),
                            inputProps: {
                                ref: locationRef,
                            },
                        }}
                        onKeyUp={eventhandler.onLocationKeyUp}
                    />
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
                        label={'Lot No'}
                        id="txtLotNo"
                        disabled
                        value={textLotNoRef.current}
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
                            className={`${classes.textDisabled}`}
                            label={'출고수량'}
                            id="txtUnitQty"
                            disabled
                            value={textUnitQtyRef.current}
                        />
                        <Clear style={{ margin: '10px 0px 0px 0px' }} />
                        <AcsTextField
                            label={'출고개수'}
                            id="txtOutQty"
                            type="number"
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={eventhandler.onBtnClearOutQty}
                                        style={{ left: '10px', height: '20px', padding: '0px' }}
                                        disableRipple={true}
                                        disableFocusRipple={true}
                                    >
                                        <Clear />
                                    </IconButton>
                                ),
                                inputProps: {
                                    ref: outQtyRef,
                                },
                            }}
                        />
                        <AcsCheckBox
                            className={`${classes.checkBoxMargin}`}
                            label={'전체'}
                            id="checkbox_outQtyAll"
                            checked={outQtyAllChecked}
                            onChange={eventhandler.onCheckbox_outQtyAllChanged}
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
                        cols={columns2}
                        rows={sumList2Ref.current}
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
                        badgeContent={sumList2Ref.current.length}
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: '#f7b13d' }}
                        onClick={eventhandler.onOutCompleteBtnClick}
                    >
                        {'출고확정'}
                    </AcsBadgeButton>
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
                                    {'작업장재고'}
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
                                    {'출고'}
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
                </AcsDialogCustom>

                {/* 메시지 박스 (CUSTOM) - 출고 탭에서 출고 진행 중인 소재가 있을 경우 초기화 여부 묻는 Dialog */}
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

export default MaterialOutput;
