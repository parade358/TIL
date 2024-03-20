using LoginForm.Forms;
using LoginForm.Models;
using System;
using System.Windows.Forms;

namespace LoginForm
{
    public partial class frmLogin : Form
    {
        private String userId;
        private String userPw;
        private String databaseInfo = "SERVER=192.168.25.118,1433\\DESKTOP-255DV3Q;Database=LoginForm;USER ID=sa;Password=585858asd";

        public frmLogin()
        {
            InitializeComponent();
        }
        // ID와 PW를 작성하고 “로그인” 버튼을 클릭하면 UTB_EMPUSER에서 ID와 PW를 찾아 해당하는 사용자의 NAME을 출력한다.
        private void loginBtn_Click(object sender, EventArgs e)
        {
            userId = id.Text;
            userPw = password.Text;

            // 아무런 값도 없이 “로그인” 버튼을 클릭했을 때 “ID 또는 PW가 입력되지 않았습니다”라고 알려준다.
            if (userId == "" || userPw == "")
            {
                MessageBox.Show("ID 또는 PW가 입력되지 않았습니다", "알림");
                return;
            }

            UserImpl userImpl = new UserImpl();

            String result = userImpl.Load(userId, userPw, databaseInfo);

            if (result != "")
            {
                MessageBox.Show($"{result}님, 환영합니다.", "알림");

                name.Text = result;

                showUpdateBtn.Visible = true;

                deleteBtn.Visible = true;
            }
            else
            {
                MessageBox.Show("아이디 또는 비밀번호가 잘못되었습니다.", "알림");
            }

        }

        // “사용자 등록”을 클릭하면 팝업창이 뜨면서 사용자 등록을 할 수 있게 한다.
        private void showAddUserBtn_Click(object sender, EventArgs e)
        {
            frmUserAdd frmUserAdd = new frmUserAdd(databaseInfo);
            frmUserAdd.ShowDialog();
        }


        private void showUpdateBtn_Click(object sender, EventArgs e)
        {
            frmUpdatePw frmUpdatePw = new frmUpdatePw(userId, databaseInfo);
            frmUpdatePw.ShowDialog();
        }

        private void deleteBtn_Click(object sender, EventArgs e)
        {
            UserImpl userImpl = new UserImpl();

            int result = userImpl.Delete(userId, databaseInfo);

            if (result == 1)
            {
                id.Text = "";
                password.Text = "";
                name.Text = "";
                showUpdateBtn.Visible = false;
                deleteBtn.Visible = false;

                MessageBox.Show("삭제 성공", "알림");
            }
            else
            {
                MessageBox.Show("오류가 발생했습니다.", "오류");
            }
        }
    }
}
