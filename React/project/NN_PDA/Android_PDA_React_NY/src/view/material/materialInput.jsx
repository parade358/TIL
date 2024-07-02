import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    IconButton,
    Tab,
    Tabs,
    colors,
    makeStyles,
} from '@material-ui/core';
import AcsTabPanel from '../../components/acsTabPanel';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Clear } from '@material-ui/icons';
import AcsTextField from '../../components/acsTextField';
import AcsRadioButton from '../../components/acsRadioButton';
import AcsSelect from '../../components/acsSelect';
import AcsCheckBox from '../../components/acsCheckBox';
import AcsDataGrid from '../../components/acsDataGrid';
import COMMON_MESSAGE from '../../commons/message';
import AcsDialog from '../../components/acsDialog';
import AcsDialogCustom from '../../components/acsDialogCustom';
import AcsBadgeButton from '../../components/acsBadgeButton';
import { CommentsDisabledOutlined } from '@mui/icons-material';

const PDA_API_GETDATE_URL = process.env.REACT_APP_PDA_API_GETDATE_URL;
const PDA_API_GENERAL_URL = process.env.REACT_APP_PDA_API_GENERAL_URL;

const PROC_PK_PDA_IV01_1_Init_D = 'U_PK_PDA_IV01_1_Init_D'; // 초기화
const PROC_PK_PDA_IV01_8_L      = 'U_PK_PDA_IV01_8_L'; // 입고창고 조회
const PROC_PK_PDA_IV01_1_L      = 'U_PK_PDA_IV01_1_L'; //거래명세서(출문증) 존재여부
const PROC_PK_PDA_IV01_2_L      = 'U_PK_PDA_IV01_2_L'; // 부품표 스캔
const PROC_PK_PDA_IV01_6_L      = 'U_PK_PDA_IV01_6_L'; //위치검증
const PROC_PK_PDA_IV01_3_L      = 'U_PK_PDA_IV01_3_L'; //품목, LOT 정보 표시
const PROC_PK_PDA_IV01_4_L = 'U_PK_PDA_IV01_4_L'; //입고수량 표시
const PROC_PK_PDA_IV01_9_L = 'U_PK_PDA_IV01_9_L'; //수동위치정보 표시
const PROC_PK_PDA_IV01_10_L = 'U_PK_PDA_IV01_10_L'; //품목타입별 위치정보 표시
const U_PK_PDA_IV01_1_1_S = 'U_PK_PDA_IV01_1_1_S'; //저장
const PROC_PK_PDA_IV01_1_D = 'U_PK_PDA_IV01_1_D'; // 선택삭제  개발서버 테이블 이름 변경으로 인해 프로시저 새로 생성
const PROC_PK_PDA_IV01_2_S = 'U_PK_PDA_IV01_2_S'; //입고확정
const PROC_PK_PDA_IV01_3_S = 'U_PK_PDA_IV01_3_S'; //입고수량 잔량여부 확인
const PROC_PK_PDA_IV01_7_L = 'U_PK_PDA_IV01_7_L'; // 입고확정 (잔량 표시)

let msg = '';
let inv_id; // 부품표 스캔시 던져지는 매개변수
let transInDate; // '-' 뺀 입고일자

// 스타일
const useStyle = makeStyles((theme) => ({
    root: {
        margin: '70px 10px 10px 10px',
        zIndex: 0,
    },
    halfWidth: {
        width: '49.5%',
    },
    form__select: {
        width: '100%',
        fontSize: '1.4rem',
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
    flexDivStorage: {
        display: 'flex',
        marginTop: '-5px',
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
    selectStorage: {
        width: '100%',
        marginTop: '10px',
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
// PDA 진동
const vibration = () => {
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'VIBRATION' }));
    }
};

// Request Param
function getRequestParam() {
    return [...arguments] //
        .map((el) => `'${el}'`)
        .join('&del;');
}

function MaterialInput() {
    const classes = useStyle(); // CSS 스타일
    const [resestTabsValue, setResestTabsValue] = useState(0); // 이동 탭에서 이동 진행 중인 정보가 있을 경우 초기화한 후 이동할 Tabs
    const [tabsValue, setTabsValue] = useState(0); // Tabs 구분
    const tabsValueRef = useRef(0); // Tabs 구분 Ref
    const [, updateState] = useState(); // forceUpdate
    const forceUpdate = useCallback(() => updateState({}), []); // forceUpdate
    const [inDate, setInDate] = useState(''); // 입고일자
    const [radioState, setRadioState] = useState('auto'); // 입고창고 라디오 버튼 (현재위치)
    const [locradioState, setLocRadioState] = useState('locauto'); // 위치 라디오 버튼 (현재위치)
    const [selectedValue, setSelectedValue] = useState([
        {
            label: '',
            value: '',
        },
    ]); // 입고창고 value
    const selectedData = useRef(); // 입고창고 Data
    const useSelectedData = useRef(); // 입고창고 선택 Data
    const [selectedLocValue, setSelectedLocValue] = useState([
        {
            label: '',
            value: '',
        },
    ]); // 위치 value
    const selectedLocData = useRef(); // 위치 Data
    const lotListRef = useRef([]);
    const [moveQtyAllCheck, setMoveQtyAllCheck] = useState(false); // 체크박스 체크여부
    const [checkDisabled, setCheckDisabled] = useState(true); // 입고 창고 Select Disabled 체크
    const checkInputStorage = useRef(true); // 입고 창고Ref 체크
    const [radioLocDisabled, setRadioLocDisabled] = useState(true); // 위치 radio Disabled 체크
    const radioLocation = useRef(true); // 위치 스캔Ref 체크
    const [sumList1, setSumList1] = useState([]); // 리스트 목록
    const [dialogOpen, setDialogOpen] = useState(false); // 다이얼로그 (메시지창)
    const [dialogCustomOpen, setDialogCustomOpen] = useState(false); // 다이얼로그 (메시지창)
    const [dialogOkay, setDialogOkay] = useState(''); // 확인, 삭제 구분
    const [dialogCancel, setDialogCancel] = useState(''); // 위치검증 아니요 버튼 구분
    const [dialogCustomrRestOpen, setDialogCustomrRestOpen] = useState(false); // 다이얼로그 커스텀 (메시지창) - 출하 탭에서 출하 진행 중인 출하지시가 있을 경우 초기화 여부 묻는 Dialog
    const [dialogCustomrLocOpen, setDialogCustomrLocOpen] = useState(false); // 다이얼로그 커스텀 (메시지창) - 위치 검증 묻는 Dialog
    const [backdropOpen, setBackdropOpen] = useState(false); // 대기
    const pda_id = localStorage.getItem('PDA_ID'); // 사용자 ID
    const pda_plant_id = localStorage.getItem('PDA_PLANT_ID'); // 공장 ID
    const pda_mac_address = localStorage.getItem('PDA_MAC_ADDRESS'); // PDA Mac Address
    const scanLocationRef = useRef('tradingStatement'); // 바코드 스캔 위치
    const tradingStatementRef = useRef(''); // 거래명세서 Text
    const [tradingStatementDisabled, setTradingStatementDisabled] = useState(false); // 거래명세서 Disabled
    const moveLocationStorageRef = useRef(''); // 이동위치 Text Ref
    const partBarcodeRef = useRef(''); // 부품표 Text
    const [textPartId, setTextPartId] = useState(''); // 품번 Text
    const [textLotNo, setTextLotNo] = useState(''); // Lot No Text
    const textLotNoRef = useRef(''); // LotNo Ref Data
    const [textTotalQty, setTextTotalQty] = useState(0); // 총수량 Text
    const [textUnitQty, setTextUnitQty] = useState(0); // 입고수량 Text
    const [partBarcodeDisabled, setPartBarcodeDisabled] = useState(false); // 부품표 Text Disabled
    const inQtyRef = useRef(''); // 입고개수 Text
    const [addListBtnDisabled, setAddListBtnDisabled] = useState(true); // 추가 버튼 Disabled
    const [selectionModel, setSelectionModel] = useState([]); // 체크박스에 체크된 것들
    const [openInputCompelteFlagColumnNot0Form, setOpenInputCompelteFlagColumnNot0Form] = useState(false); // 경고메시지 다이얼로그 - [확정 버튼 클릭시 FLAG 값이 "0"이 아닐때 경고메시지 팝업창]
    const [sumList2, setSumList2] = useState([]); // 리스트 목록 (확정 버튼 클릭시 FLAG 값이 "0"이 아닐때)

    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []); // WebView에서 받아온 데이터

    // webView 데이터 요청
    const webViewPostMessage = () => {
        // React Native WebView로 Wifi 신호 강도 데이터 요청
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GET_WIFI_CURRENT_SIGNAL_STRENGTH' }));
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

        // webView 데이터 요청
        webViewPostMessage();

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
                    if (dialogOkay === '이동중인정보초기화') {
                        setTabsValue(resestTabsValue);
                        console.log('2');
                    }
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
        //Plant_Id가 104일 경우 수동선택 자동 체크
        if (localStorage.getItem('PDA_PLANT_ID') === '104') {
            setRadioState('manual');

            eventhandler.loadLoc();
            setCheckDisabled(false);
            checkInputStorage.current = false;
        }
    };

    // React Native WebView 에서 데이터 가져오기
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
            if (tabsValueRef.current === 1) {
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
                } else if (scanLocationRef.current === 'partList') {
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
                        partBarcodeRef.current.value = '';
                        msg = '부품표/입고표 바코드가 아닙니다.';
                        setDialogOpen(true);
                        vibration();
                        return;
                    }
                } else if (scanLocationRef.current === 'locationScan') {
                    if (checkInputStorage.current === false) {
                        if (radioLocation.current === false) {
                            if (scannedData.data.length === 25) {
                                msg = '위치정보를 스캔하세요.';
                                setDialogOpen(true);
                                vibration();
                                return;
                            } else {
                                barcodeInfo(scannedData.data, '', 'locationScan');
                            }
                        }
                    } else {
                        msg = '입고창고를 [수동]으로 선택하고 보관처를 스캔하세요.';
                        setDialogOpen(true);
                        vibration();
                        return;
                    }
                }
            } else {
                msg = '현재 탭에서 스캔이 불가능합니다. 자재 탭으로 변경해주세요.';
                setDialogOpen(true);
                vibration();
                return;
            }
        }
    };
    // 바코드 스캔 처리
    const barcodeInfo = (scanData, partBarcode, gubun) => {
        console.log('barcaodeInfo', gubun);
        // 거래명세서
        if (gubun === 'tradingStatement') {
            const requestOption = getRequestOptions(PROC_PK_PDA_IV01_1_L, getRequestParam(scanData, pda_plant_id));

            setBackdropOpen(true);
            fetch(PDA_API_GENERAL_URL, requestOption)
                .then((res) => res.json())
                .then((data) => {
                    // 사용자 메시지 처리
                    if (data.returnUserMessage !== null) {
                        tradingStatementRef.current.value = '';
                        msg = data.returnUserMessage;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        tradingStatementRef.current.value = '';
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);

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
        } // 부품표
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
                        partBarcodeRef.current.value = '';
                        msg = data.returnUserMessage;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        reset('qty');
                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        partBarcodeRef.current.value = '';
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        reset('qty');
                        return;
                    }
                    // 결과 처리
                    else {
                        partBarcodeRef.current.value = partBarcode;
                        setPartBarcodeDisabled(true);
                        scanLocationRef.current = 'locationScan';
                        eventhandler.onShowInfo(scanData, partBarcode);
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
        } else if (gubun === 'locationScan') {
            const requestOption = getRequestOptions(
                PROC_PK_PDA_IV01_6_L,
                getRequestParam(useSelectedData.current.value, scanData, pda_plant_id)
            );
            setBackdropOpen(true);
            fetch(PDA_API_GENERAL_URL, requestOption)
                .then((res) => res.json())
                .then((data) => {
                    // 사용자 메시지 처리
                    if (data.returnUserMessage !== null) {
                        moveLocationStorageRef.current.value = '';
                        msg = data.returnUserMessage;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);

                        return;
                    }
                    // 에러 메시지 처리
                    else if (data.returnErrorMsg !== null) {
                        moveLocationStorageRef.current.value = '';
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);

                        return;
                    }
                    // 결과 처리
                    else {
                        const tmpArray = JSON.parse(data.returnValue[0]);

                        const dataReturn = tmpArray[0]['Column1'];
                        if (dataReturn === '1') {
                            moveLocationStorageRef.current.value = scanData;
                            msg = '스캔한 위치의 창고유형이 자재창고가 아닙니다. 입고를 계속 진행합니까?';
                            setDialogCustomrLocOpen(true);
                            setDialogOkay('location');
                            setDialogCancel('location');
                            setBackdropOpen(false);
                        } else if (dataReturn === '2') {
                            moveLocationStorageRef.current.value = scanData;
                            msg = '스캔한 위치가 [사용 중]입니다. 이 위치에 입고합니까?';
                            setDialogCustomrLocOpen(true);
                            setDialogOkay('location');
                            setDialogCancel('location');
                            setBackdropOpen(false);
                        } else {
                            setAddListBtnDisabled(false);
                            moveLocationStorageRef.current.value = scanData;
                            setBackdropOpen(false);
                        }
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
    // 입고창고 위치
    const materialInLocationArray = (obj) => {
        return obj.map((data) => ({
            value: data.LOC_ID,
            label: data.LOC_NAME,
        }));
    };
    // 창고 위치
    const materialLocationArray = (obj) => {
        return obj.map((data) => ({
            value: data.LOC_ID,
            label: data.LOC_NAME,
        }));
    };
    // Tabs 변경시 이벤트
    const handleChange = (event, newValue) => {
        if (newValue === 0) {
            if (tabsValue === 1) {
                if (sumList1.length > 0) {
                    msg = '현재 진행 중인 입고 정보가 있습니다. 초기화하시겠습니까?';
                    setDialogCustomrRestOpen(true);
                    setDialogOkay('이동중인정보초기화');
                    setResestTabsValue(newValue);
                } else {
                    setTabsValue(newValue);
                    reset('tabValue');
                    tabsValueRef.current = newValue;
                }
            }
        } else {
            setTabsValue(newValue);
            tabsValueRef.current = newValue;
        }
    };
    // 입고창고 Radio 버튼
    const dataList1 = [
        { label: '자동선택', value: 'auto' },
        { label: '수동선택', value: 'manual' },
    ];
    // 위치 Radio 버튼
    const dataList2 = [
        { label: '위치선택', value: 'locauto' },
        { label: '위치스캔', value: 'locscan' },
    ];

    // 초기화
    const reset = (gubun) => {
        if (gubun === 'scanData') {
            partBarcodeRef.current.value = '';
            setPartBarcodeDisabled(false);
            setTextPartId('');
            setTextLotNo('');
            setTextTotalQty(0);
            setTextUnitQty(0);
            inQtyRef.current.value = '';
            setMoveQtyAllCheck(false);
            setAddListBtnDisabled(true);
        } else if (gubun === 'listAdd') {
            partBarcodeRef.current.value = '';
            inQtyRef.current.value = '';
            moveLocationStorageRef.current.value = '';
            setPartBarcodeDisabled(false);
            setTextPartId('');
            setTextLotNo('');
            setTextTotalQty(0);
            setTextUnitQty(0);
            setSelectedLocValue([]);
            selectedLocData.current = [];
            setMoveQtyAllCheck(false);
            setAddListBtnDisabled(true);

            scanLocationRef.current = 'partList';
        } else if (gubun === 'all') {
            if (sumList1.length > 0) {
                partBarcodeRef.current.value = '';
                moveLocationStorageRef.current.value = '';
                inQtyRef.current.value = '';
                scanLocationRef.current = 'partList';
                setSelectedLocValue([]);
                selectedLocData.current = [];
                setPartBarcodeDisabled(false);
                setTextPartId('');
                setTextLotNo('');
                setTextTotalQty(0);
                setTextUnitQty(0);

                setMoveQtyAllCheck(false);
                setAddListBtnDisabled(true);
            } else {
                tradingStatementRef.current.value = '';
                partBarcodeRef.current.value = '';
                moveLocationStorageRef.current.value = '';
                scanLocationRef.current = 'tradingStatement';
                inQtyRef.current.value = '';
                selectedLocData.current = [];
                setSelectedLocValue([]);
                setTradingStatementDisabled(false);
                setPartBarcodeDisabled(false);
                setTextPartId('');
                setTextLotNo('');
                setTextTotalQty(0);
                setTextUnitQty(0);
                setMoveQtyAllCheck(false);
                setAddListBtnDisabled(true);
            }
        } else if (gubun === 'tabValue') {
            tradingStatementRef.current = '';
            partBarcodeRef.current = '';
            setTextLotNo('');
            setTextPartId('');
            setTextUnitQty(0);
            setTextTotalQty(0);
            moveLocationStorageRef.current = '';
            inQtyRef.current = '';
            setMoveQtyAllCheck(false);
            scanLocationRef.current = 'tradingStatement';
            setSumList1([]);
            setSelectedLocValue([]);
            selectedLocData.current = [];
            setAddListBtnDisabled(true);
            setTradingStatementDisabled(false);
            setPartBarcodeDisabled(false);
            lotListRef.current = [];
        }
        // 입고 확정후 초기화
        else {
            tradingStatementRef.current.value = '';
            setTradingStatementDisabled(false);
            partBarcodeRef.current.value = '';
            setPartBarcodeDisabled(false);
            setTextPartId('');
            setTextLotNo('');
            setTextTotalQty(0);
            setTextUnitQty(0);
            inQtyRef.current.value = '';
            setMoveQtyAllCheck(false);
            selectedLocData.current = [];
            setAddListBtnDisabled(true);
            setSumList1([]);
            lotListRef.current = [];
            moveLocationStorageRef.current.value = '';
            setSumList2([]);
            setSelectionModel([]);
            setSelectedLocValue([]);
            scanLocationRef.current = 'tradingStatement';
        }
    };

    const eventhandler = {
        // ShowInfo
        onShowInfo: (scannedData, partBarcode) => {
            eventhandler.onShowName(scannedData, partBarcode);
        },
        // 품번, Lot No 표시 이벤트
        onShowName: (scannedData, partBarcode) => {
            const requestOption = getRequestOptions(PROC_PK_PDA_IV01_3_L, getRequestParam(inv_id, pda_plant_id));

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
                        setTextLotNo(scannedData);
                        textLotNoRef.current = scannedData;
                        setTextPartId(tmpArray[0]['PART_ID']);
                        eventhandler.onShowQty(scannedData, partBarcode);
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
        // 수량 표시 이벤트
        onShowQty: (scannedData, scanData) => {
            let unit_Qty = scanData.substring(10, 17);

            let substringValue;

            for (let i = 0; unit_Qty.length; i++) {
                substringValue = unit_Qty.substring(i, i + 1);

                if (substringValue.toString() !== '0') {
                    unit_Qty = unit_Qty.substring(i);
                    break;
                }
            }

            const requestOption = getRequestOptions(
                PROC_PK_PDA_IV01_4_L,
                getRequestParam(tradingStatementRef.current.value, scannedData, pda_plant_id, inv_id)
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

                        setTextUnitQty(unit_Qty);
                        setTextTotalQty(tmpArray[0]['IN_QTY']);
                        if (checkInputStorage.current === true) {
                            eventhandler.onShowAutoLoc(scannedData); // 입고창고 자동
                        } else if (checkInputStorage.current === false) {
                            eventhandler.onShowLoc(scannedData); // 입고 수동
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
        },
        //창고 수동지정시 위치표시기능
        onShowLoc: (scannedData) => {
            if (radioLocation.current === true) {
                setBackdropOpen(false);
                const requestOption = getRequestOptions(
                    PROC_PK_PDA_IV01_9_L,
                    getRequestParam(
                        inv_id,
                        pda_plant_id,
                        useSelectedData.current.value,
                        tradingStatementRef.current.value,
                        scannedData
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

                            inQtyRef.current.value = '';
                            return;
                        }
                        // 에러 메시지 처리
                        else if (data.returnErrorMsg !== null) {
                            msg = data.returnErrorMsg;
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            inQtyRef.current.value = '';
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
                            inQtyRef.current.value = '1';
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
            } else if (radioLocation.current === false) {
                inQtyRef.current.value = '1';
                moveLocationStorageRef.current.value = '';
            }
        },
        //품목타입별 창고 자동지정시 위치표시기능
        onShowAutoLoc: (scannedData) => {
            if (radioLocation.current === true) {
                const requestOption = getRequestOptions(
                    PROC_PK_PDA_IV01_10_L,
                    getRequestParam(inv_id, pda_plant_id, tradingStatementRef.current.value, scannedData)
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
                            const tmpMaterialLocationArray = materialLocationArray(tmpArray);
                            selectedLocData.current = tmpMaterialLocationArray;

                            if (tmpMaterialLocationArray.length > 0) {
                                setSelectedLocValue(tmpMaterialLocationArray[0]);
                            }
                            inQtyRef.current.value = '1';
                        }
                        setAddListBtnDisabled(false);
                        setBackdropOpen(false);
                    })
                    .catch((data) => {
                        msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);

                        return;
                    });
            } else if (radioLocation.current === false) {
                inQtyRef.current.value = '1';
                moveLocationStorageRef.current.value = '';
            }
        },
        // 입고창고 선택 이벤트
        onMarterialInLocationChanged: (e) => {
            const tmpdata = selectedData.current.filter((data) => data.value === e.target.value);
            setSelectedValue(tmpdata[0]);
            useSelectedData.current = tmpdata[0];
        },
        // 위치창고 선택 이벤트
        onMarterialLocationChanged: (e) => {
            const tmpdata = selectedLocData.current.filter((data) => data.value === e.target.value);
            setSelectedLocValue(tmpdata[0]);
        },
        // 입고창고 라디오 버튼 이벤트
        onRadioChanged: (e, check) => {
            setRadioState(e.target.value);
            console.log(check);
            if (check === 'auto') {
                //자동
                setCheckDisabled(true);
                checkInputStorage.current = true;
            } else if (check === 'manual') {
                //수동
                setCheckDisabled(false);
                checkInputStorage.current = false;
                eventhandler.loadLoc();
            }
        },
        // 위치 라디오 버튼 이벤트
        onLocRadioChanged: (e, check) => {
            setLocRadioState(e.target.value);
            if (check === 'locauto') {
                //선택
                setRadioLocDisabled(true);
                radioLocation.current = true;
            } else if (check === 'locscan') {
                //스캔
                setRadioLocDisabled(false);
                radioLocation.current = false;
            }
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
        // 부품표 X 버튼 이벤트
        onBtnClearPartBarcode: (e) => {
            if (partBarcodeDisabled) {
                return;
            } else {
                if (partBarcodeRef.current !== null) {
                    partBarcodeRef.current.value = '';
                    scanLocationRef.current = 'partList';
                } else {
                    return;
                }
            }
        },

        // 메세지창 닫기 이벤트
        handleClose: (e) => {
            setDialogOpen(false);
        },
        //수동선택 클릭 이벤트
        loadLoc: (e) => {
            const requestOption = getRequestOptions(PROC_PK_PDA_IV01_8_L, getRequestParam(pda_plant_id));

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
                        const tmpMaterialLocationArray = materialInLocationArray(tmpArray);
                        selectedData.current = tmpMaterialLocationArray;
                        console.log(tmpMaterialLocationArray[0]);
                        if (tmpMaterialLocationArray.length > 0) {
                            setSelectedValue(tmpMaterialLocationArray[0]);
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
        },
        // 이동위치 X 버튼 이벤트
        onBtnClearMoveLocationStorage: (e) => {
            moveLocationStorageRef.current.value = '';
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
                                        //완성 후 수정 예정

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
        // 저장 = 목록저장 + 리스트뷰 추가
        onAddListBtnClick: (e) => {
            if (
                tradingStatementRef.current.value != '' &&
                partBarcodeRef.current.value != '' &&
                textPartId != '' &&
                textLotNo != '' &&
                textTotalQty != '' &&
                textUnitQty != ''
            ) {
                let in_qty = 0;
                let loc_id = null;
                // 전체 체크
                if (moveQtyAllCheck === true) {
                    in_qty = parseInt(textTotalQty);
                } else if (moveQtyAllCheck === false && inQtyRef.current.value != '') {
                    in_qty = parseInt(textUnitQty) * parseInt(inQtyRef.current.value);
                } else {
                    msg = '수량을 입력하거나 전체를 선택하세요.';
                    setDialogOpen(true);
                    vibration();
                    setBackdropOpen(false);
                    return;
                }
                //위치 스캔 or 리스트 선택 여부
                if (radioLocDisabled === false) {
                    if (moveLocationStorageRef.current.value != '') {
                        loc_id = moveLocationStorageRef.current.value;
                    } else {
                        msg = '위치를 스캔하세요.';
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    }
                } else if (radioLocDisabled === true) {
                    if (selectedLocValue.value != '') {
                        loc_id = selectedLocValue.value;
                    } else {
                        msg = '조회된 보관처가 없습니다.';
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                    }
                }
                //수량체크
                if (parseInt(textTotalQty) < in_qty) {
                    msg = '입력한 수량이 총 수량보다 큽니다.';
                    setDialogOpen(true);
                    vibration();
                    setBackdropOpen(false);
                    inQtyRef.current.value = '';
                    return;
                } else {
                    // 추가 DB
                    const transInDateArray = inDate.split('-');
                    transInDate = transInDateArray[0] + transInDateArray[1] + transInDateArray[2];
                    const requestOption = getRequestOptions(
                        U_PK_PDA_IV01_1_1_S,
                        getRequestParam(
                            transInDate,
                            textPartId,
                            in_qty,
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
        // 입고개수 X 버튼 이벤트
        onBtnClearBarcode: (e) => {
            if (inQtyRef.current !== null) {
                inQtyRef.current.value = '';
                scanLocationRef.current = 'inQty';
            } else {
                return;
            }
        },
        // 다이얼로그 커스텀 확인 이벤트
        dialogOnOkay: (e) => {
            setDialogCustomOpen(false);
            setDialogCustomrRestOpen(false);
            setDialogCustomrLocOpen(false);
            if (dialogOkay === 'delete') {
                selectionModel.forEach((selected) => {
                    let selectedIndex = sumList1.findIndex((data) => selected === data.id);

                    const requestOption = getRequestOptions(
                        PROC_PK_PDA_IV01_1_D,
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
            } else if (dialogOkay === 'location') {
                setAddListBtnDisabled(false);
                setBackdropOpen(false);
                //로케이션
            } else if (dialogOkay === '이동중인정보초기화') {
                reset('tabValue');
                console.log('1');
                initData();
            } else if (dialogOkay === 'complete') {
                const transInDateArray = inDate.split('-');
                transInDate = transInDateArray[0] + transInDateArray[1] + transInDateArray[2];
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
                                //전량이 존재하지 않을 때
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
                            } else if (tmpArray[0]['FLAG'] === '3') {
                                //조직간 이전 입고이면서 잔량이 존재할 때
                                msg = '이 출문증에 입고하지 않은 잔량이 존재합니다. 확인하고 다시 입고하세요.';
                                setDialogOpen(true);
                                vibration();
                                setBackdropOpen(false);
                                return;
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

        // 다이얼로그 커스텀 닫기 이벤트
        dialogOnCancel: (e) => {
            if (dialogCancel === 'location') {
                moveLocationStorageRef.current.value = '';
                moveLocationStorageRef.focus();
                setDialogCancel('');
            }

            setDialogCustomOpen(false);
            setDialogCustomrRestOpen(false);
            setDialogCustomrLocOpen(false);
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
    };
    //dataGrid
    const columns1 = [
        { field: 'PART_ID', headerName: '품번', width: 160, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'Lot No', width: 160, headerAlign: 'left', align: 'left' },
        { field: 'QTY', headerName: '수량', width: 120, headerAlign: 'right', align: 'right' },
        { field: 'LOCATION', headerName: '위치', width: 160, headerAlign: 'left', align: 'left' },
        { field: 'DATE', headerName: '일자', width: 160, headerAlign: 'left', align: 'left' },
    ];
    const columns2 = [
        { field: 'PART_ID', headerName: '품번', width: 160, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'Lot No', width: 140, headerAlign: 'left', align: 'left' },
        { field: 'QTY', headerName: '수량', width: 80, headerAlign: 'right', align: 'right' },
        { field: 'INPUT_QTY', headerName: '입고', width: 80, headerAlign: 'left', align: 'left' },
    ];
    return (
        <>
            <div className={classes.root}>
                {/* ================================================================================== */}
                {/* 기본 */}

                <AcsTabPanel value={tabsValue} index={0}>
                    <AcsTextField
                        className={`${classes.marginRight} ${classes.marginBottom} ${classes.text}`}
                        label={'입고일자'}
                        id="txtInputDate"
                        type="date"
                        value={inDate}
                        endAdornment={<Clear />}
                        // disabled={inputDateDisabled}
                        // style={{ backgroundColor: inputDateDisabled ? colors.PLight : colors.white }}
                        onChange={eventhandler.onInputDateChange}
                    />
                    <p> {'입고창고 선택여부 :'}</p>
                    <AcsRadioButton dataList={dataList1} value={radioState} onChange={eventhandler.onRadioChanged} />
                    <AcsSelect
                        className={`${classes.form__select}${classes.marginBottom}`}
                        disabled={checkDisabled}
                        data={selectedData.current}
                        value={selectedValue.value}
                        labelText={'입고창고'}
                        id="txtLocation"
                        backgroundColor={checkDisabled ? colors.PLight : colors.white}
                        style={{ width: '100%' }}
                        MenuProps={{
                            style: {
                                height: '400px',
                            },
                        }}
                        onChange={eventhandler.onMarterialInLocationChanged}
                    ></AcsSelect>
                </AcsTabPanel>
                {/* ================================================================================== */}
                {/* 자재 */}
                <AcsTabPanel value={tabsValue} index={1}>
                    <AcsTextField
                        className={`${classes.marginRight} ${classes.text}`}
                        label={'거래명세서'}
                        id="txtTransBCD"
                        type="text"
                        disabled={tradingStatementDisabled}
                        style={{ backgroundColor: tradingStatementDisabled ? colors.PLight : colors.white }}
                        // onChange={eventhandler.onInputDateChange}
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
                        onKeyUp={eventhandler.onTradingStatementKeyUp}
                    />
                    <AcsTextField
                        className={`${classes.marginRight} ${classes.marginBottom} ${classes.text}`}
                        label={'부품표'}
                        id="txtPartBCD"
                        type="text"
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
                        className={` ${classes.halfWidth} `}
                        label={'품번'}
                        id="txtPartID"
                        value={textPartId}
                        disabled
                    />
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.halfWidth}`}
                        label={'LotNo'}
                        id="txtLotno"
                        value={textLotNo}
                        disabled
                    />
                    <div className={`${classes.flexDiv}`}>
                        <AcsTextField
                            classes={`${classes.marginBottom} ${classes.marginRight}`}
                            label={'총수량'}
                            id="txtTotCnt"
                            disabled
                            style={{ width: '30%' }}
                            value={textTotalQty}
                        />
                        <AcsTextField
                            classes={`${classes.marginBottom} ${classes.marginRight}`}
                            label={'입고수량'}
                            id="txtShipmentCnt"
                            style={{ width: '30%' }}
                            value={textUnitQty}
                            disabled
                        />
                        <Clear style={{ margin: '10px 0px 0px 0px' }} />
                        <AcsTextField
                            classes={`${classes.marginBottom} ${classes.marginRight}`}
                            style={{ width: '25%', marginBottom: '10px' }}
                            label={'입고개수'}
                            id="txtMul"
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
                            disabled={moveQtyAllCheck}
                        />
                        <AcsCheckBox
                            className={`${classes.checkBoxMargin}`}
                            label={'전체'}
                            id="chk_All"
                            checked={moveQtyAllCheck}
                            onChange={eventhandler.clickCheckbox}
                        />
                    </div>

                    <div>
                        <AcsRadioButton
                            dataList={dataList2}
                            value={locradioState}
                            onChange={eventhandler.onLocRadioChanged}
                        />
                    </div>
                    <div className={`${classes.flexDivStorage}`}>
                        <AcsSelect
                            className={`${classes.selectStorage} ${classes.marginBottom}`}
                            labelText={'창고'}
                            id="cmb_moveLocationStorage"
                            disabled={!radioLocDisabled}
                            data={selectedLocData.current}
                            value={selectedLocValue.value}
                            MenuProps={{
                                style: {
                                    height: '400px',
                                },
                            }}
                            onChange={eventhandler.onMarterialLocationChanged}
                        />
                        <AcsTextField
                            className={`${classes.marginBottom} ${classes.text}`}
                            label={'창고'}
                            id="txtMoveLocationStorage"
                            disabled={radioLocDisabled}
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
                        <Button
                            fullWidth
                            variant="contained"
                            name="insertBtn"
                            className={`${classes.flexButton} ${classes.marginRight}`}
                            style={{
                                backgroundColor: addListBtnDisabled ? 'lightgray' : '#f7b13d',
                            }}
                            disabled={addListBtnDisabled}
                            onClick={eventhandler.onAddListBtnClick}
                        >
                            추가
                        </Button>

                        <Button
                            fullWidth
                            variant="contained"
                            name="updateBtn"
                            className={`${classes.flexButton}`}
                            style={{
                                backgroundColor: 'gray',
                            }}
                            onClick={eventhandler.onResetBtnClick}
                        >
                            정정
                        </Button>
                    </div>
                    <AcsDataGrid
                        className={`${classes.dataGridOdd} ${classes.dataGridMargin}`}
                        cols={columns1}
                        rows={sumList1}
                        checkboxSelection={true}
                        onSelectionModelChange={eventhandler.onSelectionModelChange}
                    ></AcsDataGrid>
                    <Button
                        fullWidth
                        variant="contained"
                        name="checkDeleteBtn"
                        className={`${classes.button} ${classes.half} ${classes.halfMargin}`}
                        style={{
                            backgroundColor: 'gray',
                        }}
                        onClick={eventhandler.onDeleteBtnClick}
                    >
                        선택삭제
                    </Button>
                    <AcsBadgeButton
                        badgeContent={sumList1.length}
                        fullWidth
                        variant="contained"
                        name="okErrorBtn"
                        className={`${classes.button} ${classes.half}`}
                        style={{ backgroundColor: '#f7b13d' }}
                        onClick={eventhandler.onInputCompleteBtnClick}
                    >
                        입고확정
                    </AcsBadgeButton>
                </AcsTabPanel>
                {/* 탭*/}
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
                                    {'기본'}
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
                                    {'자재'}
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
                {/* 메시지 박스 (CUSTOM) - 출하 탭에서 출하 진행 중인 출하지시가 있을 경우 초기화 여부 묻는 Dialog */}
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
                {/* 메시지 박스 (CUSTOM) - 위치 검증 여부 묻는 Dialog  */}
                <AcsDialogCustom message={msg} open={dialogCustomrLocOpen} handleClose={eventhandler.dialogOnCancel}>
                    <Button
                        onClick={eventhandler.dialogOnOkay}
                        style={{ backgroundColor: '#f7b13d', color: 'white' }}
                        fullWidth
                        variant="contained"
                    >
                        {'예'}
                    </Button>
                    <Button
                        onClick={eventhandler.dialogOnCancel}
                        style={{ backgroundColor: 'gray', color: 'white' }}
                        fullWidth
                        variant="contained"
                    >
                        {'아니요'}
                    </Button>
                </AcsDialogCustom>
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
                        <AcsDataGrid cols={columns2} rows={sumList2} height="250px" id="datagrid2"></AcsDataGrid>
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
export default MaterialInput;
