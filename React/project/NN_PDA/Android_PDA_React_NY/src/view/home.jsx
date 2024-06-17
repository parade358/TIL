import { React, useState, useEffect, useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import AcsDialog from '../components/acsDialog';

let msg = '';

function Home() {
    const [dialogopen, setDialogOpen] = useState(false);
    const pda_mac_address = localStorage.getItem('PDA_MAC_ADDRESS'); // PDA Mac Address
    const onMessage = useCallback((event) => {
        ReadData(event);
    }, []); // WebView에서 받아온 데이터
    let height = document.documentElement.clientHeight + 'px'; //화면 높이

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
        // Wifi 신호 강도 불러오기
        if (JSON.parse(e.data).type === 'GET_WIFI_CURRENT_SIGNAL_STRENGTH') {
            const { wifiCurrentSignalStrength, type } = JSON.parse(e.data);

            if (wifiCurrentSignalStrength <= -85) {
                msg = '무선랜 신호가 약하거나 끊겼습니다.';
                setDialogOpen(true);
                vibration();
                return;
            }
            console.log('Wifi 신호 강도 [홈]', wifiCurrentSignalStrength);
        }
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    // PDA 진동
    const vibration = () => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'VIBRATION' }));
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* <img src='images/nymMain.png' alt="남양넥스모 메인사진" style={{ width: "100%", height: height }} /> */}
            <div
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    right: '10px',
                    width: '80%',
                    height: '360px',
                    margin: 'auto',
                    marginTop: '70px',
                    padding: '20px',
                    backgroundColor: 'gray',
                    border: '1px solid gray',
                    borderRadius: '5px',
                    boxShadow: '2px 5px 15px 0px gray',
                }}
            >
                <Typography
                    variant="h4"
                    component="h2"
                    style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}
                >
                    {'사용자 정보'}
                </Typography>
                <br />
                <Typography
                    variant="body2"
                    component="p"
                    style={{ fontSize: '1.4rem', lineHeight: '4rem', color: 'white' }}
                >
                    {'아이디'} : {localStorage.getItem('PDA_ID')}
                </Typography>
                <Typography
                    variant="body2"
                    component="p"
                    style={{ fontSize: '1.4rem', lineHeight: '4rem', color: 'white' }}
                >
                    {'사용자명'} : {localStorage.getItem('PDA_NAME')}
                </Typography>

                <Typography
                    variant="body2"
                    component="p"
                    style={{ fontSize: '1.4rem', lineHeight: '4rem', color: 'white' }}
                >
                    {'공장ID'} : {localStorage.getItem('PDA_PLANT_ID')}
                </Typography>
                <Typography
                    variant="body2"
                    component="p"
                    style={{ fontSize: '1.4rem', lineHeight: '4rem', color: 'white' }}
                >
                    {'공장명'} : {localStorage.getItem('PDA_PLANT_NAME')}
                </Typography>
            </div>
            <AcsDialog message={msg} open={dialogopen} handleClose={handleClose}></AcsDialog>
        </div>
    );
}

export default Home;
