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
}                       from "@mui/material";
import DeleteIcon       from "@mui/icons-material/Delete";
import SearchIcon       from "@mui/icons-material/Search";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon         from "@mui/icons-material/Save";

// CSS Style
import "./contactsList.css";

export default function ContactsList({
    page,
    setPage,
    rows,
    rowsPerPage,
    setRows,
    groupList,
    reload,
    setReload,
}) {
    const [open,                setOpen]                = useState(false);  // 다이얼로그 상태
    const [picture,             setPicture]             = useState("");     // 사진 상태
    const [name,                setName]                = useState("");     // 이름 상태
    const [phoneNumber,         setPhoneNumber]         = useState("");     // 전화번호 상태
    const [group,               setGroup]               = useState("");     // 그룹 상태
    const [dropDown,            setDropDown]            = useState(true);   // 직접입력 상태
    const [showCheckbox,        setShowCheckbox]        = useState(false);  // 체크박스 상태
    const [selectedRows,        setSelectedRows]        = useState([]);     // 체크된 행 상태
    const [rowIndex,            setRowIndex]            = useState(null);   // 선택된 행 인덱스 상태
    const [revertName,          setRevertName]          = useState("");     // 수정 전 이름 상태
    const [revertPhoneNumber,   setRevertPhoneNumber]   = useState("");     // 수정 전 전화번호 상태
    const [revertGroup,         setRevertGroup]         = useState("");     // 수정 전 그룹 상태
    const [error,               setError]               = useState('');     // 에러메세지
    const API_RESULT_URL = process.env.REACT_APP_API_RESULT_URL;

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

    // 정규표현식 이용 전화번호 필터링 함수
    const handleChange = (e) => {
        const input = e.target.value;
        const regex = /^[0-9-]*$/;
        if (regex.test(input) || input === "") {
            setPhoneNumber(input);
            setError(""); // 에러 초기화
        } else {
            setError("숫자와 하이픈(-)만 입력할 수 있습니다.");
        }
    };

    // 전화번호부 추가 함수
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

        const bodyparam = {
            userID: "sa",
            userPlant: "ContactsDB",
            serviceID: "P_INSERT",
            serviceParam: `'${picture}', '${name}', '${phoneNumber}', '${group}'`,
            serviceCallerEventType: "이벤트타입",
            serviceCallerEventName: "이벤트명",
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
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setReload(reload + 1);
                setOpen(false);
                setName("");
                setPicture("");
                setPhoneNumber("");
                setGroup("");
                alert("전화번호 추가 성공!");
            })
            .catch((error) => {
                console.error("Error:", error.message);
            });
    };

    // 전화번호 삭제버튼 클릭시 실행 함수
    const deleteContact = () => {
        const selectedIndex = rows
            .filter((row) => selectedRows[row.index])
            .map((row) => row.index);

        const indexString = selectedIndex.join(".");

        if (selectedIndex.length === 0) {
            alert("삭제할 전화번호를 선택하세요.");
            return;
        }

        fetch(API_RESULT_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userID: "sa",
                userPlant: "ContactsDB",
                serviceID: "DeleteRowsByNumber",
                serviceParam: `${indexString}`,
                serviceCallerEventType: "",
                serviceCallerEventName: "",
                clientNetworkType: navigator.connection.effectiveType,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("네트워크 응답이 올바르지 않습니다");
                }
                return response.json();
            })
            .then((data) => {
                setReload(reload + 1);
                setShowCheckbox(false);
                setSelectedRows([]);
                setPage(0);
                alert("전화번호 삭제 성공!");
            })
            .catch((error) => {
                console.error("에러:", error.message);
            });
    };

    // 체크박스 변경 시 실행 함수
    const handleCheckboxChange = (index) => {
        setSelectedRows((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    // 수정버튼 클릭시 해당 행 정보 담아두기
    const editBtnClick = (index, name, phoneNumber, group) => {
        setRowIndex(index);
        setName(name);
        setRevertName(name);
        setPhoneNumber(phoneNumber);
        setRevertPhoneNumber(phoneNumber);
        setGroup(group);
        setRevertGroup(group);
    };

    // 텍스트필드에 타이핑시 수정
    const contactChange = (index, field, value) => {
        const newRows = [...rows];
        const rowIndex = newRows.findIndex((row) => row.index === index);
        if (rowIndex !== -1) {
            newRows[rowIndex][field] = value;
            if (field === "name") {
                setName(value);
            } else if (field === "phoneNumber") {
                setPhoneNumber(value);
            } else if (field === "group") {
                setGroup(value);
            }
            setRows(newRows);
        } else {
            console.error("Row not found");
        }
    };

    // 연락처 업데이트
    const saveChanges = () => {
        const bodyparam = {
            userID: "sa",
            userPlant: "ContactsDB",
            serviceID: "P_UPDATE",
            serviceParam: `'${rowIndex}', '${name}', '${phoneNumber}', '${group}'`,
            serviceCallerEventType: "이벤트타입",
            serviceCallerEventName: "이벤트명",
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
            .then((response) => {
                if (!response.ok) {
                    throw new Error("네트워크 오류");
                }
                return response.json();
            })
            .catch((error) => {
                console.error("Error:", error.message);
            });

        setName("");
        setPhoneNumber("");
        setGroup("");

        setReload(reload + 1);

        setRowIndex(null);

        alert("전화번호 수정 완료!");
    };

    // 수정 취소 (되돌릴 데이터 넣어주기)
    const cancelChanges = (index) => {
        const revertRows = [...rows];
        const rowIndex = revertRows.findIndex((row) => row.index === index);
        if (rowIndex !== -1) {
            revertRows[rowIndex] = {
                ...revertRows[rowIndex],
                name: revertName,
                phoneNumber: revertPhoneNumber,
                group: revertGroup,
            };
            setRows(revertRows);
        }

        setRevertName("");
        setRevertPhoneNumber("");
        setRevertGroup("");
        setRowIndex(null);
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
                                        {/* 삭제 버튼 눌렀을 시 취소버튼 생성*/}
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
                    {rows.length > 0 && rows[0].index !== "" ? (
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
                                            {/* 체크박스 */}
                                            {column.field === "checkbox" ? (
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedRows[
                                                            row.index
                                                        ] || false
                                                    } // 해당 행의 인덱스를 이용하여 체크 여부 확인
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            row.index
                                                        )
                                                    } // 행의 인덱스를 이용하여 체크박스 변경 핸들러 호출
                                                />
                                            ) : column.field === "picture" ? ( // 프로필 사진
                                                <img
                                                    src={row.picture}
                                                    alt="사용자 프로필 사진"
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                    }}
                                                />
                                            ) : column.field !== "editBtn" ? ( //수정버튼이 눌린 상태면 컬럼 필드 대신 텍스트 필드 보여줌
                                                rowIndex === row.index ? (
                                                    <TextField
                                                        value={
                                                            row[column.field]
                                                        }
                                                        onChange={(e) =>
                                                            contactChange(
                                                                row.index,
                                                                column.field,
                                                                e.target.value
                                                            )
                                                        }
                                                        style={{
                                                            width: "150px",
                                                        }}
                                                    />
                                                ) : (
                                                    row[column.field] // 컬럼 필드
                                                )
                                            ) : (
                                                <div>
                                                    {rowIndex === row.index ? ( // 수정 중일 때만 저장 버튼과 취소 버튼 렌더링
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
                    ) : (
                        <TableBody></TableBody>
                    )}
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
                                        onChange={handleChange}
                                        error={!!error}
                                        helperText={error}
                                        inputProps={{ inputMode: "numeric" }}
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
                                                {groupList.map(
                                                    (groupList, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={groupList}
                                                        >
                                                            {groupList}
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
