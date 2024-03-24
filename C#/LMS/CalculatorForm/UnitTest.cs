using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CalculatorForm
{
    internal class UnitTest
    {

        public class Assert
        {
            public static bool IsTrue(int i, int j)
            {
                return i != j;
            }


        }
        private void add_result()
        {
                Assert.IsTrue(1, 3);
        }


    }
}
