import React from "react";

export default function apiTest(){

    const API_GETDATE_URL = process.env.REACT_APP_API_GETDATE_URL;
    // 현재 날짜와 시간을 가져온다
    const API_GENERAL_URL = process.env.REACT_APP_API_GENERAL_URL;
    // return 받을 데이터가 없는 경우 쓰는 url
    const API_RESULT_URL = process.env.REACT_APP_API_RESULT_URL;
    // DB로부터 데이터를 Return 받을 때 쓰는 url
    const DBName = process.env.REACT_APP_PDA_DB_NAME;

    const del = "&DEL;";
    let param = "'" + 파라미터1 + "'" + del + "'" + 파라미터2 + "'" + del + "'" + 파라미터3 + "'";

        let bodyparam = {
                userID: "testId",
                userPlant: DBName,
                serviceID: "실행할 프로시저 명",
                serviceParam: param,
                serviceCallerEventType: "이벤트타입",
                serviceCallerEventName: "이벤트명",
                clientNetworkType: navigator.connection.effectiveType,
            };
            fetch(API_RESULT_URL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyparam),
            })
                .then(response => response.json())
                .then(data => {
                    const rtnValue = data["returnValue"][0];
                    const rtnObject = JSON.parse(rtnValue);
                    //rtnObject 에 실제 DB에서 Return한 데이터가 들어있다.
                })
                .catch(err => {
                    console.log(err);
                });

    return(
    <>
    
    
    </>
    );

} 