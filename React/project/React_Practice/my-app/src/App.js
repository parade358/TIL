import './App.css';
import LifecycleUpdate from './01_LifeCycle';

/*
  리액트란 ?
  UI를 구축하는 JS "라이브러리"겸 프레임워크
  동적으로 사용자가 보게될 화면을 구성할 수 있다.

  컴포넌트란?
  UI구성을 확장성 있고, 유연하게 만들어주기 위해 만들어진 개념
  화면을 이루는 구성요소 하나하나를 "컴포넌트(Companent)"로 만들어 재사용성을 늘린다.
  리액트에서는 버튼, 폼, 화면 등등 모든것을 컴포넌트로 표현한다.

  JSX(JavaScriptXml문법) : javascript 문법 안에서 HTML요소가 함께 들어있는 형태의 문법
  리액트에서 UI를 구성하기 위해 보편적으로 사용되는 문법이다.
*/


function App() {
  return (
  //리턴값은 한개만 가질 수 있다.
  <>
    {/* jsx 문법 안에서 주석처리하는 방법 */}
    <h1>Hello React</h1>
    <LifecycleUpdate value='테스트'></LifecycleUpdate>
  </>
  );
}

export default App; //다른 위치에서 해당 컴포넌트를 임포트 할수있는 이유