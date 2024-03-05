/*******************************************************************************************
■ 페이지명	: index.jsx
■ 작성목적	: 검색바 컴포넌트
■ 기타참고	: X

■ 주요변경내역    
VER			DATE		AUTHOR			DESCRIPTION
----------  ----------	---------------	------------------------------- 
0.01		2024-03-04	ys_choi		    1.신규생성.
*******************************************************************************************/

// 리액트
import React, { useState } from "react";

// 임포트
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

// CSS Style
import './searchBar.css';

export default function SearchBar({onPageChange}){

    const [searchText, setSearchText] = useState('');

    const resetList = () => {
        console.log('리셋버튼 클릭');
        setSearchText('');
        onPageChange(0);

    };

    return(
    <>
        <div id="searchBarWrap">
            <div>
                연락처 00개
            </div>

            <div id="searchInput">
            <TextField
                id="input-with-icon-textfield"
                label="TextField"
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#34DCA1' }} />
                    </InputAdornment>
                ),
                }}
                variant="outlined"
            />
                <Button variant="contained" startIcon={<RefreshIcon />} onClick={resetList} disableElevation>
                    초기화
                </Button>
            </div>
        </div>
    </>
    );
};