import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // 임포트 문으로 App 추가
import reportWebVitals from './reportWebVitals';


//루트 노드
//React로 구현한 애플리케이션은 기본적을 하나의 루트 DOM 노드가 존재하며
//기존앱에 React를 추가한 형태라면 원하는 만큼의 루트 DOM 노드를 추가해줄 수 있다.
const root = ReactDOM.createRoot(document.getElementById('root'));

//리액트를 구동하기 위해서는 DOM 요소를 ReactDOM.createRoot(요소)안에 넣어두고 react요소를
//root.render() 로 랜더링 해야한다.

root.render(
/*
  페이지 로딩 후 root.render()함수 내부에 호출하고자 하는 리액트 컴포넌트를 추가하면 해당 컴포넌트가 호출된다.
  <App> 컴포넌트를 사용하기 위해서는 상단에 import문으로 App이 추가되어야한다.

  리액트에서 컴포넌트가 대문자로 시작하는 이유는, 리액트에서 소문자는 html Dom 요소로 읽히고
  대문자로 시작하면 컴포넌트 요소로 해석된다.
*/


    <App /> //jsx 구문

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
