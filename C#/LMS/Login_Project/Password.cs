using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Login_Project
{
    internal class Password
    {
        static bool Validated(string password)
        {
            // 비밀번호 유효성을 검사하는 로직을 구현합니다.
            // 예를 들어, 여기서는 비밀번호가 8자 이상이어야 유효하다고 가정합니다.
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
