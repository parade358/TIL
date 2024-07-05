/*eslint-disable*/

import './App.css';
import { useState } from 'react';

export default function App() {

  const [title, setTitle] = useState(['다', '가', '나']);
  const [like,  setLike]  = useState(0);
  const [modal, setModal] = useState(false);

  function clickLike() {
    setLike(like + 1);
  };

  function clickBtn() {
    let copy = [...title]
    copy[0] = 'test';
    console.log(copy[0]);
    setTitle(copy);
  };

  function sortArray() {
    let copy = [...title];
    copy.sort();
    setTitle(copy);
  };

  function clickTitle() {
    if(modal === false)
    {
      setModal(true);
    } 
    else
    {
      setModal(false);
    }
  };

  return (
    <div className="App">
      <div className="black-nav">
        <h4>React</h4>
      </div>
      
      {
        [1,2,3].map(function(){
          return (
            <div className='list'>
              <h4 onClick={ clickTitle }>{title[0]} <span onClick={ clickLike }>Like</span> {like} </h4>
              <p>2월 17일 발행</p>
            </div>
          )
        })
      }


      <button onClick={ clickBtn }>Button1</button>
      <button onClick={ sortArray }>Button2</button>

      {
        //html 작성하는곳이라 if문 불가능, 삼항연산자 활용
        modal == true ? <Modal/> : null
      }
    </div>
  );
};

// 컴포넌트 *반복적인 html 축약할때, 큰 페이지들, 자주변경되는것들
function Modal(){
  return(
    <>
    <div className="modal">
        <h4>제목</h4>
        <p>날짜</p>
        <p>상세내용</p>
    </div>
    </>
  );
};