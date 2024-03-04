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
import React from "react";

// 컴포넌트
import SearchBar from "./SearchBar/index.jsx";
import ContatctsList from "./ContactsList/index.jsx";

// CSS Style
import './phoneBook.css'

export default function PhoneBook() {

    return(
    <>
        <div id="wrap">
            <SearchBar/>
            <ContatctsList/>
        </div>
    </>
    );
};