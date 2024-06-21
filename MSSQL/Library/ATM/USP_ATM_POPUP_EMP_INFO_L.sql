  
/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_ATM_POPUP_EMP_INFO_L
* DATE            : 2024/06/21  
* AUTHOR          : 최유성  
* PROCEDURE DESC  : 설비고장이력 작업자 정보 조회 팝업 프로시저
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  ---------------------------------------       
2024/06/21	최유성				Created   
******************************************************************/ 

CREATE PROCEDURE [dbo].[USP_ATM_POPUP_EMP_INFO_L]    
    @P_EMP_ID VARCHAR(20)  
	
AS BEGIN  
SET NOCOUNT ON    
     
    SELECT EMP_ID     "사원번호"  
        ,  EMP_NAME   "사원명"
    FROM TB_EMP  WITH (NOLOCK)   
    WHERE EMP_ID = @P_EMP_ID   
      
SET NOCOUNT OFF  
END