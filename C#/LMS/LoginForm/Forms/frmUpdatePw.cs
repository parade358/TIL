using LoginForm.Models;
using System;
using System.Windows.Forms;

namespace LoginForm.Forms
{
    public partial class frmUpdatePw : Form
    {
        private String userId;
        private String databaseInfo;
        private bool passwordRule;

        public frmUpdatePw(String userId, String databaseInfo)
        {
            InitializeComponent();
            this.userId = userId;
            this.databaseInfo = databaseInfo;
        }


        private void passwordCheck_TextChanged(object sender, EventArgs e)
        {

            passwordRule = Password.passwordMatch(password.Text, passwordCheck.Text);

            if (passwordRule)
            {
                pwCheck.Text = "비밀번호가 일치합니다.";
                pwCheck.ForeColor = System.Drawing.Color.Green;
            }
            else
            {
                pwCheck.Text = "비밀번호가 일치하지 않습니다.";
                pwCheck.ForeColor = System.Drawing.Color.Red;
            }
        }

        private void saveBtn_Click(object sender, EventArgs e)
        {

            passwordRule = Password.updatePasswordCheck(password.Text, passwordCheck.Text);

            if (passwordRule)
            {
                MessageBox.Show("비밀번호를 확인해 주세요.", "알림");
                return;
            }

            String newPassword = password.Text;

            UserImpl userImple = new UserImpl();

            int result = userImple.Update(userId, newPassword, databaseInfo);

            if (result == 1)
            {
                MessageBox.Show("비밀번호가 성공적으로 변경되었습니다.", "알림");
                Close();
            }
            else
            {
                MessageBox.Show("비밀번호 변경에 실패했습니다.", "오류");
            }

        }

        private void password_TextChanged_1(object sender, EventArgs e)
        {
            passwordRule = Password.passwordRule(password.Text);

            if (!passwordRule)
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

        //“닫기”를 클릭하면 그냥 팝업을 닫는다.
        private void closeBtn_Click(object sender, EventArgs e)
        {
            Close();
        }
    }
}
