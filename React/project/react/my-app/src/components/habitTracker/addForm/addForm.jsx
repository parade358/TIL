/*******************************************************************************************	
■ 페이지명	: addForm.jsx
■ 작성목적	: habbitTracker 습관 추가 컴포넌트
■ 기타참고	: X

■ 주요변경내역    
VER			DATE		AUTHOR			DESCRIPTION
----------  ----------	---------------	------------------------------- 
0.01		2024-02-28	ys_choi		    1.신규생성 및 기능개발
0.02		2024-02-29	ys_choi		    1.기능개발 완료
*******************************************************************************************/

// 리액트
import React, { useState } from "react";

// CSS Style
import './addForm.css';

// React MUI
import TextField from '@mui/material/TextField';
import Button    from '@mui/material/Button';

export default function AddForm(props) {

    const [habitName, setHabitName] = useState('');

    const handleChange = (event) => {
        setHabitName(event.target.value);
    };

    /** @use 함수 @role 상위 페이지로 정보를 보내는 함수 @author 최유성  */
    function sendData(){
        props.setHabitName(habitName);
        setHabitName('');
    };

    return (
        <>
            <div id='addForm_wrap'>
                <TextField id="outlined-basic" label="이름" variant="outlined" value={habitName} onChange={handleChange}/> <br/>
                <Button id='addBtn' variant="contained" onClick={sendData}>ADD</Button>
            </div>
        </>
    );
};
