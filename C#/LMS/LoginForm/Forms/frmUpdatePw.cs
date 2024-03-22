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

        private new void Validated(object sender, EventArgs e)
        {

            passwordRule = Password.Validated(password.Text);
            

            if (!passwordRule)
            {
                passwodCheck.Text = "비밀번호는 8자 이상이어야 합니다.";
                passwodCheck.ForeColor = System.Drawing.Color.Red;
            }
            else
            {
                passwodCheck.Text = "사용 가능한 비밀번호입니다.";
                passwodCheck.ForeColor = System.Drawing.Color.Green;
            }
        }


        private void saveBtn_Click(object sender, EventArgs e)
        {

            passwordRule = Password.Validated(password.Text);

            if (!passwordRule || password.Text == "")
            {
                MessageBox.Show("비밀번호를 확인해 주세요.", "알림");
                return;
            }

            String newPassword = password.Text;

            User user = new UserImpl();

            int result = user.Update(userId, newPassword, databaseInfo);

            if (result == 1)
            {
                MessageBox.Show("비밀번호가 성공적으로 변경되었습니다.", "알림");
                Close();
            }else if(result == 0) 
            {
                MessageBox.Show("비밀번호가 기존과 동일합니다.", "알림");
            }
            else
            {
                MessageBox.Show("비밀번호 변경에 실패했습니다.", "오류");
            }

        }


        //“닫기”를 클릭하면 그냥 팝업을 닫는다.
        private void closeBtn_Click(object sender, EventArgs e)
        {
            Close();
        }
    }
}