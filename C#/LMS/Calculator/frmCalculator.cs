using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static System.Net.Mime.MediaTypeNames;

namespace Calculator
{
    public partial class frmCalculator : Form
    {

        public frmCalculator()
        {
            InitializeComponent();
        }


        private String num1;
        private String num2;
        private String elemMath;


        private void clickNumber(object sender, EventArgs e)
        {
            Button clickedButton = sender as Button;
            string lastChar = expressionBox.Text[expressionBox.Text.Length - 1].ToString();

            if (expressionBox.Text.StartsWith("0"))
            {
                if (clickedButton.Text != "0")
                {
                    if (elemMath != null)
                    {
                        if (elemMath == "+")
                        {
                            num2 += clickedButton.Text;
                            expressionBox.Text += clickedButton.Text;
                            resultBox.Text = (Math.Round((double.Parse(num1) + double.Parse(num2)), 5)).ToString();
                        }
                        else if (elemMath == "-")
                        {
                            num2 += clickedButton.Text;
                            expressionBox.Text += clickedButton.Text;
                            resultBox.Text = (Math.Round((double.Parse(num1) - double.Parse(num2)), 5)).ToString();
                        }
                        else if (elemMath == "*")
                        {
                            num2 += clickedButton.Text;
                            expressionBox.Text += clickedButton.Text;
                            resultBox.Text = (Math.Round((double.Parse(num1) * double.Parse(num2)), 5)).ToString();
                        }
                        else if (elemMath == "/")
                        {
                            num2 += clickedButton.Text;
                            expressionBox.Text += clickedButton.Text;
                            resultBox.Text = (Math.Round((double.Parse(num1) / double.Parse(num2)), 5)).ToString();
                        }
                        else
                        {
                            num1 += clickedButton.Text;
                            expressionBox.Text += clickedButton.Text;
                        }
                    }
                    else
                    {
                        expressionBox.Text = clickedButton.Text;
                    }
                }
                else
                {
                    if (elemMath == "/")
                    {
                        num2 += clickedButton.Text;
                        expressionBox.Text += clickedButton.Text;
                        resultBox.Text = "null";
                    }
                }
            }
            else
            {
                if(lastChar != "+" && lastChar != "-" && lastChar != "*" && lastChar != "/")
                {
                    if(num2 != null)
                    {
                        if (elemMath == "+")
                        {
                            num2 += clickedButton.Text;
                            expressionBox.Text += clickedButton.Text;
                            resultBox.Text = (Math.Round((double.Parse(num1) + double.Parse(num2)), 5)).ToString();
                        }
                        else if (elemMath == "-")
                        {
                            num2 += clickedButton.Text;
                            expressionBox.Text += clickedButton.Text;
                            resultBox.Text = (Math.Round((double.Parse(num1) - double.Parse(num2)), 5)).ToString();
                        }
                        else if (elemMath == "*")
                        {
                            num2 += clickedButton.Text;
                            expressionBox.Text += clickedButton.Text;
                            resultBox.Text = (Math.Round((double.Parse(num1) * double.Parse(num2)), 5)).ToString();
                        }
                        else if (elemMath == "/")
                        {
                            num2 += clickedButton.Text;
                            expressionBox.Text += clickedButton.Text;
                            resultBox.Text = (Math.Round((double.Parse(num1) / double.Parse(num2)), 5)).ToString();
                        }
                    }
                    else
                    {
                        expressionBox.Text += clickedButton.Text;
                    }
                }
                else
                {
                    if (elemMath == "+")
                    {
                        num2 += clickedButton.Text;
                        expressionBox.Text += clickedButton.Text;
                        resultBox.Text = (Math.Round((double.Parse(num1) + double.Parse(num2)),5)).ToString();
                    }else if (elemMath == "-")
                    {
                        num2 += clickedButton.Text;
                        expressionBox.Text += clickedButton.Text;
                        resultBox.Text = (Math.Round((double.Parse(num1) - double.Parse(num2)), 5)).ToString();
                    }
                    else if(elemMath == "*")
                    {
                        num2 += clickedButton.Text;
                        expressionBox.Text += clickedButton.Text;
                        resultBox.Text = (Math.Round((double.Parse(num1) * double.Parse(num2)),5)).ToString();
                    }
                    else if (elemMath == "/")
                    {
                        num2 += clickedButton.Text;
                        expressionBox.Text += clickedButton.Text;
                        resultBox.Text = (Math.Round((double.Parse(num1) / double.Parse(num2)), 5)).ToString();
                    }
                    else
                    {
                        num1 += clickedButton.Text;
                        expressionBox.Text += clickedButton.Text;
                    }
                }
            }
        }








        private void clickOperatorBtn(object sender, EventArgs e)
        {
            String expressionText = expressionBox.Text;
            Button clickedButton = sender as Button;
            string lastChar = expressionText[expressionText.Length-1].ToString();

            
                if (lastChar != "+" && lastChar != "-" && lastChar != "*" && lastChar != "/")
                {
                    if(num2 == null)
                    {
                        num1 = expressionBox.Text;
                        elemMath = clickedButton.Text;
                        expressionBox.Text += clickedButton.Text;
                    }
                    else
                    {
                        num1 = resultBox.Text;
                        num2 = "";
                        elemMath = clickedButton.Text;
                        expressionBox.Text = "";
                        expressionBox.Text += resultBox.Text + clickedButton.Text;
                    }
                }
            
        }


        private void clickClearBtn(object sender, EventArgs e)
        {
            resultBox.Text = "0";
            expressionBox.Text = "0";
            elemMath = null;
            num1 = null;
            num2 = null;
        }


        private void equalsBtn_Click(object sender, EventArgs e)
        {

        }
    }
}