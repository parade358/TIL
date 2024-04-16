/*eslint-disable*/

import './App.css';
import { useState } from 'react';

function App() {

  const post = '신월 짬뽕 맛집';
  // document.querySelector('h4').innerHTML = post

  const [title1,setTitle1] = useState('남자 코트 추천');
  const [title2,setTitle2] = useState('신월 짬뽕 맛집');
  const [title3,setTitle3] = useState('리액트 독학');
  const [title, setTitle] = useState(['여자코트추천', '강남우동맛집', '파이썬독학']);
  const [like, setLike] = useState([0,0,0]);
  const [modal, setModal] = useState(false);

  function plusLike (i){
    setLike(like[i] + 1);
  };

  function changeTitle(){
    let copy = [...title]
    copy[0] = '남자코트추천'
    setTitle(copy)
  };

  function indexTitle(){
    let copy = [...title];
    copy.sort();
    setTitle(copy);
  }

  // [1,2,3].map(function(a){
  //   return '1233211'
  // })

  return (
    <div className="App">

      <div className="black-nav">
        <h4>ReactBlog</h4>
      </div>

      <Banner/>
      {/* <button onClick={ indexTitle }>가나다순정렬</button> */}

      {/* <button onClick={()=>{
        let copy = title;
        copy[0] = '토트넘';
        setTitle(copy);
      } }>글수정</button> */}

      {/* <button onClick={ changeTitle }>글수정</button> */}

      {/* <div className='list'>
        <h4 onClick={()=> {if(modal == true){setModal(false);} else{setModal(true);}}}>
          { title[0] } <span onClick={ plusLike }>👍</span>{like} 
        </h4> 
        <p>4월 12일 발행</p>
      </div>
      <div className='list'>
        <h4>{ title[1] } <span onClick={ plusLike }>👍</span>{like} </h4> 
        <p>4월 13일 발행</p>
      </div>
      <div className='list'>
        <h4>{ title[2] } <span onClick={ plusLike }>👍</span>{like} </h4> 
        <p>4월 14일 발행</p>
      </div> */}

      {
        title.map(function(a, i){
          return (
            <div className='list' key={i}>
              <h4>
                { title[i] } <span onClick={ plusLike(i) }>👍</span>{like[i]} 
              </h4>
              <p>4월 12일 발행</p>
            </div>
          )
        })
      }

      {/* {
        조건식 ? 참일때 실행할 코드 : 거짓일 때 실행할 코드
      } */}

      {
        modal == true ? <Modal/> : null
      }

    </div>
  );
}

function Modal(){
  return(
    <div className='modal'>
        <h4>제목</h4>
        <p>날짜</p>
        <p>상세내용</p>
      </div>
  );
}

function Banner() {
  return (
    <div className='banner'>
      <h2>광고문의 : 010-7146-6529</h2>
    </div>
  );
}

// const Modal2 = () => {
//   return(
//     <div></div>
//   );
// }

export default App;