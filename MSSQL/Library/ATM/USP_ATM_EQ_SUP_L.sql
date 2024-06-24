  
/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_ATM_EQ_SUP_L
* DATE            : 2024/06/21  
* AUTHOR          : ������  
* PROCEDURE DESC  : ���������� ��ȸ ���ν���  
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  ---------------------------------------       
2024/06/24	������				Created   
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
     , EQ_SUPPLIER_ID	'<ALIGN=CENTER> �������ڵ�'
	 , EQ_SUPPLIER_NAME	'<ALIGN=CENTER> �������'  
     , EQ_SUPPLIER_LOC	'<ALIGN=CENTER> ��������ġ'  
	 , REMARK			'<ALIGN=CENTER> ���'
     , VALID			'<ALIGN=CENTER> ��뿩��'  
     , SAVE_BY			'<ALIGN=CENTER> �Է���'
  FROM TB_EQ_MAKE_SUPPLIER WITH(NOLOCK)
  
 SET NOCOUNT OFF;
END