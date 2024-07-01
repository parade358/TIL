      
/******************************************************************            
* DATABASE        : ATM52            
* PROCEDURE NAME  : USP_EMP_INFO_D       
* DATE            : 2024/07/01            
* AUTHOR          : 최유성            
* PROCEDURE DESC  : 유저페이지 사원정보 삭제 프로시저            
*******************************************************************             
      
* DATE:		Developer			Change             
----------  ----------------  ---------------------------------------             
2024/07/01	최유성				Created          
******************************************************************/            
      
CREATE PROCEDURE [dbo].[USP_EMP_INFO_D]
    @P_ROWSTAMP NVARCHAR(50)
          
AS      
BEGIN          
    SET NOCOUNT ON;
          
    BEGIN TRY            
        BEGIN TRAN;
        
        IF (@P_ROWSTAMP IS NULL OR @P_ROWSTAMP = '')
        BEGIN
            DECLARE @ErrMsg NVARCHAR(4000) = '해당하는 사원정보가 없습니다.';
            RAISERROR(@ErrMsg, 16, 1);
        END
        
        DELETE FROM dbo.TB_EMP WHERE ROW_STAMP = @P_ROWSTAMP;
        
        COMMIT;            
    END TRY
    BEGIN CATCH
        IF (@@TRANCOUNT > 0) ROLLBACK;
        SET @ErrMsg = DBO.[FN_GETERRMSG] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
        RAISERROR(@ErrMsg, 16, 1);            
    END CATCH;
           
    SET NOCOUNT OFF;      
END;
