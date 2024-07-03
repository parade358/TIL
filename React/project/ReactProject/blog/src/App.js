/*eslint-disable*/

import './App.css';
import { useState } from 'react';

function App() {

  const [title, setTitle] = useState(['1', '2', '3'])
  const [like, setLike] = useState(0);

  function clickLike(){
    setLike(like + 1);
  }

  function clickBtn(){
    let copy = [...title]
    console.log(copy)
    copy[0] = 'test';
    console.log(copy[0]);
    setTitle(copy);
  }

  return (
    <div className="App">
      <div className="black-nav">
        <h4>React</h4>
      </div>
      <div className='list'>
        <h4>{title[0]} <span onClick={ clickLike }>Like</span> {like} </h4>
        <p>2월 17일 발행</p>
      </div>
      <div className='list'>
        <h4>{title[1]} <span onClick={ clickLike }>Like</span> {like} </h4>
        <p>2월 17일 발행</p>
      </div>
      <div className='list'>
        <h4>{title[2]} <span onClick={ clickLike }>Like</span> {like} </h4>
        <p>2월 17일 발행</p>
      </div>

      <button onClick={ clickBtn }>Button</button>
    </div>
  );
  
} 
export default App;