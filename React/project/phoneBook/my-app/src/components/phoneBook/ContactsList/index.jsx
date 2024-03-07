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
import React, { useState } from "react";

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
    Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon from "@mui/icons-material/Save";

// CSS Style
import "./contactsList.css";

export default function ContactsList({
    page,
    setPage,
    rows,
    rowsPerPage,
    setRows,
}) {
    const [open, setOpen] = useState(false); // 다이얼로그 상태
    const [picture, setPicture] = useState(""); // 사진 상태
    const [name, setName] = useState(""); // 이름 상태
    const [phoneNumber, setPhoneNumber] = useState(""); // 전화번호 상태
    const [group, setGroup] = useState(""); // 그룹 상태
    const [dropDown, setDropDown] = useState(true); // 직접입력 상태
    const [menuItems, setMenuItems] = useState(["ACS", "CO", "KR"]); // 그룹 메뉴 아이템 상태
    const [showCheckbox, setShowCheckbox] = useState(false); // 체크박스 보여지기
    const [selectedRows, setSelectedRows] = useState([]); // 체크된 행 상태
    const [rowIndex, setRowIndex] = useState(null);
    const [changeName, setChangeName] = useState("");
    const [changePhoneNumber, setChangePhoneNumber] = useState("");
    const [changeGroup, setChangeGroup] = useState("");

    const addGroupToMenu = (groupItem) => {
        if (!menuItems.includes(groupItem)) {
            setMenuItems([...menuItems, groupItem]);
        }
    };

    const editBtnClick = (index, name, phoneNumber, group) => {
        console.log(index, name, phoneNumber, group);
        setRowIndex(index);
        setChangeName(name);
        setChangePhoneNumber(phoneNumber);
        setChangeGroup(group);
    };

    const contactChange = (index, field, value) => {
        const newRows = [...rows];
        const rowIndex = newRows.findIndex((row) => row.index === index); // 여기서 'identifier'는 행의 고유한 식별자라고 가정합니다.
        if (rowIndex !== -1) {
            newRows[rowIndex][field] = value;
            setRows(newRows);
        } else {
            console.error("Row not found"); // 예외 처리: 행을 찾을 수 없는 경우
        }
    };

    const saveChanges = () => {
        setRowIndex(null);
    };

    const cancelChanges = (index) => {
        const updatedRows = [...rows]; // 현재 행 배열의 복사본 생성
        const rowIndex = updatedRows.findIndex((row) => row.index === index); // 주어진 인덱스에 해당하는 행을 찾음
        if (rowIndex !== -1) {
            // 주어진 인덱스에 해당하는 행을 찾은 경우
            updatedRows[rowIndex] = {
                ...updatedRows[rowIndex],
                name: changeName,
                phoneNumber: changePhoneNumber,
                group: changeGroup,
            };
            setRows(updatedRows); // 변경된 행 배열을 설정하여 업데이트
        }
        // 상태들을 초기화하여 이전 값으로 복구
        setChangeName("");
        setChangePhoneNumber("");
        setChangeGroup("");
        setRowIndex(null);
    };

    // 전화번호부 테이블 컬럼 정의
    const columns = [
        showCheckbox
            ? { field: "checkbox", headerName: "체크박스", width: 100 }
            : null,
        !showCheckbox
            ? { field: "picture", headerName: "사진", width: 100 }
            : null,
        { field: "name", headerName: "이름", width: 70 },
        { field: "phoneNumber", headerName: "전화번호", width: 130 },
        { field: "group", headerName: "그룹", width: 100 },
        { field: "editBtn", headerName: "수정", width: 130 },
    ].filter(Boolean);

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
        setDropDown(true);
        setOpen(true);
    };

    // 다이얼로그 닫기 함수
    const closeDialog = () => {
        setName("");
        setPicture("");
        setPhoneNumber("");
        setGroup("");
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

    // 전화번호 추가 함수
    const addContact = () => {
        if (
            picture === "" ||
            name === "" ||
            phoneNumber === "" ||
            group === ""
        ) {
            alert("값이 비어있습니다. 모든 필드에 값을 입력하세요.");
            return;
        }

        addGroupToMenu(group);

        const newItem = {
            name: name,
            picture: picture,
            phoneNumber: phoneNumber,
            group: group,
        };
        setRows([...rows, newItem]);
        setOpen(false);
        setName("");
        setPicture("");
        setPhoneNumber("");
        setGroup("");
    };

    // 전화번호 삭제버튼 클릭시 실행 함수
    const deleteContact = () => {
        console.log("삭제버튼");
        const updatedRows = rows.filter((row) => !selectedRows[row.index]); // 선택되지 않은 행만 필터링
        setRows(updatedRows);
        setSelectedRows({}); // 선택된 행들 초기화
        setPage(0);
    };

    // 체크박스 변경 시 실행 함수
    const handleCheckboxChange = (index) => {
        console.log(index);
        setSelectedRows((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
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
                                    <Button
                                        id="addBtn"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SearchIcon />}
                                        onClick={openDialog}
                                        disableElevation
                                    >
                                        추가
                                    </Button>
                                    {/* 연락처 삭제 버튼 */}
                                    <div>
                                        <Button
                                            id="deleteBtn"
                                            variant="contained"
                                            color="primary"
                                            startIcon={<DeleteIcon />}
                                            onClick={
                                                showCheckbox
                                                    ? deleteContact
                                                    : appearCheckbox
                                            }
                                            disableElevation
                                        >
                                            삭제
                                        </Button>
                                        {showCheckbox ? (
                                            <Button
                                                id="cancelBtn"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<HighlightOffIcon />}
                                                onClick={hideCheckbox}
                                                disableElevation
                                            >
                                                취소
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                        {/* 헤더의 두 번째 행 */}
                        <TableRow>
                            {/* 각 열의 제목 */}
                            {showCheckbox ? (
                                <TableCell className="tableHeadCell">
                                    선택
                                </TableCell>
                            ) : (
                                <TableCell className="tableHeadCell">
                                    사진
                                </TableCell>
                            )}
                            <TableCell className="tableHeadCell">
                                이름
                            </TableCell>
                            <TableCell className="tableHeadCell">
                                전화번호
                            </TableCell>
                            <TableCell className="tableHeadCell">
                                그룹
                            </TableCell>
                            <TableCell className="tableHeadCell">
                                수정
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {/* 테이블의 본문 부분 */}
                    <TableBody>
                        {/* 테이블의 각 행을 매핑하여 렌더링 */}
                        {(rowsPerPage > 0
                            ? rows.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                              )
                            : rows
                        ).map((row, index) => (
                            <TableRow
                                key={row.index}
                                className={
                                    index % 2 === 0
                                        ? "tableRowWhite"
                                        : "tableRow"
                                }
                            >
                                {/* 각 행의 셀을 매핑하여 렌더링 */}
                                {columns.map((column, columnIndex) => (
                                    <TableCell
                                        key={columnIndex}
                                        className="tableCell"
                                    >
                                        {/* 사진 셀 또는 데이터 셀을 렌더링 */}
                                        {column.field === "checkbox" ? (
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedRows[row.index] ||
                                                    false
                                                } // 해당 행의 ID를 이용하여 체크 여부 확인
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        row.index
                                                    )
                                                } // 행의 ID를 이용하여 체크박스 변경 핸들러 호출
                                            />
                                        ) : column.field === "picture" ? (
                                            <img
                                                src={row.picture}
                                                alt="picture"
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                }}
                                            />
                                        ) : column.field !== "editBtn" ? (
                                            rowIndex === row.index ? (
                                                <TextField
                                                    value={row[column.field]}
                                                    onChange={(e) =>
                                                        contactChange(
                                                            row.index,
                                                            column.field,
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{ width: "150px" }}
                                                />
                                            ) : (
                                                row[column.field]
                                            )
                                        ) : (
                                            <div>
                                                {rowIndex === row.index ? (
                                                    // 수정 중일 때만 저장 버튼과 취소 버튼 렌더링
                                                    <div>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() =>
                                                                saveChanges()
                                                            }
                                                            id="saveBtn"
                                                        >
                                                            Update
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() =>
                                                                cancelChanges(
                                                                    row.index
                                                                )
                                                            }
                                                            id="updateCancelBtn"
                                                            style={{
                                                                marginLeft:
                                                                    "20px",
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() =>
                                                            editBtnClick(
                                                                row.index,
                                                                row.name,
                                                                row.phoneNumber,
                                                                row.group
                                                            )
                                                        }
                                                        id="editBtn"
                                                    >
                                                        수정
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/*페이징바*/}
                {/*전화번호 추가 다이얼로그*/}
                <Dialog
                    open={open}
                    onClose={closeDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {/*다이얼로그 제목*/}
                    <DialogTitle id="alert-dialog-title" align="center">
                        {"연락처 추가"}
                    </DialogTitle>
                    {/*다이얼로그 내용*/}
                    <DialogContent>
                        {/*전체 그리드*/}
                        <Grid
                            container
                            spacing={10}
                            style={{ height: "400px" }}
                        >
                            {/*사진 추가 그리드*/}
                            <Grid
                                item
                                xs={6}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <label
                                    htmlFor="imageInput"
                                    style={{
                                        width: "300px",
                                        height: "300px",
                                        overflow: "hidden",
                                    }}
                                >
                                    {picture ? (
                                        <img
                                            src={picture}
                                            alt="이미지 버튼"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={`${process.env.PUBLIC_URL}/images/addImg.png`}
                                            alt="이미지 버튼"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}
                                </label>
                                <input
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={insertPicture}
                                />
                            </Grid>
                            {/*정보 추가 그리드*/}
                            <Grid
                                item
                                xs={4}
                                container
                                direction="column"
                                spacing={2}
                            >
                                <Grid item>
                                    {"이름"}
                                    <TextField
                                        id="nameField"
                                        variant="outlined"
                                        placeholder="Input Value"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item>
                                    {"전화번호"}
                                    <TextField
                                        id="phoneNumberField"
                                        variant="outlined"
                                        placeholder="Input Value"
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item>
                                    {"그룹"}
                                    {dropDown ? (
                                        <FormControl variant="outlined">
                                            <InputLabel id="group-select-label">
                                                Dropdown List
                                            </InputLabel>
                                            <Select
                                                labelId="group-select-label"
                                                id="group-select"
                                                value={group}
                                                onChange={(e) =>
                                                    setGroup(e.target.value)
                                                }
                                                label="그룹"
                                            >
                                                {menuItems.map(
                                                    (item, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={item}
                                                        >
                                                            {item}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <TextField
                                            id="group-textfield"
                                            variant="outlined"
                                            value={group}
                                            onChange={(e) =>
                                                setGroup(e.target.value)
                                            }
                                            placeholder="그룹을 입력하세요"
                                        />
                                    )}

                                    {dropDown ? (
                                        <span
                                            id="directInput"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setDropDown(false)}
                                        >
                                            {"직접입력"}
                                        </span>
                                    ) : (
                                        <span
                                            id="dropdownInput"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setDropDown(true)}
                                        >
                                            {"취소"}
                                        </span>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    {/*다이얼로그 액션*/}
                    <DialogActions style={{ justifyContent: "center" }}>
                        {/* 저장 버튼 */}
                        <Button
                            onClick={() => addContact()}
                            startIcon={<SaveIcon />}
                            autoFocus
                            style={{
                                backgroundColor: "#508EF5",
                                color: "white",
                                width: "550px",
                            }}
                        >
                            저장
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}
