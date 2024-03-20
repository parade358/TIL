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

    }
}
