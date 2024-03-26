using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
            
            if(rightOperand != "")
            {
                Operation(leftOperand, rightOperand, operationSymbol);
                InsertResultAndReset();
                operationSymbol = clickOperator.Text;
                InsertExpressionBox();
            }
            else
            {
                operationSymbol = clickOperator.Text;
                InsertExpressionBox();
            }
        }

        // 계산식 표현
        private void InsertExpressionBox()
        {
            expressionBox.Text = leftOperand + operationSymbol + rightOperand;
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
            if(leftOperand != "" && rightOperand != "" && operationSymbol != "")
            {
                Operation(leftOperand, rightOperand, operationSymbol);
                InsertResultAndReset();
            }
        }

        //계산
        private void Operation(string left, string right, string operation)
        {
            switch (operation)
            {
                case "+":
                    result = (int.Parse(left) + int.Parse(right)).ToString();
                    break;
                case "-":
                    result = (int.Parse(left) - int.Parse(right)).ToString();
                    break;
                case "*":
                    result = (int.Parse(left) * int.Parse(right)).ToString();
                    break;
                case "/":
                    if (right == "0")
                    {
                        result = "null";
                    }
                    else
                    {
                        result = (int.Parse(left) / int.Parse(right)).ToString();
                    }
                    break;
                default:
                    throw new ArgumentException("Invalid operation symbol");
            }
        }

        //결과박스 인서트 & 값 초기화
        private void InsertResultAndReset()
        {
            resultBox.Text = result;
            leftOperand = result;
            rightOperand = "";
            operationSymbol = "";
        }

        // cleaBtn 클릭
        private void ClearBtnClick(object sender, EventArgs e)
        {
            resultBox.Text = "0";
            expressionBox.Text = "0";
            leftOperand = "";
            rightOperand = "";
            operationSymbol = "";
            result = "";
        }
    }
}