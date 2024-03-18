using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Login_Project
{
    public partial class frmUserAdd : Form
    {
        public frmUserAdd()
        {
            InitializeComponent();
        }

        private void SignlnButton_Click(object sender, EventArgs e)
        {

        }

        private void closeBtn_Click(object sender, EventArgs e)
        {

        }

        private void addUserBtn_Click(object sender, EventArgs e)
        {

        }

        private void password_TextChanged(object sender, EventArgs e)
        {
            if (passwordTextBox.Text.Length >= 8)
            {
                passwordStatusLabel.Text = "사용 가능한 비밀번호입니다.";
                passwordStatusLabel.ForeColor = System.Drawing.Color.Green;
            }
            else if(passwordTextBox.Text.Length <1)
            {
                passwordStatusLabel.Text = "비밀번호를 입력해주세요.";
                passwordStatusLabel.ForeColor = System.Drawing.Color.Black;
            }
            else
            {
                passwordStatusLabel.Text = "비밀번호는 8자 이상이어야 합니다.";
                passwordStatusLabel.ForeColor = System.Drawing.Color.Red;
            }
        }
    }
}
