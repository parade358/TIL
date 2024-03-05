/*******************************************************************************************	
■ 페이지명	: habitTracker.jsx
■ 작성목적	: habbitTracker 시작페이지
■ 기타참고	: X

■ 주요변경내역    
VER			DATE		AUTHOR			DESCRIPTION
----------  ----------	---------------	------------------------------- 
0.01		2024-02-28	ys_choi		    1.신규생성.
0.02		2024-02-29	ys_choi		    1.페이지 명 변경 (firstPage.jsx -> habitTracker.jsx)
*******************************************************************************************/

// 리액트
import React, { useState, useEffect } from "react";

// 컴포넌트
import Header from './header/header.jsx';
import AddForm from './addForm/addForm.jsx';
import Habits from './habits/habits.jsx';

export default function FirstPage() {

    const [habitName, setHabitName]   = useState('');
    const [habitCount, setHabitCount] = useState(0);

    useEffect(() => {
        setHabitName('');
    }, [habitName]);

    return(
    <>
        <Header habitCount = {habitCount}/>
        <AddForm setHabitName = {setHabitName}/>
        <Habits habitName = {habitName} setHabitCount={setHabitCount}/>
    </>
    );
};