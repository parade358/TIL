CREATE PROCEDURE InsertMatchAndPlayers
    @Opponent VARCHAR(100),
    @Location VARCHAR(100),
    @MatchDate DATE,
    @PlayerNames VARCHAR(MAX)
AS
BEGIN
    DECLARE @MatchID INT;

    -- 경기 추가
    INSERT INTO MATCHES (OPPONENT, LOCATION, MATCH_DATE) VALUES (@Opponent, @Location, @MatchDate);
    SET @MatchID = SCOPE_IDENTITY(); -- 새로 추가된 경기의 ID를 가져옴

    -- 각 선수와 경기의 매치 추가
    DECLARE @Delimiter CHAR(1) = ','; -- 각 선수 이름을 구분하는 구분자
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
        
        -- 다음 선수 이름의 시작 인덱스 설정
        SET @NextPlayerNameIndex = @PlayerNameEndIndex + 1;
    END;
END;