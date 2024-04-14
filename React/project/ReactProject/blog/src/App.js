import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

  const post = '신월 짬뽕 맛집';
  // document.querySelector('h4').innerHTML = post

  const [a,b] = useState('남자 코트 추천');
  
  return (
    <div className="App">
      <div className="black-nav">
        <h4>블로그</h4>
      </div>
      <div className='list'>
        <h4>글제목</h4>
        <p>4월 12일 발행</p>
      </div>
    </div>
  );
}

export default App;