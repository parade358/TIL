/*******************************************************************************************	
■ 페이지명	: habits.jsx
■ 작성목적	: habbitTracker 습관 관리 컴포넌트
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
import './habits.css';

// React MUI
import TextField         from '@mui/material/TextField';
import Button            from '@mui/material/Button';
import Dialog            from '@mui/material/Dialog';
import DialogActions     from '@mui/material/DialogActions';
import DialogContent     from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle       from '@mui/material/DialogTitle';
import Snackbar          from '@mui/material/Snackbar';
import MuiAlert          from '@mui/material/Alert';

export default function Habits(props) {

    const [habitsData,       setHabitsData]       = useState([]);    // 습관 정보
    const [habitCount,       setHabitCount]       = useState(0);     // 습관 점수
    const [openDialog,       setOpenDialog]       = useState(false); // 다이얼로그 실행
    const [duplicateHabit,   setDuplicateHabit]   = useState('');    // 중복인 습관 이름 저장
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false); // 성공 알럿 실행
    const [openErrorAlert,   setOpenErrorAlert]   = useState(false); // 실패 알럿 실행
    const [alertMessage,     setAlertMessage]     = useState('');    // 알럿 메세지 저장


  // 습관 등록 함수
    useEffect(() => {

        if (!props.habitName) { // (조건) 습관 이름이 없는 경우 무시
            return;
        };

        /** @use 변수 @role 입력된 습관 문자열에서 띄어쓰기를 삭제해주는 저장 변환 변수 @author 최유성  */
        const trimmedHabitName = props.habitName.trim(); // 입력된 문자열의 양쪽 공백 제거

        if (trimmedHabitName === "") { // 공백으로만 이루어진 경우
            setAlertMessage("공백은 등록이 불가합니다.");
            setOpenErrorAlert(true);
            return;
        };

        if (isHabitExists(trimmedHabitName)) { // 중복된 습관인지 확인
            setDuplicateHabit(trimmedHabitName); // 중복 습관 이름 저장
            setOpenDialog(true); // 중복 알림 다이얼로그 실행
            return;
        }


        if (trimmedHabitName) { // 습관 배열에 등록
            setHabitsData(prevHabitsData => [...prevHabitsData, { name: trimmedHabitName, count: 0 }]);
        }
    }, [props.habitName]);



    // 이미 있는 습관인지를 확인하는 함수
    const isHabitExists = (newHabitName) => {
        return habitsData.some(habit => habit.name === newHabitName);
    };



    // 습관 점수 전달
    useEffect(() => {
        props.setHabitCount(habitCount); // habitCount를 부모 컴포넌트로 전달해 header의 total 값을 보여줌
    }, [habitCount]); // habitCount가 변경될 때마다 실행



    // 습관 점수 증가
    const habitIncrease = (index) => {
        setHabitsData(prevHabitsData => {
            const updatedHabitsData = [...prevHabitsData]; //복사본 만들기 -> 불변성 유지를 위해
            updatedHabitsData[index].count += 1; // 해당 index의 count 1 증가
            setHabitCount(prevCount => prevCount + 1); // habitCount도 1 증가
            return updatedHabitsData; // 업데이트된 배열을 반환
        });
    };



    // 습관 점수 감소
    const habitDecrease = (index) => {
        setHabitsData(prevHabitsData => {
            const updatedHabitsData = [...prevHabitsData]; // 복사본 만들기 -> 불변성 유지를 위해
            if (updatedHabitsData[index].count > 0) { // 현재 값이 0보다 큰지 확인
                updatedHabitsData[index].count -= 1; // 해당 index의 count를 1 감소
                setHabitCount(prevCount => prevCount - 1); // habitCount를 1 감소
            }
            return updatedHabitsData; // 업데이트된 배열 반환
        });
    };



    // 습관 개별 삭제
    const removeHabit = (index) => {
        const removedHabitName = habitsData[index].name; // 해당 인덱스의 습관 이름 저장
        setHabitsData(prevHabitsData => {
            const updatedHabitsData = [...prevHabitsData]; // 복사본 만들기 -> 불변성 유지를 위해
            const removedHabitCount = updatedHabitsData[index].count; // 삭제하기 전 habit의 count를 저장
            updatedHabitsData.splice(index, 1); // 해당 index의 habit 삭제
            setHabitCount(prevCount => prevCount - removedHabitCount); // 미리 저장한 count만큼 habitCount를 감소
            setOpenSuccessAlert(true); // 알림을 열도록 상태 업데이트
            setAlertMessage(`${removedHabitName} 습관 삭제 완료!`); // 알림 메시지 설정
            return updatedHabitsData; // 업데이트된 배열 반환
        });
    };



    // 습관 전체 삭제
    const resetAllHabits = () => {
        if (habitsData.length === 0) { // 습관등록 안된 상태에서 버튼 눌렀을시
            setOpenErrorAlert(true);
            setAlertMessage("등록된 습관가 없습니다."); 
            return;
        }

        setHabitsData([]);
        setHabitCount(0);
    
        setOpenSuccessAlert(true);
        setAlertMessage("전체 습관 삭제 완료!");
    };


    return (
        <>
            <div id='habits_wrap'>
                {habitsData.map((habit, index) => (
                    <div key={index}>
                        <TextField id={`outlined-basic-${index}`} label="이름" variant="outlined" value={habit.name}/>
                        <TextField id={`outlined-basic-${index}`} label="점수" variant="outlined" value={habit.count}/>
                        <Button variant="contained" onClick={() => habitIncrease(index)} id="increaseBtn">+</Button>
                        <Button variant="contained" onClick={() => habitDecrease(index)} id="decreaseBtn">-</Button>
                        <Button variant="contained" onClick={() => removeHabit(index)} id="removeBtn">X</Button> <br/>
                    </div>
                ))}
                
                <Button variant="contained" onClick={resetAllHabits} id="resetBtn">RESET ALL</Button>
            </div>



            {/*습관 중복 등록 다이얼로그*/}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(true)} // 백그라운드 클릭으로 닫기 비활성화
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"이미 등록된 습관입니다."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`"${duplicateHabit}" 습관은 이미 등록되어 있습니다.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary" autoFocus>
                        확인
                    </Button>
                </DialogActions>
            </Dialog>



            {/*습관 삭제 성공 스낵바-알럿*/}
            <Snackbar open={openSuccessAlert} autoHideDuration={5000} onClose={() => setOpenSuccessAlert(false)}>
                <MuiAlert onClose={() => setOpenSuccessAlert(false)} severity="success" sx={{ width: '100%' }}>
                    {alertMessage}
                </MuiAlert>
            </Snackbar>



            {/*습관 삭제 실패 스낵바-알럿*/}
            <Snackbar open={openErrorAlert} autoHideDuration={5000} onClose={() => setOpenErrorAlert(false)}>
                <MuiAlert onClose={() => setOpenErrorAlert(false)} severity="error" sx={{ width: '100%' }}>
                    {alertMessage}
                </MuiAlert>
            </Snackbar>
        </>
    );
};