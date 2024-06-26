/******************************************************************  
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_ATM_EQ_CHART_L
* DATE            : 2024/06/25  
* AUTHOR          : 최유성  
* PROCEDURE DESC  : 설비가격 차트 프로시저  
*******************************************************************       
      
* DATE:		Developer			Change  
----------  ----------------  ---------------------------------------       
2024/06/25	최유성				Created
******************************************************************/    

CREATE PROCEDURE [dbo].[USP_ATM_EQ_CHART_L]
    @EQ_NAME VARCHAR(255)
AS
BEGIN
SET NOCOUNT ON;
    SELECT
          EQ_NAME '설비명'
        , BASIC_PRICE '가격'
    FROM TB_EQ WITH (NOLOCK)
    WHERE ( ISNULL(@EQ_NAME,'*') = '*' OR EQ_NAME LIKE @EQ_NAME + '%' )
    GROUP BY EQ_NAME
        , BASIC_PRICE
SET NOCOUNT OFF;
END;