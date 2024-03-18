using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Login_Project
{
    internal class Password
    {
        public static bool Validated(string password)
        {

            if (password.Length >= 8)
            {
                return true; // 유효한 경우 true를 반환합니다.
            }
            else
            {
                return false; // 유효하지 않은 경우 false를 반환합니다.
            }
        }
    }
}
