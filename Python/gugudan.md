```python
#예제
def gugu(a):
    result = []
    num=0
    while num<9:
        num += 1
        result.append(a*num)
    return result
result = gugu(2)
print(result)

#내가만든 코드
# 구구단 시작 전에 구분선 출력
print('=' * 10)
print("구구단")

# 무한루프: 올바른 단수를 입력할 때까지 반복
while True:
    try:
        # 사용자로부터 단수를 입력받음
        dan = int(input('단수를 입력해 주세요 (1부터 9까지): '))
        
        # 입력값이 1부터 9까지의 정수인지 확인
        if 1 <= dan <= 9:
            break  # 정상적인 입력이면 무한루프를 탈출
        else:
            # 입력값이 범위를 벗어날 경우 안내 메시지 출력
            print('1부터 9까지의 정수만 입력하세요.')
    except ValueError:
        # 정수가 아닌 입력값에 대한 예외 처리
        print('1부터 9까지의 숫자만 입력하세요.')

# 올바른 단수를 입력받은 후, 구구단 출력
print('구구단 시작!!')

i = 1
while i <= 9:
    # f-string을 사용하여 각각의 구구단 출력
    print(f'{dan} * {i} = {dan * i}')
    i += 1

# 구분선 출력
print('=' * 10)

```

