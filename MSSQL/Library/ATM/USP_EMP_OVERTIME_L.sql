    
/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_EMP_OVERTIME_L
* DATE            : 2024/06/24  
* AUTHOR          : 최유성  
* PROCEDURE DESC  : 초과근무 조회 프로시저  
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  ---------------------------------------       
2024/06/24	최유성				Created   
******************************************************************/ 

ALTER PROCEDURE [dbo].[USP_EMP_OVERTIME_L]  
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
    SET @END	= CONVERT(VARCHAR, CAST(@END_DATE AS DATETIME) + 1, 112);  
    SET @START	= CASE @P_TERM WHEN 0 THEN @START_DATE  
                               WHEN 1 THEN CONVERT(VARCHAR, GETDATE(), 112)  
                               WHEN 7 THEN CONVERT(VARCHAR, GETDATE() - 6, 112)  
				  END;  
    
    SELECT 
	--ApplyDB
		   REASON	'@@REASON'

	--UserView
		 , EMP_NAME																		'사원명'                                          
         , REASON																		'초과근무사유'
         , '<ALIGN=CENTER;>'+CONVERT(VARCHAR(10), CAST(START_OVERTIME AS DATE), 120)	'시작시간'
         , END_OVERTIME																	'종료시간'
         , TOTAL_OVERTIME																'총 시간'
         , CASE WHEN OVERTIME_STATUS = 'R'
				THEN '<align=center;font-weight=bold;color=blue>대기'
                WHEN OVERTIME_STATUS = 'S'
				THEN '<align=center;font-weight=bold;color=red>진행'
                WHEN OVERTIME_STATUS = 'C'
				THEN '<align=center;font-weight=bold;color=green>완료'
           END																			'진행상태'
         , ( SELECT EMP_NAME FROM TB_EMP WITH (NOLOCK) WHERE EMP_ID = CREATE_BY )		'작성자'
         , CREATE_DTTM																	'작성일시'
         , ( SELECT EMP_NAME FROM TB_EMP WITH (NOLOCK) WHERE EMP_ID = SAVE_BY )			'수정자'
         , SAVE_DTTM																	'수정일시'
    FROM TB_EMP_OVERTIME
    WHERE CREATE_DTTM BETWEEN @START_DATE AND @END_DATE AND ( ISNULL(@OVERTIME_STATUS, '*') = '*' OR OVERTIME_STATUS = @OVERTIME_STATUS )

SET NOCOUNT OFF;
END;