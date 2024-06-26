  
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

 DECLARE @START NVARCHAR(20)    
 DECLARE @END  NVARCHAR(20)    
      
    SET @START= CASE @P_DATE_TYPE WHEN 0 THEN @P_START_DATE    
                             WHEN 1 THEN CONVERT(NVARCHAR,GETDATE(),112)    
                             WHEN 7 THEN CONVERT(NVARCHAR,GETDATE()-6,112) END    
      
    SET @END=CASE @P_DATE_TYPE WHEN 0 THEN @P_END_DATE    
                          ELSE CONVERT(NVARCHAR,GETDATE(),112) END   
  
  SELECT  
  --ApplyDB
		res.EQ_ID		'@@EQ_ID'
	  , emp.EMP_ID		'@@EMP_ID'				
	  , res.START_DTTM	'@@START_DTTM'				
	  , res.END_DTTM	'@@END_DTTM'					
      , res.WORK_DATE	'@@WORK_DATE'		
	  , res.EQ_MA_DESC	'@@EQ_MA_DESC'
	  , res.EQ_MA_RES_ID '@@KEY'
      
	--UserView
     , STUFF(STUFF(res.WORK_DATE, 5, 0, '-'), 8, 0, '-') '<ALIGN=CENTER> 일자'
     , FORMAT(res.START_DTTM, 'HH:mm')					 '<ALIGN=CENTER> 시작시각'  
     , FORMAT(res.END_DTTM, 'HH:mm')					 '<ALIGN=CENTER> 종료시각'  
     , DATEDIFF(MINUTE, res.START_DTTM, res.END_DTTM)	 '<ALIGN=CENTER> 소요시간(분)'   
	 , eq.EQ_NAME										 '<ALIGN=CENTER> 설비명'  
     , res.EQ_MA_DESC									 '<ALIGN=CENTER> 조치내용'  
	 , '<tag><a class="link_btn" href="javascript:showPopupWindow(500,500,''../common/dataview.aspx?SQL=USP_ATM_POPUP_EMP_INFO_L&KEYS=' + emp.EMP_ID + ''' ,''작업자정보'',true)">'+ emp.EMP_ID +'</a>'  '<ALIGN=CENTER> 작업자'
     , res.SAVE_DTTM									 '<ALIGN=CENTER> 저장일시'  
     , res.SAVE_BY										 '<ALIGN=CENTER> 입력자'
  FROM TB_EQ_MA_RES res WITH(NOLOCK)
  LEFT OUTER JOIN TB_EQ eq on res.EQ_ID = eq.EQ_ID
  LEFT OUTER JOIN TB_EQ_TYPE ty ON eq.EQ_TYPE_ID = ty.EQ_TYPE_ID  
  LEFT OUTER JOIN TB_EMP emp ON emp.EMP_ID = res.EMP_ID
  WHERE res.MA_TYPE_ID ='PM'  
      AND res.WORK_DATE BETWEEN @START AND @END    
      AND CASE WHEN @P_EQ_TYPE<>'*' THEN CASE WHEN eq.EQ_TYPE_ID=@P_EQ_TYPE THEN 1 ELSE 0 END    
                                          ELSE 1 END =1      
      AND CASE WHEN @P_EQ_NAME<>'*' THEN CASE WHEN res.EQ_ID=@P_EQ_NAME THEN 1 ELSE 0 END    
                                            ELSE 1 END =1      
    ORDER BY res.WORK_DATE, res.START_DTTM;  
  
 SET NOCOUNT OFF;
END