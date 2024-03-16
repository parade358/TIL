CREATE PROCEDURE P_DELETE
    @Numbers VARCHAR(MAX)  
AS  
BEGIN  
    DECLARE @ID INT;  
    DECLARE @Delimiter CHAR(1) = '.';  
    DECLARE @StartIndex INT = 1;  
    DECLARE @EndIndex INT; 
      
    SET @Numbers = @Numbers + @Delimiter; -- ���ڿ� ���� �����ڸ� �߰��Ͽ� ��� ���ڸ� �ݺ��� �� �ֵ��� ��  
      
    WHILE CHARINDEX(@Delimiter, @Numbers, @StartIndex) > 0  
    BEGIN  
        SET @EndIndex = CHARINDEX(@Delimiter, @Numbers, @StartIndex);  
        SET @ID = SUBSTRING(@Numbers, @StartIndex, @EndIndex - @StartIndex);  
          
        DELETE FROM CONTACTS WHERE CONTACT_ID = @ID;  
          
        SET @StartIndex = @EndIndex + 1;  
    END  
END  