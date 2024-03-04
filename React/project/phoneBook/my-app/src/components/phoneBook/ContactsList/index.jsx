/*******************************************************************************************	
■ 페이지명	: index.jsx
■ 작성목적	: 전화번호 리스트 컴포넌트
■ 기타참고	: X

■ 주요변경내역    
VER			DATE		AUTHOR			DESCRIPTION
----------  ----------	---------------	------------------------------- 
0.01		2024-03-04	ys_choi		    1.신규생성.
*******************************************************************************************/

// React
import React, { useState } from "react";

// MUI
import { Table, TableHead, TableBody, TableCell, TableRow, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// Component
import PagingBar from '../PagingBar/index';

// CSS Style
import './contactsList.css';

export default function ContactsList() {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = useState('');
    const [picture, setPicture] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dept, setDept] = useState('');
    const [group, setGroup] = useState(''); // 추가: 그룹 상태 변수
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(1);

    const columns = [
        { field: 'picture', headerName: '사진', width: 100 },
        { field: 'name', headerName: '이름', width: 70 },
        { field: 'phoneNumber', headerName: '전화번호', width: 130 },
        { field: 'dept', headerName: '그룹', width: 130 },
        { field: 'editBtn', headerName: '수정', width: 130 },
    ];

    const [rows, setRows] = useState([
        { name: '최유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '가유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '나유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '다유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '라유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '마유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '바유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '사유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '아유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '자유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '차유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '카유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '타유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '파유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
        { name: '하유성', picture: 'https://via.placeholder.com/100', phoneNumber: '010-1146-6529', dept: 'ACS' },
    ]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleImageChange = (event) => {
        // 이미지 변경 이벤트 처리
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPicture(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const insertBtn = () => {
        const newItem = {
            name: name,
            picture: picture,
            phoneNumber: phoneNumber,
            dept: dept,
        };
        setRows([...rows, newItem]);
        setOpen(false); // 다이얼로그 닫기
        // 추가: 입력 필드 초기화
        setName('');
        setPicture('');
        setPhoneNumber('');
        setDept('');
    };

    const deleteBtn = () => {
        console.log('삭제버튼');
    };

    const editBtn = (id) => {
        console.log('수정버튼 + ', id);
    };

    return (
        <div id="contactsListWrap">
            <Table className="table">
                <TableHead className="tableHead">
                    <TableRow>
                        <TableCell className="tableHeadCell" colSpan={5}>
                            <div id="buttonsWrapper">
                                <Button variant="contained" color="primary" startIcon={<SearchIcon />} onClick={handleClickOpen} disableElevation>추가</Button>
                                <Button variant="contained" color="primary" startIcon={<DeleteIcon />} onClick={deleteBtn} disableElevation>삭제</Button>    
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="tableHeadCell">사진</TableCell>
                        <TableCell className="tableHeadCell">이름</TableCell>
                        <TableCell className="tableHeadCell">전화번호</TableCell>
                        <TableCell className="tableHeadCell">그룹</TableCell>
                        <TableCell className="tableHeadCell">수정</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row, index) => (
                        <TableRow key={row.name} className={index % 2 === 0 ? 'tableRowRed' : 'tableRowBlue'}>
                            {columns.map((column) => (
                                <TableCell key={column.field} className="tableCell">
                                    {column.field === 'picture' ? (
                                        <img src={row.picture} alt="picture" style={{ width: '50px', height: '50px' }} />
                                    ) : column.field !== 'editBtn' ? (
                                        row[column.field]
                                    ) : (
                                        <div>
                                            <Button variant="outlined" onClick={() => editBtn(row.name)} id="editBtn">수정</Button>
                                        </div>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <PagingBar totalItems={rows.length} itemsPerPage={rowsPerPage} onPageChange={setPage} />
                                        
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" align="center">
                    {"연락처 추가"}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={8} style={{ display: 'flex', flexDirection: 'column' }}>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            <img src={picture} alt="사진" style={{ maxWidth: '100%', maxHeight: '100%', marginTop: '10px' }} />
                        </Grid>
                        <Grid item xs={4} container direction="column" spacing={2}>
                            <Grid item>
                                <TextField
                                    id="name"
                                    label="이름"
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="phoneNumber"
                                    label="번호"
                                    variant="outlined"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined">
                                    <InputLabel id="group-select-label">그룹</InputLabel>
                                    <Select
                                        labelId="group-select-label"
                                        id="group-select"
                                        value={dept}
                                        onChange={(e) => setDept(e.target.value)}
                                        label="그룹"
                                    >
                                        <MenuItem value="ACS">ACS</MenuItem>
                                        <MenuItem value="CO">CO</MenuItem>
                                        <MenuItem value="KR">KR</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    {/* 저장 버튼 */}
                    <Button onClick={() => insertBtn(name, picture, phoneNumber, group)} startIcon={<SaveIcon />} autoFocus style={{ backgroundColor: '#508EF5', color: 'white', width: '316px'}}>
                        저장
                    </Button>
                </DialogActions>
            </Dialog>
        
        </div>
    );
};