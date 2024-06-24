  
/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_ATM_EQ_SUP_L
* DATE            : 2024/06/21  
* AUTHOR          : 최유성  
* PROCEDURE DESC  : 설비제조사 조회 프로시저  
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  ---------------------------------------       
2024/06/24	최유성				Created   
******************************************************************/      
  
ALTER PROCEDURE [dbo].[USP_ATM_EQ_SUP_L]
AS  
BEGIN  

 SET NOCOUNT ON;  

  SELECT  
  --ApplyDB
		EQ_SUPPLIER_ID		'@@EQ_SUPPLIER_ID'
	  , EQ_SUPPLIER_NAME	'@@EQ_SUPPLIER_NAME'			
	  , EQ_SUPPLIER_LOC		'@@EQ_SUPPLIER_LOC'				
      , REMARK				'@@REMARK'		
	  , VALID				'@@VALID'
	  , ROW_STAMP			'@@KEY'
      
	--UserView
     , EQ_SUPPLIER_ID	'<ALIGN=CENTER> 제조사코드'
	 , EQ_SUPPLIER_NAME	'<ALIGN=CENTER> 제조사명'  
     , EQ_SUPPLIER_LOC	'<ALIGN=CENTER> 제조사위치'  
	 , REMARK			'<ALIGN=CENTER> 비고'
     , VALID			'<ALIGN=CENTER> 사용여부'  
     , SAVE_BY			'<ALIGN=CENTER> 입력자'
  FROM TB_EQ_MAKE_SUPPLIER WITH(NOLOCK)
  
 SET NOCOUNT OFF;
END