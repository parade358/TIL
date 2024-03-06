/*******************************************************************************************	
■ 페이지명	: index.jsx
■ 작성목적	: 페이징바 처리 컴포넌트
■ 기타참고	: X

■ 주요변경내역    
VER			DATE		AUTHOR			DESCRIPTION
----------  ----------	---------------	------------------------------- 
0.01		2024-03-04	ys_choi		    1.신규생성.
*******************************************************************************************/

//리액트
import React, { useState, useEffect } from "react";

// MUI
import { Button } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// CSS Style
import "./pagingBar.css";

export default function PagingBar({ page, totalLength, rowsPerPage, setPage }) {
    const totalPages = Math.ceil(totalLength / rowsPerPage);

    const selectedPageChange = (event) => {
        const selectedPage = parseInt(event.target.value);
        setPage(selectedPage);
    };

    const goToPreviousPage = () => {
        if (page > 0) {
            const selectedPage = page - 1;
            setPage(selectedPage);
        }
    };

    const goToNextPage = () => {
        if (page < totalPages - 1) {
            const selectedPage = page + 1;
            setPage(selectedPage);
        }
    };

    const goToFirstPage = () => {
        const selectedPage = 0;
        setPage(selectedPage);
    };

    const goToLastPage = () => {
        const selectedPage = totalPages - 1;
        setPage(selectedPage);
    };

    return (
        <>
            <div id="pagingBarWrap">
                <Button variant="text" onClick={goToFirstPage}>
                    <KeyboardDoubleArrowLeftIcon />
                </Button>
                <Button variant="text" onClick={goToPreviousPage}>
                    <KeyboardArrowLeftIcon />
                </Button>

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
                <p>out of {totalPages} </p>

                <Button variant="text" onClick={goToNextPage}>
                    <KeyboardArrowRightIcon />
                </Button>
                <Button variant="text" onClick={goToLastPage}>
                    <KeyboardDoubleArrowRightIcon />
                </Button>
            </div>
        </>
    );
}
