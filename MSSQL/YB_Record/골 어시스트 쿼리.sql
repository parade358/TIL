CREATE PROCEDURE InsertGoalAndAssist
    @PlayerName VARCHAR(100),
    @MatchID INT,
    @GoalQuarter INT,
    @AssistPlayerName VARCHAR(100) = NULL, -- 어시스트를 하지 않은 경우도 처리하기 위해 기본값으로 NULL 지정
    @AssistQuarter INT = NULL
AS
BEGIN
    DECLARE @PlayerID INT;
    DECLARE @AssistPlayerID INT;

    -- 골을 넣은 선수의 ID 가져오기
    SELECT @PlayerID = PLAYER_ID FROM PLAYERS WHERE NAME = @PlayerName;

    -- 골 추가
    INSERT INTO GOALS (PLAYER_ID, MATCH_ID, GOAL_QUARTER) VALUES (@PlayerID, @MatchID, @GoalQuarter);
    DECLARE @GoalID INT = SCOPE_IDENTITY(); -- 추가된 골의 ID 가져오기

    -- 어시스트가 있는 경우 어시스트를 한 선수의 ID 가져오기
    IF @AssistPlayerName IS NOT NULL
    BEGIN
        SELECT @AssistPlayerID = PLAYER_ID FROM PLAYERS WHERE NAME = @AssistPlayerName;
        -- 어시스트 추가
        INSERT INTO ASSISTS (GOAL_ID, PLAYER_ID, MATCH_ID, ASSISTS_QUARTER) VALUES (@GoalID, @AssistPlayerID, @MatchID, @AssistQuarter);
    END;
END;
