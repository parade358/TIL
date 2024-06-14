  
/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_ATM_TEST_L
* DATE            : 2024/06/21  
* AUTHOR          : 최유성  
* PROCEDURE DESC  : 설비고장이력 조회 프로시저  
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  ---------------------------------------       
2024/06/21	최유성				Created   
******************************************************************/      
  
ALTER PROCEDURE [dbo].[USP_ATM_TEST_L]  
    @P_DATE_TYPE	VARCHAR(50)  
  , @P_START_DATE	VARCHAR(50)  
  , @P_END_DATE		VARCHAR(50)  
  , @P_EQ_TYPE		VARCHAR(50)  
  , @P_EQ_NAME		VARCHAR(50)  
AS  
BEGIN  

 SET NOCOUNT ON;  
  
  SELECT  
  --ApplyDB
        res.WORK_DATE	'@@WORK_DATE'		
	  , res.START_DTTM	'@@START_DTTM'				
	  , res.END_DTTM	'@@END_DTTM'					
	  , eq.EQ_NAME		'@@EQ_NAME'					
	  , res.EQ_MA_DESC	'@@EQ_MA_DESC'		
	  , emp.EMP_ID		'@@EMP_ID'				
	  , res.SAVE_DTTM	'@@SAVE_DTTM'		
	  , res.SAVE_BY		'@@SAVE_BY'
      
	--UserView
     , CONVERT(CHAR(10), res.WORK_DATE, 23)				'<ALIGN=CENTER> 일자'
     , FORMAT(res.START_DTTM, 'HH:mm')					'<ALIGN=CENTER> 시작시각'  
     , FORMAT(res.END_DTTM, 'HH:mm')					'<ALIGN=CENTER> 종료시각'  
     , DATEDIFF(MINUTE, res.START_DTTM, res.END_DTTM)	'<ALIGN=CENTER> 소요시간(분)'   
	 , eq.EQ_NAME										'<ALIGN=CENTER> 설비명'  
     , res.EQ_MA_DESC									'<ALIGN=CENTER> 조치내용'  
     , emp.EMP_ID										'<ALIGN=CENTER> 작업자'  
     , res.SAVE_DTTM									'<ALIGN=CENTER> 저장일시'  
     , res.SAVE_BY										'<ALIGN=CENTER> 입력자'
  FROM TB_EQ_MA_RES res WITH(NOLOCK)
  LEFT OUTER JOIN TB_EQ eq on res.EQ_ID = eq.EQ_ID
  LEFT OUTER JOIN TB_EQ_TYPE ty ON eq.EQ_TYPE_ID = ty.EQ_TYPE_ID  
  LEFT OUTER JOIN TB_EMP emp ON emp.EMP_ID = res.EMP_ID
  
 SET NOCOUNT OFF;
END