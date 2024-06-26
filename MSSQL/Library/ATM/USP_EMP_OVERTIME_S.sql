/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_EMP_OVERTIME_S
* DATE            : 2024/06/25  
* AUTHOR          : ������  
* PROCEDURE DESC  : �ʰ��ٹ� ����/������Ʈ ���ν���  
*******************************************************************       
      
* DATE:		DEVELOPER			CHANGE  
----------  ----------------  ---------------------------------------       
2024/06/25	������				CREATED   
******************************************************************/   

ALTER PROCEDURE [DBO].[USP_EMP_OVERTIME_S]
	@P_ROWSTAMP  VARCHAR(20)   -- @@KEY
  , @P_DELIMITER VARCHAR(20)   -- ������
  , @P_VALUES    VARCHAR(8000) -- �Է¹�����
  , @P_SAVEBY    VARCHAR(20)   -- ����ھ��̵�
AS  
BEGIN  
SET NOCOUNT ON;  
  
    DECLARE @TBL TABLE( IDX INT, VDATA VARCHAR(255) )  
	DECLARE @MSG NVARCHAR(4000); 
  
    INSERT INTO @TBL
    SELECT A.IDX, A.VDATA
    FROM DBO.FN_GETVALUES (@P_DELIMITER, @P_VALUES) A

    DECLARE @REASON			AS VARCHAR(255);
	DECLARE @OVERTIME_DATE	AS VARCHAR(8);
  
    SET @REASON			= ( SELECT VDATA FROM @TBL WHERE IDX = 1 )
    SET @OVERTIME_DATE	= ( SELECT VDATA FROM @TBL WHERE IDX = 2 )

   BEGIN TRY      
    BEGIN TRAN;    
    
      
  IF @P_ROWSTAMP = ''  
   BEGIN
   IF (SELECT COUNT(EMP_NAME) FROM TB_EMP_OVERTIME WHERE OVERTIME_DATE = @OVERTIME_DATE AND EMP_NAME = @P_SAVEBY) > 0
	BEGIN
		ROLLBACK;     
		SET @MSG = '���� ��¥�� ��ϵ� �ʰ��ٹ��� �ֽ��ϴ�.'
		RAISERROR(@MSG, 16, 1);
	END
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
   , OVERTIME_DATE
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
	 , @OVERTIME_DATE
	 
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
        SET @MSG = DBO.[FN_GETERRMSG] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());      
        RAISERROR(@MSG, 16, 1);      
    END CATCH;    
  
SET NOCOUNT OFF;  
END;