/******************************************************************    
* DATABASE        : ATM52    
* PROCEDURE NAME  : USP_EMP_OVERTIME_D   
* DATE            : 2024/06/19    
* AUTHOR          : 최유성    
* PROCEDURE DESC  : 초과근무 삭제 프로시저    
*******************************************************************     
    
* DATE:		DEVELOPER			CHANGE     
----------  ----------------  ---------------------------------------     
2024/06/25	최유성				CREATED 
******************************************************************/    
  
CREATE PROCEDURE [DBO].[USP_EMP_OVERTIME_D]

	@P_ROWSTAMP  NVARCHAR(20)
  , @P_DELIMITER NVARCHAR(20)
  , @P_VALUES    NVARCHAR(4000)
  , @P_SAVEBY    NVARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;
  
    --PARSING VALUE STRING ..............................................    
    DECLARE @TBL TABLE(
        IDX   INT
    , VDATA NVARCHAR(255));
    INSERT INTO @TBL
    SELECT
        *  
    FROM   DBO.FN_GETVALUES (@P_DELIMITER, @P_VALUES);
  
    --.................................................................    
      
  
    BEGIN TRY  
    BEGIN TRAN;  
  
        DELETE FROM TB_EMP_OVERTIME WHERE ROW_STAMP = @P_ROWSTAMP  
  
        COMMIT;  
  
    END TRY  
    BEGIN CATCH  
        IF(@@TRANCOUNT > 0) ROLLBACK;  
  
        DECLARE @MSG NVARCHAR(4000);  
        SET @MSG = DBO.[FN_GETERRMSG] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());  
        RAISERROR(@MSG, 16, 1);  
    END CATCH;  
  
SET NOCOUNT OFF;  
END;  