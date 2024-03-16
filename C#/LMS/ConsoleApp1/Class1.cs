using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    internal class Class1 : Interface1
    {
        DateTime _dtStartDt;
        DateTime _dtEndDt;
        public Class1(DateTime dtStartDt, DateTime dtEndDt)
        {
            _dtStartDt = dtStartDt;
            _dtEndDt = dtEndDt;
        }

        public double GetDay()
        {
            TimeSpan diff = _dtEndDt - _dtStartDt;
            double diifDay = diff.TotalDays;
            return diifDay;
        }

        public double GetHour()
        {
            TimeSpan diff = _dtEndDt - _dtStartDt;
            double diifHour = diff.TotalHours;
            return diifHour;
        }

        public double GetMinutes()
        {
            TimeSpan diff = _dtEndDt - _dtStartDt;
            double diifMinutes = diff.TotalMinutes;
            return diifMinutes;
        }

        public double GetMonth()
        {
            TimeSpan diff = _dtEndDt - _dtStartDt;
            double diifMonth = diff.TotalDays / 30; //TotalMonths 는 존재하지 않기 때문에 TotalDays에서 30을 나누어 근사값을 구한다.
            return diifMonth;
        }
    }
}
