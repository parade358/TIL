USE [ATM52]
GO

/****** Object:  StoredProcedure [dbo].[USP_TEST_LOAD_TEST_L]    Script Date: 2024-06-20(��) ���� 8:32:44 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

    
/******************************************************************    
* DATABASE        : ATM52    
* PROCEDURE NAME  : USP_TEST_LOAD_TEST_L    
* DATE            : 2024/06/18    
* AUTHOR          : ������    
* PROCEDURE DESC  : �������� ��ȸ ���ν���    
*******************************************************************     
    
* DATE:  Developer   Change     
----------  ----------------  ---------------------------------------     
2024/06/18 ������    Created  
2024/06/19 ������    ��������, ���� �̸����� ��ȸ  
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
    ,  eq.EQ_ID '<ALIGN=CENTER> �����ڵ�'    
     , eq.EQ_NAME '<ALIGN=CENTER> �����'      
     , ty.EQ_TYPE_NAME '<ALIGN=CENTER> ��������'      
     , pr.PROC_NAME '<ALIGN=CENTER> ����'      
     , eq.IS_SUB_EQ '<ALIGN=CENTER> �δ뼳�񿩺�(1)'    
     , eq.SPEC '<ALIGN=CENTER> �԰�'    
     , eq.SN_NO '<ALIGN=CENTER> �Ϸù�ȣ'    
     , eq.MAKE_DATE '<ALIGN=CENTER> ��������'    
     , eq.SET_DATE '<ALIGN=CENTER> ��ġ����'    
     , eq.TYPE_INFO '<ALIGN=CENTER> ����'    
     , eq.USE_INFO '<ALIGN=CENTER> ����뵵'    
     , eq.SET_INFO '<ALIGN=CENTER> ��ġ�뵵'    
     , eq.MAKE_SUPPLIER '<ALIGN=CENTER> ������'    
     , eq.BASIC_PRICE '<ALIGN=CENTER> ��氡��'    
     , eq.SERVICE_LIFE '<ALIGN=CENTER> ���뿬��'    
     , eq.DEPRECIATION '<ALIGN=CENTER> �����󰢷�'
	 , CASE WHEN isnull(eq.EQ_IMAGE, '') <> '' THEN '<tag>'++'<a class="link_btn"  href="javascript:showImage('''+CAST(eq.EQ_IMAGE AS NVARCHAR(20))+''')">VIEW</a>'  
                                                     ELSE ''  
           END  '<ALIGN=CENTER> �����̹���' 
     , eq.FILE_SOURCE '<ALIGN=CENTER> ���Ͽ�����'    
     , eq.FILE_SERVER '<ALIGN=CENTER> ���ϼ������'    
     , eq.REMARK '<ALIGN=CENTER> ���'    
     , eq.VALID '<ALIGN=CENTER> ��뿩��'    
     , eq.CREATE_DTTM '<ALIGN=CENTER> �����Ͻ�'    
     , eq.SAVE_DTTM '<ALIGN=CENTER> �����Ͻ�'    
     , eq.CREATE_BY '<ALIGN=CENTER> ������'    
     , eq.SAVE_BY '<ALIGN=CENTER> ������'  
  FROM TB_EQ eq WITH(NOLOCK)      
  LEFT OUTER JOIN TB_EQ_TYPE ty ON eq.EQ_TYPE_ID = ty.EQ_TYPE_ID  
  LEFT OUTER JOIN UTB_PROC pr ON eq.PROC_ID = pr.PROC_ID  
 END    
  ELSE    
 BEGIN    
  SELECT TOP 100    
    eq.EQ_ID '<ALIGN=CENTER> �����ڵ�'    
     , eq.EQ_NAME '<ALIGN=CENTER> �����'      
     , eq.EQ_TYPE_ID '<ALIGN=CENTER> ��������'      
     , eq.PROC_ID '<ALIGN=CENTER> ����'      
     , eq.IS_SUB_EQ '<ALIGN=CENTER> �δ뼳�񿩺�(1)'    
     , eq.SPEC '<ALIGN=CENTER> �԰�'    
     , eq.SN_NO '<ALIGN=CENTER> �Ϸù�ȣ'    
     , eq.MAKE_DATE '<ALIGN=CENTER> ��������'    
     , eq.SET_DATE '<ALIGN=CENTER> ��ġ����'    
     , eq.TYPE_INFO '<ALIGN=CENTER> ����'    
     , eq.USE_INFO '<ALIGN=CENTER> ����뵵'    
     , eq.SET_INFO '<ALIGN=CENTER> ��ġ�뵵'    
     , eq.MAKE_SUPPLIER '<ALIGN=CENTER> ������'    
     , eq.BASIC_PRICE '<ALIGN=CENTER> ��氡��'    
     , eq.SERVICE_LIFE '<ALIGN=CENTER> ���뿬��'    
     , eq.DEPRECIATION '<ALIGN=CENTER> �����󰢷�'    
     , eq.EQ_IMAGE '<ALIGN=CENTER> �����̹���'    
     , eq.FILE_SOURCE '<ALIGN=CENTER> ���Ͽ�����'    
     , eq.FILE_SERVER '<ALIGN=CENTER> ���ϼ������'    
     , eq.REMARK '<ALIGN=CENTER> ���'    
     , eq.VALID '<ALIGN=CENTER> ��뿩��'    
     , eq.CREATE_DTTM '<ALIGN=CENTER> �����Ͻ�'    
     , eq.SAVE_DTTM '<ALIGN=CENTER> �����Ͻ�'    
     , eq.CREATE_BY '<ALIGN=CENTER> ������'
     , eq.SAVE_BY '<ALIGN=CENTER> ������'
  FROM TB_EQ eq WITH(NOLOCK)  
  WHERE eq.EQ_NAME = @P_EQ_NAME;  
 END    
     
 SET NOCOUNT OFF;      
END 
GO


