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

        string test;

        private void clickNumber(object sender, EventArgs e)
        {
            Button clickedButton = sender as Button;
            String expressionText = expressionBox.Text;
            string lastChar = expressionText[expressionText.Length - 1].ToString();

            if (expressionBox.Text.StartsWith("0"))
            {
                expressionBox.Text = clickedButton.Text;
            }
            else
            {
                if(lastChar != "+" && lastChar != "-" && lastChar != "*" && lastChar != "/")
                {
                    expressionBox.Text += clickedButton.Text;
                }
                else
                {
                    expressionBox.Text = clickedButton.Text;
                }
            }
        }

        private void clickClearBtn(object sender, EventArgs e)
        {
            resultBox.Text = "0";

            expressionBox.Text = "0";

            test = "asd";
        }

        private void clickOperatorBtn(object sender, EventArgs e)
        {
            String expressionText = expressionBox.Text;
            Button clickedButton = sender as Button;
            string lastChar = expressionText[expressionText.Length-1].ToString();

            if (expressionBox.Text.StartsWith("0"))
            {
                expressionBox.Text = "0";
            }
            else
            {
                if (lastChar != "+" && lastChar != "-" && lastChar != "*" && lastChar != "/")
                {
                    expressionBox.Text += clickedButton.Text;
                    resultBox.Text = test;
                }
            }
        }
    }
}