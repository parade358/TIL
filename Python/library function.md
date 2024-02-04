# library function

1. **`isdigit()` 메서드**]

   ```python
   string1 = "12345"
   string2 = "abc123"
   string3 = "12.34"
   
   print(string1.isdigit())  # True
   print(string2.isdigit())  # False
   print(string3.isdigit())  # False
   ```



2. **f-string (포맷 문자열)**

   - f-string 또는 포맷 문자열 리터럴은 표현식을 문자열 리터럴에 직접 삽입하는 방법입니다. 문자열 리터럴 앞에 'f' 또는 'F'를 붙이며, 변수나 표현식을 중괄호 `{}`로 감싸 사용합니다.
   - f-string은 간결하고 가독성이 뛰어나며, `%` 포맷팅이나 `str.format()`과 같은 예전 방식보다 편리한 문자열 포매팅을 제공합니다.

   ```python
   이름 = "홍길동"
   나이 = 30
   print(f"내 이름은 {이름}이고, 나이는 {나이}살입니다.")
   ```

   

3. **`max` 함수**

   - `max` 함수는 파이썬의 내장 함수로, 이터러블(반복 가능한 객체)에서 가장 큰 값을 반환합니다. 두 개 이상의 인자가 주어진 경우 가장 큰 값을 반환합니다.
   - 문자열에 사용할 경우, `max` 함수는 문자열을 사전식으로(Unicode 코드 포인트를 기준으로) 비교하여 가장 큰 값을 반환합니다.

   ```python
   숫자들 = [3, 8, 1, 6, 5]
   최대값 = max(숫자들)  # 8를 반환합니다.
   
   단어들 = ["사과", "바나나", "오렌지"]
   최대단어 = max(단어들)  # "오렌지"를 반환합니다.
   ```




4. **`lower()`와 `upper()`**

   ```python
   pythonCopy code
   string = "Hello, World!"
   
   # 소문자로 변환
   lower_case = string.lower()
   print(lower_case)  # 출력: hello, world!
   
   # 대문자로 변환
   upper_case = string.upper()
   print(upper_case)  # 출력: HELLO, WORLD!
   ```

   - `lower()` 함수는 모든 문자를 소문자로 변환
   -  `upper()` 함수는 모든 문자를 대문자로 변환.



5. **`range` 함수**

   - range([start,] stop [,step])은 for 문과 함께 자주 사용하는 함수이다. 이 함수는 입력받은 숫자에 해당하는 범위 값을 반복 가능한 객체로 만들어 리턴한다.

   ```python
   # 인수가 하나일 경우 - 시작 숫자를 지정해 주지 않으면 range 함수는 0부터 시작한다.
   >>> list(range(5))
   [0, 1, 2, 3, 4]
   
   # 인수가 2개일 경우 - 입력으로 주어지는 2개의 인수는 시작 숫자와 끝 숫자를 나타낸다. 단, 끝 숫자는 해당 범위에 포함되지 않는다는 것에 주의하자.
   >>> list(range(5, 10))
   [5, 6, 7, 8, 9]
   
   # 인수가 3개일 경우 - 세 번째 인수는 숫자 사이의 거리를 말한다.
   >>> list(range(1, 10, 2))
   [1, 3, 5, 7, 9]
   >>> list(range(0, -10, -1))
   [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
   ```




6. **삼항 조건 연산자(ternary conditional operator)**

   - 삼항 조건 연산자는 조건에 따라 두 가지 값 중 하나를 선택하는 간결한 방법을 제공하는 파이썬의 표현식

   ```python
   value_if_true if condition else value_if_false
   
   #  condition은 참 또는 거짓을 평가할 조건이고, value_if_true는 조건이 참일 때 반환될 값이며, value_if_false는 조건이 거짓일 때 반환될 값
   ```

   ```python
   pythonCopy codex = 10
   y = 20
   max_value = x if x > y else y
   
   # `x`가 `y`보다 크면 `max_value`에는 `x`의 값이 들어가고, 그렇지 않으면 `y`의 값이 들어간다.
   ```

