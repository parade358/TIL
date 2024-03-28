using System;

namespace UnitTest
{
    internal class Program
    {
        static void Main(string[] args)
        {
            더하기_결과4();
        }

        private static void 더하기_결과4() // 더하기_결과4 메서드 정의
        {
            var pred = 4d;
            var calcul = new Calculator(0);
            calcul.Input(2);
            calcul.Operater(Calculator.CalOperator.Add);
            calcul.Input(2);
            Console.WriteLine(Assert.IsTrue(calcul.Result, pred));
        }

        public class Assert
        {
            public static bool IsTrue(int i, int j)
            {
                return i == j;
            }
        }

        public class Calculator
        {
            public enum CalOperator { Add, Sub, Multiple, Divide }
            private double _stock; // 계산 전체 결과값
            private double _cuInput; // 현재의 계산 대기 값

            public Calculator(int i) => _cuInput = i;

            public void Input(int i)
            {
                _cuInput = (double)i;
            }

            public void Operater(CalOperator oper)
            {
                switch (oper)
                {
                    case CalOperator.Add:
                        _stock += _cuInput;
                        break;
                    case CalOperator.Sub:
                        _stock -= _cuInput;
                        break;
                    case CalOperator.Multiple:
                        _stock *= _cuInput;
                        break;
                    case CalOperator.Divide:
                        if (_cuInput == 0)
                        {
                            throw new DivideByZeroException("Cannot divide by zero");
                        }
                        _stock /= _cuInput;
                        break;
                    default:
                        throw new ArgumentException("Invalid operator");
                }
            }
        }
    }
}
