    
/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_EMP_OVERTIME_L
* DATE            : 2024/06/24  
* AUTHOR          : ������  
* PROCEDURE DESC  : �ʰ��ٹ� ��ȸ ���ν���  
*******************************************************************       
      
* DATE:		DEVELOPER			CHANGE  
----------  ----------------  ---------------------------------------       
2024/06/24	������				CREATED   
******************************************************************/ 

ALTER PROCEDURE [DBO].[USP_EMP_OVERTIME_L]  
    @P_TERM				VARCHAR(20)
  , @START_DATE			VARCHAR(20)
  , @END_DATE			VARCHAR(20)
  , @OVERTIME_STATUS	VARCHAR(20)
AS  
BEGIN   
    SET NOCOUNT ON;  

    DECLARE @START	VARCHAR(20);  
    DECLARE @END	VARCHAR(20);  

    SET @START	= '19000101';  
    SET @START	= CASE @P_TERM WHEN 0 THEN @START_DATE
                               WHEN 1 THEN CONVERT(VARCHAR, GETDATE(), 112)
                               WHEN 7 THEN CONVERT(VARCHAR, GETDATE() - 6, 112)  
				  END;  
	SET @END = CASE @P_TERM WHEN 0 THEN @END_DATE ELSE CONVERT(NVARCHAR,GETDATE(),112) END
    
    SELECT 
	--APPLYDB
		   REASON			'@@REASON'
		 , OVERTIME_DATE	'@@OVERTIME_DATE'
		 , ROW_STAMP		'@@KEY'
		 , ROW_STAMP		'@@CHECK'

	--USERVIEW
		 , EMP_NAME														'<ALIGN=CENTER;>�����'                                          
         , REASON														'<ALIGN=CENTER;>�ʰ��ٹ�����'
		 , OVERTIME_DATE												'<ALIGN=CENTER;>�ʰ��ٹ���¥'
         , CONVERT(VARCHAR(10), CAST(START_OVERTIME AS DATE), 120)		'<ALIGN=CENTER;>���۽ð�'
         , END_OVERTIME													'<ALIGN=CENTER;>����ð�'
         , TOTAL_OVERTIME												'<ALIGN=CENTER;>�� �ð�'
         , CASE WHEN OVERTIME_STATUS = 'R'
				THEN '<ALIGN=CENTER;FONT-WEIGHT=BOLD;COLOR=BLUE>���'
                WHEN OVERTIME_STATUS = 'S'
				THEN '<ALIGN=CENTER;FONT-WEIGHT=BOLD;COLOR=RED>����'
                WHEN OVERTIME_STATUS = 'C'
				THEN '<ALIGN=CENTER;FONT-WEIGHT=BOLD;COLOR=GREEN>�Ϸ�'
           END															'<ALIGN=CENTER;>�������'
    FROM TB_EMP_OVERTIME
    WHERE OVERTIME_DATE BETWEEN @START_DATE AND @END_DATE AND OVERTIME_STATUS = @OVERTIME_STATUS
  
SET NOCOUNT OFF;  
END;