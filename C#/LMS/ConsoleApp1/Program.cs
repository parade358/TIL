using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    internal class Program
    {//  두 날짜의 차이를 시간(Hour) 단위를 계산하여 double 객체를 반환하는 함수 DateTime GetDiffHour(a, b)를 만들어
        //  216의 결과가 출력되도록 작업해보자.
        public static double GetDiffHour(DateTime startDt, DateTime endDt)
        {

            TimeSpan diff = endDt - startDt;

            double diffHour = diff.TotalHours;

            return diffHour;
        }

        //  Hour 뿐 아니라 분, 초, 일, 월의 경우를 반환하는 함수를 직접 만들어보자. 이 경우 어떻게 캡슐화 할지 고민해보자.
        //  예컨대 다음의 인터페이스를 상속하는 클래스 DiffDateTime을 만들고 분, 초, 일, 월의 경우를 처리하도록 하는 형태를 고민해보자.
        static void Main(string[] args)
        {
            Console.WriteLine("----------------------------------");



            Console.WriteLine("1. 시간 차이 얻기");
            Console.WriteLine();
            Interface1 __ItrfDiffDateTime;

            DateTime dtStartDt = new DateTime(2022, 7, 1, 9, 0, 0);//22년 7월 1일 오전 9시
            DateTime dtEndDt = new DateTime(2022, 7, 10, 9, 0, 0);//현재일시

            double diff = GetDiffHour(dtStartDt, dtEndDt);

            Console.WriteLine("diff = " + diff);

            Console.WriteLine();

            __ItrfDiffDateTime = new Class1(dtStartDt, dtEndDt);

            Console.WriteLine("GetMonth : " + __ItrfDiffDateTime.GetMonth() + " months");
            Console.WriteLine("GetDay : " + __ItrfDiffDateTime.GetDay() + " days");
            Console.WriteLine("GetHour : " + __ItrfDiffDateTime.GetHour() + " hours");
            Console.WriteLine("GetMinutes : " + __ItrfDiffDateTime.GetMinutes() + " minutes");

            //발표사항 : class 없이 그냥 단순절차식으로 코드를 작성하여 보라. 그 뒤 각 방식이 얻는 이득을 비교분석하라.



            Console.WriteLine("----------------------------------");



            Console.WriteLine("2. 열과 행을 차례대로 출력");
            Console.WriteLine();

            int[,] arr = new int[3, 3]
            {
                { 1, 2, 3 },
                { 4, 5, 6 },
                { 7, 8, 9 }
            };

            for (int i = 0; i < arr.GetLength(0); i++)
            {
                for (int j = 0; j < arr.GetLength(1); j++)
                {
                    Console.Write(arr[i, j].ToString());
                }
                Console.WriteLine();
            }

            //발표사항 : 이중반복문 설명



            Console.WriteLine("----------------------------------");



            Console.WriteLine("3. 일부 열만 출력하기");
            Console.WriteLine();

            int[,] arr2 = new int[3, 6]
            {
                { 1,  2,  3,  4,  5,  6 },
                { 7,  8,  9,  10, 11, 12 },
                { 13, 14, 15, 16, 17, 18 }
            };
            //결과
            /*
            3, 6,
            9, 12,
            15, 18,
            */

            for (int i = 0; i < arr2.GetLength(0); i++)
            {
                for (int j = 0; j < arr2.GetLength(1); j++)
                {
                    if (j % 3 == 2)
                    {
                        Console.Write(arr2[i, j].ToString() + ", ");
                    }
                }
                Console.WriteLine();
            }

            Console.WriteLine();

            int[,] arr3 = new int[3, 12]
            {
                { 1,  2,  3,  4,  5,  6, 7,  8,  9,  10, 11, 12},
                { 13, 14, 15, 16, 17, 18,19, 20, 21, 22, 23, 24 },
                { 25, 26, 27, 28, 29, 30,31, 32, 33, 34, 35, 36 }
            };
            // 올바른 결과
            /*
            3, 6, 9, 12,
            15, 18, 21, 24,
            27, 30, 33, 36,
            */

            for (int i = 0; i < arr3.GetLength(0); i++)
            {
                for (int j = 0; j < arr3.GetLength(1); j++)
                {
                    if (j % 3 == 2)
                    {
                        Console.Write(arr3[i, j].ToString() + ", ");
                    }
                }
                Console.WriteLine();
            }

            Console.WriteLine();

            /*
            4,  8,  12
            16, 20, 24
            28, 32, 36
            */

            for (int i = 0; i < arr3.GetLength(0); i++)
            {
                for (int j = 0; j < arr3.GetLength(1); j++)
                {
                    if (j % 4 == 3) //나누는 값과 나머지만 변경
                    {
                        Console.Write(arr3[i, j].ToString() + ", ");
                    }
                }
                Console.WriteLine();
            }

            //발표사항: % 연산자 설명.Output의 변경 시 코드를 얼마나 변경해야 했는지 설명.



            Console.WriteLine("----------------------------------");



            Console.WriteLine("4. 데이터 자르기");
            Console.WriteLine();

            byte[] data = new byte[5] { 0x41, 0x42, 0x43, 0x44, 0x04 };//ABCD<EOT>

            String str1 = Encoding.Default.GetString(data);

            Console.WriteLine(str1);

            byte[] data2 = new byte[7] { 0x41, 0x42, 0x43, 0x44, 0x04, 0x41, 0x42 };//ABCD<EOT>AB

            String str2 = Encoding.Default.GetString(data2).Substring(0, 4);

            Console.WriteLine(str2);

            //발표사항 : SubString 메소드 설명.



            Console.WriteLine("----------------------------------");



            Console.WriteLine("5. try~catch 영역에서 잘못된 데이터 오류 일으키고 예외 처리하기");
            Console.WriteLine();

            try
            {
                byte[] data3 = new byte[6] { 0x41, 0x42, 0x43, 0x45, 0x46, 0x04 }; // 0x04는 EOT (End of Transmission) 문자를 나타냄

                // ASCII 인코딩을 사용하여 바이트 배열을 문자열로 변환
                string str3 = Encoding.ASCII.GetString(data3);

                // 결과 출력

                if (!str3.Contains('\u0004'))
                {
                    throw new Exception("잘못된 데이터가 들어왔습니다. 다시 시도하세요.(EOT 없음)");
                }

                Console.WriteLine(str3);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            //발표사항 : try~catch 설명 및 Exception 클래스 설명
        }
    }
}