USE [DABOM50_NY]
GO
/****** Object:  StoredProcedure [dbo].[U_PK_PDA_IMAGE_TEST_L]    Script Date: 2024-07-16(화) 오전 8:48:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROC [dbo].[U_PK_PDA_IMAGE_TEST_L]      
    @P_ID INT
AS          
BEGIN
    SET NOCOUNT ON

    IF NOT EXISTS (SELECT 1 FROM UTB_IMAGE (NOLOCK) WHERE IMAGE_ID = @P_ID)
    BEGIN
		RAISERROR ('해당하는 이미지가 없습니다.', 16, 1);
        RETURN 0;
    END
    ELSE
    BEGIN
        SELECT IMAGE_BASE64 FROM UTB_IMAGE (NOLOCK) WHERE IMAGE_ID = @P_ID;
    END

    SET NOCOUNT OFF
END
