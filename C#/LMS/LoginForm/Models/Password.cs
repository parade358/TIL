using System.Windows.Forms;

namespace LoginForm.Models
{
    internal class Password
    {

        public static bool Validated(string password)
        {
            if (password.Length >= 8)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static bool passwordMatch(string password, string passwordCheck)
        {

            return password == passwordCheck;
        }

        public static bool updatePasswordCheck(string password, string passwordCheck)
        {
            if (password == "" || passwordCheck == "" || passwordCheck != password)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
