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

        private void insertExpressinBox()
        {
            expressionBox.Text = leftOperand + operationSymbol + rightOperand;
        }

        private void numberBtnClick(object sender, EventArgs e)
        {
            Button clickNumber = (Button)sender;
            saveOperand(clickNumber.Text);
            insertExpressinBox();
        }

        private void operatorBtnClick(object sender, EventArgs e)
        {
            Button clickOperator = (Button)sender;
            operationSymbol = clickOperator.Text;
            insertExpressinBox();
        }

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

        private void equalsBtnClick(object sender, EventArgs e)
        {
            switch (operationSymbol)
            {
                case "+":
                    Add(leftOperand, rightOperand);
                    break;
                case "-":
                    Subtract(leftOperand, rightOperand);
                    break;
                case "*":
                    Multiply(leftOperand, rightOperand);
                    break;
                case "/":
                    Divide(leftOperand, rightOperand);
                    break;
                default:
                    throw new ArgumentException();
            }
        }

        private void Add(String left, String right)
        {
            result = (int.Parse(left) + int.Parse(right)).ToString();
            resultBox.Text = result;
            leftOperand = result;
            rightOperand = "";
            operationSymbol = "";
        }

        private void Subtract(String left, String right)
        {
            result = (int.Parse(left) - int.Parse(right)).ToString();
            resultBox.Text = result;
            leftOperand = result;
            rightOperand = "";
            operationSymbol = "";
        }

        private void Multiply(String left, String right)
        {
            result = (int.Parse(left) * int.Parse(right)).ToString();
            resultBox.Text = result;
            leftOperand = result;
            rightOperand = "";
            operationSymbol = "";
        }

        private void Divide(String left, String right)
        {
            if (leftOperand == "0")
            {
                result = "null";
                resultBox.Text = result;
                leftOperand = "";
                rightOperand = "";
                operationSymbol = "";
            }
            else
            {
                result = (int.Parse(left) / int.Parse(right)).ToString();
                resultBox.Text = result;
                leftOperand = result;
                rightOperand = "";
                operationSymbol = "";
            }
        }
    }
}