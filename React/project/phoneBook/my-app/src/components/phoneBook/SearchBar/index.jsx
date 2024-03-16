// 리액트
import React, { useEffect, useRef, useState } from "react";

// 임포트
import TextField        from "@mui/material/TextField";
import InputAdornment   from "@mui/material/InputAdornment";
import Button           from "@mui/material/Button";
import SearchIcon       from "@mui/icons-material/Search";
import RefreshIcon      from "@mui/icons-material/Refresh";

// CSS Style
import "./searchBar.css";

export default function SearchBar({ setPage, originRows, setRows }) {
    const [searchText, setSearchText] = useState(""); // 검색 텍스트

    // useRef 훅 사용하여 timeout 변수 생성
    // useState 사용시 useEffect의 디펜던시에 추가를 해야 해서 타임아웃이 변경될 때마다 무한루프에 빠짐
    const timeout = useRef(null);

    // 검색바 초기화 함수
    const resetList = () => {
        setSearchText("");
        setPage(0);
    };

    // searchText가 변경될 때마다 실행
    useEffect(() => {
        if (timeout != null) {
            clearTimeout(timeout.current);
        }
        const newTimeout = setTimeout(() => {
            // 타임 아웃을 이용해 연산 부하 줄임
            if (!searchText) {
                setRows(originRows);
            } else {
                const sText = new RegExp(searchText, "i"); // 대소문자 구분 x
                setRows(
                    originRows.filter(
                        // 검색 텍스트가 포함되는 데이터 가져오기
                        (row) =>
                            row.name.match(sText) ||
                            row.phoneNumber.match(sText) ||
                            row.group.match(sText)
                    )
                );
                setPage(0);
            }
        }, 500);
        timeout.current = newTimeout;
    }, [searchText, originRows, setRows, setPage]);

    return (
        <>
            {/* 연락처 총 개수 */}
            <div id="searchBarWrap">
                <div id="contactsCount">연락처 {originRows.length}개</div>

                <div id="searchInput">
                    {/* 검색 텍스트 필드 */}
                    <TextField
                        id="input-with-icon-textfield"
                        label="TextField"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#34DCA1" }} />
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                    />
                    {/* 초기화 버튼 */}
                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={resetList}
                        disableElevation
                    >
                        초기화
                    </Button>
                </div>
            </div>
        </>
    );
}
