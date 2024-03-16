//리액트
import React from "react";

// MUI
import {
    Button,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
} from "@mui/material";
import KeyboardDoubleArrowLeftIcon  from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowLeftIcon        from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardArrowRightIcon       from "@mui/icons-material/KeyboardArrowRight";

// CSS Style
import "./pagingBar.css";

export default function PagingBar({
    page,
    totalLength,
    rowsPerPage,
    setRowsPerPage,
    setPage,
    originRows,
}) {
    // 총 페이지 개수 계산 함수
    const totalPages = Math.ceil(totalLength / rowsPerPage);

    // 셀렉트로 페이지 이동 함수
    const selectedPageChange = (event) => {
        const selectedPage = parseInt(event.target.value);
        setPage(selectedPage);
    };

    // 이전 페이지 이동 함수
    const goToPreviousPage = () => {
        if (page > 0) {
            const selectedPage = page - 1;
            setPage(selectedPage);
        }
    };

    // 다음 페이지 이동 함수
    const goToNextPage = () => {
        if (page < totalPages - 1) {
            const selectedPage = page + 1;
            setPage(selectedPage);
        }
    };

    // 첫 페이지로 이동하는 함수
    const goToFirstPage = () => {
        const selectedPage = 0;
        setPage(selectedPage);
    };

    // 마지막 페이지로 이동하는 함수
    const goToLastPage = () => {
        const selectedPage = totalPages - 1;
        setPage(selectedPage);
    };

    return (
        <>
            <div id="pagingBarWrap">
                {/* 페이징바 버튼 */}
                <Button variant="text" onClick={goToFirstPage}>
                    <KeyboardDoubleArrowLeftIcon />
                </Button>
                <Button variant="text" onClick={goToPreviousPage}>
                    <KeyboardArrowLeftIcon />
                </Button>
                {/* 페이지 이동 셀렉트 */}
                <select value={page} onChange={selectedPageChange}>
                    {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index;
                        return (
                            <option key={pageNumber} value={pageNumber}>
                                {pageNumber + 1}
                            </option>
                        );
                    })}
                </select>
                {/* 총 페이지 */}
                <p>out of {totalPages} </p>
                {/* 페이징바 버튼 */}
                <Button variant="text" onClick={goToNextPage}>
                    <KeyboardArrowRightIcon />
                </Button>
                <Button variant="text" onClick={goToLastPage}>
                    <KeyboardDoubleArrowRightIcon />
                </Button>
            </div>
            <div>
                {/* 한 페이지에서 보여질 행의 개수 */}
                <FormControl id="rowsPerPage">
                    <InputLabel>Rows Per Page</InputLabel>
                    <Select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(e.target.value)}
                    >
                        {[...Array(originRows.length).keys()].map((num) => (
                            <MenuItem key={num + 1} value={num + 1}>
                                {num + 1} 개
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </>
    );
}
