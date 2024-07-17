USE [DABOM50_NY]
GO
/****** Object:  StoredProcedure [dbo].[U_PK_PDA_IMAGE_TEST_S]    Script Date: 2024-07-16(화) 오전 8:48:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROC [dbo].[U_PK_PDA_IMAGE_TEST_S]  
	@P_NAME NVARCHAR(255),
	@P_BASE64 NVARCHAR(MAX)                 
AS          
BEGIN          
	SET NOCOUNT ON

INSERT INTO UTB_IMAGE (IMAGE_NAME, IMAGE_BASE64) VALUES (@P_NAME, @P_BASE64);


	SET NOCOUNT OFF          
END          