using System;
using System.Data.SqlClient;
using System.Data;
using System.Windows.Forms;

namespace LoginForm.Models
{
    internal class UserImpl : User
    {
        DateTime currentTime = DateTime.Now;

        public int Add(String userId, String userPw, String userName, String conectionString)
        {
            int result = 0;

            using (SqlConnection connection = new SqlConnection(conectionString))
            {
                connection.Open();

                SqlCommand command = new SqlCommand("UTB_EMPUSER_I", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@ID", userId);
                command.Parameters.AddWithValue("@PW", userPw);
                command.Parameters.AddWithValue("@NAME", userName);
                command.Parameters.AddWithValue("@CREATE_DTTM", currentTime);
                command.Parameters.AddWithValue("@SAVE_DTTM", currentTime);

                SqlParameter resultParameter = new SqlParameter("@Result", SqlDbType.Int);
                resultParameter.Direction = ParameterDirection.Output;
                command.Parameters.Add(resultParameter);

                command.ExecuteNonQuery();

                result = (int)resultParameter.Value;

                connection.Close();
            }

            if (result == 1)
            {
                MessageBox.Show("저장되었습니다.", "알림", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            else if (result == -1)
            {
                MessageBox.Show("이미 존재하는 ID입니다.", "알림", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
            else
            {
                MessageBox.Show("오류가 발생했습니다.", "오류", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }

            return result;
        }


        public int Update(String userId, String newPassword, String connectionString)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                int result = 0;

                connection.Open();

                SqlCommand command = new SqlCommand("UTB_EMPUSER_U", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@UserID", userId);
                command.Parameters.AddWithValue("@NewPassword", newPassword);

                SqlParameter resultParameter = new SqlParameter("@Result", SqlDbType.Int);
                resultParameter.Direction = ParameterDirection.Output;
                command.Parameters.Add(resultParameter);

                command.ExecuteNonQuery();

                result = (int)resultParameter.Value;

                connection.Close();

                if (result == 1)
                {
                    MessageBox.Show("비밀번호가 성공적으로 변경되었습니다.", "알림", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    return result;
                }
                else
                {
                    MessageBox.Show("비밀번호 변경에 실패했습니다.", "오류", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return result;
                }
            }
        }

        public int Delete(String userId, String connectionString)
        {
            int result = 0;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                SqlCommand command = new SqlCommand("UTB_EMPUSER_D", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@UserID", userId);

                SqlParameter resultParameter = new SqlParameter("@Result", SqlDbType.Int);
                resultParameter.Direction = ParameterDirection.Output;
                command.Parameters.Add(resultParameter);

                command.ExecuteNonQuery();

                result = (int)resultParameter.Value;

                connection.Close();
            }

            if (result == 1)
            {
                MessageBox.Show("삭제 성공", "알림", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }else
            {
                MessageBox.Show("오류가 발생했습니다.", "오류", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }

            return result;
        }
    }
}
