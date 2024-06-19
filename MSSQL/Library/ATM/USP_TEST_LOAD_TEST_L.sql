USE [ATM52]
GO

/****** Object:  StoredProcedure [dbo].[USP_TEST_LOAD_TEST_L]    Script Date: 2024-06-20(목) 오전 8:32:44 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

    
/******************************************************************    
* DATABASE        : ATM52    
* PROCEDURE NAME  : USP_TEST_LOAD_TEST_L    
* DATE            : 2024/06/18    
* AUTHOR          : 최유성    
* PROCEDURE DESC  : 설비정보 조회 프로시저    
*******************************************************************     
    
* DATE:  Developer   Change     
----------  ----------------  ---------------------------------------     
2024/06/18 최유성    Created  
2024/06/19 최유성    설비유형, 공정 이름으로 조회  
******************************************************************/    
    
CREATE PROCEDURE [dbo].[USP_TEST_LOAD_TEST_L]      
@P_EQ_NAME VARCHAR(50) = NULL     
AS      
BEGIN      
    
 SET NOCOUNT ON;      
      
 IF (@P_EQ_NAME = '*')    
 BEGIN    
    
  SELECT    
  --ApplyDB    
     eq.EQ_ID '@@eq_id'    
   , eq.EQ_NAME '@@eq_name'      
   , eq.EQ_TYPE_ID '@@eq_type_id'      
   , eq.PROC_ID '@@proc_id'      
   , eq.IS_SUB_EQ '@@is_sub_eq'    
   , eq.SPEC '@@spec'    
   , eq.SN_NO '@@sn_no'    
   , eq.MAKE_DATE '@@make_date'    
   , eq.SET_DATE '@@set_date'    
   , eq.TYPE_INFO '@@type_info'    
   , eq.USE_INFO '@@use_info'    
   , eq.SET_INFO '@@set_info'    
   , eq.MAKE_SUPPLIER '@@make_supplier'    
   , eq.BASIC_PRICE '@@basic_price'    
   , eq.SERVICE_LIFE '@@service_life'    
   , eq.DEPRECIATION '@@depreciation'    
   , eq.EQ_IMAGE '@@eq_image'    
   , eq.FILE_SOURCE '@@file_source'    
   , eq.FILE_SERVER '@@file_server'    
   , eq.REMARK '@@remark'    
   , eq.VALID '@@valid'    
   , eq.ROW_STAMP '@@key'    
    
  --UserView     
    ,  eq.EQ_ID '<ALIGN=CENTER> 설비코드'    
     , eq.EQ_NAME '<ALIGN=CENTER> 설비명'      
     , ty.EQ_TYPE_NAME '<ALIGN=CENTER> 설비유형'      
     , pr.PROC_NAME '<ALIGN=CENTER> 공정'      
     , eq.IS_SUB_EQ '<ALIGN=CENTER> 부대설비여부(1)'    
     , eq.SPEC '<ALIGN=CENTER> 규격'    
     , eq.SN_NO '<ALIGN=CENTER> 일련번호'    
     , eq.MAKE_DATE '<ALIGN=CENTER> 제조일자'    
     , eq.SET_DATE '<ALIGN=CENTER> 설치일자'    
     , eq.TYPE_INFO '<ALIGN=CENTER> 형식'    
     , eq.USE_INFO '<ALIGN=CENTER> 설비용도'    
     , eq.SET_INFO '<ALIGN=CENTER> 설치용도'    
     , eq.MAKE_SUPPLIER '<ALIGN=CENTER> 제조사'    
     , eq.BASIC_PRICE '<ALIGN=CENTER> 취득가격'    
     , eq.SERVICE_LIFE '<ALIGN=CENTER> 내용연수'    
     , eq.DEPRECIATION '<ALIGN=CENTER> 감가상각률'
	 , CASE WHEN isnull(eq.EQ_IMAGE, '') <> '' THEN '<tag>'++'<a class="link_btn"  href="javascript:showImage('''+CAST(eq.EQ_IMAGE AS NVARCHAR(20))+''')">VIEW</a>'  
                                                     ELSE ''  
           END  '<ALIGN=CENTER> 설비이미지' 
     , eq.FILE_SOURCE '<ALIGN=CENTER> 파일원본명'    
     , eq.FILE_SERVER '<ALIGN=CENTER> 파일서버경로'    
     , eq.REMARK '<ALIGN=CENTER> 비고'    
     , eq.VALID '<ALIGN=CENTER> 사용여부'    
     , eq.CREATE_DTTM '<ALIGN=CENTER> 생성일시'    
     , eq.SAVE_DTTM '<ALIGN=CENTER> 저장일시'    
     , eq.CREATE_BY '<ALIGN=CENTER> 생성자'    
     , eq.SAVE_BY '<ALIGN=CENTER> 저장자'  
  FROM TB_EQ eq WITH(NOLOCK)      
  LEFT OUTER JOIN TB_EQ_TYPE ty ON eq.EQ_TYPE_ID = ty.EQ_TYPE_ID  
  LEFT OUTER JOIN UTB_PROC pr ON eq.PROC_ID = pr.PROC_ID  
 END    
  ELSE    
 BEGIN    
  SELECT TOP 100    
    eq.EQ_ID '<ALIGN=CENTER> 설비코드'    
     , eq.EQ_NAME '<ALIGN=CENTER> 설비명'      
     , eq.EQ_TYPE_ID '<ALIGN=CENTER> 설비유형'      
     , eq.PROC_ID '<ALIGN=CENTER> 공정'      
     , eq.IS_SUB_EQ '<ALIGN=CENTER> 부대설비여부(1)'    
     , eq.SPEC '<ALIGN=CENTER> 규격'    
     , eq.SN_NO '<ALIGN=CENTER> 일련번호'    
     , eq.MAKE_DATE '<ALIGN=CENTER> 제조일자'    
     , eq.SET_DATE '<ALIGN=CENTER> 설치일자'    
     , eq.TYPE_INFO '<ALIGN=CENTER> 형식'    
     , eq.USE_INFO '<ALIGN=CENTER> 설비용도'    
     , eq.SET_INFO '<ALIGN=CENTER> 설치용도'    
     , eq.MAKE_SUPPLIER '<ALIGN=CENTER> 제조사'    
     , eq.BASIC_PRICE '<ALIGN=CENTER> 취득가격'    
     , eq.SERVICE_LIFE '<ALIGN=CENTER> 내용연수'    
     , eq.DEPRECIATION '<ALIGN=CENTER> 감가상각률'    
     , eq.EQ_IMAGE '<ALIGN=CENTER> 설비이미지'    
     , eq.FILE_SOURCE '<ALIGN=CENTER> 파일원본명'    
     , eq.FILE_SERVER '<ALIGN=CENTER> 파일서버경로'    
     , eq.REMARK '<ALIGN=CENTER> 비고'    
     , eq.VALID '<ALIGN=CENTER> 사용여부'    
     , eq.CREATE_DTTM '<ALIGN=CENTER> 생성일시'    
     , eq.SAVE_DTTM '<ALIGN=CENTER> 저장일시'    
     , eq.CREATE_BY '<ALIGN=CENTER> 생성자'
     , eq.SAVE_BY '<ALIGN=CENTER> 저장자'
  FROM TB_EQ eq WITH(NOLOCK)  
  WHERE eq.EQ_NAME = @P_EQ_NAME;  
 END    
     
 SET NOCOUNT OFF;      
END 
GO


