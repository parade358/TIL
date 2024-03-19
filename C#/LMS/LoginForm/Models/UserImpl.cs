using System;
using System.Data.SqlClient;
using System.Data;
using System.Windows.Forms;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.StartPanel;

namespace LoginForm.Models
{
    internal class UserImpl : User
    {
        DateTime currentTime = DateTime.Now;

        // 조건 : DB 연동은 프로시저를 호출해서 처리해야 한다.

        public int Add(String userId, String userPw, String userName, String databaseInfo)
        {

            SqlConnection connection = new SqlConnection(databaseInfo);

            connection.Open();

            // UTB_EMPUSER_I 프로시저 호출
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

            int result = (int)resultParameter.Value;

            connection.Close();

            return result;
        }


        public int Update(String userId, String newPassword, String databaseInfo)
        {
            SqlConnection connection = new SqlConnection(databaseInfo);

            connection.Open();

            SqlCommand command = new SqlCommand("UTB_EMPUSER_U", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@UserID", userId);
            command.Parameters.AddWithValue("@NewPassword", newPassword);

            SqlParameter resultParameter = new SqlParameter("@Result", SqlDbType.Int);
            resultParameter.Direction = ParameterDirection.Output;
            command.Parameters.Add(resultParameter);

            command.ExecuteNonQuery();

            int result = (int)resultParameter.Value;

            connection.Close();

            return result;


        }

        public int Delete(String userId, String databaseInfo)
        {

            SqlConnection connection = new SqlConnection(databaseInfo);

            connection.Open();

            SqlCommand command = new SqlCommand("UTB_EMPUSER_D", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@UserID", userId);

            SqlParameter resultParameter = new SqlParameter("@Result", SqlDbType.Int);
            resultParameter.Direction = ParameterDirection.Output;
            command.Parameters.Add(resultParameter);

            command.ExecuteNonQuery();

            int result = (int)resultParameter.Value;

            connection.Close();

            return result;
        }

        public String Load(String userId, String userPw, String databaseInfo)
        {

            String result;

            SqlConnection connection = new SqlConnection(databaseInfo);

            connection.Open();

            SqlCommand command = new SqlCommand("UTB_EMPUSER_L", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@ID", userId);
            command.Parameters.AddWithValue("@PW", userPw);

            SqlParameter userNameParameter = new SqlParameter("@UserName", SqlDbType.VarChar, 50);
            userNameParameter.Direction = ParameterDirection.Output;
            command.Parameters.Add(userNameParameter);

            command.ExecuteNonQuery();

            result = userNameParameter.Value.ToString();

            connection.Close();

            return result;


        }
    }
}
