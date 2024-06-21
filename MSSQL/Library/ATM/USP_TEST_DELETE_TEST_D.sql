USE [ATM52]
GO

/****** Object:  StoredProcedure [dbo].[USP_TEST_DELETE_TEST_D]    Script Date: 2024-06-20(목) 오전 8:32:23 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

  
/******************************************************************    
* DATABASE        : ATM52    
* PROCEDURE NAME  : USP_TEST_DELETE_TEST_D    
* DATE            : 2024/06/19    
* AUTHOR          : 최유성    
* PROCEDURE DESC  : 설비정보 삭제 프로시저    
*******************************************************************     
    
* DATE:		Developer			Change     
----------  ----------------  ---------------------------------------     
2024/06/19	최유성				Created 
******************************************************************/    
  
ALTER PROCEDURE [dbo].[USP_TEST_DELETE_TEST_D]

	@p_rowstamp  NVARCHAR(20)  
  , @p_delimiter NVARCHAR(20)  
  , @p_values    NVARCHAR(4000)  
  , @p_saveby    NVARCHAR(20)  
AS  
BEGIN  
SET NOCOUNT ON;  
  
    --parsing value string ..............................................    
    DECLARE @tbl TABLE(  
        idx   INT  
    , vData NVARCHAR(255));  
    INSERT INTO @tbl  
    SELECT  
        *  
    FROM   dbo.fn_getValues (@p_delimiter, @p_values);
  
    --.................................................................    
      
  
    BEGIN TRY  
    BEGIN TRAN;  
  
        DELETE FROM TB_EQ WHERE ROW_STAMP = @p_rowstamp  
  
        COMMIT;  
  
    END TRY  
    BEGIN CATCH  
        IF(@@TRANCOUNT > 0) ROLLBACK;  
  
        DECLARE @MSG NVARCHAR(4000);  
        SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());  
        RAISERROR(@MSG, 16, 1);  
    END CATCH;  
  
SET NOCOUNT OFF;  
END;  
  

GO


