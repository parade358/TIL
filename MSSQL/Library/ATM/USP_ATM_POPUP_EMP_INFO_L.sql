  
/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_ATM_POPUP_EMP_INFO_L
* DATE            : 2024/06/21  
* AUTHOR          : ������  
* PROCEDURE DESC  : ��������̷� �۾��� ���� ��ȸ �˾� ���ν���
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  ---------------------------------------       
2024/06/21	������				Created   
******************************************************************/ 

CREATE PROCEDURE [dbo].[USP_ATM_POPUP_EMP_INFO_L]    
    @P_EMP_ID VARCHAR(20)  
	
AS BEGIN  
SET NOCOUNT ON    
     
    SELECT EMP_ID     "�����ȣ"  
        ,  EMP_NAME   "�����"
    FROM TB_EMP  WITH (NOLOCK)   
    WHERE EMP_ID = @P_EMP_ID   
      
SET NOCOUNT OFF  
END