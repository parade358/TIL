/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_EMP_OVERTIME_S
* DATE            : 2024/06/25  
* AUTHOR          : 최유성  
* PROCEDURE DESC  : 초과근무 저장/업데이트 프로시저  
*******************************************************************       
      
* DATE:		DEVELOPER			CHANGE  
----------  ----------------  ---------------------------------------       
2024/06/25	최유성				CREATED   
******************************************************************/   

ALTER PROCEDURE [DBO].[USP_EMP_OVERTIME_S]
	@P_ROWSTAMP  VARCHAR(20)   -- @@KEY
  , @P_DELIMITER VARCHAR(20)   -- 구분자
  , @P_VALUES    VARCHAR(8000) -- 입력받은값
  , @P_SAVEBY    VARCHAR(20)   -- 사용자아이디
AS  
BEGIN  
SET NOCOUNT ON;  
  
    DECLARE @TBL TABLE( IDX INT, VDATA VARCHAR(255) )  
  
    INSERT INTO @TBL
    SELECT A.IDX, A.VDATA
    FROM DBO.FN_GETVALUES (@P_DELIMITER, @P_VALUES) A

    DECLARE @REASON       AS VARCHAR(255);
  
    SET @REASON = ( SELECT VDATA FROM @TBL WHERE IDX = 1 )

   BEGIN TRY      
    BEGIN TRAN;    
    
      
  IF @P_ROWSTAMP = ''    
  BEGIN    
   INSERT INTO TB_EMP_OVERTIME (
     EMP_NAME
   , REASON
   , START_OVERTIME
   , END_OVERTIME
   , TOTAL_OVERTIME
   , CREATE_DTTM
   , SAVE_DTTM
   , CREATE_BY
   , SAVE_BY
   , OVERTIME_STATUS
   )
   SELECT
	   @P_SAVEBY
     , @REASON
	 , NULL
	 , NULL
	 , NULL
     , GETDATE()
     , GETDATE()
     , @P_SAVEBY
	 , @P_SAVEBY
	 , 'R'
	 
  END
  ELSE
  BEGIN
   UPDATE TB_EMP_OVERTIME
   SET REASON		= @REASON
     , SAVE_DTTM	= GETDATE()
     , SAVE_BY		= @P_SAVEBY
   WHERE ROW_STAMP	= @P_ROWSTAMP
  END

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