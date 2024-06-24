USE [ATM52]
GO
/****** Object:  StoredProcedure [dbo].[USP_TEST_LOAD_TEST_L]    Script Date: 2024-06-20(목) 오전 9:20:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM52
* PROCEDURE NAME  : USP_EQ_SUP_INFO_L
* DATE            : 2024/06/18
* AUTHOR          : 최유성
* PROCEDURE DESC  : 설비정보 조회 프로시저 (제조사)
*******************************************************************     
    
* DATE:		Developer			Change
----------  ----------------  ---------------------------------------     
2024/06/18	최유성				Created
2024/06/19	최유성				설비유형, 공정 이름으로 조회
2024/06/20	최유성				이미지 파일 조회
			최유성				조회데이터 단위 부여
2024/06/21  최유성				조회조건 부여
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
     , eq.EQ_ID						'<ALIGN=CENTER> 설비코드'
     , eq.EQ_NAME					'<ALIGN=CENTER> 설비명'
     , ty.EQ_TYPE_NAME				'<ALIGN=CENTER> 설비유형'
     , pr.PROC_NAME					'<ALIGN=CENTER> 공정'
	 , CASE WHEN eq.IS_SUB_EQ = '0' 
			THEN 'X' ELSE 'O' END	'<ALIGN=CENTER> 부대설비여부(1)'
     , eq.SPEC						'<ALIGN=CENTER> 규격'
     , eq.SN_NO						'<ALIGN=CENTER> 일련번호'
     , eq.MAKE_DATE					'<ALIGN=CENTER> 제조일자'
     , eq.SET_DATE					'<ALIGN=CENTER> 설치일자'
     , eq.TYPE_INFO					'<ALIGN=CENTER> 형식'
     , eq.USE_INFO					'<ALIGN=CENTER> 설비용도'
     , eq.SET_INFO					'<ALIGN=CENTER> 설치용도'
     , ms.EQ_SUPPLIER_NAME			'<ALIGN=CENTER> 제조사'

     , '￦' + REPLACE(CONVERT(VARCHAR,CONVERT(MONEY,eq.BASIC_PRICE),1), '.00', '') '<ALIGN=CENTER> 취득가격'

     , FORMAT(eq.SERVICE_LIFE, '##0.##########') + '년' '<ALIGN=CENTER> 내용연수'
     , FORMAT(eq.DEPRECIATION, '##0.##########') + '%' '<ALIGN=CENTER> 감가상각률'

	 , CASE WHEN isnull(eq.EQ_IMAGE, '') <> '' 
			THEN '<tag>'++'<a class="link_btn" href="javascript:showImage('''+CAST(eq.EQ_IMAGE AS NVARCHAR(255))+''')">VIEW</a>' 
			ELSE ''
			END						'<ALIGN=CENTER> 설비이미지'
     , eq.REMARK					'<ALIGN=CENTER> 비고'
     , CASE WHEN eq.VALID = '0' 
			THEN 'X' 
			ELSE 'O' 
			END						'<ALIGN=CENTER> 사용여부'
     , eq.CREATE_DTTM				'<ALIGN=CENTER> 생성일시'
     , eq.SAVE_DTTM					'<ALIGN=CENTER> 저장일시'
     , eq.CREATE_BY					'<ALIGN=CENTER> 생성자'
     , eq.SAVE_BY					'<ALIGN=CENTER> 저장자'
  FROM TB_EQ eq WITH(NOLOCK)
  LEFT OUTER JOIN TB_EQ_TYPE ty ON eq.EQ_TYPE_ID = ty.EQ_TYPE_ID
  LEFT OUTER JOIN UTB_PROC pr ON eq.PROC_ID = pr.PROC_ID
  LEFT OUTER JOIN TB_EQ_MAKE_SUPPLIER ms ON eq.MAKE_SUPPLIER = ms.EQ_SUPPLIER_ID

 SET NOCOUNT OFF;
END 

SELECT MAKE_SUPPLIER, COUNT(*) AS COUNT
FROM TB_EQ
GROUP BY MAKE_SUPPLIER;