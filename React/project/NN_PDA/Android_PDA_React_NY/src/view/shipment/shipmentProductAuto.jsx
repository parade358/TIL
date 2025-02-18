import { useRef, useState, useEffect, useCallback, useContext } from 'react'; // 리액트 훅
import { useHistory } from 'react-router-dom'; // 히스토리

import {
    makeStyles,
    Tabs,
    Tab,
    IconButton,
    Backdrop,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
} from '@material-ui/core'; // MUI
import { menuOpenContext } from '../../components/acsNavBar'; // 네비게이션 메뉴
import { Clear } from '@material-ui/icons'; // X 아이콘
import colors from '../../commons/colors'; // 색상
import COMMON_MESSAGE from '../../commons/message'; // 에러메세지
import AcsTabPanel from '../../components/acsTabPanel'; // 탭 페이지
import AcsTextField from '../../components/acsTextField'; // 텍스트필드
import AcsDataGrid from '../../components/acsDataGrid'; // 표
import AcsSelect from '../../components/acsSelect'; // 셀렉트
import AcsBadgeButton from '../../components/acsBadgeButton'; // 뱃지버튼
import AcsCheckBox from '../../components/acsCheckBox'; // 체크박스
import AcsDialog from '../../components/acsDialog'; // 다이얼로그
import AcsDialogCustom from '../../components/acsDialogCustom'; // 커스텀 다이얼로그

// API URL
const PDA_API_GETDATE_URL = process.env.REACT_APP_PDA_API_GETDATE_URL;
const PDA_API_GENERAL_URL = process.env.REACT_APP_PDA_API_GENERAL_URL;

// 프로시저 리스트
const PROC_PK_PDA_DV01_3_D = 'U_PK_PDA_DV01_3_D'; // 화면 로드될 때 출하지시 및 임시 저장된 목록 초기화
const PROC_PK_PDA_DV01_L = 'U_PK_PDA_DV01_L'; // 출하지시 조회
const PROC_PK_PDA_DV01_1_L = 'U_PK_PDA_DV01_1_L'; // 출하지시 세부목록 조회
const PROC_PK_PDA_IV05_6_L = 'U_PK_PDA_IV05_6_L'; // 선택된 품목명 표시
const PROC_PK_PDA_DV01_9_L = 'U_PK_PDA_DV01_9_L'; // 출하지시 재고 조회
const PROC_PK_PDA_DV05_1_S = 'U_PK_PDA_DV05_1_S'; // 출하지시선택 (출하지시목록 선점 처리)
const PROC_PK_PDA_DV01_3_L = 'U_PK_PDA_DV01_3_L'; // 선택된 출하지시 처리를 위한 기준 수량 표시 (신규)
const PROC_PK_PDA_DV01_12_L = 'U_PK_PDA_DV01_12_L'; // 선택된 출하지시 처리를 위한 기준 수량 표시 (저장)
const PROC_PK_PDA_DV01_6_L = 'U_PK_PDA_DV01_6_L'; // 부품표 정보조회 (품번, LOT)
const PROC_PK_PDA_DV01_7_L = 'U_PK_PDA_DV01_7_L'; // 부품표 위치조회
const PROC_PK_PDA_DV01_8_L = 'U_PK_PDA_DV01_8_L'; // 부품표 수량조회
const PROC_PK_PDA_DV01_2_L = 'U_PK_PDA_DV01_2_L'; // 입고표 정보조회 (품번, LOT, 위치, 수량)
const PROC_PK_PDA_DV05_2_S = 'U_PK_PDA_DV05_2_S'; // 출하목록임시저장
const PROC_PK_PDA_DV01_10_L = 'U_PK_PDA_DV01_10_L'; // 현재재고, 출하수량 조회
const PROC_PK_PDA_DV01_2_D = 'U_PK_PDA_DV01_2_D'; // 출하목록임시저장 삭제 (리스트 데이터 삭제)
const PROC_PK_PDA_DV05_4_S = 'U_PK_PDA_DV05_4_S'; // 출하저장
const PROC_PK_PDA_DV05_3_WITH_FLAG_S = 'U_PK_PDA_DV05_3_WITH_FLAG_S'; // 출하확정
const PROC_PK_PDA_DV01_4_L = 'U_PK_PDA_DV01_4_L'; // 출문증 재발행 조회
const PROC_PK_PDA_DV01_5_L = 'U_PK_PDA_DV01_5_L'; // 출문증 세부목록 조회
const PROC_PK_PDA_DV01_REPRT = 'U_PK_PDA_DV01_Reprt'; // 재발행
const PROC_PK_PDA_DV01_1_INIT_D = 'U_PK_PDA_DV01_1_Init_D'; // 화면 종료시 임시저장된 목록 삭제처리 - 초기화
const PROC_PK_PDA_DV01_1_D = 'U_PK_PDA_DV01_1_D'; // 화면 종료시 출하지시 선점처리 - 초기화

let printFlag = 'N';
let msg = '';
let store = true; // 입고표
// CSS 스타일
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
    selectMargin: {
        marginRight: '0px',
    },
    half: {
        width: '49.5%',
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

// 일자 '-' 자르기
function transDateSplitArray(date) {
    const transDateArray = date.split('-');
    return transDateArray[0] + transDateArray[1] + transDateArray[2];
}

// 부품표 위치 배열
const partBarcodeLocationArray = (obj) => {
    return obj.map((data) => ({
        label: data.LOCNAME,
        value: data.LOC_ID,
    }));
};

function ShipmentProductAuto() {
    const classes = useStyle(); // CSS 스타일
    const [tabsValue, setTabsValue] = useState(0); // Tabs 구분
    const tabsValueRef = useRef(0); // 현재탭 밸류
    const todayDateRef = useRef(''); // 오늘날짜 밸류
    const [resestTabsValue, setResestTabsValue] = useState(1); // 출하 탭에서 출하 진행 중인 출하지시가 있을 경우 초기화한 후 이동할 Tabs
    const [dialogOpen, setDialogOpen] = useState(false); // 다이얼로그 (메시지창)
    const [dialogCancelGubun, setDialogCancelGubun] = useState(''); // 다이얼로그 (메시지창) - 출하저장, 출하완료 후 닫기 버튼 클릭시 구분 Ref
    const [dialogCustomOpen, setDialogCustomOpen] = useState(false); // 다이얼로그 커스텀 (메시지창)
    const [dialogCustomrRestOpen, setDialogCustomrRestOpen] = useState(false); // 다이얼로그 커스텀 (메시지창) - 출하 탭에서 출하 진행 중인 출하지시가 있을 경우 초기화 여부 묻는 Dialog
    const [dialogCustomrPrintFlagOpen, setDialogCustomPrintFlagOpen] = useState(false); // 다이얼로그 커스텀 (메시지창) - 출하 탭에서 출하확정을 누른 후 발행 여부 묻는 Dialog
    const [dialogCustomrSaveCompleteOpen, setDialogCustomrSaveCompleteOpen] = useState(false); // 다이얼로그 커스텀 (메시지창) - 출하 탭에서 출하 진행 중인 출하지시가 있을 경우 출하 저장 여부 묻는 Dialog
    const [dialogOkay, setDialogOkay] = useState(''); // 확인, 삭제 구분
    const [backdropOpen, setBackdropOpen] = useState(false); // 대기

    const pda_id = localStorage.getItem('PDA_ID'); // 사용자 ID
    const pda_plant_id = localStorage.getItem('PDA_PLANT_ID'); // 공장 ID 
    const pda_mac_address = localStorage.getItem('PDA_MAC_ADDRESS'); // PDA Mac Address

    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []); // WebView에서 받아온 데이터
    const onMessageGubunRef = useRef(''); // WebView로 데이터 요청 후 작업에 대한 구분
    const { setMenuOpen } = useContext(menuOpenContext); // 메뉴

    // 출하지시 Tabs state
    const shipmentRequestDateRef = useRef(''); // 출하의뢰일자
    const [, updateState] = useState(); // forceUpdate
    const forceUpdate = useCallback(() => updateState({}), []); // forceUpdate
    const [sumList1, setSumList1] = useState([]); // 출하지시 리스트 목록 1
    const selectedShippingNumberRef = useRef(''); // 출하지시 리스트 목록 1에서 선택한 출하지시번호
    let history = useHistory();
    const selectedStateRef = useRef(''); // 출하지시 리스트 목록 1에서 선택한 상태
    const [sumList2, setSumList2] = useState([]); // 출하지시 리스트 목록 2
    const [shipmentInstructionSelectBtnDisabled, setShipmentInstructionSelectBtnDisabled] = useState(true); // 출하지시선택 버튼 Disabled
    const selectedPartIdRef = useRef(''); // 출하지시 리스트 목록 2에서 선택한 품번
    const [openCurrentInventoryStatusForm, setOpenCurrentInventoryStatusForm] = useState(false); // 현재 재고현황 리스트 다이얼로그 - [현재 재고현황 팝업창]
    const [textSelectedPartName, setTextSelectedPartName] = useState(''); // 출하지시 리스트 목록 1 에서 선택한 품명 - [현재 재고현황 팝업창]
    const [sumList3, setSumList3] = useState([]); // 현재 재고현황 리스트 목록 - [현재 재고현황 팝업창]

    // ===========================================================================================================================
    // 출하 Tabs state
    const [textShipmentInstruction, setTextShipmentInstruction] = useState(''); // 출하지시 Text
    const textShipmentInstructionRef = useRef(''); // 출하지시 Text Ref
    const barcodeRef = useRef(''); // 바코드 Text
    const [barcodeDisabled, setBarcodeDisabled] = useState(false); // 바코드 Disabled
    const textPartIdRef = useRef(''); // 품번 Text Ref
    const [textLotNo, setTextLotNo] = useState(''); // Lot No Text
    const textLotNoRef = useRef(''); // Lot No Text Ref
    const [textPartName, setTextPartName] = useState(''); // 품명 Text
    const textInputLocationRef = useRef(''); // 입고표 위치 Text Ref
    const textInputLocationDisabledRef = useRef(true); // 입고표 위치 Text Disabled Ref
    const comboBoxPartLocationRef = useRef([]); // 부품표 위치 ComboBox
    const comboBoxPartLocationDisabledRef = useRef(true); // 부품표 위치 ComboBox Disabled
    const [selectedComboBoxPartLocation, setSelectedComboBoxPartLocation] = useState({ value: '', label: '' }); // 선택된 부품표 위치 ComboBox
    const selectedComboBoxPartLocationValueRef = useRef(''); // 선택된 부품표 위치 value Ref
    const textTotalQtyRef = useRef(0); // 총수량 Text Ref
    const textUnitQtyRef = useRef(0); // 출하수량 Text Ref
    const [textTotalQty, setTextTotalQty] = useState(0); // 총수량 Text
    const [textUnitQty, setTextUnitQty] = useState(0); // 출하수량 Text

    const shipmentQtyRef = useRef(''); // 출하개수 Text Ref
    const [shipmentQtyAllCheck, setShipmentQtyAllCheck] = useState(false); // 체크박스 체크여부
    const shipmentQtyAllCheckedRef = useRef(false); // 체크박스 전체출하여부 Ref
    const [addListBtnDisabled, setAddListBtnDisabled] = useState(true); // 추가 버튼 Disabled
    const [addListBtnVisible, setAddListBtnVisible] = useState(true); // 추가 버튼 Visible
    const [correctionBtnVisible, setCorrectionBtnVisible] = useState(true); // 정정 버튼 Visible

    const [openShipmentDateChangeForm, setOpenShipmentDateChangeForm] = useState(false); // 출하일자조정 다이얼로그 - [출하일자조정 팝업창]
    const shipmentDateRef = useRef(''); // 출하일자 Ref - [출하일자조정 팝업창]
    const [sumList4, setSumList4] = useState([]); // 출하 리스트 목록 리스트 목록
    const sumList4Ref = useRef([]); // 출하 리스트 목록 리스트 목록 Ref
    const selectionModelRef = useRef([]); // 체크박스에 체크된 것들 Ref
    const selectedShippingPartIdRef = useRef(''); // 출하 품번 리스트 목록에서 선택한 품번
    const deleteSelectedDataRef = useRef([]); // 출하 품번 리스트 목록에서 삭제하려고 선택한 품번에 SCAN 개수가 0인 리스트
    const [openCurrentInventory_shipmentQtyForm, setOpenCurrentInventory_shipmentQtyForm] = useState(false); // 현재재고, 출하수량 다이얼로그 - [현재재고, 출하수량 팝업창]
    const [textSelectedShippingPartName, setTextSelectedShippingPartName] = useState(''); // 출하 품번 목록 리스트에서 선택한 품명 - [현재재고, 출하수량 팝업창]
    const [sumList5, setSumList5] = useState([]); // 현재재고, 출하수량 리스트 목록 - [현재재고, 출하수량 팝업창]
    // ===========================================================================================================================
    // 출문증재발행 Tabs state
    const reissueShipmentDateRef = useRef(''); // 출하일자
    const [sumList6, setSumList6] = useState([]); // 출문증재발행 리스트 목록 1
    const selectedReissueShipmentNumberRef = useRef(''); // 출문증재발행 리스트 목록 1에서 선택한 출하번호
    const [sumList7, setSumList7] = useState([]); // 출문증재발행 리스트 목록 2
    const [reissueBtnDisabled, setReissueBtnDisabled] = useState(true); // 재발행 버튼 Disabled
    // ===========================================================================================================================

    // 화면 처음 로드시
    // 임시데이터 삭제
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
                shipmentDateRef.current =
                    data[0].value.substring(0, 4) +
                    '-' +
                    data[0].value.substring(5, 7) +
                    '-' +
                    data[0].value.substring(8, 10);
                reissueShipmentDateRef.current =
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

        localStorage.setItem('IS_CLOSE', false);
        // 임시데이터 삭제
        loadInitOutNo();

        document.addEventListener('message', onMessage);

        // webView 데이터 요청
        webViewPostMessage();

        return () => {
            const is_close = localStorage.getItem('IS_CLOSE');
            if (is_close === 'false') {
                console.log('초기화!!!!', is_close);
                // 임시저장된 목록 삭제처리 초기화
                closeInitData();
                // 출하지시 선점처리 초기화
                closeInitOutNo();
            }

            console.log('handle 지움');
            document.removeEventListener('message', onMessage);
        };
    }, []);

    // Tab 변경시 이벤트
    useEffect(() => {
        tabsValueRef.current = tabsValue;

        // 출하지시 Tabs
        if (tabsValue === 0) {
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
                    shipmentRequestDateRef.current =
                        data[0].value.substring(0, 4) +
                        '-' +
                        data[0].value.substring(5, 7) +
                        '-' +
                        data[0].value.substring(8, 10);

                    reset('출하지시탭로드');
                    onMessageGubunRef.current = '출하지시탭로드';
                    // webView 데이터 요청
                    webViewPostMessage();
                })
                .catch((data) => {
                    msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                    setDialogOpen(true);
                    vibration();
                    return;
                });
        }
        // 출문증재발행 Tabs
        else if (tabsValue === 2) {
            reset('reissueList');
            onMessageGubunRef.current = '출문증재발행탭로드';
            // webView 데이터 요청
            webViewPostMessage();
        }
    }, [tabsValue]);

    // 출하지시 세부목록 데이터 있을시 출하지시선택 버튼 활성화 - [출하지시]
    useEffect(() => {
        if (sumList2.length > 0) {
            setShipmentInstructionSelectBtnDisabled(false);
        }
    }, [sumList2]);

    // 출하지시 세부목록 리스트에서 목록 클릭시 출하지시 재고 조회 - [현재 재고현황 팝업창]
    useEffect(() => {
        if (textSelectedPartName !== '') {
            const requestOption = getRequestOptions(
                PROC_PK_PDA_DV01_9_L,
                getRequestParam(selectedPartIdRef.current, pda_plant_id)
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

                        if (tmpArray[0]['위치'] === '' && tmpArray[0]['LOT'] === '' && tmpArray[0]['재고'] === '') {
                            msg = '선택한 출하지시에 대한 현재 재고가 없습니다.';
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            return;
                        }
                        sumArray = tmpArray.map((data) => ({
                            id: data.위치 + ';' + data.LOT,
                            LOCATION_ID: data.위치,
                            LOT_NO: data.LOT,
                            INV_QTY: data.재고,
                        }));

                        setSumList3(sumArray);
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
    }, [textSelectedPartName]);

    // 출하지시 변경시 Ref에 지정 - [출하]
    useEffect(() => {
        textShipmentInstructionRef.current = textShipmentInstruction;
    }, [textShipmentInstruction]);

    // 선택된 부품표 위치 변경시 Ref에 value지정 - [출하]
    useEffect(() => {
        selectedComboBoxPartLocationValueRef.current = selectedComboBoxPartLocation.value;
    }, [selectedComboBoxPartLocation]);

    // Lot No 변경시 Ref에 지정 - [출하]
    useEffect(() => {
        textLotNoRef.current = textLotNo;
    }, [textLotNo]);

    // 부품표 위치 변경시 부품표 수량 조회 - [출하]
    useEffect(() => {
        if (comboBoxPartLocationRef.current.length > 0) {
            onMessageGubunRef.current = '부품표수량조회';
            // webView 데이터 요청
            webViewPostMessage();
        }
    }, [comboBoxPartLocationRef.current]);

    // 전체출하 체크박스 체크시 Ref 지정 - [출하]
    useEffect(() => {
        shipmentQtyAllCheckedRef.current = shipmentQtyAllCheck;
    }, [shipmentQtyAllCheck]);

    // 리스트 변경시 Ref 지정 - [출하]
    useEffect(() => {
        sumList4Ref.current = sumList4;
    }, [sumList4]);

    // 출하 품번 목록 리스트에서 목록 클릭시 현재재고, 출하수량 조회 - [현재재고, 출하수량 팝업창]
    useEffect(() => {
        if (textSelectedShippingPartName !== '') {
            const requestOption = getRequestOptions(
                PROC_PK_PDA_DV01_10_L,
                getRequestParam(selectedShippingPartIdRef.current, selectedShippingNumberRef.current, pda_plant_id)
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
                            tmpArray[0]['LOT'] === '' &&
                            tmpArray[0]['재고'] === '' &&
                            tmpArray[0]['출하'] === ''
                        ) {
                            msg = '선택한 품번에 대한 현재 재고와 출하수량이 없습니다.';
                            setDialogOpen(true);
                            vibration();
                            setBackdropOpen(false);
                            return;
                        }
                        sumArray = tmpArray.map((data) => ({
                            id: data.위치 + ';' + data.LOT,
                            LOCATION_ID: data.위치,
                            LOT_NO: data.LOT,
                            INV_QTY: data.재고,
                            SHIPMENT_QTY: data.출하,
                        }));

                        setSumList5(sumArray);
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
    }, [textSelectedShippingPartName]);

    // 출문증 재발행 데이터 있을시 재발행 버튼 활성화 - [출문증 재발행]
    useEffect(() => {
        if (sumList7.length > 0) {
            setReissueBtnDisabled(false);
        }
    }, [sumList7]);

    /*
     API 호출 동기 방식
     PARAM
     - url : 요청 url
     - limit : 데이터 개수
     - callback : 정상 처리 후, 실행할 함수
 */
    const doRecursiveRequest = (url, limit, callback) => {
        if (limit === -2) {
            return;
        }
        if (limit === -1) {
            callback(); //콜백함수(초기화 시킴)
            return;
        }
        let del = '&del;';
        let transShipmentDate = transDateSplitArray(shipmentDateRef.current);
        let part_id = selectionModelRef.current[selectionModelRef.current.length - limit - 1];

        const tmpbodyparam = {
            userID: pda_id,
            userPlant: pda_plant_id,
            serviceID: PROC_PK_PDA_DV01_2_D,
            serviceParam:
                "'" +
                transShipmentDate +
                "'" +
                del +
                "'" +
                selectedShippingNumberRef.current +
                "'" +
                del +
                "'" +
                part_id +
                "'" +
                del +
                "'" +
                pda_mac_address +
                "'" +
                del +
                "'" +
                pda_id +
                "'" +
                del +
                "'" +
                pda_plant_id +
                "'",
            serviceCallerEventType: 'onClick',
            serviceCallerEventName: 'onSaveBtnClick',
            clientNetworkType: navigator.connection.effectiveType,
        };

        const option = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tmpbodyparam),
        };
        fetch(url, option)
            .then((res) => res.json())
            .then((data) => {
                // 사용자 메시지 처리
                if (data.returnUserMessage !== null) {
                    msg = data.returnUserMessage;
                    setDialogOpen(true);
                    setBackdropOpen(false);
                    vibration();
                    limit = -2;
                    doRecursiveRequest(url, limit, callback);
                }
                // 에러 메시지 처리
                else if (data.returnErrorMsg !== null) {
                    msg = data.returnErrorMsg;
                    setDialogOpen(true);
                    setBackdropOpen(false);
                    vibration();
                    limit = -2;
                    doRecursiveRequest(url, limit, callback);
                }
                // 값(value) 처리
                else {
                    --limit;
                    doRecursiveRequest(url, limit, callback);
                }
            })
            .catch((err) => {
                msg = err;
                setDialogOpen(true);
                setBackdropOpen(false);
                vibration();
                limit = -2;
                doRecursiveRequest(url, limit, callback);
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

    // 초기화
    const reset = (gubun) => {
        if (gubun === '출하지시탭로드') {
            setSumList1([]);
            setSumList2([]);
            if (textShipmentInstructionRef.current !== '') {
                setShipmentInstructionSelectBtnDisabled(true);
            } else {
                setTextShipmentInstruction('');
                setSumList4([]);
            }
            setBarcodeDisabled(false);
            if (textPartIdRef.current !== '') {
                textPartIdRef.current = '';
            }
            setTextLotNo('');
            setTextPartName('');
            textInputLocationRef.current = '';
            textInputLocationDisabledRef.current = true;
            comboBoxPartLocationRef.current = [];
            comboBoxPartLocationDisabledRef.current = true;
            setSelectedComboBoxPartLocation({ value: '', label: '' });
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            setTextTotalQty('');
            setCorrectionBtnVisible(true);
            setAddListBtnVisible(true);
            setTextUnitQty('');
            setShipmentQtyAllCheck(false);
            setAddListBtnDisabled(true);
            selectedPartIdRef.current = '';
        } else if (gubun === 'list') {
            setShipmentInstructionSelectBtnDisabled(true);
            setSumList1([]);
            setSumList2([]);
        } else if (gubun === 'scanFail') {
            if (barcodeRef.current.value !== '') {
                barcodeRef.current.value = '';
            }
            setBarcodeDisabled(false);
            if (textPartIdRef.current !== '') {
                textPartIdRef.current = '';
            }
            setTextLotNo('');
            setTextPartName('');
            textInputLocationRef.current = '';
            textInputLocationDisabledRef.current = true;
            comboBoxPartLocationRef.current = [];
            comboBoxPartLocationDisabledRef.current = true;
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            setTextTotalQty(0);

            setTextUnitQty(0);
            if (shipmentQtyRef.current.value !== '') {
                shipmentQtyRef.current.value = '';
            }
            setAddListBtnDisabled(true);
            selectedPartIdRef.current = '';
            //window.scrollTo({top: 0});
        } else if (gubun === 'reset') {
            barcodeRef.current.value = '';
            setBarcodeDisabled(false);
            textPartIdRef.current = '';
            setTextLotNo('');
            setTextPartName('');
            setCorrectionBtnVisible(true);
            setAddListBtnVisible(true);
            textInputLocationRef.current = '';
            textInputLocationDisabledRef.current = true;
            comboBoxPartLocationRef.current = [];
            setSelectedComboBoxPartLocation({ value: '', label: '' });
            comboBoxPartLocationDisabledRef.current = true;
            textTotalQtyRef.current = 0;
            textUnitQtyRef.current = 0;
            shipmentQtyRef.current.value = '';
            setShipmentQtyAllCheck(false);
            setAddListBtnDisabled(true);
            selectedPartIdRef.current = '';
            setTextTotalQty('');

            setTextUnitQty('');
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
            console.log('Wifi 신호 강도 [제품출하]', wifiCurrentSignalStrength);
            console.log(onMessageGubunRef.current);

            // wifi 신호가 약할때
            if (wifiCurrentSignalStrength <= -85) {
                // 출하지시 Tabs
                if (tabsValueRef.current === 0) {
                    // 출하지시 리스트 클릭시
                    if (onMessageGubunRef.current === '출하지시리스트클릭') {
                        reset('list');
                    }
                    // 출하지시 세부목록 리스트 클릭시
                    else if (onMessageGubunRef.current === '출하지시세부목록리스트클릭') {
                        reset('list');
                    }
                }
                // 출문증재발행 Tabs
                else if (tabsValueRef.current === 2) {
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
                // 출하지시 Tabs
                if (tabsValueRef.current === 0) {
                    if (onMessageGubunRef.current === '출하지시탭로드') {
                        // 출하지시 조회
                        loadDevoutData();
                    }
                    // 출하의뢰일자 변경시
                    else if (onMessageGubunRef.current === '출하의뢰일자변경') {
                        // 출하지시 조회
                        loadDevoutData();
                    }
                    // 출하지시 리스트 클릭시
                    else if (onMessageGubunRef.current === '출하지시리스트클릭') {
                        // 출하지시 세부목록 조회
                        loadDevoutDetailData();
                    }
                    // 출하지시 세부목록 리스트 클릭시
                    else if (onMessageGubunRef.current === '출하지시세부목록리스트클릭') {
                        // 현재 재고현황 팝업창 열기
                        setOpenCurrentInventoryStatusForm(true);
                    }
                    // 출하지시선택 버튼 클릭시
                    else if (onMessageGubunRef.current === '출하지시선택') {
                        // 출하지시선택
                        selectDevout();
                    }
                }
                // 출하 Tabs
                else if (tabsValueRef.current === 1) {
                    if (onMessageGubunRef.current === '부품표수량조회') {
                        // 부품표 수량 조회
                        loadPartBarcodeQty();
                    } else if (onMessageGubunRef.current === '리스트추가') {
                        // 리스트에 데이터 추가
                        saveDataAddDataList();
                    } else if (onMessageGubunRef.current === '출하지시품번목록리스트클릭') {
                        // 현재재고, 출하수량 팝업창 열기
                        setOpenCurrentInventory_shipmentQtyForm(true);
                    } else if (onMessageGubunRef.current === '출하품번리스트삭제') {
                        // 리스트 데이터 삭제
                        deleteDataList();
                    } else if (onMessageGubunRef.current === '출하저장') {
                        // 출하저장
                        shippingSave();
                    } else if (onMessageGubunRef.current === '출하확정') {
                        // 출하확정
                        shipmentComplete();
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

            if (tabsValueRef.current === 1) {
                if (textShipmentInstructionRef.current === '') {
                    msg = '선택된 출하지시가 없습니다.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (scannedData.data === '') {
                    msg = '부품표/입고표 바코드를 스캔하세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (scannedData.data.length !== 25) {
                    msg = '부품표/입고표 바코드가 아닙니다.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }

                // 바코드의 LOT_NO 위치 앞 두 글자 중 숫자가 포함되면 부품표 정보조회
                if (isNaN(scannedData.data.substring(17, 18)) || isNaN(scannedData.data.substring(18, 19))) {
                    textInputLocationDisabledRef.current = true;
                    comboBoxPartLocationDisabledRef.current = false;
                    textInputLocationRef.current = '';
                    setAddListBtnVisible(true);
                    setCorrectionBtnVisible(true);
                    barcodeInfo(scannedData.data, 'partBarcode');
                }
                // 바코드의 LOT_NO 위치 앞 두 글자가 숫자이면 입고표 정보조회
                else {
                    textInputLocationDisabledRef.current = true;
                    comboBoxPartLocationDisabledRef.current = true;
                    setAddListBtnVisible(false);
                    setCorrectionBtnVisible(false);
                    store = false;
                    //**********자동 저장 추가부분**********
                    barcodeInfo(scannedData.data, 'inputBarcode');
                    //**********자동 저장 추가부분**********
                    barcodeRef.current.focus();
                }
            }
        }
    };

    // 바코드 스캔 처리
    const barcodeInfo = (scanData, gubun) => {
        // 부품표
        if (gubun === 'partBarcode') {
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
                PROC_PK_PDA_DV01_6_L,
                getRequestParam(inv_id, pda_plant_id, textShipmentInstructionRef.current, scanData)
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
                        setBarcodeDisabled(true);
                        textPartIdRef.current = tmpArray[0]['PART_ID'];
                        setTextLotNo(scanData.substring(17));
                        setTextPartName(tmpArray[0]['PART_NAME']);
                        shipmentQtyRef.current.value = '1';
                        shipmentQtyRef.current.focus();
                        shipmentQtyRef.current.select();
                        // 부품표 위치 조회
                        loadPartBarcodeLocation(inv_id, scanData.substring(17));
                    }
                })
                .catch((data) => {
                    msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                    setDialogOpen(true);
                    vibration();
                    reset('scanFail');
                    setBackdropOpen(false);
                    return;
                });
        }
        // 입고표
        else {
            let unit_qty = scanData.substring(10, 17);

            let substringValue;

            for (let i = 0; unit_qty.length; i++) {
                substringValue = unit_qty.substring(i, i + 1);

                if (substringValue.toString() !== '0') {
                    unit_qty = unit_qty.substring(i);
                    break;
                }
            }

            const requestOption = getRequestOptions(
                PROC_PK_PDA_DV01_2_L,
                getRequestParam(textShipmentInstructionRef.current, scanData, pda_plant_id)
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
                        setTextLotNo(tmpArray[0]['LOT_NO']);
                        setTextPartName(tmpArray[0]['PART_NAME']);
                        textInputLocationRef.current = tmpArray[0]['SUB_LOCATION_ID'];
                        setTextTotalQty(parseInt(parseFloat(tmpArray[0]['INV_QTY'].toString())).toString());
                        setTextUnitQty(unit_qty);
                        textTotalQtyRef.current = parseInt(parseFloat(tmpArray[0]['INV_QTY'].toString())).toString();
                        textUnitQtyRef.current = unit_qty;

                        shipmentQtyRef.current.value = '1';
                        shipmentQtyRef.current.focus();
                        shipmentQtyRef.current.select();
                        saveDataAddDataList();
                    }
                    setBackdropOpen(false);
                })
                .catch((data) => {
                    msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                    setDialogOpen(true);
                    vibration();
                    reset('scanFail');
                    setBackdropOpen(false);
                    return;
                });
        }
    };

    // 임시데이터 삭제
    // 화면 로드될 때 혹시 에러로 그냥 닫힌 출하지시 있으면 컨펌 CONFIRM_DTTM에 넣은 현재시간 null 처리 및 출하 중에 뻗은 데이터 삭제
    const loadInitOutNo = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV01_3_D,
            getRequestParam(pda_mac_address, pda_id, pda_plant_id)
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
                    if (dialogOkay === '출하중인출하지시초기화') {
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

    // 출하지시 조회
    const loadDevoutData = () => {
        const transDate = transDateSplitArray(shipmentRequestDateRef.current);
        const requestOption = getRequestOptions(PROC_PK_PDA_DV01_L, getRequestParam(transDate, pda_plant_id));
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
                        tmpArray[0]['출하지시번호'] === '' &&
                        tmpArray[0]['고객사'] === '' &&
                        tmpArray[0]['차량'] === '' &&
                        tmpArray[0]['출하시간'] === '' &&
                        tmpArray[0]['출하처'] === '' &&
                        tmpArray[0]['상태'] === ''
                    ) {
                        msg = '지정한 날짜에 대한 출하지시가 없습니다.';
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    }
                    sumArray = tmpArray.map((data) => ({
                        id: data.출하지시번호,
                        SHIPPING_NUMBER: data.출하지시번호,
                        CUSTOMER: data.고객사,
                        VEHICLE: data.차량,
                        SHIPPING_TIME: data.출하시간,
                        SHIP_TO: data.출하처,
                        STATE: data.상태,
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
    };

    // DataGrid1 출하지시 리스트 데이터에 상태 컬럼이 '저장' 이거나 'Storage' 일때 Row색 지정
    const setDataGrid1BackgroudColor = (params) => {
        let returnValue = '';

        if (params.row['STATE'] === '저장' || params.row['STATE'] === 'Storage') {
            returnValue = `dataGridRowBackgroudColor`;
        }
        return returnValue;
    };

    // 출하지시 세부목록 조회
    const loadDevoutDetailData = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV01_1_L,
            getRequestParam(selectedShippingNumberRef.current, pda_plant_id)
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
                        tmpArray[0]['지시'] === '' &&
                        tmpArray[0]['재고'] === ''
                    ) {
                        msg = '선택한 출하지시에 대한 세부목록이 없습니다.';
                        setDialogOpen(true);
                        vibration();
                        setBackdropOpen(false);
                        return;
                    }
                    sumArray = tmpArray.map((data) => ({
                        id: data.품번,
                        PART_ID: data.품번,
                        PART_NAME: data.품명,
                        INSTRUCTION: data.지시,
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
                setBackdropOpen(false);
                return;
            });
    };

    // 출하지시 세부목록 리스트에서 선택된 데이터에 대한 품목명 표시
    // 출하 품번 목록 리스트에서 선택된 데이터에 대한 품목명 표시
    const loadSelectedPartName = () => {
        let requestOption;

        if (tabsValueRef.current === 0) {
            requestOption = getRequestOptions(
                PROC_PK_PDA_IV05_6_L,
                getRequestParam(selectedPartIdRef.current, pda_plant_id)
            );
        } else if (tabsValueRef.current === 1) {
            requestOption = getRequestOptions(
                PROC_PK_PDA_IV05_6_L,
                getRequestParam(selectedShippingPartIdRef.current, pda_plant_id)
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

                    if (tabsValueRef.current === 0) {
                        setTextSelectedPartName(tmpArray[0]['PART_NAME']);
                    } else if (tabsValueRef.current === 1) {
                        setTextSelectedShippingPartName(tmpArray[0]['PART_NAME']);
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

    // 출하지시선택
    const selectDevout = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV05_1_S,
            getRequestParam(selectedShippingNumberRef.current, pda_plant_id, pda_mac_address, pda_id)
        );
        //ㅁㄴ
        setBackdropOpen(true);
        fetch(PDA_API_GENERAL_URL, requestOption)
            .then((res) => res.json())
            .then((data) => {
                // 사용자 메시지 처리
                if (data.returnUserMessage !== null) {
                    msg = data.returnUserMessage;
                    setDialogOpen(true);
                    vibration();
                    loadDevoutData();
                    setSumList2([]);
                    setBackdropOpen(false);
                    return;
                }
                // 에러 메시지 처리
                else if (data.returnErrorMsg !== null) {
                    msg = data.returnErrorMsg;
                    setDialogOpen(true);
                    vibration();
                    loadDevoutData();
                    setSumList2([]);
                    setBackdropOpen(false);
                    return;
                }
                // 결과 처리
                else {
                    setTextShipmentInstruction(selectedShippingNumberRef.current);

                    if (selectedStateRef.current === '신규') {
                        // 출하지시 선택되어 출하처리 화면에 기준이 될 출하수량 넣기
                        loadDevoutDetailProcData();
                    } else if (selectedStateRef.current === '저장') {
                        // 출하지시 선택되어 출하처리 화면에 기준이 될 출하수량 넣고 기존저장된 항목있을 때 PDA 아이디 다시 업데이트
                        loadDevoutDetailSaveProcData();
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

    // 출하지시 선택되어 출하처리 화면에 기준이 될 출하수량 넣기 - 신규
    const loadDevoutDetailProcData = () => {
        setTabsValue(1);
        //ㄴㄴ
        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV01_3_L,
            getRequestParam(selectedShippingNumberRef.current, pda_plant_id)
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

                    let sumArray = [];

                    if (
                        tmpArray[0]['품번'] === '' &&
                        tmpArray[0]['지시'] === '' &&
                        tmpArray[0]['스캔'] === '' &&
                        tmpArray[0]['품명'] === ''
                    ) {
                        msg = '선택된 출하지시에 대한 출하수량 정보가 없습니다.(신규)';
                        setDialogOpen(true);
                        vibration();
                        return;
                    }
                    sumArray = tmpArray.map((data) => ({
                        id: data.품번,
                        PART_ID: data.품번,
                        ORDER: data.지시,
                        SCAN: data.스캔,
                        PART_NAME: data.품명,
                    }));

                    setSumList4(sumArray);
                }
                setBackdropOpen(false);
            })
            .catch((data) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + data.value + ' (신규)';
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
    };

    // 출하지시 선택되어 출하처리 화면에 기준이 될 출하수량 넣고 기존저장된 항목있을 때 PDA 아이디 다시 업데이트 - 저장
    const loadDevoutDetailSaveProcData = () => {
        setTabsValue(1);

        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV01_12_L,
            getRequestParam(selectedShippingNumberRef.current, pda_plant_id, pda_mac_address)
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

                    let sumArray = [];

                    if (
                        tmpArray[0]['품번'] === '' &&
                        tmpArray[0]['지시'] === '' &&
                        tmpArray[0]['스캔'] === '' &&
                        tmpArray[0]['품명'] === ''
                    ) {
                        msg = '선택된 출하지시에 대한 출하수량 정보가 없습니다.(저장)';
                        setDialogOpen(true);
                        vibration();
                        return;
                    }
                    sumArray = tmpArray.map((data) => ({
                        id: data.품번,
                        PART_ID: data.품번,
                        ORDER: data.지시,
                        SCAN: data.스캔,
                        PART_NAME: data.품명,
                    }));

                    setSumList4(sumArray);
                }
                setBackdropOpen(false);
            })
            .catch((data) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + data.value + ' (저장)';
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
    };

    // 부품표 위치 조회
    const loadPartBarcodeLocation = (invId, lotNo) => {
        const requestOption = getRequestOptions(PROC_PK_PDA_DV01_7_L, getRequestParam(invId, lotNo, pda_plant_id));

        setBackdropOpen(true);
        fetch(PDA_API_GENERAL_URL, requestOption)
            .then((res) => res.json())
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
                    const tmpPartLocationArray = partBarcodeLocationArray(tmpArray);

                    comboBoxPartLocationRef.current = tmpPartLocationArray;

                    if (tmpPartLocationArray.length > 0) {
                        setSelectedComboBoxPartLocation(tmpPartLocationArray[0]);
                    }
                }
                setBackdropOpen(false);
            })
            .catch((data) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                setDialogOpen(true);
                vibration();
                reset('scanFail');
                setBackdropOpen(false);
                return;
            });
    };

    // 부품표 수량 조회
    const loadPartBarcodeQty = () => {
        let inv_id = barcodeRef.current.value.substring(3, 10);
        let substringValue1;

        for (let i = 0; inv_id.length; i++) {
            substringValue1 = inv_id.substring(i, i + 1);

            if (substringValue1.toString() !== '0') {
                inv_id = inv_id.substring(i);
                break;
            }
        }

        let unit_qty = barcodeRef.current.value.substring(10, 17);
        let substringValue2;

        for (let i = 0; unit_qty.length; i++) {
            substringValue2 = unit_qty.substring(i, i + 1);

            if (substringValue2.toString() !== '0') {
                unit_qty = unit_qty.substring(i);
                break;
            }
        }

        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV01_8_L,
            getRequestParam(
                inv_id,
                textLotNoRef.current,
                selectedComboBoxPartLocationValueRef.current,
                textShipmentInstructionRef.current,
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

                    textTotalQtyRef.current = tmpArray[0]['INV_QTY'];
                    textUnitQtyRef.current = unit_qty;
                    setTextTotalQty(parseInt(tmpArray[0]['INV_QTY']));
                    setTextUnitQty(unit_qty);
                    shipmentQtyRef.current.value = '1';
                    shipmentQtyRef.current.focus();
                    setAddListBtnDisabled(false);
                }
                setBackdropOpen(false);
            })
            .catch((data) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                setDialogOpen(true);
                vibration();
                reset('scanFail');
                setBackdropOpen(false);
                return;
            });
    };

    // 리스트에 데이터 추가
    const saveDataAddDataList = () => {
        if (barcodeRef.current.value === '' || selectedShippingNumberRef.current === '') {
            msg = '비어있는 항목이 있습니다.';
            setDialogOpen(true);
            vibration();
            return;
        } else {
            let shipment_qty = 0;

            if (shipmentQtyAllCheckedRef.current) {
                if (textTotalQtyRef.current !== '') {
                    shipment_qty = parseInt(textTotalQtyRef.current);
                } else {
                    msg = '수량정보를 확인하세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
            } else {
                if (shipmentQtyRef.current.value !== '' && textUnitQtyRef.current !== '') {
                    shipment_qty = parseInt(shipmentQtyRef.current.value) * parseInt(textUnitQtyRef.current);
                } else {
                    msg = '수량을 입력하거나 전체를 선택하세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (
                    parseInt(shipmentQtyRef.current.value) <= 0 ||
                    shipment_qty <= 0 ||
                    parseInt(textTotalQtyRef.current) <= 0
                ) {
                    msg = '출하숫자가 0입니다.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
            }
            let loc_id = '';

            if (!store) {
                if (textInputLocationRef.current === '') {
                    msg = '스캔된 보관처가 없습니다.';
                    setDialogOpen(true);
                    vibration();
                    return;
                } else {
                    loc_id = textInputLocationRef.current;
                }
            } else if (!comboBoxPartLocationDisabledRef.current) {
                if (comboBoxPartLocationRef.current.length === 0) {
                    msg = '보관처 정보가 없습니다.';
                    setDialogOpen(true);
                    vibration();
                    return;
                } else {
                    loc_id = selectedComboBoxPartLocationValueRef.current;
                }
            }

            if (parseInt(textTotalQtyRef.current) < shipment_qty) {
                msg = '입력한 수량이 총 수량보다 큽니다.';
                setDialogOpen(true);
                vibration();
                shipmentQtyRef.current.value = '';
                return;
            } else {
                for (let i = 0; i < sumList4Ref.current.length; i++) {
                    let part_id = sumList4Ref.current[i]['PART_ID'];
                    let orderQty = parseInt(sumList4Ref.current[i]['ORDER']);
                    let scanQty = parseInt(sumList4Ref.current[i]['SCAN']);

                    if (part_id === textPartIdRef.current && orderQty === scanQty) {
                        msg = '기존 스캔수량과 지시수량이 일치합니다.';
                        setDialogOpen(true);
                        vibration();
                        return;
                    }
                    if (part_id === textPartIdRef.current && orderQty < scanQty) {
                        msg =
                            '스캔수량 대비 지시수량이 작습니다. ERP 지시수량 변경이 있었습니다. 출하화면을 닫고 다시 진행해 주세요.';
                        setDialogOpen(true);
                        vibration();
                        return;
                    }
                    if (part_id === textPartIdRef.current && orderQty !== scanQty) {
                        if (orderQty >= scanQty + shipment_qty) {
                            // 데이터저장
                            saveData(shipment_qty, loc_id, i);
                        } else {
                            msg = '지시수량보다 큰 수량입니다.';
                            setDialogOpen(true);
                            vibration();
                            return;
                        }
                    }
                }
            }
        }
    };

    // 데이터저장
    const saveData = (shipmentQty, locId, index) => {
        let transShipmentDate = transDateSplitArray(shipmentDateRef.current);

        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV05_2_S,
            getRequestParam(
                transShipmentDate,
                selectedShippingNumberRef.current,
                textPartIdRef.current,
                shipmentQty,
                textLotNoRef.current,
                locId,
                barcodeRef.current.value,
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
                    sumList4Ref.current[index]['SCAN'] =
                        parseInt(parseFloat(sumList4Ref.current[index]['SCAN'])) + shipmentQty;
                    setSumList4(sumList4Ref.current);
                    reset('reset');
                }
                setBackdropOpen(false);
            })
            .catch((data) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + data.value + ' (데이터저장)';
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
    };

    // 리스트 데이터 삭제
    const deleteDataList = () => {
        setBackdropOpen(true);
        doRecursiveRequest(PDA_API_GENERAL_URL, selectionModelRef.current.length - 1, () => {
            selectionModelRef.current.forEach((selected) => {
                const resetScanIndex = sumList4Ref.current.findIndex((data) => selected === data.id);

                sumList4Ref.current[resetScanIndex]['SCAN'] = 0;
            });

            setSumList4(sumList4Ref.current);
            selectionModelRef.current = [];
            setBackdropOpen(false);
        });
    };

    // 출하저장
    const shippingSave = () => {
        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV05_4_S,
            getRequestParam(pda_plant_id, selectedShippingNumberRef.current, pda_mac_address, pda_id)
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
                    msg = '해당 출하지시가 저장되었습니다.';
                    setDialogOpen(true);
                    setBackdropOpen(false);
                    setDialogCancelGubun('출하저장');
                    localStorage.setItem('IS_CLOSE', true);
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

    // 출하확정
    const shipmentComplete = () => {
        let transShipmentCompleteDate = transDateSplitArray(shipmentDateRef.current);

        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV05_3_WITH_FLAG_S,
            getRequestParam(
                transShipmentCompleteDate,
                pda_plant_id,
                selectedShippingNumberRef.current,
                pda_mac_address,
                pda_id,
                printFlag
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
                    msg = '출하확정이 완료되어 출문증이 발행되었습니다.';
                    setDialogOpen(true);
                    setBackdropOpen(false);
                    setDialogCancelGubun('출하완료');
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

    // 출문증 재발행 조회
    const loadReissuanceOfPassport = () => {
        const reissueShipmentDate = transDateSplitArray(reissueShipmentDateRef.current);

        const requestOption = getRequestOptions(
            PROC_PK_PDA_DV01_4_L,
            getRequestParam(reissueShipmentDate, pda_mac_address, pda_id, pda_plant_id)
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
            .catch((data) => {
                msg = COMMON_MESSAGE.FETCH_ERROR + data.value;
                setDialogOpen(true);
                vibration();
                setBackdropOpen(false);
                return;
            });
    };

    // 출문증 세부목록 조회
    const loadOutPageDetailData = () => {
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
            PROC_PK_PDA_DV01_REPRT,
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

    // 임시저장된 목록 삭제처리 초기화
    const closeInitData = () => {
        if (selectedShippingNumberRef.current !== '') {
            const requestOption = getRequestOptions(
                PROC_PK_PDA_DV01_1_INIT_D,
                getRequestParam(selectedShippingNumberRef.current, pda_mac_address, pda_id)
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
        }
    };

    // 출하지시 선점처리 초기화
    const closeInitOutNo = () => {
        if (selectedShippingNumberRef.current !== '') {
            const requestOption = getRequestOptions(
                PROC_PK_PDA_DV01_1_D,
                getRequestParam(selectedShippingNumberRef.current, pda_plant_id)
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
                        localStorage.setItem('IS_CLOSE', false);
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
        }
    };

    // Tabs 변경시 이벤트
    const handleChange = (event, newValue) => {
        if (newValue === 1) {
            if (tabsValue === 0) {
                return;
            } else if (tabsValue === 2) {
                return;
            }
        } else if (newValue === 0 || newValue === 2) {
            if (tabsValue === 1) {
                msg = '현재 출하 진행 중인 출하지시가 있습니다. 초기화하시겠습니까?';
                setDialogCustomrRestOpen(true);
                setDialogOkay('출하중인출하지시초기화');
                setResestTabsValue(newValue);
                return;
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

            if (dialogCancelGubun === '출하저장') {
                history.push('/home');
                setMenuOpen(true);
                setDialogCancelGubun('');
            } else if (dialogCancelGubun === '출하완료') {
                setTabsValue(0);
                setDialogCancelGubun('');
            }
        },

        // 다이얼로그 커스텀 닫기 이벤트
        dialogOnCancel: (e) => {
            setDialogCustomPrintFlagOpen(false);
            setDialogCustomOpen(false);
            setDialogCustomrRestOpen(false);
            setDialogCustomrSaveCompleteOpen(false);
        },

        // 다이얼로그 커스텀 확인 이벤트
        dialogOnOkay: (e) => {
            setDialogCustomOpen(false);
            setDialogCustomrRestOpen(false);
            setDialogCustomrSaveCompleteOpen(false);
            setDialogCustomPrintFlagOpen(false);
            //testttttttttt
            if (dialogOkay === '출하중인출하지시초기화') {
                // 임시데이터 삭제
                loadInitOutNo();
            } else if (dialogOkay === 'delete') {
                onMessageGubunRef.current = '출하품번리스트삭제';
                // webView 데이터 요청
                webViewPostMessage();
            } else if (dialogOkay === '출하저장') {
                onMessageGubunRef.current = '출하저장';
                // webView 데이터 요청
                webViewPostMessage();
            } else if (dialogOkay === '재발행') {
                onMessageGubunRef.current = '재발행';
                // webView 데이터 요청
                webViewPostMessage();
            } else if (dialogOkay === '재발행') {
                onMessageGubunRef.current = '재발행';
                // webView 데이터 요청
                webViewPostMessage();
            } else if (dialogOkay === '출하확정') {
                onMessageGubunRef.current = '출하확정';
                // webView 데이터 요청
                webViewPostMessage();
            }
        },

        // 출하지시 Tabs 이벤트 =====================================
        // 출하의뢰일자 변경시 이벤트
        onShipmentRequestDateChange: (e) => {
            if (e.target.value === '') {
                msg = '출하의뢰일자를 선택해주세요.';
                setDialogOpen(true);
                vibration();
                return;
            } else {
                shipmentRequestDateRef.current = e.target.value;
                forceUpdate();
                console.log(shipmentRequestDateRef);
                reset('list');
                onMessageGubunRef.current = '출하의뢰일자변경';
                // webView 데이터 요청
                webViewPostMessage();
            }
        },

        // 리스트1 에서 한 행을 체크시 이벤트
        onShipmentInstructionRowSelected: (e) => {
            selectedShippingNumberRef.current = e.data['id'];
            console.log(selectedShippingNumberRef.current);
            selectedStateRef.current = e.data['STATE'];
            onMessageGubunRef.current = '출하지시리스트클릭';
            // webView 데이터 요청
            webViewPostMessage();
        },

        // 리스트2 에서 한 행을 체크시 이벤트
        onShipmentInstructionDetailRowSelected: (e) => {
            selectedPartIdRef.current = e.data['id'];
            onMessageGubunRef.current = '출하지시세부목록리스트클릭';
            // webView 데이터 요청
            webViewPostMessage();
        },

        // 출하지시선택 버튼 이벤트
        onShipmentInstructionSelectBtnClick: (e) => {
            onMessageGubunRef.current = '출하지시선택';
            // webView 데이터 요청
            webViewPostMessage();
        },

        // 현재 재고현황 팝업창 로드 - [현재 재고현황 팝업창]
        onCurrentInventoryStatusFormEntered: (e) => {
            // 선택된 품목명 표시
            loadSelectedPartName();
        },

        // 현재 재고현황 팝업창 닫기 버튼 이벤트 - [현재 재고현황 팝업창]
        onUseCurrentInventoryStatusCloseClick: (e) => {
            setOpenCurrentInventoryStatusForm(false);
            setTextSelectedPartName('');
            setSumList3([]);
        },
        // =========================================================

        // 출하 Tabs 이벤트 =========================================
        // 바코드 X 버튼 이벤트
        onBtnClearBarcode: (e) => {
            if (barcodeDisabled) {
                return;
            } else {
                barcodeRef.current.value = '';
            }
        },

        // 바코드 키인 이벤트
        onBarcodeKeyUp: (e) => {
            const scanData = e.target.value;

            if (e.keyCode === 13) {
                if (textShipmentInstructionRef.current === '') {
                    msg = '선택된 출하지시가 없습니다.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (scanData === '') {
                    msg = '부품표/입고표 바코드를 스캔하세요.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                if (scanData.length !== 25) {
                    msg = '부품표/입고표 바코드가 아닙니다.';
                    setDialogOpen(true);
                    vibration();
                    return;
                }
                // 바코드의 LOT_NO 위치 앞 두 글자 중 숫자가 포함되면 부품표 정보조회
                if (isNaN(scanData.substring(17, 18)) || isNaN(scanData.substring(18, 19))) {
                    textInputLocationDisabledRef.current = true;
                    comboBoxPartLocationDisabledRef.current = false;
                    textInputLocationRef.current = '';
                    setAddListBtnVisible(true);
                    setCorrectionBtnVisible(true);
                    barcodeInfo(scanData, 'partBarcode');
                }
                // 바코드의 LOT_NO 위치 앞 두 글자가 숫자이면 입고표 정보조회
                else {
                    textInputLocationDisabledRef.current = true;
                    comboBoxPartLocationDisabledRef.current = true;
                    setAddListBtnVisible(false);
                    setCorrectionBtnVisible(false);
                    store = false;
                    //**********자동 저장 추가부분**********
                    barcodeInfo(scanData, 'inputBarcode');
                    //**********자동 저장 추가부분**********
                    barcodeRef.current.focus();
                }
            }
        },

        // 부품표 위치 선택시 이벤트
        onCmb_partLocationChanged: (e) => {
            const tmpdata = comboBoxPartLocationRef.current.filter((data) => data.value === e.target.value);
            setSelectedComboBoxPartLocation(tmpdata[0]);
        },

        // 출하개수 X 버튼 이벤트
        onBtnClearShipmentQty: (e) => {
            shipmentQtyRef.current.value = '';
        },

        // 체크박스 전체 클릭 이벤트
        onCheckbox_shipmentQtyAllChanged: (e) => {
            if (e.target.checked) {
                setShipmentQtyAllCheck(true);
            } else {
                setShipmentQtyAllCheck(false);
            }
        },

        // 출하일자조정 버튼 이벤트
        onShipmentDateChangeBtnClick: (e) => {
            const shippingList = sumList4Ref.current.filter((data) => parseFloat(data.SCAN) > 0);

            if (shippingList.length > 0) {
                msg = '출하작업 도중에 일자변경 할 수 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }

            shipmentDateRef.current = todayDateRef.current;
            setOpenShipmentDateChangeForm(true);
        },

        // 리스트에 데이터 추가 이벤트
        onAddListBtnClick: (e) => {
            onMessageGubunRef.current = '리스트추가';
            // webView 데이터 요청
            webViewPostMessage();
        },

        // 텍스트 초기화 이벤트
        onResetBtnClick: (e) => {
            reset('reset');
        },

        // 리스트에서 CELL 클릭시 이벤트
        onShipmentCellClick: (e) => {
            if (e.field === '__check__') {
                return;
            } else {
                selectedShippingPartIdRef.current = e.row['id'];
                onMessageGubunRef.current = '출하지시품번목록리스트클릭';
                // webView 데이터 요청
                webViewPostMessage();
            }
        },

        // 리스트에서 체크박스 체크시 이벤트
        onSelectionModelChange: (e) => {
            selectionModelRef.current = [...e.selectionModel];
        },

        // 삭제 버튼 이벤트
        onDeleteBtnClick: (e) => {
            const length = selectionModelRef.current.length;

            if (sumList4Ref.current.length === 0) {
                msg = '출하목록이 비어있습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            if (length === 0) {
                msg = '선택된 품번이 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            deleteSelectedDataRef.current = [];
            selectionModelRef.current.forEach((selected) => {
                const deleteSeletedData = sumList4Ref.current.filter((data) => selected === data['id']);

                deleteSelectedDataRef.current = [deleteSeletedData[0], ...deleteSelectedDataRef.current];
            });

            let isMsgOpen = false;
            for (let i = 0; i < deleteSelectedDataRef.current.length; i++) {
                if (deleteSelectedDataRef.current[i]['SCAN'] <= 0) {
                    isMsgOpen = true;
                }
            }
            if (isMsgOpen) {
                msg = '선택된 품번의 스캔수량이 0입니다.';
                setDialogOpen(true);
                vibration();
                deleteSelectedDataRef.current = [];
                return;
            }

            msg = '삭제하시겠습니까?';
            setDialogCustomOpen(true);
            setDialogOkay('delete');
        },

        // 출하저장 버튼 이벤트
        onShipmentWhileSaveBtnClick: (e) => {
            if (sumList4Ref.current.length === 0) {
                msg = '출하목록이 비어있습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            const shipmentWhileSaveScanData = sumList4Ref.current.filter((data) => data['SCAN'] > 0);

            if (shipmentWhileSaveScanData.length === 0) {
                msg = '출하수량이 0입니다.';
                setDialogOpen(true);
                vibration();
                return;
            }

            msg = '진행 중인 제품출하를 저장하고 화면을 닫습니다.';
            setDialogCustomrSaveCompleteOpen(true);
            setDialogOkay('출하저장');
        },
        // 출하확정 발행 버튼 이벤트
        onShipmentPrintFlagBtnClick: (e) => {
            msg = '출문증을 발행하면서 제품 출하를 확정하시겠습니까?';
            setDialogCustomPrintFlagOpen(true);
        },
        // 다이얼로그 발행 예(Y) 버튼
        dialogPrintFlagOkay: (e) => {
            printFlag = 'Y';
            eventhandler.onShipmentComplete();
            setDialogCustomPrintFlagOpen(false);
        },
        // 다이얼로그 발행 아니요(N) 버튼
        dialogPrintFlagNo: (e) => {
            printFlag = 'N';
            eventhandler.onShipmentComplete();
            setDialogCustomPrintFlagOpen(false);
        },
        // 출하확정 이벤트
        onShipmentComplete: (e) => {
            if (sumList4.length === 0) {
                msg = '출하확정할 품번이 없습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            const shipmentCompleteScanQtyData = sumList4.filter((data) => parseInt(data['SCAN']) <= 0);
            if (shipmentCompleteScanQtyData.length === sumList4.length) {
                msg = '출하수량이 0입니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            const shipmentCompleteCompareOrderQtyScanQtyData1 = sumList4.filter(
                (data) => parseInt(data['ORDER']) < parseInt(data['SCAN'])
            );
            if (shipmentCompleteCompareOrderQtyScanQtyData1.length > 0) {
                msg = '스캔수량이 지시수량보다 큰 품번이 존재합니다. 선택 삭제 후 다시 출하하세요.';
                setDialogOpen(true);
                vibration();
                return;
            }
            const shipmentCompleteCompareOrderQtyScanQtyData2 = sumList4.filter(
                (data) => parseInt(data['ORDER']) > parseInt(data['SCAN'])
            );
            if (shipmentCompleteCompareOrderQtyScanQtyData2.length > 0) {
                msg =
                    '지시수량과 스캔수량이 일치하지 않는 품번이 존재합니다. 출하확정하면 해당 출하지시는 완료처리됩니다. 출하하시겠습니까?';
                setDialogCustomrSaveCompleteOpen(true);
                setDialogOkay('출하확정');
            } else {
                shipmentComplete();
            }
        },

        // 출하일자 변경시 이벤트 - [출하일자조정 팝업창]
        onShipmentDateChange: (e) => {
            if (e.target.value === '') {
                msg = '출하일자를 선택해주세요.';
                setDialogOpen(true);
                vibration();
                return;
            } else {
                shipmentDateRef.current = e.target.value;
                forceUpdate();
            }
        },

        // 출하일자조정 팝업창 반영 버튼 이벤트 - [출하일자조정 팝업창]
        onUseReflectionClick: (e) => {
            setOpenShipmentDateChangeForm(false);
        },

        // 현재재고, 출하수량 팝업창 로드 - [현재재고, 출하수량 팝업창]
        onCurrentInventory_shipmentQtyFormEntered: (e) => {
            // 선택된 품목명 표시
            loadSelectedPartName();
        },

        // 현재재고, 출하수량 팝업창 닫기 버튼 이벤트 - [현재재고, 출하수량 팝업창]
        onUseCurrentInventory_shipmentQtyCloseClick: (e) => {
            setOpenCurrentInventory_shipmentQtyForm(false);
            setTextSelectedShippingPartName('');
            setSumList5([]);
        },
        // =========================================================

        // 출문증재발행 Tabs 이벤트 ==================================
        // 출하일자 변경시 이벤트
        onReissueShipmentDateChange: (e) => {
            if (e.target.value === '') {
                msg = '출하일자를 선택해주세요.';
                setDialogOpen(true);
                vibration();
                return;
            } else {
                reissueShipmentDateRef.current = e.target.value;
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

    let columns1;
    let columns2;
    let columns3;
    let columns4;
    let columns5;
    let columns6;
    let columns7;

    // DataGrid1 Header 컬럼 데이터
    columns1 = [
        { field: 'SHIPPING_NUMBER', headerName: '출하지시번호', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'CUSTOMER', headerName: '고객사', width: 200, headerAlign: 'left', align: 'left' },
        { field: 'VEHICLE', headerName: '차량', width: 80, headerAlign: 'left', align: 'left' },
        { field: 'SHIPPING_TIME', headerName: '출하시간', width: 90, headerAlign: 'left', align: 'left' },
        { field: 'SHIP_TO', headerName: '출하처', width: 80, headerAlign: 'left', align: 'left' },
        { field: 'STATE', headerName: '상태', width: 60, headerAlign: 'left', align: 'left' },
    ];

    // DataGrid2 Header 컬럼 데이터
    columns2 = [
        { field: 'PART_ID', headerName: '품번', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'PART_NAME', headerName: '품명', width: 200, headerAlign: 'left', align: 'left' },
        { field: 'INSTRUCTION', headerName: '지시', width: 80, headerAlign: 'right', align: 'right' },
        { field: 'INVENTORY', headerName: '재고', width: 80, headerAlign: 'right', align: 'right' },
    ];

    // DataGrid3 Header 컬럼 데이터
    columns3 = [
        { field: 'LOCATION_ID', headerName: '위치', width: 110, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'LOT', width: 110, headerAlign: 'left', align: 'left' },
        { field: 'INV_QTY', headerName: '재고', width: 95, headerAlign: 'right', align: 'right' },
    ];

    // DataGrid4 Header 컬럼 데이터
    columns4 = [
        { field: 'PART_ID', headerName: '품번', width: 120, headerAlign: 'left', align: 'left' },
        { field: 'ORDER', headerName: '지시', width: 60, headerAlign: 'right', align: 'right' },
        { field: 'SCAN', headerName: '스캔', width: 70, headerAlign: 'right', align: 'right' },
        { field: 'PART_NAME', headerName: '품명', width: 200, headerAlign: 'left', align: 'left' },
    ];

    // DataGrid5 Header 컬럼 데이터
    columns5 = [
        { field: 'LOCATION_ID', headerName: '위치', width: 75, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'LOT', width: 85, headerAlign: 'left', align: 'left' },
        { field: 'INV_QTY', headerName: '재고', width: 65, headerAlign: 'right', align: 'right' },
        { field: 'SHIPMENT_QTY', headerName: '출하수량', width: 90, headerAlign: 'right', align: 'right' },
    ];

    // DataGrid6 Header 컬럼 데이터
    columns6 = [
        { field: 'SHIPMENT_TO', headerName: '출하처', width: 180, headerAlign: 'left', align: 'left' },
        { field: 'VEHICLE', headerName: '차량', width: 80, headerAlign: 'left', align: 'left' },
        { field: 'SHIPMENT_QTY', headerName: '출하량', width: 75, headerAlign: 'right', align: 'right' },
        { field: 'SHIPMENT_NUMBER', headerName: '출하번호', width: 120, headerAlign: 'left', align: 'left' },
    ];

    // DataGrid7 Header 컬럼 데이터
    columns7 = [
        { field: 'PART_ID', headerName: '품번', width: 130, headerAlign: 'left', align: 'left' },
        { field: 'LOT_NO', headerName: 'LOT.No', width: 125, headerAlign: 'left', align: 'left' },
        { field: 'QTY', headerName: '수량', width: 80, headerAlign: 'right', align: 'right' },
    ];

    return (
        <>
            <div className={classes.root}>
                {/* ================================================================================== */}
                {/* 출하지시 */}
                <AcsTabPanel value={tabsValue} index={0}>
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text}`}
                        label={'출하의뢰일자'}
                        id="txtShipmentRequestDate"
                        type="date"
                        value={shipmentRequestDateRef.current}
                        onChange={eventhandler.onShipmentRequestDateChange}
                    />
                    <AcsDataGrid
                        className={`${classes.dataGrid1}`}
                        cols={columns1}
                        rows={sumList1}
                        getRowClassName={(params) => setDataGrid1BackgroudColor(params)}
                        onRowSelected={eventhandler.onShipmentInstructionRowSelected}
                    />
                    <AcsDataGrid
                        className={`${classes.dataGridOdd}`}
                        cols={columns2}
                        rows={sumList2}
                        onRowSelected={eventhandler.onShipmentInstructionDetailRowSelected}
                    />
                    <Button
                        className={`${classes.button}`}
                        fullWidth
                        variant="contained"
                        disabled={shipmentInstructionSelectBtnDisabled}
                        style={{ backgroundColor: shipmentInstructionSelectBtnDisabled ? 'lightgray' : '#f7b13d' }}
                        onClick={eventhandler.onShipmentInstructionSelectBtnClick}
                    >
                        {'출하지시선택'}
                    </Button>
                    {/* 현재 재고현황 리스트 팝업창 */}
                    <Dialog
                        className={`${classes.customDialog}`}
                        open={openCurrentInventoryStatusForm}
                        onEntered={eventhandler.onCurrentInventoryStatusFormEntered}
                    >
                        <DialogTitle className={`${classes.customDialogTitle}`}>{'현재 재고현황'}</DialogTitle>
                        <div className={classes.customDialogRoot}>
                            <AcsTextField
                                className={`${classes.marginBottom} ${classes.text} ${classes.textDisabled}`}
                                label={'품명'}
                                id="txtSelectedPartName"
                                disabled
                                value={textSelectedPartName}
                            />
                            <AcsDataGrid
                                className={`${classes.dataGridOdd}`}
                                cols={columns3}
                                rows={sumList3}
                                height="300px"
                            ></AcsDataGrid>
                            <Button
                                className={`${classes.useCloseButton}`}
                                fullWidth
                                variant="contained"
                                style={{ backgroundColor: 'gray' }}
                                onClick={eventhandler.onUseCurrentInventoryStatusCloseClick}
                            >
                                {'닫기'}
                            </Button>
                        </div>
                    </Dialog>
                </AcsTabPanel>
                {/* ================================================================================== */}
                {/* 출하 */}
                <AcsTabPanel value={tabsValue} index={1}>
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text} ${classes.textDisabled}`}
                        label={'출하지시'}
                        id="txtShipmentInstruction"
                        disabled
                        value={textShipmentInstruction}
                    />
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text}`}
                        label={'바코드'}
                        id="txtBarcode"
                        disabled={barcodeDisabled}
                        style={{ backgroundColor: barcodeDisabled ? colors.PLight : colors.white }}
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
                            value={textLotNo}
                        />
                        <AcsTextField
                            className={`${classes.marginBottom} ${classes.textDisabled}`}
                            label={'품명'}
                            id="txtPartName"
                            disabled
                            value={textPartName}
                        />
                    </div>
                    <div style={{ display: 'flex' }}>
                        <AcsTextField
                            className={`${classes.marginBottom} ${classes.half} ${classes.halfMargin} ${classes.textDisabled}`}
                            label={'입고표 위치'}
                            id="txtInputLocation"
                            disabled={textInputLocationDisabledRef.current}
                            value={textInputLocationRef.current}
                        />
                        <AcsSelect
                            className={`${classes.selectMargin} ${classes.half} ${classes.marginBottom}`}
                            labelText={'부품표 위치'}
                            id="cmb_partLocation"
                            disabled={comboBoxPartLocationDisabledRef.current}
                            backgroundColor={comboBoxPartLocationDisabledRef.current ? colors.PLight : colors.white}
                            data={comboBoxPartLocationRef.current}
                            value={selectedComboBoxPartLocation.value}
                            onChange={eventhandler.onCmb_partLocationChanged}
                            MenuProps={{
                                style: {
                                    height: '400px',
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
                            value={textTotalQty}
                        />
                        <AcsTextField
                            className={`${classes.textDisabled}`}
                            label={'출하수량'}
                            id="txtUnitQty"
                            disabled
                            value={textUnitQty}
                        />
                        <Clear style={{ margin: '10px 0px 0px 0px' }} />
                        <AcsTextField
                            label={'출하개수'}
                            id="txtShipmentQty"
                            type="number"
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={eventhandler.onBtnClearShipmentQty}
                                        style={{ left: '10px', height: '20px', padding: '0px' }}
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
                            id="checkbox_shipmentQtyAll"
                            checked={shipmentQtyAllCheck}
                            onChange={eventhandler.onCheckbox_shipmentQtyAllChanged}
                        />
                    </div>
                    <div className={`${classes.flexDiv}`}>
                        <Button
                            className={`${classes.flexButton} ${classes.marginRight}`}
                            fullWidth
                            variant="contained"
                            style={{ backgroundColor: 'gray', padding: '5px' }}
                            onClick={eventhandler.onShipmentDateChangeBtnClick}
                        >
                            {'출하일자조정'}
                        </Button>
                        {addListBtnVisible && (
                            <Button
                                className={`${classes.flexButton} ${classes.marginRight}`}
                                fullWidth
                                variant="contained"
                                id="addBtn"
                                style={{ backgroundColor: addListBtnDisabled ? 'lightgray' : '#f7b13d' }}
                                disabled={addListBtnDisabled}
                                onClick={eventhandler.onAddListBtnClick}
                            >
                                {'추가'}
                            </Button>
                        )}
                        {correctionBtnVisible && (
                            <Button
                                className={`${classes.flexButton}`}
                                fullWidth
                                id="correctionBtn"
                                variant="contained"
                                style={{ backgroundColor: 'gray' }}
                                onClick={eventhandler.onResetBtnClick}
                            >
                                {'정정'}
                            </Button>
                        )}
                    </div>
                    <AcsDataGrid
                        className={`${classes.dataGridOdd} ${classes.dataGridMargin}`}
                        cols={columns4}
                        rows={sumList4}
                        height="200px"
                        checkboxSelection={true}
                        disableSelectionOnClick
                        onCellClick={eventhandler.onShipmentCellClick}
                        onSelectionModelChange={eventhandler.onSelectionModelChange}
                    />
                    <Button
                        className={`${classes.button} ${classes.threeHalf} ${classes.threeHalfMargin}`}
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: 'gray' }}
                        onClick={eventhandler.onDeleteBtnClick}
                    >
                        {'삭제'}
                    </Button>
                    <Button
                        className={`${classes.button} ${classes.threeHalf} ${classes.threeHalfMargin}`}
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: 'gray' }}
                        onClick={eventhandler.onShipmentWhileSaveBtnClick}
                    >
                        {'출하저장'}
                    </Button>
                    <AcsBadgeButton
                        className={`${classes.button} ${classes.threeHalf}`}
                        badgeContent={sumList4.length}
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: '#f7b13d' }}
                        onClick={eventhandler.onShipmentPrintFlagBtnClick}
                    >
                        {'출하확정'}
                    </AcsBadgeButton>
                    {/* 출하일자 조정 팝업창 */}
                    <Dialog className={`${classes.customDialog}`} open={openShipmentDateChangeForm}>
                        <DialogTitle className={`${classes.customDialogTitle}`}>{'출하일자조정'}</DialogTitle>
                        <div className={classes.customDialogRoot}>
                            <AcsTextField
                                className={`${classes.marginBottom} ${classes.text}`}
                                label={'출하일자'}
                                id="txtShipmentDate"
                                type="date"
                                value={shipmentDateRef.current}
                                onChange={eventhandler.onShipmentDateChange}
                            />
                            <Button
                                className={`${classes.useReflectionButton}`}
                                fullWidth
                                variant="contained"
                                style={{ backgroundColor: '#f7b13d' }}
                                onClick={eventhandler.onUseReflectionClick}
                            >
                                {'반영'}
                            </Button>
                        </div>
                    </Dialog>
                    {/* 현재재고, 출하수량 리스트 팝업창 */}
                    <Dialog
                        className={`${classes.customDialog}`}
                        open={openCurrentInventory_shipmentQtyForm}
                        onEntered={eventhandler.onCurrentInventory_shipmentQtyFormEntered}
                    >
                        <DialogTitle className={`${classes.customDialogTitle}`}>{'현재재고, 출하수량'}</DialogTitle>
                        <div className={classes.customDialogRoot}>
                            <AcsTextField
                                className={`${classes.marginBottom} ${classes.text} ${classes.textDisabled}`}
                                label={'품명'}
                                id="txtSelectedPartName"
                                disabled
                                value={textSelectedShippingPartName}
                            />
                            <AcsDataGrid
                                className={`${classes.dataGridOdd}`}
                                cols={columns5}
                                rows={sumList5}
                                height="300px"
                            ></AcsDataGrid>
                            <Button
                                className={`${classes.useCloseButton}`}
                                fullWidth
                                variant="contained"
                                style={{ backgroundColor: 'gray' }}
                                onClick={eventhandler.onUseCurrentInventory_shipmentQtyCloseClick}
                            >
                                {'닫기'}
                            </Button>
                        </div>
                    </Dialog>
                </AcsTabPanel>
                {/* ================================================================================== */}
                {/* 출문증재발행 */}
                <AcsTabPanel value={tabsValue} index={2}>
                    <AcsTextField
                        className={`${classes.marginBottom} ${classes.text}`}
                        label={'출하일자'}
                        id="txtReissueShipmentDate"
                        type="date"
                        value={reissueShipmentDateRef.current}
                        onChange={eventhandler.onReissueShipmentDateChange}
                    />
                    <AcsDataGrid
                        className={`${classes.dataGridOdd}`}
                        cols={columns6}
                        rows={sumList6}
                        height="120px"
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
                                    {'출하지시'}
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
                                    {'출하'}
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
                                    {'출문증재발행'}
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

                {/* 메시지 박스 (CUSTOM)
                 - 출하 탭에서 출하 진행 중인 출하지시가 있을 경우 저장 여부 묻는 Dialog
                 - 출하 탭에서 출하확정 클릭시 지시수량과 스캔수량이 일치하지 않는 경우 출하확정 여부 묻는 Dialog
             */}
                <AcsDialogCustom
                    message={msg}
                    open={dialogCustomrSaveCompleteOpen}
                    handleClose={eventhandler.dialogOnCancel}
                >
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

                {/* 화면 대기 */}
                <Backdrop className={classes.backdrop} open={backdropOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </>
    );
}

export default ShipmentProductAuto;
