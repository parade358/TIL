using LoginForm.Models;
using System;
using System.Windows.Forms;

namespace LoginForm
{
    public partial class frmUserAdd : Form
    {
        private String databaseInfo;
        bool passwordRule;

        public frmUserAdd(String databaseInfo)
        {
            InitializeComponent();
            this.databaseInfo = databaseInfo;
        }

        // 팝업에서 “저장” 클릭하면 저장을 처리한 후 팝업을 닫는다.
        // “저장” 시 이미 ID가 있으면 “이미 존재하는 ID입니다”라는 메시지가 출력되어야 함.
        private void saveBtn_Click(object sender, EventArgs e)
        {
            String userId = id.Text;
            String userPw = password.Text;
            String userName = name.Text;


            if (userId == "" || userPw == "" || userName == "" || passwordRule == false)
            {
                MessageBox.Show("정보를 규칙에 맞게 전부 입력해주세요.", "알림");
                return;
            }


            UserImpl userImpl = new UserImpl();
            int result = userImpl.Add(userId, userPw, userName, databaseInfo);


            if (result == 1)
            {
                MessageBox.Show("저장되었습니다.", "알림");
                Close();
            }
            else if (result == -1)
            {
                MessageBox.Show("이미 존재하는 ID입니다.", "알림");
            }
            else
            {
                MessageBox.Show("오류가 발생했습니다.", "오류");
            }
        }


        private void password_TextChanged(object sender, EventArgs e)
        {
            passwordRule = Password.Validated(password.Text);

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
