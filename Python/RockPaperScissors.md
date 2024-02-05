```python
import random
import time

def print_choices(user, computer):
    print("가위...")
    time.sleep(1)
    print("바위...")
    time.sleep(1)
    print("보!")
    time.sleep(1)
    print("당신 : " + user)
    time.sleep(1)
    print("컴퓨터 : " + computer)
    time.sleep(1)

def main():
    print("가위바위보 시작")

    count = 0

    while True:
        print("'가위', '바위', '보' 중 한 단어를 입력해주세요. 현재 스코어: " + str(count) + "점")

        user = input()

        if user not in ["가위", "바위", "보"]:
            print("'가위', '바위', '보' 중 한 단어만 입력하셔야 합니다. 다시 입력해 주세요.")
            continue

        choices = ["가위", "바위", "보"]
        computer = random.choice(choices)

        print_choices(user, computer)

        if user == computer:
            print("비겼습니다. 다시 입력해주세요.")
        elif (user == "가위" and computer == "바위") or \
             (user == "바위" and computer == "보") or \
             (user == "보" and computer == "가위"):
            print("졌습니다 ㅠㅠ")
            print("최종 스코어: " + str(count)+"점")
            break
        else:
            print("축하합니다! 이겼습니다!")
            count += 1

if __name__ == "__main__":
    main()
```

