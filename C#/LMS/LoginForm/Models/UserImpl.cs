using System;
using System.Data.SqlClient;
using System.Data;

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

            // UTB_EMPUSER_I 프로시저 호출 (유저 정보 인서트)
            SqlCommand command = new SqlCommand("UTB_EMPUSER_I", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@P_ID", userId);
            command.Parameters.AddWithValue("@P_PW", userPw);
            command.Parameters.AddWithValue("@P_NAME", userName);
            command.Parameters.AddWithValue("@P_CREATE_DTTM", currentTime);
            command.Parameters.AddWithValue("@P_SAVE_DTTM", currentTime);

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

            // UTB_EMPUSER_U 프로시저 호출 (유저 정보 업데이트)
            SqlCommand command = new SqlCommand("UTB_EMPUSER_U", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@P_ID", userId);
            command.Parameters.AddWithValue("@P_NEW_PW", newPassword);

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

            // UTB_EMPUSER_D 프로시저 호출 (유저 삭제)
            SqlCommand command = new SqlCommand("UTB_EMPUSER_D", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@P_ID", userId);

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

            // UTB_EMPUSER_L 프로시저 호출 (유저 정보 로드)
            SqlCommand command = new SqlCommand("UTB_EMPUSER_L", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@P_ID", userId);
            command.Parameters.AddWithValue("@P_PW", userPw);

            SqlParameter userNameParameter = new SqlParameter("@P_Name", SqlDbType.VarChar, 50);
            userNameParameter.Direction = ParameterDirection.Output;
            command.Parameters.Add(userNameParameter);

            command.ExecuteNonQuery();

            result = userNameParameter.Value.ToString();

            connection.Close();

            return result;


        }
    }
}
