/*******************************************************************************************	
■ 페이지명	: header.jsx
■ 작성목적	: habbitTracker header 컴포넌트
■ 기타참고	: X

■ 주요변경내역    
VER			DATE		AUTHOR			DESCRIPTION
----------  ----------	---------------	------------------------------- 
0.01		2024-02-28	ys_choi		    1.신규생성 및 기능개발
0.02		2024-02-29	ys_choi		    1.기능개발 완료
*******************************************************************************************/

// 리액트
import React, { useState, useEffect } from "react";

// CSS Style
import './header.css';

export default function Header(props) {
    const [habitCount, setHabitCount] = useState(0);

    useEffect(() => {
        setHabitCount(props.habitCount)
    }, [props.habitCount]);

    return (

        <>
            <div id='header_wrap'>
                <img src="/images/favicon.ico" alt="" />
                <p>Habit Tracker</p>
                <p>Total = {habitCount}</p>
            </div>
        </>
    );
}
