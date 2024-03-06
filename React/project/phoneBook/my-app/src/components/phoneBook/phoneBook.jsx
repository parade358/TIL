/*******************************************************************************************	
■ 페이지명	: PhoneBook.jsx
■ 작성목적	: PhoneBook 시작페이지
■ 기타참고	: X

■ 주요변경내역    
VER			DATE		AUTHOR			DESCRIPTION
----------  ----------	---------------	------------------------------- 
0.01		2024-03-04	ys_choi		    1.신규생성.
*******************************************************************************************/

// 리액트
import React, { useEffect, useState } from "react";

// 컴포넌트
import SearchBar from "./SearchBar/index.jsx";
import ContatctsList from "./ContactsList/index.jsx";
import PagingBar from "./PagingBar/index.jsx";

// CSS Style
import "./phoneBook.css";

export default function PhoneBook() {
    const [page, setPage] = useState(0); // 페이지 상태
    const [rowsPerPage, setRowsPerPage] = useState(2); // 페이지당 보여지는 행 갯수 상태

    // 초기 데이터
    const [originRows, setOriginRows] = useState([
        {
            name: "최유성",
            picture: "https://via.placeholder.com/100",
            phoneNumber: "010-1146-6529",
            group: "ACS",
        },
        {
            name: "가유성",
            picture: "https://via.placeholder.com/100",
            phoneNumber: "010-1146-6529",
            group: "ACS",
        },
        {
            name: "나유성",
            picture: "https://via.placeholder.com/100",
            phoneNumber: "010-1146-6529",
            group: "ACS",
        },
        {
            name: "다유성",
            picture: "https://via.placeholder.com/100",
            phoneNumber: "010-1146-6529",
            group: "ACS",
        },
        {
            name: "라유성",
            picture: "https://via.placeholder.com/100",
            phoneNumber: "010-1146-6529",
            group: "ACS",
        },
    ]);

    // 검색결과
    const [rows, setRows] = useState([]);

    return (
        <>
            <div id="wrap">
                <SearchBar
                    setPage={setPage}
                    originRows={originRows}
                    setRows={setRows}
                />
                <ContatctsList
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    setPage={setPage}
                />
                <PagingBar
                    rowsPerPage={rowsPerPage}
                    page={page}
                    setPage={setPage}
                    totalLength={rows.length}
                />
            </div>
        </>
    );
}
