using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CalculatorForm
{
    public class Calculator
    {
        private double _result;

        public Calculator(double initialValue)
        {
            _result = initialValue;
        }

        public void Input(double value)
        {
            // 입력된 값을 결과에 추가
            _result += value;
        }

        public void Operater(CalOperator oper)
        {
            // 연산 수행
            switch (oper)
            {
                case CalOperator.Add:
                    // 더하기 연산 수행
                    // 현재 결과값에 현재 입력값을 더함
                    _result += _cuInput;
                    break;
                case CalOperator.Sub:
                    // 빼기 연산 수행
                    // 현재 결과값에서 현재 입력값을 뺌
                    _result -= _cuInput;
                    break;
                case CalOperator.Multiple:
                    // 곱하기 연산 수행
                    // 현재 결과값에 현재 입력값을 곱함
                    _result *= _cuInput;
                    break;
                case CalOperator.Divide:
                    // 나누기 연산 수행
                    // 현재 결과값을 현재 입력값으로 나눔
                    // 나누는 값이 0이면 에러 처리
                    if (_cuInput == 0)
                    {
                        throw new DivideByZeroException("Cannot divide by zero");
                    }
                    _result /= _cuInput;
                    break;
                default:
                    throw new ArgumentException("Invalid operator");
            }
        }

        public double Result => _result;

        // 입력된 값
        private double _cuInput;
        public double CuInput
        {
            get { return _cuInput; }
            set { _cuInput = value; }
        }
    }

    public enum CalOperator { Add, Sub, Multiple, Divide }
}
