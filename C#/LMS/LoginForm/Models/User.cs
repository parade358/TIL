using System;

namespace LoginForm.Models
{
    internal interface User
    {
        int Add(String userId, String userPw, String userName, String conectionString);

        int Update(String userId, String newPassword, String conectionString);

        int Delete(String userId, String connectionString);
    }
}
