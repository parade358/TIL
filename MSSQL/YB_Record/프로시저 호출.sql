DECLARE @Opponent VARCHAR(100) = 'FC 마피아';
DECLARE @Location VARCHAR(100) = '영신초등학교';
DECLARE @MatchDate DATE = '2024-04-05';
DECLARE @PlayerNames VARCHAR(MAX) = '최유성, 유준석, 류제승';

-- 경기 및 선수 추가 프로시저 호출
EXEC InsertMatchAndPlayers @Opponent, @Location, @MatchDate, @PlayerNames;

-- 추가된 경기의 ID 가져오기
DECLARE @MatchID INT;
SELECT @MatchID = SCOPE_IDENTITY();

-- 골 및 어시스트 추가 프로시저 호출
-- 선수1이 2쿼터에 골을 넣었으며, 선수2가 어시스트를 제공한 경우
EXEC InsertGoalAndAssist '최유성', @MatchID, 2, '선수2', 2;

-- 선수2가 3쿼터에 골을 넣었으며, 선수3가 어시스트를 제공한 경우
EXEC InsertGoalAndAssist '선수2', @MatchID, 3, '선수3', 3;

-- 추가적으로 골 및 어시스트를 추가할 수 있습니다.