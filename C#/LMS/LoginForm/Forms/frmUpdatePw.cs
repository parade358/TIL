using LoginForm.Models;
using System;
using System.Windows.Forms;

namespace LoginForm.Forms
{
    public partial class frmUpdatePw : Form
    {
        private String userId;
        private String connectionString;
        bool isValidPassword;

        public frmUpdatePw(String userId, String connectionString)
        {
            InitializeComponent();
            this.userId = userId;
            this.connectionString = connectionString;
        }

        private void closeBtn_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void passwordCheck_TextChanged(object sender, EventArgs e)
        {
            if(passwordCheck.Text == password.Text)
            {
                pwCheck.Text = "비밀번호가 일치합니다.";
                pwCheck.ForeColor = System.Drawing.Color.Green;
            }else
            {
                pwCheck.Text = "비밀번호가 일치하지 않습니다.";
                pwCheck.ForeColor = System.Drawing.Color.Red;
            }
        }

        private void saveBtn_Click(object sender, EventArgs e)
        {
            if (password.Text == "" || passwordCheck.Text == "" || passwordCheck.Text != password.Text)
            {
                MessageBox.Show("비밀번호를 확인해 주세요.", "알림");
                return;
            }

            String newPassword = password.Text;

            UserImpl userImple = new UserImpl();

            int result = userImple.Update(userId, newPassword, connectionString);

            if (result > 0) 
            {
                Close();
            }

        }

        private void password_TextChanged_1(object sender, EventArgs e)
        {
            isValidPassword = Password.Validated(password.Text);

            if (!isValidPassword)
            {
                pwCheck.Text = "비밀번호는 8자 이상이어야 합니다.";
                pwCheck.ForeColor = System.Drawing.Color.Red;
            }
            else
            {
                pwCheck.Text = "사용 가능한 비밀번호입니다.";
                pwCheck.ForeColor = System.Drawing.Color.Green;
            }
        }
    }
}
