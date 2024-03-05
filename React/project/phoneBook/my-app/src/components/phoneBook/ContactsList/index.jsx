/*******************************************************************************************	
■ 페이지명	: index.jsx
■ 작성목적	: 전화번호 리스트 컴포넌트
■ 기타참고	: X

■ 주요변경내역    
VER			DATE		AUTHOR			DESCRIPTION
----------  ----------	---------------	------------------------------- 
0.01		2024-03-04	ys_choi		    1. 신규 생성.
                                        2. 디자인 및 영역 잡기
                                        3. 버튼 및 테이블 구현 완료
                                        4. 페이징바 구현 완료
0.02        2024-03-05  ys_choi		    1. 전화번호 추가 팝업창 구현 완료
                                        2. 체크박스 기능 구현
*******************************************************************************************/

// React
import React, { useState,useEffect } from "react";

// MUI
import {
       Table,
       TableHead,
       TableBody,
       TableCell,
       TableRow,
       Button,
       TextField,
       FormControl,
       InputLabel,
       Select,
       MenuItem,
       Dialog,
       DialogActions,
       DialogContent,
       DialogTitle,
       Grid
}                       from '@mui/material';
import DeleteIcon       from '@mui/icons-material/Delete';
import SearchIcon       from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveIcon         from '@mui/icons-material/Save';

// Component
import PagingBar from '../PagingBar/index';

// CSS Style
import './contactsList.css';

export default function ContactsList(props) {

    const [page,         setPage]         = useState(0);     // 페이지 상태
    const [rowsPerPage,  setRowsPerPage]  = useState(2);     // 페이지당 보여지는 행 갯수 상태
    const [open,         setOpen]         = useState(false); // 다이얼로그 상태
    const [picture,      setPicture]      = useState('');    // 사진 상태
    const [name,         setName]         = useState('');    // 이름 상태
    const [phoneNumber,  setPhoneNumber]  = useState('');    // 전화번호 상태
    const [group,        setGroup]        = useState('');    // 그룹 상태
    const [diret,        setDiret]        = useState(true);  // 직접입력 상태
    const [showCheckbox, setShowCheckbox] = useState(false); // 체크박스 보여지기
    const [selectedRows, setSelectedRows] = useState([]);    // 체크된 행 상태

    useEffect(() => {
        setPage(props.handlePageChange)
    }, [props.handlePageChange]);

    // 전화번호부 테이블 컬럼 정의
    const columns = [
        showCheckbox ?  { field: 'checkbox',    headerName: '체크박스', width: 100 } : null,
        !showCheckbox ? { field: 'picture',     headerName: '사진',     width: 100 } : null,
                        { field: 'name',        headerName: '이름',     width: 70 },
                        { field: 'phoneNumber', headerName: '전화번호', width: 130 },
                        { field: 'group',       headerName: '그룹',     width: 130 },
                        { field: 'editBtn',     headerName: '수정',     width: 130 },
    ].filter(Boolean);

    // 초기 데이터
    const [rows, setRows] = useState([
        { name: '최유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', group: 'ACS' },
        { name: '가유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', group: 'ACS' },
        { name: '나유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', group: 'ACS' },
        { name: '다유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', group: 'ACS' },
        { name: '라유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', group: 'ACS' },
    ]);

    // 삭제 시작 함수
    const appearCheckbox = () => {
        setShowCheckbox(true);
    };

    // 삭제 취소 함수
    const hideCheckbox = () => {
        setShowCheckbox(false);
    };

    // 다이얼로그 열기 함수
    const openDialog = () => {
        setOpen(true);
    };

    // 다이얼로그 닫기 함수
    const closeDialog = () => {
        setName('');
        setPicture('');
        setPhoneNumber('');
        setGroup('');
        setOpen(false);
    };

    // 사진 삽입 함수
    const insertPicture = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPicture(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // 직접입력 변경 함수
    const directInputClick = () => {
        setDiret(false);
        setGroup('');
    };

    const dropdownInputClick = () => {
        setDiret(true);
        setGroup('');
    }

    // 전화번호 추가 함수
    const addContact = () => {
        const newItem = {
            name: name,
            picture: picture,
            phoneNumber: phoneNumber,
            group: group,
        };
        setRows([...rows, newItem]);
        setOpen(false);
        setName('');
        setPicture('');
        setPhoneNumber('');
        setGroup('');
    };

    // 전화번호 삭제버튼 클릭시 실행 함수
    const deleteContact = () => {
        console.log('삭제버튼');
        const updatedRows = rows.filter(row => !selectedRows[row.name]); // 선택되지 않은 행만 필터링
        setRows(updatedRows);
        setSelectedRows({}); // 선택된 행들 초기화
        setPage(0);
    };

    // 전화번호 수정버튼 클릭시 실행 함수
    const editContact = (id) => {
        console.log('수정버튼 + ', id);
    };

    // 체크박스 변경 시 실행 함수
    const handleCheckboxChange = (id) => {
        console.log(id);
        setSelectedRows(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
    <>
        <div id="contactsListWrap">
            <Table className="table">
                {/* 테이블의 헤더 부분 */}
                <TableHead className="tableHead">
                    {/* 헤더의 첫 번째 행 */}
                    <TableRow>
                        {/* 첫 번째 행의 셀 */}
                        <TableCell className="tableHeadCell" colSpan={5}>
                            {/* 버튼 그룹 */}
                            <div id="buttonsWrapper">
                                {/* 연락처 추가 버튼 */}
                                <Button id="addBtn" variant="contained" color="primary" startIcon={<SearchIcon />} onClick={openDialog} disableElevation>추가</Button>
                                {/* 연락처 삭제 버튼 */}
                                <div>
                                    <Button id="deleteBtn" variant="contained" color="primary" startIcon={<DeleteIcon />} onClick={showCheckbox ? deleteContact : appearCheckbox} disableElevation>삭제</Button>
                                    {showCheckbox ? (
                                        <Button id="cancelBtn" variant="contained" color="primary" startIcon={<HighlightOffIcon />} onClick={hideCheckbox} disableElevation>취소</Button>
                                    ) : null}
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                    {/* 헤더의 두 번째 행 */}
                    <TableRow>
                        {/* 각 열의 제목 */}
                        {showCheckbox ? (
                            <TableCell className="tableHeadCell">선택</TableCell>
                        ) : (
                            <TableCell className="tableHeadCell">사진</TableCell>
                        )}
                        <TableCell className="tableHeadCell">이름</TableCell>
                        <TableCell className="tableHeadCell">전화번호</TableCell>
                        <TableCell className="tableHeadCell">그룹</TableCell>
                        <TableCell className="tableHeadCell">수정</TableCell>
                    </TableRow>
                </TableHead>
                {/* 테이블의 본문 부분 */}
                <TableBody>
                    {/* 테이블의 각 행을 매핑하여 렌더링 */}
                    {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row, index) => (
                        <TableRow key={row.name} className={index % 2 === 0 ? 'tableRowWhite' : 'tableRow'}>
                            {/* 각 행의 셀을 매핑하여 렌더링 */}
                            {columns.map((column, columnIndex) => (
                                <TableCell key={columnIndex} className="tableCell">
                                    {/* 사진 셀 또는 데이터 셀을 렌더링 */}
                                    {column.field === 'checkbox' ? 
                                        (
                                            <input
                                                type="checkbox"
                                                checked={selectedRows[row.name] || false} // 해당 행의 ID를 이용하여 체크 여부 확인
                                                onChange={() => handleCheckboxChange(row.name)} // 행의 ID를 이용하여 체크박스 변경 핸들러 호출
                                            />
                                        ) 
                                        : column.field === 'picture' ? 
                                        (
                                            <img src={row.picture} alt="picture" style={{ width: '50px', height: '50px' }} />
                                        )
                                        : column.field !== 'editBtn' ? 
                                        (
                                            row[column.field]
                                        ) 
                                        : 
                                        (
                                            <div>
                                                <Button variant="outlined" onClick={() => editContact(row.name)} id="editBtn">수정</Button>
                                            </div>
                                        )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
            {/*페이징바*/}
            <PagingBar totalItems={rows.length} itemsPerPage={rowsPerPage} onPageChange={setPage} />
            {/*전화번호 추가 다이얼로그*/}                
            <Dialog open={open} onClose={closeDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                {/*다이얼로그 제목*/}
                <DialogTitle id="alert-dialog-title" align="center">
                    {"연락처 추가"}
                </DialogTitle>
                {/*다이얼로그 내용*/}
                <DialogContent>
                    {/*전체 그리드*/}
                    <Grid container spacing={10} style={{height: '400px'}}>
                        {/*사진 추가 그리드*/}
                        <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="imageInput" style={{ width: '300px', height: '300px', overflow: 'hidden' }}>
                                {picture ? 
                                    (
                                        <img src={picture} alt="이미지 버튼" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) 
                                    : 
                                    (
                                        <img src={`${process.env.PUBLIC_URL}/images/addImg.png`} alt="이미지 버튼" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )
                                }
                            </label>
                            <input id="imageInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={insertPicture} />
                        </Grid>
                        {/*정보 추가 그리드*/}
                        <Grid item xs={4} container direction="column" spacing={2}>
                            <Grid item>
                                {"이름"}
                                <TextField id="nameField"  variant="outlined" placeholder="Input Value" value={name} onChange={(e) => setName(e.target.value)}/>
                            </Grid>
                            <Grid item>
                                {"전화번호"}
                                <TextField id="phoneNumberField" variant="outlined" placeholder="Input Value" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                            </Grid>
                            <Grid item>
                                {"그룹"}
                                {diret ?
                                    (
                                        <FormControl variant="outlined">
                                            <InputLabel>Dropdown List</InputLabel>
                                            <Select 
                                                id="group-select" 
                                                value={group} 
                                                onChange={(e) => setGroup(e.target.value)} 
                                                label="그룹"
                                            >
                                                <MenuItem value="ACS">ACS</MenuItem>
                                                <MenuItem value="CO">CO</MenuItem>
                                                <MenuItem value="KR">KR</MenuItem>
                                            </Select>
                                        </FormControl>
                                    ) 
                                    : 
                                    (
                                        <TextField 
                                            id="group-textfield" 
                                            variant="outlined" 
                                            value={group} 
                                            onChange={(e) => setGroup(e.target.value)} 
                                            placeholder="그룹을 입력하세요"
                                        />
                                    )}

                                {diret ?                                 
                                    (
                                        <span id="directInput" style={{ cursor: 'pointer'}} onClick={directInputClick} >
                                            {'직접입력'}
                                        </span>
                                    ) 
                                    : 
                                    (
                                        <span id="dropdownInput" style={{ cursor: 'pointer'}} onClick={dropdownInputClick}>
                                            {'취소'}
                                        </span>
                                    )}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                {/*다이얼로그 액션*/}
                <DialogActions style={{ justifyContent: 'center' }}>
                    {/* 저장 버튼 */}
                    <Button onClick={() => addContact()} startIcon={<SaveIcon />} autoFocus style={{ backgroundColor: '#508EF5', color: 'white', width: '550px'}}>
                        저장
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    </>
    );
};
