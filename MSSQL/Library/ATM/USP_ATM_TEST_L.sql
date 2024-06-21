  
/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_ATM_TEST_L
* DATE            : 2024/06/21  
* AUTHOR          : ������  
* PROCEDURE DESC  : ��������̷� ��ȸ ���ν���  
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  ---------------------------------------       
2024/06/21	������				Created   
******************************************************************/      
  
CREATE PROCEDURE [dbo].[USP_ATM_TEST_L]  
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
     , res.WORK_DATE					'<ALIGN=CENTER> ����'  
     , res.START_DTTM					'<ALIGN=CENTER> ���۽ð�'  
     , res.END_DTTM						'<ALIGN=CENTER> ����ð�'  
     , res.END_DTTM - res.START_DTTM	'<ALIGN=CENTER> �ҿ�ð�(��)'   
	 , eq.EQ_NAME						'<ALIGN=CENTER> �����'  
     , res.EQ_MA_DESC					'<ALIGN=CENTER> ��ġ����'  
     , emp.EMP_ID						'<ALIGN=CENTER> �۾���'  
     , res.SAVE_DTTM					'<ALIGN=CENTER> �����Ͻ�'  
     , res.SAVE_BY						'<ALIGN=CENTER> �Է���'
  FROM TB_EQ_MA_RES res WITH(NOLOCK)
  LEFT OUTER JOIN TB_EQ eq on res.EQ_ID = eq.EQ_ID
  LEFT OUTER JOIN TB_EQ_TYPE ty ON eq.EQ_TYPE_ID = ty.EQ_TYPE_ID  
  LEFT OUTER JOIN TB_EMP emp ON emp.EMP_ID = res.EMP_ID
  
 SET NOCOUNT OFF;
END