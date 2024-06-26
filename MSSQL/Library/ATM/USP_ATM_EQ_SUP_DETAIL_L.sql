
/******************************************************************
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_ATM_EQ_SUP_DETAIL_L
* DATE            : 2024/06/21  
* AUTHOR          : 최유성  
* PROCEDURE DESC  : 설비제조사 상세 조회 프로시저  
*******************************************************************
      
* DATE:		Developer			Change  
----------  ----------------  -------------------------------------
2024/06/24	최유성				Created   
******************************************************************/
  
ALTER PROCEDURE [dbo].[USP_ATM_EQ_SUP_DETAIL_L]
    @P_EQ_SUPPLIER_ID VARCHAR(20)  --@@PARAM으로 받은값
AS
BEGIN
SET NOCOUNT ON;

    SELECT EQ_SUPPLIER_ID	'제조사번호'
		 , EQ_SUPPLIER_NAME '제조사명'
		 , EQ_SUPPLIER_LOC	'제조사위치'
		 , REMARK			'비고'
		 , VALID			'사용여부'
		 , SAVE_DTTM		'저장일자'
		 ,SAVE_BY			'저장자'
    FROM TB_EQ_MAKE_SUPPLIER D WITH (NOLOCK)
    WHERE EQ_SUPPLIER_ID = @P_EQ_SUPPLIER_ID;
  
SET NOCOUNT OFF;
END;