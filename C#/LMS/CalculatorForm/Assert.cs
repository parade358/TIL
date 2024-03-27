using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CalculatorForm
{
    internal class Assert
    {
        public static bool IsTrue(double actual, double expected)
        {
            return actual == expected;
        }
    }
}
