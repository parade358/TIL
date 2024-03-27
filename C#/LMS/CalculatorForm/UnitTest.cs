using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static CalculatorForm.Calculator;

namespace CalculatorForm
{
    internal class UnitTest
    {
        private void AddResult()
        {
            var expected = 4d;
            var calculator = new Calculator(0);
            calculator.Input(2);
            calculator.Operater(CalOperator.Add);
            calculator.Input(2);
            Assert.IsTrue(calculator.Result, expected);
        }
    }
}
