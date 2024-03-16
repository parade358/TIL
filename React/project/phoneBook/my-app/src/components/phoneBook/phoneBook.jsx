import React, { useState, useEffect } from "react";

// 컴포넌트
import SearchBar from "./SearchBar/index.jsx";
import ContatctsList from "./ContactsList/index.jsx";
import PagingBar from "./PagingBar/index.jsx";

// CSS Style
import "./phoneBook.css";

export default function PhoneBook() {
    const [page,        setPage]        = useState(0);                  // 페이지 상태
    const [rowsPerPage, setRowsPerPage] = useState(2);                  // 페이지당 보여지는 행 갯수 상태
    const [originRows,  setOrigin]      = useState([]);                 // 데이터베이스에 있는 모든 전화번호
    const [groupList,   setGroupList]   = useState(["ACS","CO","KR"]);  // 그룹리스트 배열
    const [reload,      setReload]      = useState(0);                  // CLUD 후 전화번호 불러오기

    useEffect(() => {
        const groups = Array.from(new Set(originRows.map((row) => row.group)));
        setGroupList(prevGroups => {
            const Groups = groups.filter(group => !prevGroups.includes(group));
            return [...prevGroups, ...Groups];
        });
    }, [originRows]);
    
    useEffect(() => {
        const API_RESULT_URL = process.env.REACT_APP_API_RESULT_URL;
        const bodyparam = {
            userID: "sa",
            userPlant: "ContactsDB",
            serviceID: "P_SELECT",
            serviceParam: "",
            serviceCallerEventType: "",
            serviceCallerEventName: "",
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
            .then((response) => response.json())
            .then((data) => {
                const returnValue = data.returnValue[0];
                const jsonData = JSON.parse(returnValue);
                const transformedData = jsonData.map((item) => ({
                    index: item.CONTACT_ID,
                    name: item.NAME,
                    picture: item.PROFILE_PICTURE,
                    phoneNumber: item.PHONE_NUMBER,
                    group: item.CONTACT_GROUP,
                }));
                setOrigin(transformedData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [reload]);

    const [rows, setRows] = useState([]);

    return (
        <>
            <div id="wrap">
                {/* 검색 바 */}
                <SearchBar
                    setPage={setPage}
                    originRows={originRows}
                    setRows={setRows}
                />
                {/* 연락처 테이블 */}
                <ContatctsList
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    setPage={setPage}
                    groupList={groupList}
                    reload={reload}
                    setReload={setReload}
                />
                {/* 페이징 바 */}
                <PagingBar
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    page={page}
                    setPage={setPage}
                    totalLength={rows.length}
                    originRows={originRows}
                />
            </div>
        </>
    );
}
