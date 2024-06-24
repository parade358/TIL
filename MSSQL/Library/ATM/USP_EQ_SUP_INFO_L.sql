USE [ATM52]
GO
/****** Object:  StoredProcedure [dbo].[USP_TEST_LOAD_TEST_L]    Script Date: 2024-06-20(��) ���� 9:20:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM52
* PROCEDURE NAME  : USP_EQ_SUP_INFO_L
* DATE            : 2024/06/18
* AUTHOR          : ������
* PROCEDURE DESC  : �������� ��ȸ ���ν��� (������)
*******************************************************************     
    
* DATE:		Developer			Change
----------  ----------------  ---------------------------------------     
2024/06/18	������				Created
2024/06/19	������				��������, ���� �̸����� ��ȸ
2024/06/20	������				�̹��� ���� ��ȸ
			������				��ȸ������ ���� �ο�
2024/06/21  ������				��ȸ���� �ο�
******************************************************************/    

ALTER PROCEDURE [dbo].[USP_EQ_SUP_INFO_L]

AS

BEGIN

 SET NOCOUNT ON;

  SELECT
  --ApplyDB
     eq.EQ_ID			'@@eq_id'
   , eq.EQ_NAME			'@@eq_name'
   , eq.EQ_TYPE_ID		'@@eq_type_id'
   , eq.PROC_ID			'@@proc_id'
   , eq.IS_SUB_EQ		'@@is_sub_eq'
   , eq.SPEC			'@@spec'
   , eq.SN_NO			'@@sn_no'
   , eq.MAKE_DATE		'@@make_date'
   , eq.SET_DATE		'@@set_date'
   , eq.TYPE_INFO		'@@type_info'
   , eq.USE_INFO		'@@use_info'
   , eq.SET_INFO		'@@set_info'
   , eq.MAKE_SUPPLIER	'@@make_supplier'
   , eq.BASIC_PRICE		'@@basic_price'
   , eq.SERVICE_LIFE	'@@service_life'
   , eq.DEPRECIATION	'@@depreciation'
   , eq.EQ_IMAGE		'@@eq_image'
   , eq.FILE_SOURCE		'@@file_source'
   , eq.FILE_SERVER		'@@file_server'
   , eq.REMARK			'@@remark'
   , eq.VALID			'@@valid'
   , eq.ROW_STAMP		'@@key'
   , eq.MAKE_SUPPLIER	'@@PARAM'
    
  --UserView
     , eq.EQ_ID						'<ALIGN=CENTER> �����ڵ�'
     , eq.EQ_NAME					'<ALIGN=CENTER> �����'
     , ty.EQ_TYPE_NAME				'<ALIGN=CENTER> ��������'
     , pr.PROC_NAME					'<ALIGN=CENTER> ����'
	 , CASE WHEN eq.IS_SUB_EQ = '0' 
			THEN 'X' ELSE 'O' END	'<ALIGN=CENTER> �δ뼳�񿩺�(1)'
     , eq.SPEC						'<ALIGN=CENTER> �԰�'
     , eq.SN_NO						'<ALIGN=CENTER> �Ϸù�ȣ'
     , eq.MAKE_DATE					'<ALIGN=CENTER> ��������'
     , eq.SET_DATE					'<ALIGN=CENTER> ��ġ����'
     , eq.TYPE_INFO					'<ALIGN=CENTER> ����'
     , eq.USE_INFO					'<ALIGN=CENTER> ����뵵'
     , eq.SET_INFO					'<ALIGN=CENTER> ��ġ�뵵'
     , ms.EQ_SUPPLIER_NAME			'<ALIGN=CENTER> ������'

     , '��' + REPLACE(CONVERT(VARCHAR,CONVERT(MONEY,eq.BASIC_PRICE),1), '.00', '') '<ALIGN=CENTER> ��氡��'

     , FORMAT(eq.SERVICE_LIFE, '##0.##########') + '��' '<ALIGN=CENTER> ���뿬��'
     , FORMAT(eq.DEPRECIATION, '##0.##########') + '%' '<ALIGN=CENTER> �����󰢷�'

	 , CASE WHEN isnull(eq.EQ_IMAGE, '') <> '' 
			THEN '<tag>'++'<a class="link_btn" href="javascript:showImage('''+CAST(eq.EQ_IMAGE AS NVARCHAR(255))+''')">VIEW</a>' 
			ELSE ''
			END						'<ALIGN=CENTER> �����̹���'
     , eq.REMARK					'<ALIGN=CENTER> ���'
     , CASE WHEN eq.VALID = '0' 
			THEN 'X' 
			ELSE 'O' 
			END						'<ALIGN=CENTER> ��뿩��'
     , eq.CREATE_DTTM				'<ALIGN=CENTER> �����Ͻ�'
     , eq.SAVE_DTTM					'<ALIGN=CENTER> �����Ͻ�'
     , eq.CREATE_BY					'<ALIGN=CENTER> ������'
     , eq.SAVE_BY					'<ALIGN=CENTER> ������'
  FROM TB_EQ eq WITH(NOLOCK)
  LEFT OUTER JOIN TB_EQ_TYPE ty ON eq.EQ_TYPE_ID = ty.EQ_TYPE_ID
  LEFT OUTER JOIN UTB_PROC pr ON eq.PROC_ID = pr.PROC_ID
  LEFT OUTER JOIN TB_EQ_MAKE_SUPPLIER ms ON eq.MAKE_SUPPLIER = ms.EQ_SUPPLIER_ID

 SET NOCOUNT OFF;
END 

SELECT MAKE_SUPPLIER, COUNT(*) AS COUNT
FROM TB_EQ
GROUP BY MAKE_SUPPLIER;