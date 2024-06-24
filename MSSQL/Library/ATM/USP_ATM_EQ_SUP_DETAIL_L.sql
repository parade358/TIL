
/******************************************************************
* DATABASE        : ATM52  
* PROCEDURE NAME  : USP_ATM_EQ_SUP_DETAIL_L
* DATE            : 2024/06/21  
* AUTHOR          : ������  
* PROCEDURE DESC  : ���������� �� ��ȸ ���ν���  
*******************************************************************
      
* DATE:		Developer			Change  
----------  ----------------  -------------------------------------
2024/06/24	������				Created   
******************************************************************/
  
CREATE PROCEDURE [dbo].[USP_ATM_EQ_SUP_DETAIL_L]
    @P_EQ_SUPPLIER_ID VARCHAR(20)  --@@PARAM���� ������
AS
BEGIN
SET NOCOUNT ON;

    SELECT EQ_SUPPLIER_ID	'�������ȣ'
		 , EQ_SUPPLIER_NAME '�������'
		 , EQ_SUPPLIER_LOC	'��������ġ'

    FROM TB_EQ_MAKE_SUPPLIER D WITH (NOLOCK)
    WHERE EQ_SUPPLIER_ID = @P_EQ_SUPPLIER_ID;
  
SET NOCOUNT OFF;
END;