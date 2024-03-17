# React Hook



## 1. 개요

함수형 컴포넌트에서 상태(state)나 생명주기 메서드를 사용하기 위해서는 클래스 컴포넌트를 작성해야 한다. 하지만 훅을 사용하면 함수형 컴포넌트에서도 상태와 다양한 React 기능을 사용할 수 있다.



## 2. React Hook 종류와 활용



1. **useState** : 함수형 컴포넌트 내에서 상태를 관리할 수 있게 해준다.

   ```react
   import React, { useState } from 'react';
   
   function Counter() {
     // count 상태와 그 상태를 변경하는 함수 setCount를 useState 훅을 사용하여 정의
     const [count, setCount] = useState(0);
   
     return (
       <div>
         {/* 현재 클릭된 횟수 */}
         <p>You clicked {count} times</p>
         {/* 버튼을 클릭할 때마다 count를 1씩 증가 */}
         <button onClick={() => setCount(count + 1)}>Click me</button>
       </div>
     );
   }
   ```

   

2. **useEffect** : 부수 효과(side effects)를 수행할 수 있다. 주로 데이터 가져오기, 구독 설정, 수동으로 리소스 해제 등에 사용된다.

   ```react
   import React, { useState, useEffect } from 'react';
   
   function Timer() {
     // seconds 상태와 그 상태를 변경하는 함수 setSeconds를 useState 훅을 사용하여 정의
     const [seconds, setSeconds] = useState(0);
   
     useEffect(() => {
       // 1초마다 seconds를 1씩 증가시키는 타이머를 설정
       const intervalId = setInterval(() => {
         setSeconds(seconds + 1);
       }, 1000);
   
       // 컴포넌트가 언마운트되거나 seconds가 변경될 때마다 타이머를 정리
       return () => clearInterval(intervalId);
     }, [seconds]);
   
     return (
       <div>
         {/* 경과된 시간을 보여줌 */}
         <p>Seconds elapsed: {seconds}</p>
       </div>
     );
   }
   
   ```

   

3. **useContext** : React 컨텍스트(Context)를 사용할 수 있게 해준다. 이를 통해 컴포넌트 간에 전역 데이터를 공유할 수 있다.

   ```react
   import React, { useContext } from 'react';
   
   // 테마를 관리하는 컨텍스트를 생성
   const ThemeContext = React.createContext('light');
   
   function ThemedButton() {
     // 현재 테마 값을 가져옴
     const theme = useContext(ThemeContext);
   
     return <button style={{ background: theme }}>Themed Button</button>;
   }
   
   ```

   

4. **useReducer** : 복잡한 상태 논리를 분리하고 더 효율적으로 관리할 수 있게 해준다.

   ```react
   import React, { useReducer } from 'react';
   
   // 초기 상태를 정의합니다.
   const initialState = { count: 0 };
   
   // 상태를 변경하는 로직을 포함한 리듀서 함수를 정의합니다.
   function reducer(state, action) {
     switch (action.type) {
       case 'increment':
         return { count: state.count + 1 };
       case 'decrement':
         return { count: state.count - 1 };
       default:
         throw new Error();
     }
   }
   
   function Counter() {
     // 상태와 상태를 변경하는 함수를 useReducer 훅을 사용하여 정의합니다.
     const [state, dispatch] = useReducer(reducer, initialState);
   
     return (
       <div>
         {/* 현재 카운트 값을 보여줍니다. */}
         Count: {state.count}
         {/* 각각의 버튼을 클릭할 때마다 해당 액션을 디스패치하여 상태를 변경합니다. */}
         <button onClick={() => dispatch({ type: 'increment' })}>+</button>
         <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
       </div>
     );
   }
   
   ```

   

5. **useCallback** : 콜백 함수를 메모이제이션하여 성능을 최적화할 수 있다.

   ```react
   import React, { useState, useCallback } from 'react';
   
   function MyComponent() {
     // count 상태와 그 상태를 변경하는 함수 setCount를 useState 훅을 사용하여 정의
     const [count, setCount] = useState(0);
   
     // increment 함수를 메모이제이션하여 성능을 최적화
     const increment = useCallback(() => {
       setCount(count + 1);
     }, [count]);
   
     return (
       <div>
         {/* 현재 카운트 값을 보여준다 */}
         <p>Count: {count}</p>
         {/* 버튼을 클릭할 때마다 increment 함수를 호출 */}
         <button onClick={increment}>Increment</button>
       </div>
     );
   }
   
   ```

   

6. **useMemo** : 메모이제이션된 값을 반환하여 성능을 최적화할 수 있다.

   ```react
   import React, { useState, useMemo } from 'react';
   
   function ExpensiveCalculation({ num }) {
     // num이 변경될 때마다 결과를 다시 계산
     const result = useMemo(() => {
       return num * 2;
     }, [num]);
   
     return <p>Result of expensive calculation: {result}</p>;
   }
   
   ```

   

7. **useRef** : DOM 요소에 직접적으로 접근할 수 있게 해준다. 또한, 값이 바뀌어도 컴포넌트가 리렌더링되지 않도록 하는 데에도 사용될 수 있다.

   ```react
   import React, { useRef } from 'react';
   
   function TextInputWithFocusButton() {
     // input 요소에 대한 참조를 생성
     const inputRef = useRef(null);
   
     // 버튼을 클릭하면 input 요소에 포커스를 설정
     const handleClick = () => {
       inputRef.current.focus();
     };
   
     return (
       <div>
         {/* input 요소에 대한 참조를 설정 */}
         <input ref={inputRef} type="text" />
         {/* 버튼을 클릭하면 input 요소에 포커스를 설정 */}
         <button onClick={handleClick}>Focus the input</button>
       </div>
     );
   }
   
   ```

   

## 3. 마무리

위와 같이 각각의 훅은 간단한 함수형 컴포넌트 내에서 사용된다. 각각의 훅은 특정한 기능을 담당하며, 함수형 컴포넌트 내에서 상태 관리, 부수 효과 처리, 성능 최적화 등을 할 수 있도록 도와주므로 이러한 장점들을 활용하여 프로젝트를 만들어보자.