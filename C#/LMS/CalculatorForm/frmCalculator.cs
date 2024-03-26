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
        private void numberBtnClick(object sender, EventArgs e)
        {
            Button clickNumber = (Button)sender;
            saveOperand(clickNumber.Text);
            insertExpressionBox();
        }

        // 연산자 버튼 클릭
        private void operatorBtnClick(object sender, EventArgs e)
        {
            Button clickOperator = (Button)sender;
            operationSymbol = clickOperator.Text;
            insertExpressionBox();
        }

        // 계산식 표현
        private void insertExpressionBox()
        {
            expressionBox.Text = leftOperand + operationSymbol + rightOperand;
        }

        // 계산할 숫자 저장
        private void saveOperand(String operand)
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
        private void equalsBtnClick(object sender, EventArgs e)
        {
            if(leftOperand != "" && rightOperand != "" && operationSymbol != "")
            {
                Operation(leftOperand, rightOperand, operationSymbol);
                insertResultAndReset();
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
        private void insertResultAndReset()
        {
            resultBox.Text = result;
            leftOperand = result;
            rightOperand = "";
            operationSymbol = "";
        }
    }
}