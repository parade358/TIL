USE [DABOM50_NY]
GO
/****** Object:  StoredProcedure [dbo].[U_PK_PDA_IMAGE_TEST_L]    Script Date: 2024-07-16(화) 오전 8:48:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROC [dbo].[U_PK_PDA_IMAGE_TEST_L]      
	@P_NAME NVARCHAR(255)
AS          
BEGIN          
	SET NOCOUNT ON

SELECT IMAGE_BASE64 FROM UTB_IMAGE WHERE IMAGE_ID = 2;


	SET NOCOUNT OFF          
END          