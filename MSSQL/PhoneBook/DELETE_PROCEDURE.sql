CREATE PROCEDURE P_DELETE
    @Numbers VARCHAR(MAX)  
AS  
BEGIN  
    DECLARE @ID INT;  
    DECLARE @Delimiter CHAR(1) = '.';  
    DECLARE @StartIndex INT = 1;  
    DECLARE @EndIndex INT; 
      
    SET @Numbers = @Numbers + @Delimiter; -- 문자열 끝에 구분자를 추가하여 모든 숫자를 반복할 수 있도록 함  
      
    WHILE CHARINDEX(@Delimiter, @Numbers, @StartIndex) > 0  
    BEGIN  
        SET @EndIndex = CHARINDEX(@Delimiter, @Numbers, @StartIndex);  
        SET @ID = SUBSTRING(@Numbers, @StartIndex, @EndIndex - @StartIndex);  
          
        DELETE FROM CONTACTS WHERE CONTACT_ID = @ID;  
          
        SET @StartIndex = @EndIndex + 1;  
    END  
END  