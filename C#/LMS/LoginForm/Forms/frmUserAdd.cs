using LoginForm.Models;
using System;
using System.Windows.Forms;

namespace LoginForm
{
    public partial class frmUserAdd : Form
    {
        private String conectionString;
        bool isValidPassword;

        public frmUserAdd(String connectionString)
        {
            InitializeComponent();
            this.conectionString = connectionString;
        }


        private void saveBtn_Click(object sender, EventArgs e)
        {
            String userId = id.Text;
            String userPw = password.Text;
            String userName = name.Text;

            if (userId == "" || userPw == "" || userName == "" || isValidPassword ==false)
            {
                MessageBox.Show("정보를 규칙에 맞게 전부 입력해주세요.", "알림");
                return;
            }

            UserImpl userImpl = new UserImpl();

            int result = userImpl.Add(userId, userPw, userName, conectionString);

            if(result > 0)
            {
                Close();
            }
        }

        private void closeBtn_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void password_TextChanged(object sender, EventArgs e)
        {
            isValidPassword = Password.Validated(password.Text);

            if (!isValidPassword)
            {
                pwCheck.Text = "비밀번호는 8자 이상이어야 합니다.";
                pwCheck.ForeColor = System.Drawing.Color.Red;
            }else
            {
                pwCheck.Text = "사용 가능한 비밀번호입니다.";
                pwCheck.ForeColor = System.Drawing.Color.Green;
            }
        }
    }
}
