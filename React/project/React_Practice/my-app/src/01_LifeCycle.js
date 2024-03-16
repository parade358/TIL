/*
    현재 만든 모듈을 받아주는 모듈에서 사용하려면
    현재 클래스를 Component로 사용하기 위한 구문(임포트문) 추가하기
*/

import { Component } from "react";
 
/*
    Component의 생명주기 (생성, 변경, 소멸)와 관련된 함수중 '생성' 과정과 연관된 함수
    
    1. render() : return되는 html 형식의 코드를 화면에 그려주는(랜더링) 함수
                  화면에 내용이 변경되어야 할 시점에 자동으로 호출된다.

    2. constructor(props) : 생성자 함수로 생명주기 함수들 중 가장 먼저 실행되며 처음 한번만 실행되는 함수
                            component내부에서 사용되는 변수(state)를 선언하고 부모객체에서 전달받은 변수(props)를
                            초기화 할때 사용한다. super()함수는 생성자 함수 가장 위에 호출한다 (자바와 같음)

    3. gerDerivedStateFromProps(props,state) : constructor 함수 호출과 render 함수 호출 사이에 실행된다.
                                               컴포넌트가 새로운 props를 받게 됐을 때 state 값을 변경해준다.
                                               app.js에서 전달한 값이 있다면 해당 변수로 접근하여 값을 추출할수있다.
    4. componentDidMount() : 생성과 관련된 함수들 중 가장 마지막에 실행되ㅏ는 함수
                             화면이 만들어지고 나서 할당할 수 있는 이벤트부여나 초기화 작업시 활용되는 함수.
                             ex) 비동기처리가 필요할때 (외부 API등을 연동하여 값을 가져오는 작업)
                             초기화시에는 setState() 함수를 사용한다.
                             -setState() 현재 컴포넌트의 state 값을 변경해준다.
                             *** state에 대입연산자를 사용하여 값을 넣는것과 setState의 차이 ***
                             setState()는 state값을 변경하면 자동으로 render() 함수가 호출된다.
                             대입연산자로 값을 변경하면 재랜더링되지 않음.
    ----------------------------------------------------------------------------------------------------------------------------
    Component의 생명주기중에서 변경과 관련된 함수

    5.  shouldComponentUpdate   :   컴포넌트를 수정해야하는지를 설정하는함수
                                    props,state가 새로운 값으로 갱신되어 render()함수가 호출되는 시점에 컴포넌트를
                                    업데이트할지에 대한 여부를 결정한다.
                                    반환값은 true/false로 설정하며 true값을 반환할땐 render함수를 호출하여 컴포넌트를 수정한다.
                                    * 초기랜더링 또는 forceUpdate() 두가지 상황에선 호출되지 않음
                                    -forceUpadate() : 강제 랜더링

    6. componentDidUpdate()     :   컴포넌트가 실제 화면에 출력된 이후에 실행된다. (재랜더링 됐을때 - ex) setState, forceUpdate
                                    이 함수는 부모 컴포넌트로부터 전달된 이전 props와 이전 state를 인자로 받는다.
*/


class LifecycleUpdate extends Component{


    // static getDerivedStateFromProps(props,state){
    //     console.log("gerDerivedStateFromProps 함수 호출");
    //     state = {test: "변경됨"};
    //     console.log(state);
    //     console.log(props);
    //     return state; //return구문에 작성된 값이 최종적으로 state에 담기게 된다.
    // }

    componentDidMount(){
        console.log("componentDidMount 함수 호출");
        console.log(this.state);
        this.setState({test:"안녕하세요"}); //setState함수가 호출되면 state가 변경된 후 재랜더링된다(render함수 호출)
    }

    // shouldComponentUpdate(props, state){
    //     console.log('shouldComponentUpdate 함수 호출');
    //     console.log(props);
    //     console.log(state);
    //     //props 또는 state의 값에 따라서 재 렌더링을 할지 여부를 선택할 수 있다.
    //     if(state.tmp_state){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }

    // componentDidUpdate(preProp,preState){
    //     console.log('componentDidUpdate 함수 호출');
    //     console.log(preProp);
    //     console.log(preState);
    // }

    // 생성자 함수
    constructor(props){ // props : 부모요소로부터 넘겨받은 데이터
        console.log("생성자 함수 실행");
        super(props); // super : 부모요소 생성자
        console.log(props);
        this.state = {test:"확인"}; // state : 상태를 저장할 수 있는 변수
        console.log(this.state);
    }

    //랜더 함수
    render(){
        console.log("랜더 함수 실행");
        console.log(this.state);
        return (
        <>
            {/* <h2>render 함수 호출</h2> */}
            <h2>{this.state.test}</h2>
        </>
        )

    }


}

/*
    작성한 컴포넌트를 내보내는 방법

        1. export default 개체명; // default : 현재 모듈안에 단 하나의 개체만 있을때 사용
        2. export {클래스(함수) or 상수 or  배열 or 함수1, ... };
*/

export default LifecycleUpdate;
//export {LifecycleUpdate};