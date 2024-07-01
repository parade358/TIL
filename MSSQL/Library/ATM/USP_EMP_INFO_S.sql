    
/******************************************************************          
* DATABASE        : ATM52          
* PROCEDURE NAME  : USP_EMP_INFO_S        
* DATE            : 2024/06/18          
* AUTHOR          : 최유성          
* PROCEDURE DESC  : 유저페이지 사원정보 저장/업데이트 프로시저          
*******************************************************************           
    
* DATE:		Developer			Change           
----------  ----------------  ---------------------------------------           
2024/07/01	최유성				Created        
******************************************************************/          
    
ALTER PROCEDURE [DBO].[USP_EMP_INFO_S]    
	@P_ROWSTAMP		NVARCHAR(50)    
  , @P_EMP_NAME		NVARCHAR(50)    
  , @P_DEPT_ID		NVARCHAR(50)    
  , @P_EMP_RANK		NVARCHAR(50)    
  , @P_SAVE_BY		NVARCHAR(50)
        
AS    
BEGIN        
 SET NOCOUNT ON;        
        
 BEGIN TRY          
    BEGIN TRAN;        
        
  
  IF @P_ROWSTAMP IS NULL        
  BEGIN        
   INSERT INTO dbo.TB_EMP
   (
       EMP_ID,
       EMP_NAME,
       PLANT_ID,
       DEPT_ID,
       STAMP_IMAGE,
       EMP_NO,
       AUTH_ID,
       IS_ADMIN,
       PW,
       TEL_INFO,
       ADDR_INFO,
       REMARK,
       VALID,
       CREATE_DTTM,
       SAVE_DTTM,
       CREATE_BY,
       SAVE_BY,
       EMP_RANK
   )
   VALUES
   (   N'',     -- EMP_ID - nvarchar(20)
       NULL,    -- EMP_NAME - nvarchar(255)
       DEFAULT, -- PLANT_ID - varchar(50)
       NULL,    -- DEPT_ID - nvarchar(20)
       NULL,    -- STAMP_IMAGE - nvarchar(255)
       NULL,    -- EMP_NO - nvarchar(50)
       N'',     -- AUTH_ID - nvarchar(20)
       DEFAULT, -- IS_ADMIN - int
       DEFAULT, -- PW - varbinary(128)
       NULL,    -- TEL_INFO - nvarchar(255)
       NULL,    -- ADDR_INFO - nvarchar(255)
       NULL,    -- REMARK - nvarchar(255)
       DEFAULT, -- VALID - int
       DEFAULT, -- CREATE_DTTM - datetime
       DEFAULT, -- SAVE_DTTM - datetime
       NULL,    -- CREATE_BY - nvarchar(20)
       NULL,    -- SAVE_BY - nvarchar(20)
       NULL     -- EMP_RANK - varchar(20)
       ) 
  END         
  ELSE        
  BEGIN        
	UPDATE dbo.TB_EMP
	SET EMP_NAME = @P_EMP_NAME
	  , DEPT_ID  = @P_DEPT_ID
	  , EMP_RANK = @P_EMP_RANK
	  , SAVE_DTTM = GETDATE()
	  , SAVE_BY = @P_SAVE_BY
	WHERE ROW_STAMP = CAST(@P_ROWSTAMP AS INT)
  END        
          
  COMMIT;          
        
 END TRY          
    BEGIN CATCH          
        IF(@@TRANCOUNT > 0) ROLLBACK;          
          
        DECLARE @MSG NVARCHAR(4000);          
        SET @MSG = DBO.[FN_GETERRMSG] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());          
        RAISERROR(@MSG, 16, 1);          
    END CATCH;         
         
 SET NOCOUNT OFF;    
 
END;

COMMIT
