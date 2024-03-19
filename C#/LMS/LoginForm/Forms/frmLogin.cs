using LoginForm.Forms;
using LoginForm.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Windows.Forms;

namespace LoginForm
{
    public partial class frmLogin : Form
    {
        public frmLogin()
        {
            InitializeComponent();
        }

        String userId;
        String userPw;

        private String connectionString = "SERVER=192.168.25.118,1433\\DESKTOP-255DV3Q;Database=LoginForm;USER ID=sa;Password=585858asd";

        private void showAddUserBtn_Click(object sender, EventArgs e)
        {
            frmUserAdd frmUserAdd = new frmUserAdd(connectionString);
            frmUserAdd.ShowDialog();
        }

        private void loginBtn_Click(object sender, EventArgs e)
        {
            userId = id.Text;
            userPw = password.Text;

            if (userId == "" || userPw == "") 
            {
                MessageBox.Show("ID 또는 PW가 입력되지 않았습니다", "로그인 오류");
                return; 
            }

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                SqlCommand command = new SqlCommand("UTB_EMPUSER_L", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@ID", userId);
                command.Parameters.AddWithValue("@PW", userPw);

                SqlParameter userNameParameter = new SqlParameter("@UserName", SqlDbType.VarChar, 50);
                userNameParameter.Direction = ParameterDirection.Output;
                command.Parameters.Add(userNameParameter);

                SqlParameter resultParameter = new SqlParameter("@Result", SqlDbType.Int);
                resultParameter.Direction = ParameterDirection.Output;
                command.Parameters.Add(resultParameter);
                command.ExecuteNonQuery();

                int result = (int)resultParameter.Value;

                connection.Close();

                if (result == 1)
                {
                    String userName = userNameParameter.Value.ToString();

                    MessageBox.Show($"{userName}님, 환영합니다.", "로그인 성공", MessageBoxButtons.OK, MessageBoxIcon.Information);

                    name.Text = userName;

                    showUpdateBtn.Visible = true;

                    deleteBtn.Visible = true;
                }
                else if (result == -1)
                {
                    MessageBox.Show("아이디 또는 비밀번호가 잘못되었습니다.", "로그인 오류", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void showUpdateBtn_Click(object sender, EventArgs e)
        {
            frmUpdatePw frmUpdatePw = new frmUpdatePw(userId, connectionString);
            frmUpdatePw.ShowDialog();
        }

        private void deleteBtn_Click(object sender, EventArgs e)
        {
            UserImpl userImpl = new UserImpl();

            int result = userImpl.Delete(userId, connectionString);
        }
    }
}
