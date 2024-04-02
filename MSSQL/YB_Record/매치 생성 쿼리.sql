CREATE PROCEDURE InsertMatchAndPlayers
    @Opponent VARCHAR(100),
    @Location VARCHAR(100),
    @MatchDate DATE,
    @PlayerNames VARCHAR(MAX)
AS
BEGIN
    DECLARE @MatchID INT;

    -- ��� �߰�
    INSERT INTO MATCHES (OPPONENT, LOCATION, MATCH_DATE) VALUES (@Opponent, @Location, @MatchDate);
    SET @MatchID = SCOPE_IDENTITY(); -- ���� �߰��� ����� ID�� ������

    -- �� ������ ����� ��ġ �߰�
    DECLARE @Delimiter CHAR(1) = ','; -- �� ���� �̸��� �����ϴ� ������
    DECLARE @PlayerName VARCHAR(100);
    DECLARE @PlayerNameEndIndex INT;
    DECLARE @NextPlayerNameIndex INT = 1;

    WHILE @NextPlayerNameIndex <= LEN(@PlayerNames)
    BEGIN
        SET @PlayerNameEndIndex = CHARINDEX(@Delimiter, @PlayerNames, @NextPlayerNameIndex);
        IF @PlayerNameEndIndex = 0
            SET @PlayerNameEndIndex = LEN(@PlayerNames) + 1;
        
        SET @PlayerName = SUBSTRING(@PlayerNames, @NextPlayerNameIndex, @PlayerNameEndIndex - @NextPlayerNameIndex);
        INSERT INTO MATCH_PLAYERS (MATCH_ID, PLAYER_ID) VALUES (@MatchID, (SELECT PLAYER_ID FROM PLAYERS WHERE NAME = @PlayerName));
        
        -- ���� ���� �̸��� ���� �ε��� ����
        SET @NextPlayerNameIndex = @PlayerNameEndIndex + 1;
    END;
END;