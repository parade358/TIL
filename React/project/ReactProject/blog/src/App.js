/*eslint-disable*/

import './App.css';
import { useState } from 'react';

export default function App() {

  const [title, setTitle] = useState(['다', '가', '나']);
  const [like,  setLike]  = useState([0, 0, 0]);
  const [modal, setModal] = useState(false);
  const [titleNum, setTitleNum] = useState(0);
  const [input, setInput] = useState('');

  const clickAddBtn = () => {
    if(input !== '')
    {
      setTitle([...title, input]);
      setLike([...like, 0]);
      console.log(like);
      console.log(title);
    } 
    else
    {
      console.log('제목을 입력해 주세요.')
    }
  };

  const clickDeleteBtn = (index) => {
    setTitle(title.filter((_, i) => i !== index));
    setLike(like.filter((_, i) => i !== index));
  };

  function clickBtn() {
    let copy = [...title]
    copy[0] = 'test'; 
    console.log(copy[0]);
    setTitle(copy);
  };


  function clickTitle(i) {
    if(modal === false)
    {
      setModal(true);
      setTitleNum(i);
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
        title.map(function(a, i){
          return (
            <div className='list' key={i}>
              <h4 onClick={() => clickTitle(i)}>{title[i]}  <span onClick={(e) => { 
                                                      e.stopPropagation(); // 이벤트 버블링 막아줌
                                                      let copy = [...like];
                                                      copy[i] = copy[i] + 1;
                                                      setLike(copy);
                                                    }}> Like {like[i]}</span> </h4>
              <p>2월 17일 발행</p>
              <button onClick={() => clickDeleteBtn(i)}>글 삭제</button>
            </div>
          )
        })
      }

      <input onChange={(e)=>{ setInput(e.target.value) }} type='text'/><button onClick={clickAddBtn}>글 작성</button>

      {
        //html 작성하는곳이라 if문 불가능, 삼항연산자 활용
        modal == true ? <Modal title={title} color='yellow' clickBtn = {clickBtn} titleNum = {titleNum}/> : null
      }
    </div>
  );
};

// 컴포넌트 *반복적인 html 축약할때, 큰 페이지들, 자주변경되는것들
function Modal(props){

  return(
    <>
    <div className="modal" style={{background : props.color}}>
        <h4>{props.title[props.titleNum]}</h4>
        <p>날짜</p>
        <p>상세내용</p>
        <button onClick={ props.clickBtn }>글수정</button>
    </div>
    </>
  );
};