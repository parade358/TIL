CREATE PROCEDURE InsertGoalAndAssist
    @PlayerName VARCHAR(100),
    @MatchID INT,
    @GoalQuarter INT,
    @AssistPlayerName VARCHAR(100) = NULL, -- ��ý�Ʈ�� ���� ���� ��쵵 ó���ϱ� ���� �⺻������ NULL ����
    @AssistQuarter INT = NULL
AS
BEGIN
    DECLARE @PlayerID INT;
    DECLARE @AssistPlayerID INT;

    -- ���� ���� ������ ID ��������
    SELECT @PlayerID = PLAYER_ID FROM PLAYERS WHERE NAME = @PlayerName;

    -- �� �߰�
    INSERT INTO GOALS (PLAYER_ID, MATCH_ID, GOAL_QUARTER) VALUES (@PlayerID, @MatchID, @GoalQuarter);
    DECLARE @GoalID INT = SCOPE_IDENTITY(); -- �߰��� ���� ID ��������

    -- ��ý�Ʈ�� �ִ� ��� ��ý�Ʈ�� �� ������ ID ��������
    IF @AssistPlayerName IS NOT NULL
    BEGIN
        SELECT @AssistPlayerID = PLAYER_ID FROM PLAYERS WHERE NAME = @AssistPlayerName;
        -- ��ý�Ʈ �߰�
        INSERT INTO ASSISTS (GOAL_ID, PLAYER_ID, MATCH_ID, ASSISTS_QUARTER) VALUES (@GoalID, @AssistPlayerID, @MatchID, @AssistQuarter);
    END;
END;
