import logo from './logo.svg';
import './App.css';

function App() {

  const post = '신월 짬뽕 맛집';
  // document.querySelector('h4').innerHTML = post
  
  return (
    <div className="App">
      <div className="black-nav">
        <h4 style= {{color : 'red'}} id={post}>블로그</h4>
      </div>
      <div className='list'>
        <h4>글제목</h4>
        <p>4월 12일 발행</p>
      </div>
      <h4>{ post }</h4>
    </div>
  );
}

export default App;