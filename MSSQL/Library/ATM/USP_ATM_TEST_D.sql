  
/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_ATM_TEST_D
* DATE            : 2024/06/21  
* AUTHOR          : 최유성  
* PROCEDURE DESC  : 설비고장이력 삭제 프로시저  
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  -----G----------------------------------       
2024/06/21	최유성				Created   
******************************************************************/    
  
ALTER PROCEDURE [dbo].[USP_ATM_TEST_D]  
    @P_KEY       VARCHAR(20)  
  , @P_DELIMITER VARCHAR(20)  
  , @P_VALUES    VARCHAR(8000)  
  , @P_SAVEBY    VARCHAR(20)  
AS  
BEGIN  
SET NOCOUNT ON;     
 
    DELETE A FROM TB_EQ_MA_RES A WHERE A.EQ_MA_RES_ID = @P_KEY;  
      
SET NOCOUNT OFF;  
END;