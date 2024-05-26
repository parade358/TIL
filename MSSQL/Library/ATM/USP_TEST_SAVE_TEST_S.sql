USE [ATM52]
GO

/****** Object:  StoredProcedure [dbo].[USP_TEST_SAVE_TEST_S]    Script Date: 2024-06-20(목) 오전 8:32:34 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


/******************************************************************      
* DATABASE        : ATM52      
* PROCEDURE NAME  : USP_TEST_SAVE_TEST_S      
* DATE            : 2024/06/18      
* AUTHOR          : 최유성      
* PROCEDURE DESC  : 설비정보 저장/업데이트 프로시저      
*******************************************************************       

* DATE:  Developer   Change       
----------  ----------------  ---------------------------------------       
2024/06/18 최유성    Created    
2024/06/19 최유성    저장 기능    
******************************************************************/      

CREATE PROCEDURE [dbo].[USP_TEST_SAVE_TEST_S]
 @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values  NVARCHAR(4000)
  , @p_saveby  NVARCHAR(20)
    
AS
BEGIN    
 SET NOCOUNT ON;    

 DECLARE @tbl TABLE(idx INT,  vData NVARCHAR(255));
 INSERT INTO @tbl

 SELECT *
 FROM dbo.fn_getValues (@p_delimiter, @p_values);
    
 DECLARE @EQ_ID varchar(50)    
 DECLARE @EQ_NAME nvarchar(255)    
 DECLARE @EQ_TYPE_ID varchar(50)    
 DECLARE @PROC_ID varchar(50)    
 DECLARE @IS_SUB_EQ int    
 DECLARE @SPEC nvarchar(255)    
 DECLARE @SN_NO nvarchar(255)    
 DECLARE @MAKE_DATE varchar(8)    
 DECLARE @SET_DATE varchar(8)    
 DECLARE @TYPE_INFO nvarchar(255)    
 DECLARE @USE_INFO nvarchar(255)    
 DECLARE @SET_INFO nvarchar(255)    
 DECLARE @MAKE_SUPPLIER nvarchar(255)    
 DECLARE @BASIC_PRICE money    
 DECLARE @SERVICE_LIFE numeric(30, 10)    
 DECLARE @DEPRECIATION numeric(30, 10)    
 DECLARE @EQ_IMAGE nvarchar(255)    
 DECLARE @FILE_SOURCE nvarchar(255)    
 DECLARE @FILE_SERVER nvarchar(255)    
 DECLARE @REMARK nvarchar(255)    
 DECLARE @VALID int  
    
 SET @EQ_ID   = ( SELECT vData FROM @tbl WHERE idx = 1 );    
 SET @EQ_NAME  = ( SELECT vData FROM @tbl WHERE idx = 2 );    
 SET @EQ_TYPE_ID  = ( SELECT vData FROM @tbl WHERE idx = 3 );    
 SET @PROC_ID  = ( SELECT vData FROM @tbl WHERE idx = 4 );    
 SET @IS_SUB_EQ  = ( SELECT vData FROM @tbl WHERE idx = 5 );    
 SET @SPEC   = ( SELECT vData FROM @tbl WHERE idx = 6 );    
 SET @SN_NO   = ( SELECT vData FROM @tbl WHERE idx = 7 );    
 SET @MAKE_DATE  = ( SELECT vData FROM @tbl WHERE idx = 8 );    
 SET @SET_DATE  = ( SELECT vData FROM @tbl WHERE idx = 9 );    
 SET @TYPE_INFO  = ( SELECT vData FROM @tbl WHERE idx = 10 );    
 SET @USE_INFO  = ( SELECT vData FROM @tbl WHERE idx = 11 );    
 SET @SET_INFO  = ( SELECT vData FROM @tbl WHERE idx = 12 );    
 SET @MAKE_SUPPLIER  = ( SELECT vData FROM @tbl WHERE idx = 13 );    
 SET @BASIC_PRICE = ( SELECT vData FROM @tbl WHERE idx = 14 );    
 SET @SERVICE_LIFE = ( SELECT vData FROM @tbl WHERE idx = 15 );    
 SET @DEPRECIATION = ( SELECT vData FROM @tbl WHERE idx = 16 );    
 SET @EQ_IMAGE  = ( SELECT vData FROM @tbl WHERE idx = 17 );    
 SET @FILE_SOURCE = ( SELECT vData FROM @tbl WHERE idx = 18 );    
 SET @FILE_SERVER = ( SELECT vData FROM @tbl WHERE idx = 19 );    
 SET @REMARK   = ( SELECT vData FROM @tbl WHERE idx = 20 );    
 SET @VALID   = ( SELECT vData FROM @tbl WHERE idx = 21 );    
    
 BEGIN TRY      
    BEGIN TRAN;    
    
      
  IF @p_rowstamp = ''    
  BEGIN    
   INSERT INTO TB_EQ (    
     EQ_ID            
   , EQ_NAME        
   , EQ_TYPE_ID      
   , PROC_ID       
   , IS_SUB_EQ    
   , SPEC       
   , SN_NO       
   , MAKE_DATE      
   , SET_DATE      
   , TYPE_INFO      
   , USE_INFO      
   , SET_INFO      
   , MAKE_SUPPLIER    
   , BASIC_PRICE      
   , SERVICE_LIFE     
   , DEPRECIATION     
   , EQ_IMAGE      
   , FILE_SOURCE      
   , FILE_SERVER      
   , REMARK     
   , VALID       
   , CREATE_DTTM      
   , SAVE_DTTM      
   , CREATE_BY      
   , SAVE_BY     
   )      
   SELECT ''       
     , @EQ_NAME      
     , @EQ_TYPE_ID      
     , @PROC_ID      
     , @IS_SUB_EQ      
     , @SPEC       
     , @SN_NO       
     , @MAKE_DATE      
     , @SET_DATE      
     , @TYPE_INFO      
     , @USE_INFO      
     , @SET_INFO      
     , @MAKE_SUPPLIER      
     , @BASIC_PRICE     
     , @SERVICE_LIFE     
     , @DEPRECIATION     
     , @EQ_IMAGE      
     , @FILE_SOURCE     
     , @FILE_SERVER     
     , @REMARK       
     , @VALID    
     , GETDATE()    
     , GETDATE()    
     , @p_saveby    
     , @p_saveby    
  END     
  ELSE    
  BEGIN    
   UPDATE TB_EQ     
   SET EQ_NAME     = @EQ_NAME      
     , EQ_TYPE_ID   = @EQ_TYPE_ID      
     , PROC_ID    = @PROC_ID      
     , IS_SUB_EQ   = @IS_SUB_EQ      
     , SPEC    = @SPEC       
     , SN_NO    = @SN_NO       
     , MAKE_DATE   = @MAKE_DATE      
     , SET_DATE   = @SET_DATE      
     , TYPE_INFO   = @TYPE_INFO      
     , USE_INFO   = @USE_INFO      
     , SET_INFO   = @SET_INFO      
     , MAKE_SUPPLIER = @MAKE_SUPPLIER      
     , BASIC_PRICE   = @BASIC_PRICE     
     , SERVICE_LIFE  = @SERVICE_LIFE     
     , DEPRECIATION  = @DEPRECIATION     
     , EQ_IMAGE   = @EQ_IMAGE      
     , FILE_SOURCE   = @FILE_SOURCE     
     , FILE_SERVER   = @FILE_SERVER     
     , REMARK    = @REMARK       
     , VALID    = @VALID  
     , SAVE_DTTM  = GETDATE()  
     , SAVE_BY    = @p_saveby  
   WHERE ROW_STAMP = @p_rowstamp   
  END    
      
  COMMIT;      
    
 END TRY      
    BEGIN CATCH      
        IF(@@TRANCOUNT > 0) ROLLBACK;      
      
        DECLARE @MSG NVARCHAR(4000);      
        SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());      
        RAISERROR(@MSG, 16, 1);      
    END CATCH;     
     
 SET NOCOUNT OFF;    
END;
GO


