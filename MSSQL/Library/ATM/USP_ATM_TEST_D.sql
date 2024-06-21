  
/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_ATM_TEST_D
* DATE            : 2024/06/21  
* AUTHOR          : ������  
* PROCEDURE DESC  : ��������̷� ���� ���ν���  
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  ---------------------------------------       
2024/06/21	������				Created   
******************************************************************/    
  
ALTER PROCEDURE [dbo].[USP_ATM_TEST_D]  
    @P_KEY       VARCHAR(20)  
  , @P_DELIMITER VARCHAR(20)  
  , @P_VALUES    VARCHAR(8000)  
  , @P_SAVEBY    VARCHAR(20)  
AS  
BEGIN  
SET NOCOUNT ON;  
  
    --DECLARE @MSG VARCHAR(2000);  
    --SET @MSG = '1. @P_KEY(Ű��) :  ' + @P_KEY +  
    --           '\n2. @P_DELIMITER(������) :  ' + @P_DELIMITER +  
    --           '\n3. @P_VALUES(���ް�) :  ' + @P_VALUES +  
    --           '\n5. @P_SAVEBY(������) :  ' + @P_SAVEBY   
    --BEGIN   
    --RAISERROR(@MSG, 16,1)  
    --RETURN 0;   
    --END   
  
    DELETE A FROM TB_EQ_MA_RES A WHERE A.EQ_MA_RES_ID = @P_KEY;  
      
SET NOCOUNT OFF;  
END;