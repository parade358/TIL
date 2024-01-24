# library function

1. [삼항연산자] 

   ```java
   int result = (x > y) ? x : y;  
   ```

   

2. [배열자르기] 

   ```java
   int[] slicedArray = Arrays.copyOfRange(originalArray, 2, 7);
   ```

   

3. [배열 오름차순] 

   ```java
   Arrays.sort(numbers);
   ```

   

4. [배열 내림차순] 

   ```java
   Arrays.sort(numbers); //오름차순 배열을 뒤집기
   ```

   

5. [ArrayList -> int 배열] 

   ```java
   int[] intArray = dynamicArray.stream().mapToInt(Integer::intValue).toArray(); 
   ```

   

6. [향상된 for문] 

   ```java
   for (ElementType element : arrayOrCollection) {
       // 배열 또는 컬렉션의 각 요소에 접근
       // element
   }
   ```




7. [제곱수 판별 함수]

   ```java
   class Solution {
       public int solution(int n) {
           // n이 제곱수인지 여부를 판단
           if (n % Math.sqrt(n) == 0) {
               return 1; // 제곱수이면 1 반환
           } else {
               return 2; // 제곱수가 아니면 2 반환
           }
       }
   }
   ```



8. [정수 문자 문자열 간 변환]

   ```java
   public class ConversionExample {
   
       public static void main(String[] args) {
           // 정수를 문자열로 변환
           int number = 123;
           String strNumber1 = String.valueOf(number);
           String strNumber2 = Integer.toString(number);
           String strNumber3 = "" + number;
   
           // 문자열을 정수로 변환
           String strInt = "456";
           int intFromStr1 = Integer.parseInt(strInt);
           int intFromStr2 = Integer.valueOf(strInt);
   
           // 문자를 정수로 변환
           char charDigit = '7';
           int digit = Character.getNumericValue(charDigit);
       }
   }
   ```

   

