/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_ATM_TEST_S
* DATE            : 2024/06/21  
* AUTHOR          : 최유성  
* PROCEDURE DESC  : 설비고장이력 저장/업데이트 프로시저  
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  ---------------------------------------       
2024/06/21	최유성				Created   
******************************************************************/   
  
ALTER PROCEDURE [dbo].[USP_ATM_TEST_S]  
    @P_KEY       VARCHAR(20)   -- @@key  
  , @P_DELIMITER VARCHAR(20)   -- 구분자  
  , @P_VALUES    VARCHAR(8000) -- 입력받은값  
  , @P_SAVEBY    VARCHAR(20)   -- 사용자아이디  
AS  
BEGIN  
SET NOCOUNT ON;  
  
    -- PARSING VALUE STRING  
    ;DECLARE @TBL TABLE(  
          IDX   INT  
        , VDATA VARCHAR(255)  
    )  
  
    ;INSERT INTO @TBL  
    SELECT A.IDX, A.vData  
    FROM dbo.fn_getValues (@P_DELIMITER, @P_VALUES) A  
  
    --.................................................................  
    --DECLARE @MSG VARCHAR(2000);  
    --SET @MSG = '1. @P_KEY(키값) :  ' + @P_KEY +  
    --           '\n2. @P_DELIMITER(구분자) :  ' + @P_DELIMITER +  
    --           '\n3. @P_VALUES(전달값) :  ' + @P_VALUES +  
    --           '\n5. @P_SAVEBY(수정자) :  ' + @P_SAVEBY   
    --BEGIN   
    --   RAISERROR(@MSG, 16,1)  
    --   RETURN 0;   
    --END   
  
    DECLARE @KEY         AS VARCHAR(255);  
    DECLARE @EQ_ID       AS VARCHAR(255);  
    DECLARE @EMP_ID      AS VARCHAR(255);  
    DECLARE @START_DTTM  AS VARCHAR(255);  
    DECLARE @END_DTTM    AS VARCHAR(255);  
    DECLARE @WORK_DATE   AS VARCHAR(255);  
    DECLARE @EQ_MA_DESC  AS VARCHAR(255);  
  
    ;SET @EQ_ID        = ( SELECT VDATA FROM @TBL WHERE IDX = 1 )  
    ;SET @EMP_ID       = ( SELECT VDATA FROM @TBL WHERE IDX = 2 )  
    ;SET @START_DTTM   = ( SELECT VDATA FROM @TBL WHERE IDX = 3 )  
    ;SET @END_DTTM     = ( SELECT VDATA FROM @TBL WHERE IDX = 4 )  
    ;SET @WORK_DATE    = ( SELECT VDATA FROM @TBL WHERE IDX = 5 )  
    ;SET @EQ_MA_DESC   = ( SELECT VDATA FROM @TBL WHERE IDX = 6 )  
  
 IF(LEN(@START_DTTM) < 14)  
  SET @START_DTTM = @START_DTTM + '00'  
  
 IF(LEN(@END_DTTM) < 14)  
  SET @END_DTTM = @END_DTTM + '00'  
      
    UPDATE A SET   
          A.EQ_ID        = @EQ_ID         
        , A.EMP_ID       = @EMP_ID        
        , A.START_DTTM   = dbo.fn_StrToDateTime(@START_DTTM)  
        , A.END_DTTM     = dbo.fn_StrToDateTime(@END_DTTM)  
        , A.WORK_DATE    = @WORK_DATE     
        , A.EQ_MA_DESC   = @EQ_MA_DESC    
        , SAVE_DTTM      = GETDATE()   
        , SAVE_BY        = @P_SAVEBY  
    FROM TB_EQ_MA_RES A WITH (NOLOCK)   
    WHERE A.EQ_MA_RES_ID = @P_KEY  
  
    IF (@@ROWCOUNT > 0)  
        RETURN;  
  
    INSERT INTO TB_EQ_MA_RES (  
          EQ_ID          
        , EMP_ID         
        , START_DTTM     
        , END_DTTM       
        , WORK_DATE      
        , EQ_MA_DESC     
        , MA_TYPE_ID   
        , CREATE_DTTM  
        , CREATE_BY  
        , SAVE_DTTM  
        , SAVE_BY  
    ) SELECT   
          @EQ_ID       EQ_ID           
        , @EMP_ID      EMP_ID         
        , dbo.fn_StrToDateTime(@START_DTTM)  START_DTTM     
        , dbo.fn_StrToDateTime(@END_DTTM)    END_DTTM       
        , @WORK_DATE   WORK_DATE      
        , @EQ_MA_DESC  EQ_MA_DESC     
        , 'PM'         MA_TYPE_ID   
        , GETDATe()    CREATE_DTTM  
        , @P_SAVEBY    CREAETE_BY  
        , GETDATE()    SAVE_DTTM  
        , @P_SAVEBY    SAVE_BY  
  
SET NOCOUNT OFF;  
END;