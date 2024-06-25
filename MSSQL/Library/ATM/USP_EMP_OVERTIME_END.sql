/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_EMP_OVERTIME_END
* DATE            : 2024/06/25  
* AUTHOR          : ������  
* PROCEDURE DESC  : �ʰ��ٹ� ���� ���ν���  
*******************************************************************       
      
* DATE:		DEVELOPER			CHANGE  
----------  ----------------  ---------------------------------------       
2024/06/25	������				CREATED   
******************************************************************/  

CREATE PROCEDURE [dbo].[USP_EMP_OVERTIME_END]  
	@P_TERM				VARCHAR(20)
  , @START_DATE			VARCHAR(20)
  , @END_DATE			VARCHAR(20)
  , @OVERTIME_STATUS	VARCHAR(20)
  , @P_ROW_STAMP		VARCHAR(20)  
  , @P_SAVEBY			VARCHAR(20)  
AS  
BEGIN  
SET NOCOUNT ON;  

	DECLARE @TMPSTR VARCHAR(MAX);  
    SET @TMPSTR = REPLACE(@P_ROW_STAMP, '''', '');
  
    UPDATE TB_EMP_OVERTIME
	SET END_OVERTIME = FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm')
    WHERE ROW_STAMP = @TMPSTR;
  
SET NOCOUNT OFF;  
END;  