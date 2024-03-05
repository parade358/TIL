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
import React, { useState, useEffect  } from "react";

// MUI
import { Button }                   from "@mui/material";
import KeyboardDoubleArrowLeftIcon  from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowLeftIcon        from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardArrowRightIcon       from '@mui/icons-material/KeyboardArrowRight';

// CSS Style
import './pagingBar.css'

export default function PagingBar({ totalItems, itemsPerPage, onPageChange }){

    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    useEffect(() => {
        setCurrentPage(0); // 컴포넌트가 처음 마운트될 때 currentPage 상태를 초기화
    }, [totalItems, itemsPerPage]);


    const selectedPageChange = (event) => {
        const selectedPage = parseInt(event.target.value);
        setCurrentPage(selectedPage);
        onPageChange(selectedPage);
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            const selectedPage = currentPage - 1;
            setCurrentPage(selectedPage);
            onPageChange(selectedPage);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            const selectedPage = currentPage + 1;
            setCurrentPage(selectedPage);
            onPageChange(selectedPage);
        }
    };

    const goToFirstPage = () => {
        const selectedPage = 0;
        setCurrentPage(selectedPage);
        onPageChange(selectedPage);
    };

    const goToLastPage = () => {
        const selectedPage = totalPages - 1;
        setCurrentPage(selectedPage);
        onPageChange(selectedPage);
    };

    return(
    <>
        <div id="pagingBarWrap">
            
            <Button variant="text" onClick={goToFirstPage}><KeyboardDoubleArrowLeftIcon /></Button>
            <Button variant="text" onClick={goToPreviousPage}><KeyboardArrowLeftIcon /></Button>
            
            <select value={currentPage} onChange={selectedPageChange}>
                {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index;
                    return <option key={pageNumber} value={pageNumber}>{pageNumber + 1}</option>;
                })}
            </select> 
            <p>out of {totalPages} </p>

            <Button variant="text" onClick={goToNextPage}><KeyboardArrowRightIcon /></Button>
            <Button variant="text" onClick={goToLastPage}><KeyboardDoubleArrowRightIcon /></Button>

        </div>
    </>
    );
};