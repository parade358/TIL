import { FormControl, MenuItem, Select } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Apartment, SupervisorAccount, VpnKey } from '@material-ui/icons';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import COMMON_MESSAGE from '../../commons/message';
import AcsDialog from '../../components/acsDialog';
import AcsTextField from '../../components/acsTextField';

//컴포넌트 변수 선언
const PDA_API_GENERAL_URL = process.env.REACT_APP_PDA_API_GENERAL_URL;
const PDA_VERSION = process.env.REACT_APP_PDA_VERSION;
const PROC_ATM_SP_LOGIN_L = 'pk_ATM_sp_login_L'; // 로그인
const PROC_PK_PDA_PLANT_NAME_L = 'U_PK_PDA_PLANT_NAME_L'; // 공장명

let msg = '';
let ipAddress = '';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    exitButton: {
        backgroundColor: 'gray',
        color: 'white',
        fontSize: '0.8rem',
        position: 'absolute',
        right: '8px',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'Column',
    },
    form__column: {
        display: 'flex',
        alignItems: 'center',
        justifySelf: 'end',
    },
    form__column_factory: {
        display: 'flex',
        alignItems: 'center',
        justifySelf: 'end',
        visibility: 'hidden',
    },
    form__column_version: {
        textAlign: 'right',
    },
    form__icon: {
        width: '3.5rem',
        height: '3.0rem',
        marginTop: '16px',
        marginBottom: '8px',
        backgroundColor: '#707070',
        color: '#ffffff',
        borderRadius: '0.5rem',
        marginRight: '0.5rem',
    },
    form__icon_factory: {
        width: '3.5rem',
        height: '3.0rem',
        marginTop: '16px',
        marginBottom: '8px',
        backgroundColor: '#707070',
        color: '#ffffff',
        borderRadius: '0.5rem',
        marginRight: '0.5rem',
    },
    form__text: {
        width: '100%',
    },
    form__select: {
        width: '100%',
        fontSize: '1.4rem',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        textTransform: 'none',
    },
    skeleton__align: {
        margin: '0 auto',
    },

    skeleton__first: {
        marginTop: theme.spacing(4),
    },
}));

function SignIn() {
    //hook 정의
    const classes = useStyles();
    const [dialogopen, setDialogOpen] = useState(false);
    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []); // WebView에서 받아온 데이터
    //const [islogin, setLogin] = useState(false);

    //최초 마운트 되었을 때
    //시작 - 특정 state - 항상 렌더링 - 언마운트
    useEffect(() => {
        document.addEventListener('message', onMessage);

        // React Native WebView로 Wifi 신호 강도 데이터 요청
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GET_WIFI_CURRENT_SIGNAL_STRENGTH' }));
        }

        return () => {
            console.log('handle 지움');
            document.removeEventListener('message', onMessage);
        };
    }, []);

    // React Native WebView 에서 데이터 가져오기
    const ReadData = (e) => {
        const type = JSON.parse(e.data).type;

        // MacAddress 불러오기
        if (type === 'MACADDRESS') {
            const { pdaMacAddress, type } = JSON.parse(e.data);

            localStorage.setItem('PDA_MAC_ADDRESS', pdaMacAddress);
            console.log('MacAddress [로그인]', pdaMacAddress);
        }
        // IpAddress 불러오기
        else if (type === 'IPADDRESS') {
            const { pdaIpAddress, type } = JSON.parse(e.data);

            console.log('IpAddress', pdaIpAddress);
            const ipAddress = pdaIpAddress.substring(0, 3).toString();

            // IpAddress 체크
            if (ipAddress !== '172' && ipAddress !== '192') {
                msg = '접속할 수 없는 IP 입니다.';
                setDialogOpen(true);
                vibration();
                return;
            } else {
                console.log('정상 아이피 주소 : ', pdaIpAddress);
            }
        }
        // Wifi 신호 강도 불러오기
        else if (type === 'GET_WIFI_CURRENT_SIGNAL_STRENGTH') {
            const { wifiCurrentSignalStrength, type } = JSON.parse(e.data);

            if (wifiCurrentSignalStrength <= -85) {
                msg = '무선랜 신호가 약하거나 끊겼습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            console.log('Wifi 신호 강도 [로그인]', wifiCurrentSignalStrength);
        }
    };

    // PDA 진동
    const vibration = () => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'VIBRATION' }));
        }
    };

    const gps = [
        //위치
        { name: '1공장', value: '102', type: 'mx' },
        { name: '2공장', value: '103' },
        { name: '3공장', value: '104' },
        { name: '4공장', value: '105' },
        { name: '울산공장', value: '121' },
    ];
    const useGps = useRef('102');

    //

    // 이벤트 핸들러
    const eventhandler = {
        handleClose: () => {
            setDialogOpen(false);
        },
        // 위치 변경 이벤트
        onGpsChange: (e) => {
            useGps.current = e.target.value;
        },
        // 프로그램 종료
        onProgramExitClick: (e) => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CLOSE_PROGRAM' }));
        },

        onLoginClick: (e) => {
            console.log(useGps.current);
            e.preventDefault();
            let del = '&del;';
            let bodyparam1 = {
                userID: e.target.userId.value,
                userPlant: useGps.current,
                serviceID: PROC_ATM_SP_LOGIN_L,
                serviceParam:
                    "'" +
                    e.target.userId.value +
                    "'" +
                    del +
                    "'" +
                    e.target.password.value +
                    "'" +
                    del +
                    "'" +
                    ipAddress +
                    "'" +
                    del +
                    "'" +
                    'K' +
                    "'",
                serviceCallerEventType: 'onSubmit',
                serviceCallerEventName: 'onLoginClick',
                clientNetworkType: navigator.connection.effectiveType,
            };

            fetch(PDA_API_GENERAL_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyparam1),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.returnUserMessage !== null) {
                        msg = data.returnUserMessage;
                        setDialogOpen(true);
                        vibration();
                        return;
                    } else if (data.returnErrorMsg !== null) {
                        msg = data.returnErrorMsg;
                        setDialogOpen(true);
                        vibration();
                        return;
                    } else {
                        const tmpArray1 = JSON.parse(data.returnValue[0]);

                        localStorage.setItem('PDA_ID', e.target.userId.value);
                        localStorage.setItem('PDA_NAME', tmpArray1[0]['NAME']);
                        localStorage.setItem('PDA_AUTH', tmpArray1[0]['auth']);
                        localStorage.setItem('PDA_PLANT_ID', useGps.current);
                        localStorage.setItem('IS_CLOSE', false);

                        let del = '&del;';
                        let bodyparam2 = {
                            userID: e.target.userId.value,
                            userPlant: useGps.current,
                            serviceID: PROC_PK_PDA_PLANT_NAME_L,
                            serviceParam: "'" + useGps.current + "'",
                            serviceCallerEventType: 'onSubmit',
                            serviceCallerEventName: 'onLoginClick',
                            clientNetworkType: navigator.connection.effectiveType,
                        };

                        fetch(PDA_API_GENERAL_URL, {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(bodyparam2),
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                if (data.returnUserMessage !== null) {
                                    msg = data.returnUserMessage;
                                    setDialogOpen(true);
                                    vibration();
                                    return;
                                } else if (data.returnErrorMsg !== null) {
                                    msg = data.returnErrorMsg;
                                    setDialogOpen(true);
                                    vibration();
                                    return;
                                } else {
                                    const tmpArray2 = JSON.parse(data.returnValue[0]);

                                    localStorage.setItem('PDA_PLANT_NAME', tmpArray2[0]['PLANT_NAME']);
                                    window.location.href = '/home';
                                }
                            })
                            .catch((data) => {
                                msg = COMMON_MESSAGE.FETCH_ERROR + data;
                                setDialogOpen(true);
                                return;
                            });
                    }
                })
                .catch((data) => {
                    msg = COMMON_MESSAGE.FETCH_ERROR + data;
                    setDialogOpen(true);
                    return;
                });
        },
    };

    return (
        <Container component="main" maxWidth="xs">
            <>
                <CssBaseline />
                <div className={classes.paper}>
                    <Button
                        className={classes.exitButton}
                        variant="contained"
                        onClick={eventhandler.onProgramExitClick}
                    >
                        {'종료'}
                    </Button>
                    <img
                        src="ny.png"
                        alt="남양넥스모 메인사진"
                        style={{ width: '200px', height: '90px', marginTop: '20px' }}
                    />
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        {'로그인'}
                    </Typography>

                    <FormControl
                        className={classes.form}
                        onSubmit={eventhandler.onLoginClick}
                        component="form"
                        method="post"
                    >
                        <div className={classes.form__column_version}>
                            <Typography component="h1" variant="h9">
                                {'버전'} : {PDA_VERSION}
                            </Typography>
                        </div>

                        <div className={classes.form__column}>
                            <SupervisorAccount className={classes.form__icon} />

                            <AcsTextField
                                className={classes.form__text}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="userId"
                                label={'사용자ID'}
                                name="userId"
                                autoComplete="off"
                                autoFocus
                                maxLength={40}
                                InputLabelProps={{ shrink: true, style: { fontSize: '1.4rem' } }}
                                InputProps={{ style: { fontSize: '1.4rem' } }}
                            />
                        </div>
                        <div className={classes.form__column}>
                            <VpnKey className={classes.form__icon} />
                            <AcsTextField //
                                className={classes.form__text}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label={'비밀번호'}
                                type="password"
                                id="password"
                                mode="pass"
                                maxLength={20}
                                InputLabelProps={{ shrink: true, style: { fontSize: '1.4rem' } }}
                                InputProps={{ style: { fontSize: '1.4rem' } }}
                            />
                        </div>

                        <div className={classes.form__column}>
                            <Apartment className={classes.form__icon} />
                            <Select
                                labelText={'위치'}
                                labelId="gps_label"
                                id="gps"
                                name="gps"
                                defaultValue={gps[0].value}
                                className={classes.form__select}
                                onChange={eventhandler.onGpsChange}
                            >
                                {gps.map((el, i) => (
                                    <MenuItem key={i} value={el.value}>
                                        {el.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            style={{ backgroundColor: '#f7b13d', color: 'white', fontSize: '1rem', fontWeight: 'bold' }}
                            className={classes.submit}
                        >
                            {'로그인'}
                        </Button>
                    </FormControl>
                </div>
            </>

            <AcsDialog message={msg} open={dialogopen} handleClose={eventhandler.handleClose}></AcsDialog>
        </Container>
    );
}

export default SignIn;
