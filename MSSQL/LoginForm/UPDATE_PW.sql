CREATE PROCEDURE UTB_EMPUSER_U
(
    @UserID VARCHAR(50),
    @NewPassword VARCHAR(50),
    @Result INT OUTPUT
)
AS
BEGIN
    DECLARE @Count INT;
    SET @Count = (SELECT COUNT(*) FROM UTB_EMPUSER WHERE ID = @UserID);
    
    IF @Count = 0
    BEGIN
        SET @Result = -1;
        RETURN;
    END
    
    UPDATE UTB_EMPUSER SET PW = @NewPassword WHERE ID = @UserID;
    SET @Result = 1;
END
