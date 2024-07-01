  
/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_EMP_INFO_L
* DATE            : 2024/06/26  
* AUTHOR          : 최유성  
* PROCEDURE DESC  : 사원 정보 프로시저  
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  ---------------------------------------       
2024/06/26	최유성				Created   
******************************************************************/      
  
ALTER PROCEDURE [dbo].[USP_EMP_INFO_L]
	@P_EMP_ID  VARCHAR(50)
  , @P_DEPT_ID VARCHAR(50)
  , @P_RANK_ID VARCHAR(50)
AS  
BEGIN  

 SET NOCOUNT ON;  

  SELECT  
	   emp.EMP_NAME			'사원명'
	 , dept.DEPT_NAME		'부서'
  FROM TB_EMP emp WITH(NOLOCK)
  JOIN TB_DEPT dept ON emp.DEPT_ID = dept.DEPT_ID;
  
 SET NOCOUNT OFF;
END