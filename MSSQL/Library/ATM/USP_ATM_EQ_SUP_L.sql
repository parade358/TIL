  
/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_EMP_INFO_L
* DATE            : 2024/06/26  
* AUTHOR          : ������  
* PROCEDURE DESC  : ��� ���� ���ν���  
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  ---------------------------------------       
2024/06/26	������				Created   
******************************************************************/      
  
ALTER PROCEDURE [dbo].[USP_EMP_INFO_L]
	@P_EMP_ID  VARCHAR(50)
  , @P_DEPT_ID VARCHAR(50)
  , @P_RANK_ID VARCHAR(50)
AS  
BEGIN  

 SET NOCOUNT ON;  

  SELECT  
	   emp.EMP_NAME			'�����'
	 , dept.DEPT_NAME		'�μ�'
  FROM TB_EMP emp WITH(NOLOCK)
  JOIN TB_DEPT dept ON emp.DEPT_ID = dept.DEPT_ID;
  
 SET NOCOUNT OFF;
END