using System;

namespace LoginForm.Models
{
    internal interface User
    {
        int Add(String userId, String userPw, String userName, String databaseInfo);

        int Update(String userId, String newPassword, String databaseInfo);

        int Delete(String userId, String databaseInfo);

        String Load(String userId, String userPw, String databaseInfo);
    }
}
