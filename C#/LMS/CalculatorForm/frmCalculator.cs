using System;
using System.Windows.Forms;

namespace CalculatorForm
{
    public partial class frmCalculator : Form
    {
        String leftOperand = "";
        String rightOperand = "";
        String operationSymbol = "";
        String result = "";

        public frmCalculator()
        {
            InitializeComponent();
        }

        // 숫자 버튼 클릭
        private void NumberBtnClick(object sender, EventArgs e)
        {
            Button clickNumber = (Button)sender;
            SaveOperand(clickNumber.Text);
            InsertExpressionBox();
        }

        // 연산자 버튼 클릭
        private void OperatorBtnClick(object sender, EventArgs e)
        {
            Button clickOperator = (Button)sender;

            if (rightOperand != "" && leftOperand != "")
            {
                Console.WriteLine("1");
                Operation(leftOperand, rightOperand, operationSymbol);
                InsertResultAndReset();
                operationSymbol = clickOperator.Text;
                InsertExpressionBox();
            }
            else if (rightOperand == "" && leftOperand == "")
            {
                Console.WriteLine("2");
                if (clickOperator.Text == "-")
                {
                    leftOperand = clickOperator.Text;
                    InsertExpressionBox();
                }
            }
            else
            {
                Console.WriteLine("3");
                operationSymbol = clickOperator.Text;
                InsertExpressionBox();
            }
        }

        // 계산식 표현
        private void InsertExpressionBox()
        {
            string leftOperandWithCommas = MakeCommas(leftOperand);
            string rightOperandWithCommas = MakeCommas(rightOperand);
            expressionBox.Text = leftOperandWithCommas + operationSymbol + rightOperandWithCommas;
        }

        // 계산할 숫자 저장
        private void SaveOperand(String operand)
        {
            if (operationSymbol == "")
            {
                leftOperand += operand;
            }
            else
            {
                rightOperand += operand;
            }
        }

        // '=' 버튼 클릭
        private void EqualsBtnClick(object sender, EventArgs e)
        {
            if (leftOperand != "" && rightOperand != "" && operationSymbol != "")
            {
                Operation(leftOperand, rightOperand, operationSymbol);
                InsertResultAndReset();
            }
            else if (leftOperand.Contains("-"))
            {
                resultBox.Text = MakeCommas(expressionBox.Text);
            }
        }

        // 계산
        private void Operation(string left, string right, string operation)
        {
            switch (operation)
            {
                case "+":
                    result = (Math.Round((double.Parse(left) + double.Parse(right)), 5)).ToString();
                    break;
                case "-":
                    result = (Math.Round((double.Parse(left) - double.Parse(right)), 5)).ToString();
                    break;
                case "*":
                    result = (Math.Round((double.Parse(left) * double.Parse(right)), 5)).ToString();
                    break;
                case "/":
                    if (right == "0")
                    {
                        result = "null";
                    }
                    else
                    {
                        result = (Math.Round((double.Parse(left) / double.Parse(right)), 5)).ToString();
                    }
                    break;
                default:
                    throw new ArgumentException("Invalid operation symbol");
            }
        }

        // 결과박스 인서트 & 값 초기화
        private void InsertResultAndReset()
        {
            resultBox.Text = MakeCommas(result);
            leftOperand = result;
            rightOperand = "";
            operationSymbol = "";
        }

        // ClearBtn 클릭
        private void ClearBtnClick(object sender, EventArgs e)
        {
            resultBox.Text = "0";
            expressionBox.Text = "0";
            leftOperand = "";
            rightOperand = "";
            operationSymbol = "";
            result = "";
        }

        // 천 단위마다 쉼표만들기 & 소수점 밑 다섯자리 처리
        private string MakeCommas(string numberString)
        {
            if (double.TryParse(numberString, out double number))
            {
                return string.Format("{0:#,0.#####}", number);
            }
            else
            {
                return numberString;
            }
        }
    }
}
