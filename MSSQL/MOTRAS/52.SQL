USE [ATM52_EDU]
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_board_sp_get_url_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : pk_ATM_board_sp_get_url_L
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 게시판 URL 가져오기
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_board_sp_get_url_L]
    @p_user NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                A.title
              , A.url
              , A.menu_id
         FROM   tb_menu A WITH (NOLOCK)
         WHERE  A.menu_id IN (
                              SELECT
                                     AA.menu_id
                              FROM   tb_menu_auth AA WITH (NOLOCK)
                              WHERE  AA.menu_id = '97'
                             );
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_board_sp_notice_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_board_sp_notice_D]
    @p_row_stamp NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DELETE FROM tb_board
             WHERE
                   ROW_STAMP = @p_row_stamp;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_board_sp_notice_detail_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[pk_ATM_board_sp_notice_detail_L]
    @p_row_stamp NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @vSql NVARCHAR(4000);
    
    SET @vSql = 'select
                    row_stamp         
                    ,title         
                    ,(select emp_name +''('' + emp_id +'')'' from tb_emp (NOLOCK)  
                        where emp_id=a.emp_id) usr         
                    ,a.emp_id         
                    ,priority         
                    ,file_path         
                    ,file_seq         
                    ,replace(replace(content,''>'',''&gt;''),''<'',''&lt;'')  content        
                    ,create_dttm dt         
                    ,readcount cnt         
                    ,db_id         
                    ,exp_date
                from tb_board a  (NOLOCK)      
                where ROW_STAMP='+@p_row_stamp+'';
         
    EXEC (@vSql);

    -- EXEC pk_ATM_board_sp_notice_S_count @p_row_stamp;
    UPDATE tb_board SET
        readcount = readcount + 1
    WHERE row_stamp = @p_row_stamp;

    SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_board_sp_notice_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_board_sp_notice_L]
    @p_db_id   NVARCHAR(255)
  , @p_title   NVARCHAR(255)
  , @p_content NVARCHAR(255)
  , @p_user    NVARCHAR(255)
  , @p_tr_id   NVARCHAR(255)
  , @p_emp_id  NVARCHAR(255) = NULL
AS
     BEGIN
         SET NOCOUNT ON;

         IF (
             SELECT
                    COUNT(*)
             FROM   TB_MENU_AUTH aa(NOLOCK)
             LEFT OUTER JOIN TB_EMP ee(NOLOCK) ON aa.EMP_ID = ee.EMP_ID
             LEFT OUTER JOIN tb_auth ag(NOLOCK) ON aa.EMP_ID = ag.auth_id
             LEFT OUTER JOIN TB_EMP AGE(NOLOCK) ON AG.auth_id = AGE.AUTH_ID
             WHERE  ISNULL(EE.EMP_ID, AGE.EMP_ID) = @p_emp_id
                    AND aa.MENU_ID = '4569'
            ) = 0
         BEGIN
             RETURN;
         END;
         DECLARE @vSql NVARCHAR(4000);
         SET @vSql = 'select    
       top 15    
       row_stamp "게시번호",         
       title "제목",          
       usr "작성자",         
       dt "등록일",         
       cnt "읽음",         
       row_stamp "@@PARAM",         
       row_stamp "@@seq",         
       title "@@title",         
       dt "@@date",         
       replace(replace(content,''>'',''&gt;''),''<'',''&lt;'')  "@@content",         
       usr "@@name",    
       priority "@@priority"    
      from    (select             
          row_stamp,    
          priority,    
          ff,    
          usr,    
          title,    
          dt,    
          cnt,    
          content          
         from (select             
            row_stamp,    
            priority,    
            (case isnull(file_path,'''') when '''' then 0    
               else 1 end) ff,    
            title,    
            (select emp_name   from tb_emp  (NOLOCK)      
             where emp_id=a.emp_id) usr,    
            replace(convert(nvarchar,create_dttm,111),''/'',''.'') dt,    
            readcount cnt,    
            content    
           from tb_board a   (NOLOCK)    
           where exp_date>=convert(nvarchar,getdate(),112)';
         IF ISNULL(@p_db_id, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and db_id ='''+@p_db_id+'''';
         END;
         IF ISNULL(@p_title, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and title like'''+@p_title+'%''';
         END;
         IF ISNULL(@p_content, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and content like'''+@p_content+'%''';
         END;
         IF ISNULL(@p_user, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and emp_id in (select emp_id from tb_emp (NOLOCK) where emp_name like'''+@p_user+'%'')';
         END;
         IF ISNULL(@p_tr_id, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and row_stamp ='''+@p_tr_id+'''';
         END;
         SET @vSql = @vSql+'       ) R ) R order by priority desc, dt DESC';
         PRINT(@vSql);
         EXEC (@vSql);
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_board_sp_notice_list_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 
2018/06/21  황정민			fixed where조건
exec pk_ATM_board_sp_notice_list_L N'DB', N'*', N'*', N'*', N'*', N'20180614', N'20180621'
******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_board_sp_notice_list_L]
    @p_db_id   NVARCHAR(20)
  , @p_title   NVARCHAR(255)
  , @p_content NVARCHAR(255)
  , @p_user    NVARCHAR(20)
  , @p_tr_id   NVARCHAR(20)
  , @p_start   NVARCHAR(20)
  , @p_end     NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         DECLARE @vSql NVARCHAR(4000);
         SET @vSql = 'select
                            row_stamp "게시번호",     
                            title "제목",      
                            usr "작성자",     
                            dt "등록일",     
                            cnt "읽음",     
                            row_stamp "@@PARAM",     
                            row_stamp "@@seq",     
                            title "@@title",     
                            dt "@@date",     
                            replace(replace(content,''>'',''&gt;''),''<'',''&lt;'')  "@@content",     
                            usr "@@name"    ,
                            priority "priority"
                        from    (select         
                                        row_stamp,
                                        priority,
                                        ff,
                                        usr,
                                        title,
                                        dt,
                                        cnt,
                                        content      
                                    from (select         
                                                row_stamp,
                                                priority,
                                                (case isnull(file_path,'''') when '''' then 0
                                                            else 1 end) ff,
                                                title,
                                                (select emp_name +''('' + emp_id +'')'' from tb_emp (NOLOCK)  
                                                    where emp_id=a.emp_id) usr,
                                                replace(convert(nvarchar,create_dttm,111),''/'',''.'') dt,
                                                readcount cnt,
                                                content
                                            from tb_board a (NOLOCK)  
                                            where exp_date>=convert(nvarchar,getdate(),112)';
         --IF ISNULL(@p_db_id, 'db') <> 'db'
		 IF ISNULL(@p_db_id, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and db_id ='''+@p_db_id+'''';
         END;
         IF ISNULL(@p_title, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and title like ''%'+@p_title+'%''';
         END;
         IF ISNULL(@p_content, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and content like ''%'+@p_content+'%''';
         END;
         IF ISNULL(@p_user, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and emp_id in (select emp_id from tb_emp (NOLOCK)   where emp_name like ''%'+@p_user+'%'')';
         END;
         IF ISNULL(@p_tr_id, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and row_stamp ='''+@p_tr_id+'''';
         END;
         IF ISNULL(@p_start, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and convert(nvarchar,create_dttm,112) between '''+@p_start+''' and '''+@p_end+''' ';
         END;
         SET @vSql = @vSql+'       ) R ) R order by priority desc, dt';
         PRINT(@vSql);
         EXEC (@vSql);
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_board_sp_notice_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_board_sp_notice_S]
    @p_row_stamp NVARCHAR(20)
  , @p_title     NVARCHAR(255)
  , @p_expdate   NVARCHAR(20)
  , @p_priority  NVARCHAR(20)
  , @p_db_id     NVARCHAR(20)
  , @p_file_path NVARCHAR(255)
  , @p_content   NVARCHAR(4000)
  , @p_file_new  NVARCHAR(255)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         DECLARE @db NVARCHAR(20);
         IF(@p_db_id = '전사')
         BEGIN
             SET @db = NULL;
         END;
             ELSE
         BEGIN
             SET @db = @p_db_id;
         END;
         BEGIN TRY
             BEGIN TRAN;
             IF ISNULL(@p_row_stamp, ' ') = ' '
             BEGIN
                 INSERT INTO          tb_board (
                        title
                      , emp_id
                      , priority
                      , DB_ID
                      , file_path
                      , file_seq
                      , content
                      , exp_date )
                 VALUES (
                        @p_title
                      , @p_saveby
                      , CAST(@p_priority AS INT)
                      , @db
                      , @p_file_path
                      , @p_file_new
                      , @p_content
                      , @p_expdate);
             END;
                 ELSE
             BEGIN
                 UPDATE tb_board
                   SET
                       title = @p_title
                     , emp_id = @p_saveby
                     , priority = CAST(@p_priority AS INT)
                     , DB_ID = @db
                     , file_path = @p_file_path
                     , content = @p_content
                     , file_seq = @p_file_new
                     , exp_date = @p_expdate
                 WHERE
                       row_stamp = CAST(@p_row_stamp AS INT);
             END;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_code_list_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_code_list_L]
    @p_groupid NVARCHAR(20) = 'ORDER_TYPE'
  , @p_valid   NVARCHAR(20) = NULL
AS
     BEGIN
         SET NOCOUNT ON;
         DECLARE @vSql NVARCHAR(4000);
         DECLARE @title NVARCHAR(255);
         DECLARE @fk_table NVARCHAR(255);
         DECLARE @fk_field NVARCHAR(255);
         DECLARE @rel_group NVARCHAR(255);
         DECLARE @rel_value NVARCHAR(255);
         DECLARE title_list CURSOR
         FOR SELECT
                    CODE_TITLE
                  , FK_TABLE
                  , FK_FIELD
                  , REL_GROUP_id
                  , REL_VALUE_ID
             FROM   TB_GROUP
             WHERE  group_ID = @p_groupid
             ORDER BY
                      code_seq;
         DECLARE @idx INT;
         SET @idx = 1;
         SET @vSql = 'SELECT  a.group_id "@@GroupID"';
         OPEN title_list;
         FETCH NEXT FROM title_list INTO @title, @fk_table, @fk_field, @rel_group, @rel_value;
         WHILE(@@FETCH_STATUS <> -1)
         BEGIN

--create sql
             IF isnull(@fk_field, '') = ''
             BEGIN
                 SET @vSql = @vSql+'  ,a.VALUE'+CAST(@idx AS NVARCHAR)+' "'+@title+'"';
             END;
                 ELSE
             BEGIN
                 SET @vSql = @vSql+'  ,(select '+@rel_value+' from '+@fk_table+'
                                                where '+@fk_field+'= A.VALUE'+CAST(@idx AS NVARCHAR);
                 PRINT @VSQL;
                 IF isnull(@rel_group, '') <> ''
                 BEGIN
                     SET @vSql = @vSql+'    and group_id='''+@rel_group+''''
                 END;
                 SET @vSql = @vSql+') "'+@title+'"';
                 SET @vSql = @vSql+'  ,a.VALUE'+CAST(@idx AS NVARCHAR)+' "@@'+@title+'"'; --원 코드값
             END;
             SET @idx = @idx + 1;
             FETCH NEXT FROM title_list INTO @title, @fk_table, @fk_field, @rel_group, @rel_value;
         END;
         CLOSE title_list;
         DEALLOCATE title_list;
         SET @vSql = @vSql+'  ,''<align=right>''
                                    +cast(a.sort_seq as nvarchar)정렬순서 
                                ,a.REMARK "@@REMARK" 
                                ,a.valid "@@Valid" 
                                , ''<align=center>''
                                    +(case a.valid
                                        when ''0'' then ''X''
                                        else ''O''end)  "사용여부"
                                ,''<align=center>''
                                    +convert(nvarchar,a.SAVE_DTTM,120) "저장일시"
                                ,e.EMP_NAME "입력자"
                                ,a.row_stamp "@@KEY"
                                from  TB_CODE a  (NOLOCK) left outer join tb_emp e (NOLOCK) 
                                on a.save_by=e.emp_id
                                where 1=1';
         IF ISNULL(@p_groupid, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and a.GROUP_ID ='''+@p_groupid+'''';
         END;
         IF ISNULL(@p_valid, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and a.VALID='''+@p_valid+'''';
         END;
         SET @vSql = @vSql+'    order by a.sort_seq';

--select ISNULL(@p_rowstamp, '*')
         PRINT(@vSql);
         EXEC (@vSql);
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_dictionary_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_dictionary_D]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DELETE TB_DICTIONARY
             WHERE
                   ROW_STAMP = @p_rowstamp;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_dictionary_file_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_dictionary_file_L]
    @p_lang_id NVARCHAR(20)
  , @p_kor     NVARCHAR(255)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                @p_lang_id 언어코드
              , A.KOR      "기준한국어"
              , A.TRANS    "변환언어"
         FROM   TB_DICTIONARY A(NOLOCK)
         WHERE  LANG_ID = @p_lang_id
         ORDER BY
                  a.KOR;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_dictionary_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_dictionary_L]
    @p_lang_id NVARCHAR(20)  = NULL
  , @p_kor     NVARCHAR(255) = NULL
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
-- apply db
                lang_id                                              "@@lang_id"
              , kor                                                  "@@kor"
              , trans                                                "@@trans"
              , remark                                               "@@remark"
              , A.ROW_STAMP                                          "@@KEY"
--view  
              , '<width=25%>'+A.KOR                                  "기준한국어"
              , N'<width=25%>'+A.TRANS                               "변환언어"
              , '<width=50%>'+A.REMARK                               "비고"
              , '<align=center>'+CONVERT(NVARCHAR, A.SAVE_DTTM, 120) "저장일시"
              , '<align=center>'+ (
                                   SELECT
                                          emp_name
                                   FROM    tb_emp (NOLOCK)
                                   WHERE  emp_id = a.SAVE_BY
                )                                                    "입력자"
         FROM TB_DICTIONARY A(NOLOCK)
         WHERE LANG_ID = @p_lang_id
               AND KOR LIKE CASE WHEN isnull(@p_kor, '*') = '*'
                                THEN KOR
                                ELSE '%'+@p_kor+'%'
                            END
         ORDER BY
                  save_dttm DESC;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_dictionary_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_dictionary_S]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_values);
--.................................................................
         DECLARE @lang_id AS NVARCHAR(20);
         DECLARE @kor AS NVARCHAR(255);
         DECLARE @trans AS NVARCHAR(255);
         DECLARE @remark AS NVARCHAR(255);
         SET @lang_id = (
                         SELECT
                                vData
                         FROM   @tbl
                         WHERE  idx = 1
             );
         SET @kor = (
                     SELECT
                            vData
                     FROM   @tbl
                     WHERE  idx = 2
             );
         SET @trans = (
                       SELECT
                              vData
                       FROM   @tbl
                       WHERE  idx = 3
             );
         SET @remark = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 4
             );
         BEGIN TRY
             BEGIN TRAN;
             IF ISNULL(@p_rowstamp, ' ') = ' '
             BEGIN
                 INSERT INTO               tb_dictionary (
                        LANG_ID
                      , KOR
                      , TRANS
                      , REMARK
                      , create_by
                      , SAVE_BY )
                 SELECT
                        @lang_id
                      , REPLACE(@kor, CHAR(13) + CHAR(10), '\n')
                      , REPLACE(@trans, CHAR(13) + CHAR(10), '\n')
                      , @remark
                      , @p_saveby
                      , @p_saveby;
             END;
                 ELSE
             BEGIN
                 UPDATE TB_DICTIONARY
                   SET
                       LANG_ID = @lang_id
                     , TRANS = REPLACE(@trans, CHAR(13) + CHAR(10), '\n')
                     , REMARK = @remark
                     , save_by = @p_saveby
                 WHERE
                       row_stamp = @p_rowstamp;
             END;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_group_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_group_D]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DELETE FROM TB_GROUP
             WHERE
                   GROUP_ID = @p_rowstamp;
             DELETE FROM TB_CODE
             WHERE
                   GROUP_ID = @p_rowstamp;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_group_detail_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_group_detail_D]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DELETE FROM TB_GROUP
             WHERE
                   ROW_STAMP = @p_rowstamp;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_group_detail_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_group_detail_L]
    @p_group_ID NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
-- APPLY
                CODE_SEQ                                                                     "@@code_seq"
              , CODE_TITLE                                                                   "@@code_title"
              , FK_TABLE                                                                     "@@fk_table"
              , FK_FIELD                                                                     "@@fk_field"
              , REL_GROUP_ID                                                                 "@@rel_group_id"
              , REL_VALUE_ID                                                                 "@@rel_value_id"
              , valid                                                                        "@@valid"
              , GROUP_ID                                                                     "@@group_id"
              , a.ROW_STAMP                                                                  "@@KEY"
              , @p_group_ID                                                                  "@@GROUP_ID"
-- VIEW   
              , A.CODE_SEQ                                                                   필드순서
              , A.CODE_TITLE                                                                 필드명
              , A.FK_TABLE                                                                   '연결테이블(FK)'
              , A.FK_FIELD                                                                   '연결필드(FK ID)'
              , (
                 SELECT TOP 1
                        AA.GROUP_NAME
                 FROM    TB_GROUP AA(NOLOCK)
                 WHERE  AA.GROUP_ID = A.REL_GROUP_ID
                )                                                                            "연결공통그룹(GROUP_ID)"
              , A.REL_VALUE_ID                                                               "연결필드(FK NAME)"
              , '<tag;width=50><span style="width:100%; text-align:center">'+(CASE a.valid WHEN '0'
                                                                                  THEN 'X'
                                                                                  ELSE 'O'
                                                                              END)+'</span>' "사용여부"
              , '<align=center>'+CONVERT(NVARCHAR, a.SAVE_DTTM, 120)                         저장일시
              , '<width=100>'+ (
                                SELECT
                                       EMP_NAME
                                FROM   TB_EMP (NOLOCK)
                                WHERE  EMP_ID = A.SAVE_BY
                )                                                                            "입력자"
         FROM TB_GROUP a(NOLOCK)
         WHERE A.GROUP_ID = @p_group_ID;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_group_detail_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_group_detail_S]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................  
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_values);
--.................................................................  
         DECLARE @code_seq AS NVARCHAR(255);
         DECLARE @code_title AS NVARCHAR(255);
         DECLARE @fk_table AS NVARCHAR(255);
         DECLARE @fk_field AS NVARCHAR(255);
         DECLARE @rel_group_id AS NVARCHAR(255);
         DECLARE @rel_value_id AS NVARCHAR(255);
         DECLARE @valid AS NVARCHAR(255);
         DECLARE @group_id AS NVARCHAR(255);
         DECLARE @use_system AS INT;
         SET @code_seq = (
                          SELECT
                                 vData
                          FROM   @tbl
                          WHERE  idx = 1
             );
         SET @code_title = (
                            SELECT
                                   vData
                            FROM   @tbl
                            WHERE  idx = 2
             );
         SET @fk_table = (
                          SELECT
                                 vData
                          FROM   @tbl
                          WHERE  idx = 3
             );
         SET @fk_field = (
                          SELECT
                                 vData
                          FROM   @tbl
                          WHERE  idx = 4
             );
         SET @rel_group_id = (
                              SELECT
                                     vData
                              FROM   @tbl
                              WHERE  idx = 5
             );
         SET @rel_value_id = (
                              SELECT
                                     vData
                              FROM   @tbl
                              WHERE  idx = 6
             );
         SET @valid = (
                       SELECT
                              vData
                       FROM   @tbl
                       WHERE  idx = 7
             );
         SET @group_id = (
                          SELECT
                                 vData
                          FROM   @tbl
                          WHERE  idx = 8
             );
         SET @use_system = (
                            SELECT DISTINCT
                                   USE_SYSTEM
                            FROM   TB_GROUP
                            WHERE  GROUP_ID = @group_id
             );
         BEGIN TRY
             BEGIN TRAN;
             IF ISNULL(@p_rowstamp, ' ') = ' '
             BEGIN
                 INSERT INTO          TB_GROUP (
                        GROUP_ID
                      , GROUP_NAME
                      , CODE_SEQ
                      , CODE_TITLE
                      , FK_TABLE
                      , FK_FIELD
                      , REL_GROUP_ID
                      , REL_VALUE_ID
                      , VALID
                      , CREATE_BY
                      , SAVE_BY
                      , USE_SYSTEM )
                 SELECT TOP 1
                        a.GROUP_ID
                      , a.GROUP_NAME
                      , @code_seq
                      , @code_title
                      , @fk_table
                      , @fk_field
                      , @rel_group_id
                      , @rel_value_id
                      , @valid
                      , @p_saveby
                      , @p_saveby
                      , @use_system
                 FROM   TB_GROUP a
                 WHERE  a.GROUP_ID = @group_id;
             END;
                 ELSE
             BEGIN
                 UPDATE TB_GROUP
                   SET
                       CODE_TITLE = @code_title
                     , FK_TABLE = @fk_table
                     , FK_FIELD = @fk_field
                     , REL_GROUP_ID = @rel_group_id
                     , REL_VALUE_ID = @rel_value_id
                     , VALID = @valid
                     , SAVE_BY = @p_saveby
                 WHERE
                       ROW_STAMP = @p_rowstamp;
             END;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_group_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_group_L]
    @p_group_name NVARCHAR(20)
  , @p_valid      NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                '@@header0'
              , '공통코드 그룹아이디'
              , '공통코드그룹명'
              , '시스템사용'
              , '최종변경일시1'
              , '@@use_system'
              , '@@key'
              , '@@param';
         SELECT
                '@@header1'
              , '공통코드 그룹아이디'
              , '공통코드그룹명'
              , '시스템사용'
              , '최종변경일시2'
              , '@@use_system'
              , '@@key'
              , '@@param';
         SELECT
                '@@list'
              , a.GROUP_ID                                                "공통코드 그룹아이디"
              , a.GROUP_NAME                                              "공통코드 그룹명"
              , '<align=center>'+CASE WHEN A.USE_SYSTEM = 1
                                     THEN 'O'
                                     ELSE 'X'
                                 END                                      "시스템사용"
              , '<align=center>'+CONVERT(NVARCHAR, MIN(a.SAVE_DTTM), 120) 최종변경일시
              , A.USE_SYSTEM                                              "@@USE_SYSTEM"
              , A.GROUP_ID                                                "@@KEY"
              , A.GROUP_ID                                                "@@PARAM"
         FROM   TB_GROUP a(NOLOCK)
         WHERE  VALID = CASE WHEN @p_valid = '*'
                            THEN VALID
                            ELSE @p_valid
                        END
                AND a.GROUP_NAME LIKE '%'+isnull(@p_group_name, '')+'%'
         GROUP BY
                  A.GROUP_ID
                , A.GROUP_NAME
                , USE_SYSTEM
         ORDER BY
                  a.GROUP_NAME;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_group_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_group_S]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................  
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_values);
--.................................................................  
         DECLARE @group_id AS NVARCHAR(255);
         DECLARE @group_name AS NVARCHAR(255);
         DECLARE @IS_SYSTEM_CODE_GROUP AS NVARCHAR(255);
         SET @group_id = (
                          SELECT
                                 vData
                          FROM   @tbl
                          WHERE  idx = 1
             );
         SET @group_name = (
                            SELECT
                                   vData
                            FROM   @tbl
                            WHERE  idx = 2
             );
         SET @IS_SYSTEM_CODE_GROUP = (
                                      SELECT
                                             vData
                                      FROM   @tbl
                                      WHERE  idx = 3
             );
         BEGIN TRY
             BEGIN TRAN;
             IF ISNULL(@p_rowstamp, ' ') = ' '
             BEGIN
                 INSERT INTO          TB_GROUP (
                        GROUP_ID
                      , GROUP_NAME
                      , CODE_SEQ
                      , USE_SYSTEM
                      , CODE_TITLE )
                 VALUES (
                        @group_id
                      , @group_name
                      , @IS_SYSTEM_CODE_GROUP
                      , 1
                      , '@@CODE');
             END;
                 ELSE
             BEGIN
                 UPDATE TB_GROUP
                   SET
                       GROUP_NAME = @group_name
                     , USE_SYSTEM = @IS_SYSTEM_CODE_GROUP
                 WHERE
                       GROUP_ID = @group_id;
             END;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_language_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_language_D]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DELETE TB_DICTIONARY
             WHERE
                   LANG_ID = (
                              SELECT
                                     LANG_ID
                              FROM   TB_LANGUAGE
                              WHERE  row_stamp = @p_rowstamp
                   );
             DELETE TB_LANGUAGE
             WHERE
                   ROW_STAMP = @p_rowstamp;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_language_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_language_L]
    @p_KOR NVARCHAR(255)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
--apply
                lang_id                         "@@lang_id"
              , lang_name                       "@@lang_name"
              , remark                          "@@remark"
              , ROW_STAMP                       "@@KEY"
--view 
              , LANG_ID                         "언어코드"
              , LANG_NAME                       "언어명"
              , '<width=30%>'+REMARK            "비고"
              , LANG_ID+';'+ISNULL(@p_KOR, '*') "@@PARAM"
         FROM   TB_LANGUAGE (NOLOCK);
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_code_sp_language_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_code_sp_language_S]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_values);
--.................................................................
         DECLARE @lang_id AS NVARCHAR(20);
         DECLARE @lang_name AS NVARCHAR(255);
         DECLARE @remark AS NVARCHAR(255);
         SET @lang_id = (
                         SELECT
                                vData
                         FROM   @tbl
                         WHERE  idx = 1
             );
         SET @lang_name = (
                           SELECT
                                  vData
                           FROM   @tbl
                           WHERE  idx = 2
             );
         SET @remark = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 3
             );
         BEGIN TRY
             BEGIN TRAN;
             IF ISNULL(@p_rowstamp, ' ') = ' '
             BEGIN
                 INSERT INTO             tb_language (
                        LANG_ID
                      , LANG_NAME
                      , REMARK
                      , create_by
                      , SAVE_BY )
                 SELECT
                        @lang_id
                      , @lang_name
                      , @remark
                      , @p_saveby
                      , @p_saveby;
             END;
                 ELSE
             BEGIN
                 UPDATE TB_LANGUAGE
                   SET
                       LANG_ID = @lang_id
                     , LANG_NAME = @lang_name
                     , REMARK = @remark
                     , save_by = @p_saveby
                 WHERE
                       row_stamp = @p_rowstamp;
             END;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_add_db_auth_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_add_db_auth_S]
    @p_db_id  NVARCHAR(20)
  , @p_values NVARCHAR(MAX)
  , @p_saveby NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................        
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (',', @p_values);
--.................................................................     
         INSERT INTO            TB_DB_AUTH (
                DB_ID
              , EMP_ID
              , create_by
              , save_by )
         SELECT
                @p_db_id
              , emp_id
              , @p_saveby
              , @p_saveby
         FROM   TB_EMP
         WHERE  EMP_ID IN (
                           SELECT
                                  SUBSTRING(vData, 2, LEN(vData)-2)
                           FROM   @tbl
                           WHERE  vData <> ''
                          )
                AND EMP_ID NOT IN (
                                   SELECT
                                          EMP_ID
                                   FROM   TB_DB_AUTH
                                   WHERE  DB_ID = @p_db_id
                                  );
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_attach_file_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_attach_file_D]
    @p_ref_table_name NVARCHAR(255)
  , @p_ref_row_stamp  NVARCHAR(20)
  , @p_file_server    NVARCHAR(255)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DELETE FROM tb_attach_file
             WHERE
                   ref_table_name = @p_ref_table_name
                   AND ref_row_stamp = @p_ref_row_stamp
                   AND file_server = @p_file_server;
             EXEC pk_ATM_sp_attach_file_list_L
                  @p_ref_table_name
                , @p_ref_row_stamp;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_attach_file_list_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_attach_file_list_L]
    @p_ref_table_name NVARCHAR(255)
  , @p_ref_row_stamp  NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                file_source
              , file_server
              , row_stamp
         FROM   tb_attach_file
         WHERE  ref_table_name = @p_ref_table_name
                AND ref_row_stamp = @p_ref_row_stamp;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_attach_file_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_attach_file_S]
    @p_ref_table_name NVARCHAR(255)
  , @p_ref_row_stamp  NVARCHAR(20)
  , @p_file_source    NVARCHAR(255)
  , @p_file_server    NVARCHAR(255)
AS
     BEGIN
         SET NOCOUNT ON;
         INSERT INTO                tb_attach_file (
                ref_table_name
              , ref_row_stamp
              , file_source
              , file_server )
         VALUES (
                @p_ref_table_name
              , @p_ref_row_stamp
              , @p_file_source
              , @p_file_server);
         EXEC pk_ATM_sp_attach_file_list_L
              @p_ref_table_name
            , @p_ref_row_stamp;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_change_menu_location_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_change_menu_location_S]
    @p_id     VARCHAR(20)
  , @p_parent VARCHAR(255)
  , @p_seq    VARCHAR(20)
  , @p_saveby VARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         DECLARE @PRE_PARENT NVARCHAR(255);
         SET @PRE_PARENT = (
                            SELECT
                                   PARENT
                            FROM   tb_menu
                            WHERE  MENU_ID = @p_id
             );
         UPDATE tb_menu
           SET
               parent = @p_parent
             , seq = @p_seq
             , save_by = @p_saveby
         WHERE
               menu_id = @p_id;
         UPDATE tb_menu
           SET
               PARENT = replace(parent, @pre_parent, @p_parent)
         WHERE
               PARENT LIKE @PRE_PARENT+'/'+@p_id+'%';
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_change_pw_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_change_pw_S]
    @p_user    NVARCHAR(20)
  , @p_curr_pw NVARCHAR(255)
  , @p_new_pw  NVARCHAR(255)
AS
     BEGIN
         SET NOCOUNT ON;
         DECLARE @pw AS NVARCHAR(255);
         IF (
             SELECT
                    PWDCOMPARE(@p_curr_pw, PW)
             FROM   tb_emp
             WHERE  emp_id = @p_user
            ) <> 1
         BEGIN
             RAISERROR('현재 비밀번호가 아닙니다.', 16, 1);
             RETURN 0;
         END;
         IF dbo.fn_CheckPassword (@p_new_pw) = 0
         BEGIN
             RAISERROR('비밀번호는 영문과 숫자가 포함된 8자 이상이어야 합니다.', 16, 1);
             RETURN 0;
         END;
         UPDATE tb_emp
           SET
               pw = PWDENCRYPT(@p_new_pw)
             , save_by = @p_user
         WHERE
               emp_id = @p_user;
         SET NOCOUNT OFF;
     END;
GO

/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_auth_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 


2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_auth_L]
    @p_dept_id  NVARCHAR(20)
  , @p_auth_id  NVARCHAR(20)
  , @p_emp_id   NVARCHAR(20)
  , @p_emp_name NVARCHAR(255)
  , @p_login_id NVARCHAR(20)
  , @p_valid    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
--ApplyDB
                AUTH_ID    "@@auth_id"
              , AUTH_NAME  "@@auth_name"
              , SORT_SEQ   "@@sort_seq"
              , VALID      "@@valid"
              , REMARK     "@@remark"
              , ROW_STAMP  "@@key"
--UserView
              , AUTH_ID    "권한코드"
              , AUTH_NAME  "권한명"
              , SORT_SEQ   "정렬순서"
              , REMARK     "비고"
              , CASE WHEN VALID = 1
                    THEN 'O'
                    ELSE 'X'
                       END "<ALIGN=CENTER>사용여부"
         FROM   TB_AUTH
         ORDER BY
                  SORT_SEQ
                , ROW_STAMP;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_code_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_code_D]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DELETE TB_CODE
             WHERE
                   ROW_STAMP = @p_rowstamp;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_code_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_code_L]
    @p_groupid NVARCHAR(20) = NULL
  , @p_valid   NVARCHAR(20) = NULL
AS
     BEGIN
         SET NOCOUNT ON;
         DECLARE @vSql NVARCHAR(4000);
         DECLARE @title NVARCHAR(255);
         DECLARE @fk_table NVARCHAR(255);
         DECLARE @fk_field NVARCHAR(255);
         DECLARE @rel_group NVARCHAR(255);
         DECLARE @rel_value NVARCHAR(255);
         DECLARE title_list CURSOR
         FOR SELECT
                    CODE_TITLE
                  , FK_TABLE
                  , FK_FIELD
                  , REL_GROUP_id
                  , REL_VALUE_ID
             FROM   TB_GROUP
             WHERE  group_ID = @p_groupid
             ORDER BY
                      code_seq;
         DECLARE @idx INT;
         SET @idx = 1;
         SET @vSql = 'SELECT  a.group_id "@@GroupID"';
         OPEN title_list;
         FETCH NEXT FROM title_list INTO @title, @fk_table, @fk_field, @rel_group, @rel_value;
         WHILE(@@FETCH_STATUS <> -1)
         BEGIN

--create sql
             IF isnull(@fk_field, '') = ''
             BEGIN
                 SET @vSql = @vSql+'  ,a.VALUE'+CAST(@idx AS NVARCHAR)+' "'+@title+'"';
                 IF(@title NOT LIKE '@@%')
                 BEGIN
                     SET @vSql = @vSql+',a.VALUE'+CAST(@idx AS NVARCHAR)+' "@@'+@title+'"';
                 END;
             END;
                 ELSE
             BEGIN
                 SET @vSql = @vSql+'  ,(select '+@rel_value+' from '+@fk_table+'
                                                where '+@fk_field+'= A.VALUE'+CAST(@idx AS NVARCHAR);
                 IF isnull(@rel_group, '') <> ''
                     SET @vSql = @vSql+'    and group_id='''+@rel_group+'''';
                 SET @vSql = @vSql+') "'+@title+'"';
                 SET @vSql = @vSql+'  ,a.VALUE'+CAST(@idx AS NVARCHAR)+' "@@'+@title+'"'; --원 코드값
             END;
             SET @idx = @idx + 1;
             FETCH NEXT FROM title_list INTO @title, @fk_table, @fk_field, @rel_group, @rel_value;
         END;
         CLOSE title_list;
         DEALLOCATE title_list;
         SET @vSql = @vSql+'  ,a.sort_seq "@@SORT_SEQ" 
                                ,a.REMARK "@@REMARK" 
                                ,a.valid "@@Valid" 
                                ,''<align=right>''
                                    +cast(a.sort_seq as nvarchar)정렬순서 
                                ,A.REMARK "<WIDTH=30%>비고" 
                                ,''<align=center>''
                                    +convert(nvarchar,a.SAVE_DTTM,120) "저장일시"
                                ,e.EMP_NAME "입력자"
                                ,a.row_stamp "@@KEY"
                                from  TB_CODE a  (NOLOCK) left outer join tb_emp e (NOLOCK) 
                                on a.save_by=e.emp_id
                                where 1=1
                                and a.use_system=0';
         IF ISNULL(@p_groupid, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and a.GROUP_ID ='''+@p_groupid+'''';
         END;
         IF ISNULL(@p_valid, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and a.VALID='''+@p_valid+'''';
         END;
         SET @vSql = @vSql+'    order by a.sort_seq, A.ROW_STAMP';

--select ISNULL(@p_rowstamp, '*')
         PRINT(@vSql);
         EXEC (@vSql);
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_code_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_code_S]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_values);
--.................................................................
         DECLARE @group_id AS NVARCHAR(255);
         DECLARE @value1 AS NVARCHAR(255);
         DECLARE @value2 AS NVARCHAR(255);
         DECLARE @value3 AS NVARCHAR(255);
         DECLARE @value4 AS NVARCHAR(255);
         DECLARE @value5 AS NVARCHAR(255);
         DECLARE @value6 AS NVARCHAR(255);
         DECLARE @value7 AS NVARCHAR(255);
         DECLARE @value8 AS NVARCHAR(255);
         DECLARE @value9 AS NVARCHAR(255);
         DECLARE @value10 AS NVARCHAR(255);
         DECLARE @sort_seq AS NVARCHAR(255);
         DECLARE @remark AS NVARCHAR(255);
         DECLARE @valid AS NVARCHAR(255);
         SET @group_id = (
                          SELECT
                                 vData
                          FROM   @tbl
                          WHERE  idx = 1
             );
         SET @value1 = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 2
             );
         SET @value2 = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 3
             );
         SET @value3 = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 4
             );
         SET @value4 = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 5
             );
         SET @value5 = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 6
             );
         SET @value6 = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 7
             );
         SET @value7 = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 8
             );
         SET @value8 = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 9
             );
         SET @value9 = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 10
             );
         SET @value10 = (
                         SELECT
                                vData
                         FROM   @tbl
                         WHERE  idx = 11
             );
         SET @sort_seq = (
                          SELECT
                                 vData
                          FROM   @tbl
                          WHERE  idx = (
                                        SELECT
                                               MAX(idx)
                                        FROM   @tbl
                                ) - 2
             );
         SET @remark = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = (
                                      SELECT
                                             MAX(idx)
                                      FROM   @tbl
                              ) - 1
             );
         SET @valid = (
                       SELECT
                              vData
                       FROM   @tbl
                       WHERE  idx = (
                                     SELECT
                                            MAX(idx)
                                     FROM   @tbl
                             )
             );
         DECLARE @cnt INT;
         BEGIN TRY
             BEGIN TRAN;
             IF ISNULL(@p_rowstamp, ' ') = ' '
             BEGIN
                 INSERT INTO         tb_code (
                        group_id
                      , value1
                      , value2
                      , value3
                      , value4
                      , value5
                      , value6
                      , value7
                      , value8
                      , value9
                      , value10
                      , remark
                      , sort_seq
                      , valid
                      , USE_SYSTEM
                      , create_by
                      , save_by )
                 SELECT
                        @group_id
                      , isnull(@value1, '')
                      , @value2
                      , @value3
                      , @value4
                      , @value5
                      , @value6
                      , @value7
                      , @value8
                      , @value9
                      , @value10
                      , @remark
                      , @sort_seq
                      , @valid
                      , (
                         SELECT TOP 1
                                USE_SYSTEM
                         FROM    TB_GROUP
                         WHERE  GROUP_ID = @group_id
                        )
                      , @p_saveby
                      , @p_saveby;
                 IF @value1 IS NULL
                 BEGIN
                     IF @group_id = 'AUTH'
                     BEGIN
                         SET @value1 = @value2;
                     END;
                         ELSE
                     BEGIN
                         SET @value1 = dbo.[fn_genCode] ('CD', SCOPE_IDENTITY());
                     END;
                     UPDATE TB_CODE
                       SET
                           VALUE1 = @value1
                     WHERE
                           ROW_STAMP = SCOPE_IDENTITY();
                 END;
             END;
                 ELSE
             BEGIN
                 UPDATE tb_code
                   SET
                       group_id = @group_id
                     , value1 = @value1
                     , value2 = @value2
                     , value3 = @value3
                     , value4 = @value4
                     , value5 = @value5
                     , value6 = @value6
                     , value7 = @value7
                     , value8 = @value8
                     , value9 = @value9
                     , value10 = @value10
                     , remark = @remark
                     , sort_Seq = @sort_seq
                     , valid = @valid
                     , save_by = @p_saveby
                 WHERE
                       row_stamp = @p_rowstamp;
             END;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_dept_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_dept_D]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_values);
--.................................................................
         BEGIN TRY
             BEGIN TRAN;
             DELETE TB_DEPT
             WHERE
                   ROW_STAMP = @p_rowstamp;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_dept_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_dept_L]
    @p_dept_id  NVARCHAR(20)
  , @p_auth_id  NVARCHAR(20)
  , @p_emp_id   NVARCHAR(20)
  , @p_emp_name NVARCHAR(255)
  , @p_login_id NVARCHAR(20)
  , @p_valid    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
--ApplyDB
                DEPT_ID    "@@dept_id"
              , DEPT_NAME  "@@dept_name"
              , SORT_SEQ   "@@sort_seq"
              , REMARK     "@@remark"
              , VALID      "@@valid"
              , ROW_STAMP  "@@key"
--UserView
              , DEPT_ID    "부서코드"
              , DEPT_NAME  "부서명"
              , SORT_SEQ   "정렬순서"
              , REMARK     "비고"
              , CASE WHEN VALID = 1
                    THEN 'O'
                    ELSE 'X'
                       END "<ALIGN=CENTER>사용여부"
         FROM   TB_DEPT
         ORDER BY
                  SORT_SEQ
                , ROW_STAMP;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_dept_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_dept_S]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................  
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_values);
--.................................................................  
         DECLARE @dept_id AS NVARCHAR(20);
         DECLARE @dept_name AS NVARCHAR(255);
         DECLARE @sort_seq AS NVARCHAR(255);
         DECLARE @remark AS NVARCHAR(255);
         DECLARE @valid AS NVARCHAR(20);
         SET @dept_id = (
                         SELECT
                                vData
                         FROM   @tbl
                         WHERE  idx = 1
             );
         SET @dept_name = (
                           SELECT
                                  vData
                           FROM   @tbl
                           WHERE  idx = 2
             );
         SET @sort_seq = (
                          SELECT
                                 vData
                          FROM   @tbl
                          WHERE  idx = 3
             );
         SET @remark = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 4
             );
         SET @valid = (
                       SELECT
                              vData
                       FROM   @tbl
                       WHERE  idx = 5
             );
         IF @dept_id IS NULL
         BEGIN
             SET @dept_id = '';
         END;
         BEGIN TRY
             BEGIN TRAN;
             IF ISNULL(@p_rowstamp, '') = ''
             BEGIN
                 INSERT INTO         TB_DEPT (
                        DEPT_ID
                      , DEPT_NAME
                      , SORT_SEQ
                      , VALID
                      , REMARK
                      , create_by
                      , save_by )
                 SELECT
                        @dept_id
                      , @dept_name
                      , @sort_seq
                      , @valid
                      , @remark
                      , @p_saveby
                      , @p_saveby;
                 IF ISNULL(@dept_id, '') = ''
                 BEGIN
                     SET @dept_id = dbo.[fn_genCode] ('A', SCOPE_IDENTITY());
                     UPDATE TB_DEPT
                       SET
                           DEPT_ID = @dept_id
                     WHERE
                           ROW_STAMP = SCOPE_IDENTITY();
                 END;
             END;
                 ELSE
             BEGIN
                 UPDATE TB_DEPT
                   SET
                       DEPT_NAME = @dept_name
                     , SORT_SEQ = @sort_seq
                     , VALID = @valid
                     , REMARK = @remark
                     , save_by = @p_saveby
                 WHERE
                       row_stamp = @p_rowstamp;
             END;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_emp_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_emp_D]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DELETE TB_MENU_AUTH
             WHERE
                   EMP_ID = (
                             SELECT
                                    emp_id
                             FROM   tb_emp
                             WHERE  row_stamp = @p_rowstamp
                   );
             DELETE TB_EMP
             WHERE
                   ROW_STAMP = @p_rowstamp;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_emp_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_emp_L]
    @p_dept_id  NVARCHAR(20)
  , @p_auth_id  NVARCHAR(20)
  , @p_emp_no   NVARCHAR(20)
  , @p_emp_name NVARCHAR(255)
  , @p_emp_id   NVARCHAR(20)
  , @p_valid    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
--ApplyDB
                emp.emp_no         "@@emp_no"
              , emp.EMP_ID         "@@emp_id"
              , emp.EMP_NAME       "@@emp_name"
              , emp.DEPT_ID        "@@dept_id"
              , emp.STAMP_IMAGE    "@@stamp_image"
              , emp.TEL_INFO       "@@tel_info"
              , emp.ADDR_INFO      "@@addr_info"
              , emp.AUTH_ID        "@@auth_id"
              , emp.IS_ADMIN       "@@is_admin"
              , ''                 "@@PW_INITIAL"
              , emp.REMARK         "@@remark"
              , emp.VALID          "@@valid"
              , emp.ROW_STAMP      "@@key"
--UserView
              , emp.EMP_NO         "사원번호"
              , emp.EMP_ID         로그인ID
              , emp.EMP_NAME       "사원명"
              , dept.DEPT_NAME     "부서"
              , CASE WHEN isnull(emp.STAMP_IMAGE, '') <> ''
                    THEN '<tag>'++'<a class="link_btn"  href="javascript:showImage('''+CAST(emp.STAMP_IMAGE AS NVARCHAR(20))+''')">VIEW</a>'
                    ELSE ''
                               END "<ALIGN=CENTER>사인(도장)"
              , emp.TEL_INFO       "<tag;WIDTH=120>연락처"
              , emp.ADDR_INFO      "<WIDTH=30%>주소"
              , auth.AUTH_NAME     "권한"
              , CASE WHEN EMP.IS_ADMIN = 1
                    THEN 'O'
                    ELSE 'X'
                               END "<ALIGN=CENTER>프로그램관리자"
         FROM   TB_EMP emp
         JOIN TB_DEPT dept ON emp.DEPT_ID = dept.DEPT_ID
         JOIN TB_AUTH auth ON emp.AUTH_ID = auth.AUTH_ID
         WHERE  emp.EMP_ID LIKE '%'+isnull(@p_emp_id, '')+'%'
                AND emp.EMP_NAME LIKE '%'+isnull(@p_emp_name, '')+'%'
                AND emp.emp_no LIKE '%'+isnull(@p_emp_no, '')+'%'
                AND emp.VALID = @p_valid
                AND CASE WHEN isnull(@p_dept_id, '*') <> '*'
                        THEN CASE WHEN emp.DEPT_ID = @p_dept_id
                                 THEN 1
                                 ELSE 0
                             END
                        ELSE 1
                    END = 1
                AND CASE WHEN isnull(@p_auth_id, '*') <> '*'
                        THEN CASE WHEN emp.AUTH_ID = @p_auth_id
                                 THEN 1
                                 ELSE 0
                             END
                        ELSE 1
                    END = 1;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_emp_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_emp_S]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_values);
--.................................................................
         DECLARE @emp_no AS NVARCHAR(255);
         DECLARE @emp_id AS NVARCHAR(255);
         DECLARE @emp_name AS NVARCHAR(255);
         DECLARE @dept_id AS NVARCHAR(255);
         DECLARE @stamp_image AS NVARCHAR(255);
         DECLARE @tel AS NVARCHAR(255);
         DECLARE @addr AS NVARCHAR(255);
         DECLARE @auth_id AS NVARCHAR(255);
         DECLARE @is_admin AS NVARCHAR(255);
         DECLARE @pw_initial AS NVARCHAR(255);
         DECLARE @remark AS NVARCHAR(255);
         DECLARE @valid AS NVARCHAR(255);
         SET @emp_no = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 1
             );
         SET @emp_id = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 2
             );
         SET @emp_name = (
                          SELECT
                                 vData
                          FROM   @tbl
                          WHERE  idx = 3
             );
         SET @dept_id = (
                         SELECT
                                vData
                         FROM   @tbl
                         WHERE  idx = 4
             );
         SET @stamp_image = (
                             SELECT
                                    vData
                             FROM   @tbl
                             WHERE  idx = 5
             );
         SET @tel = (
                     SELECT
                            vData
                     FROM   @tbl
                     WHERE  idx = 6
             );
         SET @addr = (
                      SELECT
                             vData
                      FROM   @tbl
                      WHERE  idx = 7
             );
         SET @auth_id = (
                         SELECT
                                vData
                         FROM   @tbl
                         WHERE  idx = 8
             );
         SET @is_admin = (
                          SELECT
                                 vData
                          FROM   @tbl
                          WHERE  idx = 9
             );
         SET @pw_initial = (
                            SELECT
                                   vData
                            FROM   @tbl
                            WHERE  idx = 10
             );
         SET @remark = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 11
             );
         SET @valid = (
                       SELECT
                              vData
                       FROM   @tbl
                       WHERE  idx = 12
             );
         IF @emp_id IS NULL
         BEGIN
             SET @emp_id = '';
         END;
         BEGIN TRY
             BEGIN TRAN;
             IF ISNULL(@p_rowstamp, ' ') = ' '
             BEGIN
                 INSERT INTO        tb_emp (
                        emp_id
                      , emp_name
                      , DEPT_ID
                      , STAMP_IMAGE
                      , emp_no
                      , AUTH_ID
                      , IS_ADMIN
                      , PW
                      , TEL_INFO
                      , ADDR_INFO
                      , valid
                      , Remark
                      , create_by
                      , SAVE_BY )
                 SELECT
                        isnull(@emp_id, @emp_no)
                      , @emp_name
                      , @dept_id
                      , @stamp_image
                      , @emp_no
                      , @auth_id
                      , @is_admin
                      , PWDENCRYPT('1')
                      , @tel
                      , @addr
                      , @valid
                      , @Remark
                      , @p_saveby
                      , @p_saveby;
                 IF @emp_id = ''
                 BEGIN
                     SET @emp_no = dbo.[fn_genCode] ('A', SCOPE_IDENTITY());
                     UPDATE TB_EMP
                       SET
                           EMP_no = @emp_no
                     WHERE
                           ROW_STAMP = SCOPE_IDENTITY();
                 END;
             END;
                 ELSE
             BEGIN
                 UPDATE tb_emp
                   SET
                       EMP_NAME = @emp_name
                     , DEPT_ID = @dept_id
                     , STAMP_IMAGE = CASE WHEN isnull(@stamp_image, '') <> ''
                                         THEN @stamp_image
                                     END
                     , EMP_ID = @emp_id
                     , AUTH_ID = @auth_id
                     , IS_ADMIN = @is_admin
                     , TEL_INFO = @tel
                     , ADDR_INFO = @addr
                     , valid = @valid
                     , Remark = @Remark
                     , save_by = @p_saveby
                 WHERE
                       row_stamp = @p_rowstamp;
             END;
             IF(@pw_initial = 1)
             BEGIN
                 UPDATE tb_emp
                   SET
                       PW = PWDENCRYPT('1')
                 WHERE
                       row_stamp = @p_rowstamp;
             END;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_group_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_group_L]
    @p_groupid NVARCHAR(20) = NULL
  , @p_valid   NVARCHAR(20) = NULL
AS
     BEGIN
         SET NOCOUNT ON;
         DECLARE @vSql NVARCHAR(4000);
         DECLARE @title NVARCHAR(255);
         DECLARE @fk_table NVARCHAR(255);
         DECLARE @fk_field NVARCHAR(255);
         DECLARE @rel_group NVARCHAR(255);
         DECLARE @rel_value NVARCHAR(255);
         DECLARE title_list CURSOR
         FOR SELECT
                    CODE_TITLE
                  , FK_TABLE
                  , FK_FIELD
                  , REL_GROUP_id
                  , REL_VALUE_ID
             FROM   TB_GROUP
             WHERE  group_ID = @p_groupid
             ORDER BY
                      code_seq;
         DECLARE @idx INT;
         SET @idx = 1;
         SET @vSql = 'SELECT  a.group_id "@@GroupID"';
         OPEN title_list;
         FETCH NEXT FROM title_list INTO @title, @fk_table, @fk_field, @rel_group, @rel_value;
         WHILE(@@FETCH_STATUS <> -1)
         BEGIN

--create sql
             IF isnull(@fk_field, '') = ''
             BEGIN
                 SET @vSql = @vSql+'  ,a.VALUE'+CAST(@idx AS NVARCHAR)+' "'+@title+'"';
                 IF(@title NOT LIKE '@@%')
                 BEGIN
                     SET @vSql = @vSql+',a.VALUE'+CAST(@idx AS NVARCHAR)+' "@@'+@title+'"';
                 END;
             END;
                 ELSE
             BEGIN
                 SET @vSql = @vSql+'  ,(select '+@rel_value+' from '+@fk_table+'
                                                where '+@fk_field+'= A.VALUE'+CAST(@idx AS NVARCHAR);
                 IF isnull(@rel_group, '') <> ''
                     SET @vSql = @vSql+'    and group_id='''+@rel_group+'''';
                 SET @vSql = @vSql+') "'+@title+'"';
                 SET @vSql = @vSql+'  ,a.VALUE'+CAST(@idx AS NVARCHAR)+' "@@'+@title+'"'; --원 코드값
             END;
             SET @idx = @idx + 1;
             FETCH NEXT FROM title_list INTO @title, @fk_table, @fk_field, @rel_group, @rel_value;
         END;
         CLOSE title_list;
         DEALLOCATE title_list;
         SET @vSql = @vSql+'  ,a.sort_seq "@@SORT_SEQ" 
                                ,a.REMARK "@@REMARK" 
                                ,a.valid "@@Valid" 
                                ,''<align=right>''
                                    +cast(a.sort_seq as nvarchar)정렬순서 
                                ,A.REMARK 비고
                                , ''<align=center>''
                                    +(case a.valid
                                        when ''0'' then ''X''
                                        else ''O''end)  "사용여부"
                                ,''<align=center>''
                                    +convert(nvarchar,a.SAVE_DTTM,120) "저장일시"
                                ,e.EMP_NAME "입력자"
                                ,a.row_stamp "@@KEY"
                                from  TB_CODE a  (NOLOCK) left outer join tb_emp e (NOLOCK) 
                                on a.save_by=e.emp_id
                                where 1=1
                                and a.use_system=1';
         IF ISNULL(@p_groupid, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and a.GROUP_ID ='''+@p_groupid+'''';
         END;
         IF ISNULL(@p_valid, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' and a.VALID='''+@p_valid+'''';
         END;
         SET @vSql = @vSql+'    order by a.sort_seq, A.ROW_STAMP';

--select ISNULL(@p_rowstamp, '*')
         PRINT(@vSql);
         EXEC (@vSql);
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_init_dictionary_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_init_dictionary_D]
    @p_lang_id NVARCHAR(20)
  , @P_kor     NVARCHAR(255)
  , @p_save_by NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DELETE FROM TB_DICTIONARY
             WHERE
                   lang_id = @p_lang_id;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_L]
    @p_groupid  NVARCHAR(20)
  , @p_rowstamp NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         DECLARE @vSql NVARCHAR(4000);
         DECLARE @title NVARCHAR(4000);
         DECLARE title_list CURSOR
         FOR SELECT
                    CODE_TITLE
             FROM   TB_GROUP
             WHERE  group_ID = @p_groupid
             ORDER BY
                      code_seq;
         DECLARE @idx INT;
         SET @idx = 1;
         SET @vSql = 'SELECT  group_id  "@@GROUP" ';
         OPEN title_list;
         FETCH NEXT FROM title_list INTO @title;
         WHILE(@@FETCH_STATUS <> -1)
         BEGIN

--create sql
             SET @vSql = @vSql+'  ,VALUE'+CAST(@idx AS NVARCHAR)+' '+@title;
             SET @idx = @idx + 1;
             FETCH NEXT FROM title_list INTO @title;
         END;
         CLOSE title_list;
         DEALLOCATE title_list;
         SET @vSql = @vSql+'  , valid "사용"
                                from  TB_CODE';
         IF ISNULL(@p_rowstamp, '*') <> '*'
         BEGIN
             SET @vSql = @vSql+' where ROW_STAMP ='''+@p_rowstamp+'''';
         END;

--select ISNULL(@p_rowstamp, '*')
         EXEC (@vSql);
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_System_Lang_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create PROCEDURE [dbo].[pk_ATM_sp_code_System_Lang_L]
    @P_USER_LANG_ID NVARCHAR(30),
    @P_USER_ID NVARCHAR(30)
AS
BEGIN
    
    SET NOCOUNT ON;

   SELECT SYSTEM_LANG_ID "@@KEY"
    FROM dbo.TB_LANGUAGE WITH(NOLOCK)
    WHERE LANG_ID = @P_USER_LANG_ID
END
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_upload_dictionary_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_upload_dictionary_S]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_params    NVARCHAR(MAX)
  , @p_fields    NVARCHAR(MAX)
  , @p_values    NVARCHAR(MAX)
  , @p_filename  NVARCHAR(MAX)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................  
         DECLARE @tblV TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tblV
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_values);
--.................................................................  
--parsing value string ..............................................  
         DECLARE @tblF TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tblF
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_fields);
--.................................................................  
--parsing value string ..............................................  
         DECLARE @tblP TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tblP
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_params);
--.................................................................  
         DECLARE @lang_id NVARCHAR(255);
         DECLARE @kor NVARCHAR(255);
         DECLARE @trans NVARCHAR(255);
         SET @lang_id = (
                         SELECT
                                vData
                         FROM   @tblV
                         WHERE  idx = 1
             );
         SET @kor = (
                     SELECT
                            vData
                     FROM   @tblV
                     WHERE  idx = 2
             );
         SET @trans = (
                       SELECT
                              vData
                       FROM   @tblV
                       WHERE  idx = 3
             );
         BEGIN TRY
             BEGIN TRAN;
             IF EXISTS (
                        SELECT
                               *
                        FROM   TB_DICTIONARY
                        WHERE  LANG_ID = @lang_id
                               AND KOR = @kor
                       )
             BEGIN
                 UPDATE TB_DICTIONARY
                   SET
                       TRANS = @trans
                 WHERE
                       LANG_ID = @lang_id
                       AND KOR = @kor;
             END;
                 ELSE
             BEGIN
                 INSERT INTO               TB_DICTIONARY (
                        LANG_ID
                      , KOR
                      , TRANS )
                 SELECT
                        @lang_id
                      , @kor
                      , @trans;
             END;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_user_group_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_user_group_D]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................  
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_values);
--.................................................................  
         DECLARE @user_group_id AS NVARCHAR(20);
         DECLARE @user_group_name AS NVARCHAR(255);
         DECLARE @remark AS NVARCHAR(255);
         SET @user_group_id = (
                               SELECT
                                      vData
                               FROM   @tbl
                               WHERE  idx = 1
             );
         SET @user_group_name = (
                                 SELECT
                                        vData
                                 FROM   @tbl
                                 WHERE  idx = 2
             );
         SET @remark = (
                        SELECT
                               vData
                        FROM   @tbl
                        WHERE  idx = 3
             );
         BEGIN TRY
             BEGIN TRAN;
             DELETE TB_USER_GROUP
             WHERE
                   ROW_STAMP = @p_rowstamp;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_user_group_emp_info_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[pk_ATM_sp_code_user_group_emp_info_D]
    @p_user_group_id NVARCHAR(20)   = NULL
  , @p_values        NVARCHAR(4000)
  , @p_saveby        NVARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    --parsing value string ..............................................        
    DECLARE @tbl TABLE(
          idx   INT
        , vData NVARCHAR(255)
    );

    INSERT INTO @tbl
    SELECT *
    FROM dbo.fn_getValues (',', @p_values);
    
    --.................................................................     
    BEGIN TRY
    BEGIN TRAN;
        
        DELETE TB_USER_GROUP_EMP_INFO
        WHERE ROW_sTAMP IN(SELECT SUBSTRING(vData, 2, LEN(vData)-2) FROM @tbl WHERE  vData <> '');
        
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
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_user_group_emp_info_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[pk_ATM_sp_code_user_group_emp_info_L]
    @p_user_group_id NVARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    SELECT UI.ROW_STAMP    "@@KEY"
        ,  E.EMP_ID        "사원번호"
        ,  E.EMP_NAME      "사원명"
        ,  D.DEPT_NAME     "부서"
        ,  CASE WHEN isnull(E.STAMP_IMAGE, '') <> '' THEN '<tag>'++'<a class="link_btn"  href="javascript:showImage('''+CAST(E.STAMP_IMAGE AS NVARCHAR(20))+''')">VIEW</a>'
                                                     ELSE ''
           END             "<ALIGN=CENTER>사인(도장)"
        ,  E.TEL_INFO      "<WIDTH=120>연락처"
        ,  E.ADDR_INFO     "<WIDTH=30%>주소"
    FROM TB_USER_GROUP_EMP_INFO UI WITH (NOLOCK)
    JOIN TB_EMP E WITH (NOLOCK) ON UI.EMP_ID = E.EMP_ID AND E.VALID = 1
    JOIN TB_AUTH A WITH (NOLOCK) ON E.AUTH_ID = A.AUTH_ID
    JOIN TB_DEPT D WITH (NOLOCK) ON E.DEPT_ID = D.DEPT_ID AND D.VALID = 1
    WHERE  UI.USER_GROUP_ID = @p_user_group_id;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_user_group_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[pk_ATM_sp_code_user_group_L]
    @p_user_group_id   NVARCHAR(20) -- SALES_ADMIN
  , @p_user_group_name NVARCHAR(20) -- 영업관리자
AS
BEGIN
SET NOCOUNT ON;

    SELECT --apply 
          USER_GROUP_ID                  "@@USER_GROUP_ID"
        , USER_GROUP_NAME                "@@USER_GROUP_NAME"
        , ug.REMARK                      "@@REMARK"
        , USER_GROUP_ID                  "@@PARAM"
        , ug.ROW_STAMP                   "@@KEY"
        -- user view 
        , user_group_id                  "사용자그룹코드"
        , user_group_name                "사용자그룹명"
        , ug.REMARK                      "<WIDTH=20%>비고"
        , isnull(emp.EMP_NAME, 'SYSTEM') "<align=center>입력자"
        , ug.SAVE_DTTM                   "<align=center;width=20%>저장일시"
    FROM tb_user_group UG WITH (NOLOCK)
    LEFT OUTER JOIN TB_EMP emp WITH (NOLOCK) ON ug.SAVE_BY = emp.EMP_ID
    WHERE ( ISNULL(@p_user_group_id, '*') = '*' OR USER_GROUP_ID LIKE '%'+@p_user_group_id+'%' )
      AND ( ISNULL(@p_user_group_name, '*') = '*' OR USER_GROUP_NAME LIKE '%'+@p_user_group_name+'%' )

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_code_user_group_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_code_user_group_S]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    --parsing value string ..............................................  
    DECLARE @tbl TABLE(
        idx   INT
    , vData NVARCHAR(255));
    INSERT INTO @tbl
    SELECT
        *
    FROM   dbo.fn_getValues (@p_delimiter, @p_values);

    --.................................................................  
    DECLARE @user_group_id AS NVARCHAR(20);
    DECLARE @user_group_name AS NVARCHAR(255);
    DECLARE @remark AS NVARCHAR(255);
    
    SET @user_group_id   = ( SELECT vData FROM @tbl WHERE idx = 1 );
    SET @user_group_name = ( SELECT vData FROM @tbl WHERE idx = 2 );
    SET @remark          = ( SELECT vData FROM @tbl WHERE idx = 3 );

    BEGIN TRY
    BEGIN TRAN;

        IF ISNULL(@p_rowstamp, '') = ''
        BEGIN
            INSERT INTO TB_USER_GROUP (
                  USER_GROUP_ID
                , USER_GROUP_NAME
                , REMARK
                , create_by
                , save_by 
            )
            SELECT isnull(@user_group_id, '')
                ,  @user_group_name
                ,  @remark
                ,  @p_saveby
                ,  @p_saveby
                ;

            IF ISNULL(@user_group_id, '') = ''
            BEGIN
                SET @user_group_id = dbo.[fn_genCode] ('UG', SCOPE_IDENTITY());

                UPDATE TB_USER_GROUP
                SET user_group_id = @user_group_id
                WHERE ROW_STAMP = SCOPE_IDENTITY();
            END
        END
        ELSE
        BEGIN
            UPDATE TB_USER_GROUP
            SET user_group_name = @user_group_name
              , REMARK = @remark
              , save_by = @p_saveby
            WHERE row_stamp = @p_rowstamp;

        END;
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
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_common_addItembyCodeList]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[pk_ATM_sp_common_addItembyCodeList]
    @p_group_id NVARCHAR(255)
  , @p_where    NVARCHAR(4000) = NULL
AS
BEGIN
SET NOCOUNT ON;

    DECLARE @vSql VARCHAR(8000);
    DECLARE @order_by VARCHAR(8000);

    IF(@p_group_id = 'INSP_LIST')
    BEGIN
        /* 자주검사항목 */
        SET @vSql = 'select INSP_ID "@@key"
                        ,   INSP_NAME "@@"
                        ,   INSP_NAME "검사항목"
                        ,   PR.PROC_NAME 검사공정
                    from TB_INSP I
                    LEFT OUTER JOIN TB_PROC PR
                    ON I.PROC_ID=PR.PROC_ID ';
    END;
    ELSE IF(@p_group_id = 'INSP_TYPE')
    BEGIN
        /* 검사유형 */
        SET @vSql = 'select TI.INSP_TYPE_ID  "@@KEY"
                            ,  TI.INSP_TYPE_ID  검사유형코드
                            ,  T.INSP_TYPE_NAME 검사유형명
                    FROM TB_PART_INSP_TYPE_INFO TI
                    JOIN TB_INSP_TYPE T
                    ON TI.INSP_TYPE_ID = T.INSP_TYPE_ID';
    END
    ELSE IF(@p_group_id = 'CONDI_ITEM')
    BEGIN
        /* 공정조건정보 */

        SET @vSql = 'SELECT C.CONDI_ID "@@KEY"
                            , C.CONDI_GROUP  "조건구분"
                            , C.CONDI_ID "조건항목코드"
                            , C5.CONDI_NAME "조건항목명"
                    FROM TB_CONDI C 
                    WHERE C.VALID =1 
                    ORDER BY CONDI_ID';
    END;
    ELSE IF(@p_group_id = 'PROD_WORKER')
    BEGIN
        /* 공정조건정보 */
        SET @vSql = 'SELECT UI.EMP_ID "@@KEY"
                            ,  E.EMP_NAME "@@"
                            ,  E.EMP_ID 사원번호
                            ,  E.EMP_NAME 사원명
                            ,  D.DEPT_NAME 부서
                            ,  EI.WORK_GROUP_ID 작업조
                    FROM VW_USER_PROD UI
                    JOIN TB_EMP E
                    ON UI.EMP_ID=E.EMP_ID AND E.VALID=1
                    JOIN TB_DEPT D
                    ON E.DEPT_ID=D.DEPT_ID AND D.VALID=1 
                    LEFT OUTER JOIN TB_WORK_GROUP_EMP_INFO  EI
                    ON E.EMP_ID = EI.EMP_ID';
    END
    ELSE IF(@p_group_id = 'EMP')
    BEGIN
        /* 사원정보 */
        SET @vSql = 'SELECT EMP_ID "@@KEY"
                            ,  EMP_ID "사원번호"
                            ,  EMP_NAME "사원명"
                            ,  DEPT.DEPT_NAME "부서"
                    FROM TB_EMP EMP
                    JOIN TB_DEPT DEPT 
                    ON EMP.DEPT_ID = DEPT.DEPT_ID 
                    WHERE EMP.VALID = 1 ';
    END;
    ELSE IF(@p_group_id = 'PROD_RETURN')
    BEGIN
        /* 미사용반입창고 */
        SET @vSql = 'SELECT CASE WHEN LOCS.ROW_STAMP IS NULL THEN LOC.LOC_ID
                                                                ELSE LOCS.SUB_LOC_ID
                            END   "@@KEY"
                            , LOC.LOC_NAME 적재창고
                            , ISNULL(SN.LOC_NAME,''-'') 적재위치
                    FROM TB_LOC LOC
                    LEFT OUTER JOIN TB_LOC_SUB_INFO LOCS
                    ON LOC.LOC_ID=LOCS.LOC_ID
                    LEFT OUTER JOIN TB_LOC SN
                    ON LOCS.SUB_LOC_ID=SN.LOC_ID
                    WHERE LOC.LOC_TYPE_ID=''MATERIAL_LOC'' 
                    AND LOC.IS_SUB=0
                    ORDER BY LOC.SORT_SEQ, SN.SORT_SEQ';
    END;
    ELSE
    BEGIN
        PRINT 'else';
        DECLARE @title1 NVARCHAR(20);
        DECLARE @title2 NVARCHAR(20);
        SET @title1 = ( SELECT code_title FROM tb_group WHERE  group_id = @p_group_id AND code_seq = 1 );
        SET @title2 = ( SELECT code_title FROM tb_group WHERE  group_id = @p_group_id AND code_seq = 2 );

        IF @title1 IS NULL
        BEGIN
            SET @title1 = '코드'
        END;
        IF @title2 IS NULL
        BEGIN
            SET @title2 = '이름'
        END;
            
        SET @vSql = 'select value1 "'+@title1+'" ';
        IF @title2 IS NOT NULL
        BEGIN
            SET @vSql = @vSql+',value2  "'+@title2+'"'
        END;
        SET @vSql = @vSql+' ,value1 "@@KEY" 
                            from tb_code          
                            where valid=1 and group_id='''+@p_group_id+'''';
        PRINT(@vSql);
        SET @order_by = ' order by sort_seq, ROW_STAMP';
    END;

    IF isnull(@p_where, '*') <> '*'
    BEGIN
        IF ( SELECT CHARINDEX('where', @vSql) ) > 0
        BEGIN
            IF ( SELECT CHARINDEX('and', LTRIM(@p_where)) ) = 1
            BEGIN
                SET @vSql = @vSql + @p_where;
            END;
            ELSE
            BEGIN
                SET @vSql = @vSql+' and '+N''+@p_where;
            END;
        END;
        ELSE
        BEGIN
            SET @vSql = @vSql+' where '+@p_where;
        END;
    END;

    IF ( SELECT CHARINDEX('order by', LTRIM(@vSql)) ) < 1 
    BEGIN
        IF @order_by IS NULL
        BEGIN
            IF ( SELECT CHARINDEX(',', LTRIM(@vSql)) ) > 0
            BEGIN
                SET @vSql = @vSql+' order by 2';
            END;
            ELSE
            BEGIN
                SET @vSql = @vSql+' order by 1';
            END;
        END;
        ELSE
        BEGIN
            SET @vSql = @vSql + @order_by;
        END;
    END;

    PRINT(@vSql);
    EXEC (@vSql);

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_db_auth_info_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_db_auth_info_D]
    @p_db_id  NVARCHAR(20)   = ''
  , @p_values NVARCHAR(4000)
  , @p_saveby NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................  
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (',', @p_values);
--.................................................................   
         BEGIN TRY
             BEGIN TRAN;
             DELETE FROM TB_DB_AUTH
             WHERE
                   EMP_ID IN(SELECT
                                    SUBSTRING(vData, 2, LEN(vData)-2)
                             FROM   @tbl
                             WHERE  vData <> '');
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_db_auth_info_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[pk_ATM_sp_db_auth_info_L]
    @p_id NVARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    SELECT a.EMP_ID                                                                         사원아이디
        ,  B.EMP_NAME                                                                       사원명
        ,  (SELECT AA.DEPT_NAME FROM TB_DEPT AA WITH (NOLOCK) WHERE AA.DEPT_ID = B.DEPT_ID) 부서
        ,  (SELECT AA.AUTH_NAME FROM TB_AUTH AA WITH (NOLOCK) WHERE AA.AUTH_ID = B.AUTH_ID) 권한그룹
        ,  a.EMP_ID                                                                         "@@KEY"
    FROM tb_db_auth a WITH (NOLOCK)
    JOIN TB_EMP b WITH (NOLOCK) ON a.EMP_ID = b.EMP_ID
    WHERE A.DB_ID = @p_id;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_db_auth_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_db_auth_L]
    @p_emp_id NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                a.DB_ID
              , c.db_name
              , a.DB_ID "@@KEY"
         FROM   tb_db_auth a
         JOIN TB_EMP b ON a.EMP_ID = b.EMP_ID
         JOIN TB_DB c ON a.DB_ID = c.DB_ID
         WHERE  a.EMP_ID = @p_emp_id
         ORDER BY
                  c.sort_seq;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_db_info_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_db_info_D]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................  
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_values);
--.................................................................  
         DECLARE @DB_ID AS NVARCHAR(255);
         SET @DB_ID = (
                       SELECT
                              vData
                       FROM   @tbl
                       WHERE  idx = 1
             );
         DELETE tb_db
         WHERE
               [db_id] = @p_rowstamp;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_db_info_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_db_info_L]
    @DB NVARCHAR(20) = NULL
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                A.DB_ID    "DB"
              , A.db_NAME  "NAME"
              , A.SORT_SEQ "정렬순서"
              , A.DB_ID    "@@PARAM"
              , A.DB_ID    "@@KEY"
         FROM   TB_DB a
         ORDER BY
                  SORT_SEQ;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_db_info_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_db_info_S]
    @p_key       NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................  
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (@p_delimiter, @p_values);
--.................................................................  
         DECLARE @DB_ID AS NVARCHAR(255);
         DECLARE @DB_NAME AS NVARCHAR(255);
         DECLARE @SORT_SEQ AS NVARCHAR(255);
         SET @DB_ID = (
                       SELECT
                              vData
                       FROM   @tbl
                       WHERE  idx = 1
             );
         SET @DB_NAME = (
                         SELECT
                                vData
                         FROM   @tbl
                         WHERE  idx = 2
             );
         SET @SORT_SEQ = (
                          SELECT
                                 vData
                          FROM   @tbl
                          WHERE  idx = 3
             );
         BEGIN TRY
             BEGIN TRAN;
             IF ISNULL(@p_key, ' ') = ' '
             BEGIN
                 IF EXISTS (
                            SELECT
                                   *
                            FROM   TB_DB
                            WHERE  DB_ID = @p_key
                           )
                 BEGIN
                     RAISERROR('이미 등록된 DB입니다.', 16, 1);
                     RETURN 0;
                 END;
                 INSERT INTO       TB_DB (
                        DB_ID
                      , DB_NAME
                      , SORT_SEQ
                      , CREATE_BY
                      , SAVE_BY )
                 SELECT
                        @DB_ID
                      , @DB_NAME
                      , @SORT_SEQ
                      , @p_saveby
                      , @p_saveby;
             END;
                 ELSE
             BEGIN
                 UPDATE TB_DB
                   SET
                       DB_NAME = @DB_NAME
                     , SORT_SEQ = @SORT_SEQ
                     , SAVE_BY = @p_saveby
                 WHERE
                       DB_ID = @p_key;
             END;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_dictionary_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_dictionary_L]
    @p_lang_id NVARCHAR(20)
  , @p_kor     NVARCHAR(255) = NULL
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                LOWER(replace(kor, ' ', '')) kor
              , TRANS
         FROM   TB_DICTIONARY WITH (NOLOCK)
         WHERE  LANG_ID = @p_lang_id
                AND KOR LIKE '%'+ISNULL(@p_kor, '')+'%';
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_dictionary_L_by_user]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_dictionary_L_by_user]
    @p_user_id NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                kor
              , TRANS
         FROM   TB_DICTIONARY
         WHERE  LANG_ID = (
                           SELECT TOP 1
                                  LANG_ID
                           FROM   TB_LOGIN_HIST
                           WHERE  EMP_ID = @p_user_id
                           ORDER BY
                                    CREATE_DTTM DESC
               );
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_dictionary_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_dictionary_S]
    @p_kor       NVARCHAR(255)
  , @p_lang_id   NVARCHAR(20)
  , @p_create_by NVARCHAR(20)  = NULL
AS
     BEGIN
         SET NOCOUNT ON;
         INSERT INTO               TB_DICTIONARY (
                LANG_ID
              , KOR
              , TRANS
              , create_by )
         VALUES (
                @p_lang_id
              , @p_kor
              , @p_kor
              , @p_create_by);
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_dictionary_S_by_user]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_dictionary_S_by_user]
    @p_kor     NVARCHAR(255)
  , @p_user_id NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         INSERT INTO               TB_DICTIONARY (
                LANG_ID
              , KOR
              , TRANS )
         SELECT TOP 1
                a.lang_id
              , @p_kor
              , @p_kor
         FROM   tb_login_hist a
         WHERE  emp_id = @p_user_id
         ORDER BY
                  create_dttm DESC;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_get_menu_auth_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_get_menu_auth_L]
    @p_menu_id VARCHAR(20)
  , @p_user_id VARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         DECLARE @count INT;
         SELECT
                @count = COUNT(*)
         FROM   TB_MENU_AUTH
         WHERE  MENU_ID = @p_menu_id
                AND user_group = 'USER'
                AND EMP_ID = @p_user_id;
         IF @count > 0
         BEGIN
             SELECT
                    CASE WHEN read_flag = 1
                        THEN 'true'
                        ELSE 'false'
                    END
                  , CASE WHEN edit_flag = 1
                        THEN 'true'
                        ELSE 'false'
                    END
             FROM   TB_MENU_AUTH
             WHERE  MENU_ID = @p_menu_id
                    AND user_group = 'USER'
                    AND EMP_ID = @p_user_id;
         END;
             ELSE
         BEGIN
             SELECT
                    CASE WHEN read_flag = 1
                        THEN 'true'
                        ELSE 'false'
                    END
                  , CASE WHEN edit_flag = 1
                        THEN 'true'
                        ELSE 'false'
                    END
             FROM   TB_MENU_AUTH
             WHERE  MENU_ID = @p_menu_id
                    AND user_group = 'AUTH'
                    AND EMP_ID = (
                                  SELECT
                                         AUTH_ID
                                  FROM   Tb_EMP
                                  WHERE  EMP_ID = @p_user_id
                   );
         END;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_get_menu_info_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_get_menu_info_L]
    @menu_id NVARCHAR(20)
  , @lang_id NVARCHAR(50)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                CAST(A.MENU_ID AS VARCHAR)
              , isnull( (
                         SELECT
                                TRANS
                         FROM    TB_DICTIONARY
                         WHERE  LANG_ID = @lang_id
                                AND KOR = a.title
                ), a.TITLE) TITLE
              , A.REMARK
              , A.URL
              , A.PARENT
              , CAST(a.SEQ AS VARCHAR)
         FROM TB_MENU a
         WHERE MENU_ID = @menu_id;
         SET NOCOUNT OFF;
     END;
GO

/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_get_popup_menu_auth_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_get_popup_menu_auth_L]
    @p_menu_id  VARCHAR(20)
  , @p_cell_idx VARCHAR(20)
  , @p_linked   VARCHAR(20)
  , @p_url_no   VARCHAR(20)
  , @p_user_id  VARCHAR(50)
AS
     BEGIN
         SET NOCOUNT ON;
         DECLARE @count INT;
         SELECT
                @count = COUNT(*)
         FROM   TB_POPUP_MENU_AUTH
         WHERE  MENU_ID = @p_menu_id
                AND user_group = 'USER'
                AND EMP_ID = @p_user_id
                AND MENU_ID = @p_menu_id
                AND CELL_INDEX = @p_cell_idx
                AND LINKED = @p_linked
                AND URL_NO = @p_url_no;
         IF @count > 0
         BEGIN
             SELECT
                    CASE WHEN read_flag = 1
                        THEN 'true'
                        ELSE 'false'
                    END
                  , CASE WHEN edit_flag = 1
                        THEN 'true'
                        ELSE 'false'
                    END
             FROM   TB_POPUP_MENU_AUTH
             WHERE  MENU_ID = @p_menu_id
                    AND user_group = 'USER'
                    AND EMP_ID = @p_user_id
                    AND MENU_ID = @p_menu_id
                    AND CELL_INDEX = @p_cell_idx
                    AND LINKED = @p_linked
                    AND URL_NO = @p_url_no;
         END;
             ELSE
         BEGIN
             SELECT
                    CASE WHEN read_flag = 1
                        THEN 'true'
                        ELSE 'false'
                    END
                  , CASE WHEN edit_flag = 1
                        THEN 'true'
                        ELSE 'false'
                    END
             FROM   TB_POPUP_MENU_AUTH
             WHERE  MENU_ID = @p_menu_id
                    AND user_group = 'AUTH'
                    AND MENU_ID = @p_menu_id
                    AND CELL_INDEX = @p_cell_idx
                    AND LINKED = @p_linked
                    AND URL_NO = @p_url_no
                    AND EMP_ID = (
                                  SELECT
                                         AUTH_ID
                                  FROM   Tb_EMP
                                  WHERE  EMP_ID = @p_user_id
                   );
         END;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_get_qry_info_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_get_qry_info_L]
    @p_obj_names VARCHAR(8000)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................            
         DECLARE @tbl TABLE(
             idx   INT
           , vData VARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues ('\', @p_obj_names);
--.................................................................            
         DECLARE @p_obj_name_load VARCHAR(255);
         DECLARE @p_obj_name_save VARCHAR(255);
         DECLARE @p_obj_name_delete VARCHAR(255);
         SET @p_obj_name_load = (
                                 SELECT
                                        vData
                                 FROM   @tbl
                                 WHERE  idx = 1
             );
         SET @p_obj_name_save = (
                                 SELECT
                                        vData
                                 FROM   @tbl
                                 WHERE  idx = 2
             );
         SET @p_obj_name_delete = (
                                   SELECT
                                          vData
                                   FROM   @tbl
                                   WHERE  idx = 3
             );
         IF CHARINDEX('@', @p_obj_name_load) > 0
         BEGIN
             SET @p_obj_name_load = SUBSTRING(@p_obj_name_load, CHARINDEX('@', @p_obj_name_load)+1, 8000);
         END;
             ELSE
         BEGIN
             SET @p_obj_name_load = SUBSTRING(@p_obj_name_load, CHARINDEX(':', @p_obj_name_load)+1, 8000);
         END;
         IF CHARINDEX('@', @p_obj_name_save) > 0
         BEGIN
             SET @p_obj_name_save = SUBSTRING(@p_obj_name_save, CHARINDEX('@', @p_obj_name_save)+1, 8000);
         END;
             ELSE
         BEGIN
             SET @p_obj_name_save = SUBSTRING(@p_obj_name_save, CHARINDEX(':', @p_obj_name_save)+1, 8000);
         END;
         IF CHARINDEX('@', @p_obj_name_delete) > 0
         BEGIN
             SET @p_obj_name_delete = SUBSTRING(@p_obj_name_delete, CHARINDEX('@', @p_obj_name_delete)+1, 8000);
         END;
             ELSE
         BEGIN
             SET @p_obj_name_delete = SUBSTRING(@p_obj_name_delete, CHARINDEX(':', @p_obj_name_delete)+1, 8000);
         END;
         SET @p_obj_name_load = REPLACE(@p_obj_name_load, 'UNDEFINED', '');
         SET @p_obj_name_save = REPLACE(@p_obj_name_save, 'UNDEFINED', '');
         SET @p_obj_name_delete = REPLACE(@p_obj_name_delete, 'UNDEFINED', '');
         SELECT DISTINCT
                '@@header0'
              , '<merge>My Info.'
              , '<merge>My Info.'
              , '<merge>!!My Info.'
              , '<merge>@@NAME'
              , '<merge>Child1 Info.'
              , '<merge>Child1 Info.'
              , '<merge>@@NAME'
              , 'Child2 Info.'
              , 'Child2 Info.'
              , '@@NAME';
         SELECT DISTINCT
                '@@header1'
              , 'SSID'
              , 'Object Name'
              , 'Create/Modify Date'
              , '@@NAME'
              , 'Object Name'
              , 'Create/Modify Date'
              , '@@NAME'
              , 'Object Name'
              , 'Create/Modify Date'
              , '@@NAME';
         SELECT DISTINCT
                '@@list'
              , pp.SSID                                                                            '<merge>SSID'
              , pp.SSNAME                                                                          '<merge>!!SSNAME'
              , (
                 SELECT
                        CONVERT(VARCHAR, aaa.create_date, 120)+' => '+CONVERT(VARCHAR, AAA.modify_date, 120)
                 FROM    SYS.objects AAA
                 WHERE  AAA.name = PP.SSNAME
                )                                                                                  "Modify Date"
              , pp.SSNAME                                                                          '@@NAME'
              , pp.name                                                                            '<merge>CHILD1'
              , CONVERT(VARCHAR, pp.create_date, 120)+' => '+CONVERT(VARCHAR, pp.modify_date, 120) "Modify Date"
              , pp.name                                                                            '@@NAME'
              , o1.name                                                                            '<merge>CHILD2'
              , CONVERT(VARCHAR, o1.create_date, 120)+' => '+CONVERT(VARCHAR, o1.modify_date, 120) "Modify Date"
              , o1.name                                                                            '@@NAME'
         FROM sys.objects o1
         JOIN master.dbo.spt_values v2 ON o1.type = SUBSTRING(v2.name, 1, 2) COLLATE database_default
                                          AND v2.type = 'O9T'
         JOIN sysdepends d3 ON o1.object_id = d3.depid
         JOIN master.dbo.spt_values u4 ON u4.type = 'B'
                                          AND u4.number = d3.resultobj
         JOIN master.dbo.spt_values w5 --11667
         ON w5.type = 'B'
            AND w5.number = d3.readobj|d3.selall
         JOIN sys.schemas s6 ON o1.schema_id = s6.schema_id
         RIGHT OUTER JOIN (
                           SELECT
                                  SS.SSID                  SSID
                                , SS.OBJ_NAME              SSNAME
                                , SUBSTRING(v2.name, 1, 1) ty
                                , 'name' = o1.name
                                , o1.create_date
                                , o1.modify_date
                                , o1.object_id
                           FROM   sys.objects o1
                           JOIN master.dbo.spt_values v2 ON o1.type = SUBSTRING(v2.name, 1, 2) COLLATE database_default
                                                            AND v2.type = 'O9T'
                           JOIN sysdepends d3 ON o1.object_id = d3.depid
                           JOIN master.dbo.spt_values u4 ON u4.type = 'B'
                                                            AND u4.number = d3.resultobj
                           JOIN master.dbo.spt_values w5 --11667
                           ON w5.type = 'B'
                              AND w5.number = d3.readobj|d3.selall
                           JOIN sys.schemas s6 ON o1.schema_id = s6.schema_id
                           RIGHT OUTER JOIN (
                                             SELECT
                                                    '1.LOAD'                    SSID
                                                  , @p_obj_name_load            OBJ_NAME
                                                  , OBJECT_ID(@p_obj_name_load) obj_id
                                             UNION
                                             SELECT
                                                    '2.SAVE'         SSID
                                                  , @p_obj_name_save OBJ_NAME
                                                  , OBJECT_ID(@p_obj_name_save)
                                             UNION
                                             SELECT
                                                    '3.DELETE'         SSID
                                                  , @p_obj_name_delete OBJ_NAME
                                                  , OBJECT_ID(@p_obj_name_delete)
                                ) ss ON d3.id = ss.obj_id
                                        AND D3.deptype < 2
                           WHERE  SS.OBJ_NAME <> ''
              ) PP ON d3.id = pp.object_id
                      AND pp.ty <> 'U'
         WHERE ISNULL(D3.deptype, 1) < 2
         ORDER BY
                  1
                , 2
                , 3
                , 4
                , 5
                , 6
                , 7;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_get_qry_text_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_get_qry_text_L]
    @p_obj_name VARCHAR(8000)
AS
     BEGIN
         SET NOCOUNT ON;
         IF (
             SELECT
                    A.type
             FROM   sys.objects A
             WHERE  A.object_id = OBJECT_ID(@p_obj_name)
            ) = 'U'
         BEGIN
             DECLARE @dbname SYSNAME, @no VARCHAR(35), @yes VARCHAR(35), @none VARCHAR(35);
             SELECT
                    @no = 'no'
                  , @yes = 'yes'
                  , @none = 'none';
             DECLARE @precscaletypes NVARCHAR(150);
             SELECT
                    @precscaletypes = N'tinyint,smallint,decimal,int,bigint,real,money,float,numeric,smallmoney,date,time,datetime2,datetimeoffset,';
             DECLARE @max_col_len AS INT;
             SELECT
                    @max_col_len = MAX(LEN(name))
             FROM   sys.all_columns a
             WHERE  object_id = OBJECT_ID(@p_obj_name);
             SELECT
                    *
             INTO
                  #TTT
             FROM (
                   SELECT
                          1             ROW_NUM
                        , 'Column_name' COLUMN_NAME
                        , 'Type'        TY
                        , 'Length'      LENG
                        , 'Prec'        PREC
                        , 'Scale'       SCALE
                        , 'Nullable'    NULLABLE
                        , 'Computed'    COMPU
                        , 'Collation'   COLL
                        , 'Comment'     comment
                   UNION
                   SELECT
                          2
                        , '-'
                        , '-'
                        , '-'
                        , '-'
                        , '-'
                        , '-'
                        , '-'
                        , '-'
                        , '-'
                   UNION
                   SELECT
                          b.ORDINAL_POSITION + 2
                        , name
                        , TYPE_NAME(user_type_id)
                        , CAST(CONVERT(INT, max_length) AS VARCHAR)
                        , CASE WHEN CHARINDEX(TYPE_NAME(system_type_id)+',', @precscaletypes) > 0
                              THEN CONVERT(CHAR(5), COLUMNPROPERTY(object_id, name, 'precision'))
                              ELSE '-'
                                                                  END
                        , CASE WHEN CHARINDEX(TYPE_NAME(system_type_id)+',', @precscaletypes) > 0
                              THEN CONVERT(CHAR(5), OdbcScale (system_type_id, scale) )
                              ELSE '-'
                          END
                        , CASE WHEN a.is_nullable = 0
                              THEN @no
                              ELSE @yes
                          END
                        , CASE WHEN COLUMNPROPERTY(object_id, name, 'IsComputed') = 0
                              THEN @no
                              ELSE @yes
                          END
                        , isnull(a.collation_name, '-')
                        , CAST(isnull( (
                                        SELECT
                                               value
                                        FROM   ::fn_listextendedproperty (NULL, 'user', 'dbo', 'table', b.TABLE_NAME, 'column', a.name)
                          ), '-') AS VARCHAR) comment
                   FROM sys.all_columns a
                   JOIN INFORMATION_SCHEMA.COLUMNS b ON object_id = OBJECT_ID(b.TABLE_NAME)
                                                        AND a.name = b.COLUMN_NAME
                   WHERE                     object_id = OBJECT_ID(@p_obj_name)
                  ) R;
             SELECT
                    r.comment
             FROM (
                   SELECT
                          -1      row_num
                        , '[U]'+@p_obj_name+':'+ISNULL( (
                                                         SELECT
                                                                CAST(ISNULL(value, '') AS VARCHAR)
                                                         FROM   ::fn_listextendedproperty (NULL, 'user', 'dbo', 'table', @p_obj_name, NULL, NULL)
                          ), '-') COMMENT
                   UNION
                   SELECT
                          0
                        , replace(SPACE(120), ' ', '-')
                   UNION
                   SELECT
                          a.row_num
                        , CASE WHEN a.ROW_NUM = 2
                              THEN replace(SPACE(120), ' ', '-')
                              ELSE CASE WHEN A.ROW_NUM >= 2
                                       THEN CAST(A.ROW_NUM AS VARCHAR)
                                       ELSE 'NO'
                                   END+CHAR(9)+ISNULL(a.COLUMN_NAME, '')+SPACE( (
                                                                                 SELECT
                                                                                        MAX(LEN(COLUMN_NAME))
                                                                                 FROM   #ttt
                                   ) -LEN(a.COLUMN_NAME))+CHAR(9)+ISNULL(a.TY, '')+SPACE( (
                                                                                           SELECT
                                                                                                  MAX(LEN(TY))
                                                                                           FROM   #ttt
                                   ) -LEN(a.TY))+CHAR(9)+ISNULL(a.LENG, '')+SPACE( (
                                                                                    SELECT
                                                                                           MAX(LEN(LENG))
                                                                                    FROM   #ttt
                                   ) -LEN(a.LENG))+CHAR(9)+ISNULL(a.PREC, '')+SPACE( (
                                                                                      SELECT
                                                                                             MAX(LEN(PREC))
                                                                                      FROM   #ttt
                                   ) -LEN(a.PREC))+CHAR(9)+ISNULL(a.SCALE, '')+SPACE( (
                                                                                       SELECT
                                                                                              MAX(LEN(SCALE))
                                                                                       FROM   #ttt
                                   ) -LEN(a.SCALE))+CHAR(9)+ISNULL(a.NULLABLE, '')+SPACE( (
                                                                                           SELECT
                                                                                                  MAX(LEN(NULLABLE))
                                                                                           FROM   #ttt
                                   ) -LEN(a.NULLABLE))+CHAR(9)+ISNULL(a.COMPU, '')+SPACE( (
                                                                                           SELECT
                                                                                                  MAX(LEN(COMPU))
                                                                                           FROM   #ttt
                                   ) -LEN(a.COMPU))+CHAR(9)+ISNULL(a.COLL, '')+SPACE( (
                                                                                       SELECT
                                                                                              MAX(LEN(COLL))
                                                                                       FROM   #ttt
                                   ) -LEN(a.COLL))+CHAR(9)+ISNULL(a.comment, '')
                            END
                   FROM #TTT A
                  ) r
             ORDER BY
                      r.ROW_NUM;
         END;
             ELSE
         BEGIN
             IF (
                 SELECT
                        A.type
                 FROM   sys.objects A
                 WHERE  A.object_id = OBJECT_ID(@p_obj_name)
                ) IS NULL
             BEGIN
                 SELECT
                        @p_obj_name+' => N/A';
             END
                 ELSE
             BEGIN
                 EXEC sp_helptext
                      @p_obj_name;
             END;
         END;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_get_report_by_insp_revision_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_get_report_by_insp_revision_L]
    @p_work_ticket_id NVARCHAR(MAX)
  , @p_lang_id        NVARCHAR(50)
AS
     BEGIN
         SET NOCOUNT ON;
--raiserror('성적서 양식 변경중입니다.', 16, 1)
--return; 
/*
  if (select COUNT(*) from TB_INSPECTION_REQ req  
   join TB_PROC pr  
   on req.PROC_ID=pr.PROC_ID and pr.PROC_GROUP_ID='제품검사2'  
   where req.WORK_TICKET_ID=@p_work_ticket_id)=0  
 return;  
    
 DECLARE @HTML_HEADER nvarchar(max)    
 DECLARE @HTML_BODY nvarchar(max)    
 DECLARE @HTML_FOOTER nvarchar(max)    
 DECLARE @max_row int    
    
 SELECT    
  @HTML_HEADER=HTML_HEADER,    
  @HTML_BODY=HTML_BODY,    
  @HTML_FOOTER=HTML_FOOTER,    
  @max_row=max_row       
 FROM TB_REPORT    
 WHERE RPT_NAME='교정검사서'    
 and lang_id = @p_lang_id     
    
 DECLARE @HTML nvarchar(max)    
    
 declare @part_unit nvarchar(255);    
 DECLARE @tot_cnt NUMERIC(13,3);    
 declare @prt_no nvarchar(255);    
     
 select     
  @part_unit=dbo.fn_codename('UNIT',P.UNIT_ID),    
  @tot_cnt=(SELECT COUNT(CC.ROW_STAMP) FROM TB_INSPECTION_REQ AA    
     JOIN TB_WORK_TICKET WT    
     ON AA.WORK_TICKET_ID=WT.WORK_TICKET_ID    
     JOIN TB_INSPECTION_RES BB    
     ON AA.INSPECTION_REQ_ID=BB.INSPECTION_REQ_ID JOIN TB_INSPECTION_RES_PART_TEST_DETAIL CC    
     ON BB.inspection_res_id=CC.inspection_res_id    
     JOIN TB_PROC PR  
 ON AA.PROC_ID=PR.PROC_ID AND PR.PROC_GROUP_ID='제품검사2'       
     WHERE WT.WORK_ORDER_NO=WOP.WORK_ORDER_NO AND WT.WORK_ORDER_PART_SEQ_NO=WOP.WORK_ORDER_PART_SEQ_NO    
     AND ABS(CC.READ_VALUE-CC.TEST_VALUE)<=CC.TOLERANCE)    
 from TB_WORK_ORDER_PART WOP    
 JOIN TB_WORK_TICKET WT    
 ON WOP.WORK_ORDER_NO=WT.WORK_ORDER_NO AND WOP.WORK_ORDER_PART_SEQ_NO=WT.WORK_ORDER_PART_SEQ_NO    
 JOIN TB_PART P    
 ON WOP.PART_ID=P.PART_ID    
 where WT.WORK_TICKET_ID =@p_work_ticket_id    
     
     
     
 select @prt_no=prt_no from tb_inspection_req     
 where WORK_TICKET_ID =@p_work_ticket_id     
    
 set @HTML_HEADER=replace(@HTML_HEADER,'@unit@',dbo.fn_rptFormat(@part_unit) );     
 set @HTML_HEADER=replace(@HTML_HEADER,'@prt_no@',dbo.fn_rptFormat(@prt_no) );     
     
    
 Declare data_list Cursor For    
 SELECT     
  CC.PART_TAG_NO,    
  CC.TEST_VALUE,    
  CC.READ_VALUE,    
  CC.TOLERANCE,    
  CC.READ_VALUE-CC.TEST_VALUE,    
  'OK',    
  CC.REMARK    
 FROM TB_INSPECTION_REQ AA     
 JOIN TB_WORK_TICKET WT    
 ON AA.WORK_TICKET_ID=WT.WORK_TICKET_ID    
 JOIN TB_INSPECTION_RES BB    
 ON AA.INSPECTION_REQ_ID=BB.INSPECTION_REQ_ID JOIN TB_INSPECTION_RES_PART_TEST_DETAIL CC    
 ON BB.inspection_res_id=CC.inspection_res_id    
 JOIN TB_PROC PR  
 ON AA.PROC_ID=PR.PROC_ID AND PR.PROC_GROUP_ID='제품검사2'  
 WHERE ABS(CC.READ_VALUE-CC.TEST_VALUE)<=CC.TOLERANCE    
 AND aa.WORK_TICKET_ID =@p_work_ticket_id    
 order by aa.row_stamp    
    
    declare @part_tag as nvarchar(255)    
 declare @test as nvarchar(255)    
 declare @read as nvarchar(255)    
 declare @tol as nvarchar(255)    
 declare @err as nvarchar(255)    
 declare @result as nvarchar(255)    
 declare @remark as nvarchar(255)    
    
 set @HTML='';    
    
 declare @tmphmtl nvarchar(max);    
    
    
 declare @i int;    
 declare @page int;    
    
 set @i=0;    
 set @page=2;    
    
 declare @tot_page int;    
 if @tot_cnt=0    
  set @tot_cnt=1;    
    
 set @tot_page=isnull(ceiling(@tot_cnt/@max_row),1)+1;    
    
    
    select    
  replace(replace(@HTML_HEADER,'@cur_page@',dbo.fn_rptFormat(cast(@page as nvarchar))),'@tot_page@',@tot_page)    
    
     
 OPEN data_list      
     
  FETCH NEXT FROM data_list INTO @part_tag ,@test ,@read,@tol , @err ,@result ,@remark    
    
  WHILE (@@FETCH_STATUS <> -1)    
  BEGIN    
       
   if @i=@max_row    
   begin    
    
    set @i=1;    
    set @page=@page+1;    
    
    select    
     @HTML_FOOTER    
--    select    
--     '<div style="height:20;"></div>'    
    
                select    
     replace(replace(@HTML_HEADER,'@cur_page@',dbo.fn_rptFormat(cast(@page as nvarchar))),'@tot_page@',@tot_page)    
    
        
   end    
   else    
    set @i=@i+1;    
    
   set @tmphmtl=@HTML_BODY;        
    
   set @tmphmtl=replace(@tmphmtl,'@tag@',dbo.fn_rptFormat(@part_tag));    
   set @tmphmtl=replace(@tmphmtl,'@test@',dbo.fn_rptFormat(@test));    
   set @tmphmtl=replace(@tmphmtl,'@read@',dbo.fn_rptFormat(@read));    
   set @tmphmtl=replace(@tmphmtl,'@tol@',dbo.fn_rptFormat(@tol));    
   set @tmphmtl=replace(@tmphmtl,'@err@',dbo.fn_rptFormat(@err));    
   set @tmphmtl=replace(@tmphmtl,'@result@',dbo.fn_rptFormat(@result));    
   set @tmphmtl=replace(@tmphmtl,'@remark@',dbo.fn_rptFormat(@remark));     
       
         
    
    
   select @tmphmtl    
    
       
    
       
    
   FETCH NEXT FROM data_list INTO @part_tag ,@test ,@read,@tol , @err ,@result ,@remark    
    
  END    
    
 CLOSE data_list    
 DEALLOCATE data_list    
    
 while (@i<@max_row)    
 begin    
  set @tmphmtl=@HTML_BODY;      
    
  set @tmphmtl=replace(@tmphmtl,'@tag@',dbo.fn_rptFormat(''));    
   set @tmphmtl=replace(@tmphmtl,'@test@',dbo.fn_rptFormat(''));    
   set @tmphmtl=replace(@tmphmtl,'@read@',dbo.fn_rptFormat(''));    
   set @tmphmtl=replace(@tmphmtl,'@tol@',dbo.fn_rptFormat(''));    
   set @tmphmtl=replace(@tmphmtl,'@err@',dbo.fn_rptFormat(''));    
   set @tmphmtl=replace(@tmphmtl,'@result@',dbo.fn_rptFormat(''));    
   set @tmphmtl=replace(@tmphmtl,'@remark@',dbo.fn_rptFormat(''));     
       
    
  select @tmphmtl    
  set @i=@i+1;    
 end    
     
 select    
  @HTML_FOOTER    
       */

         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_go_menu_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_go_menu_L]
    @user_id   VARCHAR(20)
  , @P_LANG_ID VARCHAR(20)  = 'KOR'
  , @P_MENU_ID VARCHAR(200)
AS
     BEGIN
         SET NOCOUNT ON;
         IF NOT EXISTS (
                        SELECT
                               *
                        FROM   TB_MENU
                        WHERE  MENU_ID = @P_MENU_ID
                       )
         BEGIN
             RAISERROR('유효한 메뉴번호가 아닙니다.', 16, 1);
             RETURN 0;
         END;
         SELECT
                *
         INTO
              #ttt
         FROM (
               SELECT
                      b.menu_id
                    , b.title
                    , b.remark
                    , b.url
                    , b.parent                                                         parent_key
                    , CAST(b.parent AS VARCHAR)+'/'+CAST(b.menu_id AS VARCHAR)         subkey
                    , CASE read_flag WHEN 1
                          THEN 'true'
                          ELSE 'false'
                                                                               END     read_flag
                    , CASE edit_flag WHEN 1
                          THEN 'true'
                          ELSE 'false'
                                                                                   END edit_flag
                    , attr
                    , seq
               FROM     tb_menu_auth a
                      , tb_menu b
               WHERE   a.emp_id = @user_id
                       AND a.menu_id = b.menu_id
                       AND b.title <> '-'
                       AND b.MENU_ID = @P_MENU_ID
               UNION
               SELECT
                      b.menu_id
                    , b.title
                    , b.remark
                    , b.url
                    , b.parent                                                         parent_key
                    , CAST(b.parent AS VARCHAR)+'/'+CAST(b.menu_id AS VARCHAR)         subkey
                    , CASE read_flag WHEN 1
                          THEN 'true'
                          ELSE 'false'
                                                                               END     read_flag
                    , CASE edit_flag WHEN 1
                          THEN 'true'
                          ELSE 'false'
                                                                                   END edit_flag
                    , attr
                    , seq
               FROM   tb_menu_auth a
                    , tb_menu b
               WHERE  a.emP_id = (
                                  SELECT
                                         AUTH_ID
                                  FROM   tb_emp
                                  WHERE  emp_id = @user_id
                     )
                      AND a.uSer_group = 'AUTH'
                      AND a.menu_id = b.menu_id
                      AND b.title <> '-'
                      AND A.MENU_ID NOT IN (
                                            SELECT
                                                   MENU_ID
                                            FROM   TB_MENU_AUTH
                                            WHERE  EMP_ID = @user_id
                                                   AND USER_GROUP = 'USER'
                                           )
                      AND A.MENU_ID = @P_MENU_ID
              ) r;
         SELECT
                *
         FROM   #ttt;

--WITH bomCTE(menu_id, title,parent_key,subkey,attr,url,seq,remark)
--as
--(
--    SELECT menu_id, title,parent_key,subkey,attr,url,seq,remark
--    FROM #ttt
--    UNION ALL
--    SELECT E.menu_id,E.TITLE, E.parent, CAST(E.parent AS VARCHAR) + '/' + CAST(E.menu_id AS VARCHAR), E.attr,E.url,E.seq,E.REMARK
--      FROM TB_MENU AS E
--            INNER JOIN bomCTE AS M ON CAST(E.parent AS VARCHAR) + '/' + CAST(E.menu_id AS VARCHAR) = M.parent_key
--)
--SELECT
--    distinct 
--        menu_id, 
--        isnull((SELECT TRANS FROM TB_DICTIONARY
--                WHERE LANG_ID=@P_LANG_ID 
--                AND KOR=a.title),a.TITLE),
--        remark,
--        url,    
--        parent_key,
--        CAST(parent_key AS VARCHAR) + '/' + CAST(menu_id AS VARCHAR) subkey,
--        case when attr='I' then
--            (select read_flag from #ttt where menu_id=a.menu_id)
--            else 'true' end read_flag,
--        case when attr='I' then
--            (select edit_flag from #ttt where menu_id=a.menu_id)
--            else 'true' end edit_flag,
--        attr,seq
--FROM bomCTE A
--UNION
--SELECT
--     b.menu_id,
--     isnull((SELECT TRANS FROM TB_DICTIONARY
--                WHERE LANG_ID=@P_LANG_ID 
--                AND KOR=B.title),b.TITLE),
--     b.remark,
--     b.url,
--     b.parent parent_key,
--     CAST(b.parent AS VARCHAR) + '/' + CAST(b.menu_id AS VARCHAR) subkey,
--     '' read_flag,
--     '' edit_flag,
--     'I',seq
--FROM  tb_menu b 
--WHERE b.title='-'
--and b.MENU_ID = @P_MENU_ID
--order by seq
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_login_by_sso_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_login_by_sso_L]
    @p_id      VARCHAR(20)
  , @p_ip      VARCHAR(255)
  , @p_lang_id VARCHAR(20)  = 'KOR'
AS
BEGIN
SET NOCOUNT ON;
    
    IF @p_id IS NULL
    BEGIN
        RAISERROR('아이디를 입력하세요.', 16, 1);
        RETURN 0;
    END;
    
    DECLARE @count_id INT;
    DECLARE @count_pw INT;
    
    SELECT
        @count_id = COUNT(*)
    FROM   tb_emp
    WHERE  emp_id = @p_id;
    
    IF @count_id <= 0
    BEGIN
        RAISERROR('존재하지 않는 아이디 입니다.', 16, 1);
        RETURN 0;
    END;
    
    IF @count_id > 0
    BEGIN
        SELECT A.emp_id                                      ID
            , A.emp_name                                     NAME
            , (CASE A.is_admin WHEN '1' THEN 'ADMIN' END)    auth
            , A.PLANT_ID                                     PLANT_ID 
        FROM tb_emp A
        WHERE  emp_id = @p_id
            AND valid = 1;

        INSERT INTO tb_login_hist (
              emp_id
            , ip
            , login_dttm
            , LANG_ID 
        )
        VALUES (
              @p_id
            , @p_ip
            , GETDATE()
            , @p_lang_id);
    END;

SET NOCOUNT OFF;
END;

GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_login_hist_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[pk_ATM_sp_login_hist_L]
      @create_dttm nvarchar(20)
    , @emp_id as nvarchar(20) 
AS 
BEGIN
SET NOCOUNT ON
  
    DECLARE @vSql         nvarchar(4000)
    declare @rcreate_dttm datetime
  
    select @rcreate_dttm = CAST(@create_dttm AS DATETIME)

    select tb_login_hist.emp_id                            "사용자 ID"
        ,  emp.emp_name                                    "사용자 이름"
	    ,  iP                                              "iP"
        ,  convert(nvarchar,tb_login_hist.create_dttm,120) "시간"
        ,  tb_login_hist.action                            "Login/Logout"
	    ,  TB_LOGIN_HIST.ROW_STAMP                         "@@param"
        ,  tb_login_hist.ROW_STAMP                         "@@KEY"
    from tb_login_hist (NOLOCK)
    INNER JOIN tb_emp emp (NOLOCK) ON emp.emp_id = tb_login_hist.emp_id
    where ( ISNULL(@emp_id,'*') = '*' OR tb_login_hist.emp_id = @emp_id )
      and tb_login_hist.create_dttm between @rcreate_dttm and dateadd(d,1,@rcreate_dttm)
   order by tb_login_hist.create_dttm

SET NOCOUNT OFF
END
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_login_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_login_L]
    @p_id       NVARCHAR(20)
  , @p_password NVARCHAR(255)
  , @p_ip       NVARCHAR(255)
  , @p_lang_id  NVARCHAR(20)  = 'KOR'
AS
BEGIN
SET NOCOUNT ON;

    IF @p_id IS NULL
    BEGIN
        RAISERROR('아이디를 입력하세요.', 16, 1);
        RETURN 0;
    END;
    
    IF @p_password IS NULL
    BEGIN
        RAISERROR('암호를 입력하세요.', 16, 1);
        RETURN 0;
    END;
    
    DECLARE @count_id INT;
    DECLARE @count_pw INT;
    DECLARE @valid INT;
    set @count_id = 0

    SELECT @count_id = 1
        ,  @count_pw = PWDCOMPARE(@p_password, PW)
        ,  @valid = VALID
    FROM   tb_emp
    WHERE  EMP_ID = @p_id;
    
    IF @count_id <= 0
    BEGIN
        RAISERROR('존재하지 않는 아이디 입니다.', 16, 1);
        RETURN @count_id;
    END;
    
    IF @count_pw <> 1
    BEGIN
        RAISERROR('비밀번호가 정확하지 않습니다.', 16, 1);
        RETURN 0;
    END;
    
    IF @p_password = '1'
    BEGIN
        RAISERROR('초기 설정암호입니다. 변경 후 로그인 할 수 있습니다.', 16, 1);
        RETURN 0;
    END;

    IF ( @count_id > 0 AND isnull(@valid, 0) <> 0 AND @count_pw = 1 )
    BEGIN
        INSERT INTO tb_login_hist (
              EMP_ID
            , ip
            , login_dttm
            , LANG_ID 
        )
        SELECT
              @p_id
            , @p_ip
            , GETDATE()
            , @p_lang_id

        SELECT A.emp_id                                    ID
            ,  A.emp_name                                  NAME
            ,  (CASE A.is_admin WHEN '1' THEN 'ADMIN' END) auth
            ,  SCOPE_IDENTITY()                            "idd"
            ,  B.DEPT_NAME                                 DEPT_NAME
            ,  A.PLANT_ID                                  PLANT_ID
        FROM tb_emp A WITH (NOLOCK)
        JOIN tb_dept B WITH (NOLOCK) ON A.DEPT_ID = B.DEPT_ID
        WHERE A.emp_id = @p_id
          AND PWDCOMPARE(@p_password, A.pw) = 1
          AND A.valid = 1;
    END;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_login_menu_hist_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[pk_ATM_sp_login_menu_hist_L]
	  @create_dttm nvarchar(20)
    , @emp_id as nvarchar(20) 
AS 
BEGIN
SET NOCOUNT ON

	SELECT A.USER_ID "사용자 ID"
        ,  DBO.FN_GETMENUNAME(M.PARENT, M.TITLE) "접속메뉴"
        ,  COUNT(M.MENU_ID) "<ALIGN=RIGHT>접속횟수"
        ,  CONVERT(VARCHAR(5),MAX(CLICK_DTTM),114) "<ALIGN=CENTER>마지막 접속 시간"
	FROM TB_MENU_USE_HIST A WITH (NOLOCK)
	JOIN TB_MENU M WITH (NOLOCK) ON A.MENU_ID = M.MENU_ID  
	WHERE A.CLICK_DTTM BETWEEN CAST(@CREATE_DTTM AS DATETIME) AND DATEADD(dd,1,CAST(@CREATE_DTTM AS DATETIME))
	AND (ISNULL(@EMP_ID,'*') = '*' OR A.USER_ID = @EMP_ID )
	GROUP BY A.USER_ID,CONVERT(NVARCHAR(8), CAST(A.CLICK_DTTM AS DATETIME),112),A.MENU_ID, M.PARENT, M.TITLE
	ORDER BY A.USER_ID,CONVERT(NVARCHAR(8), CAST(A.CLICK_DTTM AS DATETIME),112),A.MENU_ID, M.PARENT, M.TITLE

SET NOCOUNT OFF
END
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_logout_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_logout_S]
    @p_id NVARCHAR(255)
  , @p_ip NVARCHAR(255)
AS
     BEGIN
         SET NOCOUNT ON;
         INSERT INTO               tB_login_hist (
                emp_id
              , IP
              , [action] )
         VALUES (
                @p_id
              , @p_ip
              , 'LOGOUT');
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_auth_backup_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_auth_backup_S]
    @p_apply_start NVARCHAR(255)
  , @p_user_id     NVARCHAR(50)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DECLARE @BACKUP_SEQ INT;
             SELECT
                    @BACKUP_SEQ = ISNULL(MAX(BACKUP_SEQ) + 1, 0)
             FROM   TB_MENU_AUTH_BACKUP
             WHERE  APPLY_START = @p_apply_start;
             UPDATE TB_MENU_AUTH_BACKUP
               SET
                   VALID = 0
                 , BACKUP_BY = @p_user_id
             WHERE
                   APPLY_START = @p_apply_start;
             INSERT INTO                     TB_MENU_AUTH_BACKUP (
                    MENU_ID
                  , USER_GROUP
                  , EMP_ID
                  , READ_FLAG
                  , EDIT_FLAG
                  , APPLY_START
                  , VALID
                  , BACKUP_SEQ
                  , BACKUP_BY
                  , CREATE_BY
                  , SAVE_BY )
             SELECT
                    MENU_ID
                  , USER_GROUP
                  , EMP_ID
                  , READ_FLAG
                  , EDIT_FLAG
                  , @p_apply_start
                  , 1
                  , @BACKUP_SEQ
                  , ''
                  , CREATE_BY
                  , SAVE_BY
             FROM   TB_MENU_AUTH;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @ERR_MSG NVARCHAR(4000);
             SET @ERR_MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@ERR_MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_auth_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_auth_D]
    @p_menu_id NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DELETE FROM TB_MENU_AUTH
             WHERE
                   MENU_ID = @p_menu_id;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_auth_done_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_auth_done_S]
    @p_menu_id NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--상위폴더에 없는 권한은 하위 항목에서 삭제
         DELETE FROM TB_MENU_AUTH
         WHERE
               MENU_ID IN(SELECT
                                 MENU_ID
                          FROM   TB_MENU
                          WHERE  (PARENT LIKE '%/'+@p_menu_id
                                  OR PARENT LIKE '%/'+@p_menu_id+'/%'))
               AND USER_GROUP+'|'+EMP_ID NOT IN(SELECT
                                                       USER_GROUP+'|'+EMP_ID
                                                FROM   TB_MENU_AUTH
                                                WHERE  MENU_ID = @p_menu_id);
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_auth_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_auth_L]
    @p_menu_id VARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                '['+USER_GROUP+']'+emp_id emp_id
              , CASE read_flag WHEN 1
                    THEN 'true'
                    ELSE 'false'
                                          END
              , CASE edit_flag WHEN 1
                    THEN 'true'
                    ELSE 'false'
                                          END
         FROM   TB_MENU_AUTH
         WHERE  MENU_ID = @p_menu_id
         ORDER BY
                  emp_id;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_auth_restore_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_auth_restore_S]
    @p_apply_start NVARCHAR(255)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;

--메뉴전체삭제
             DELETE TB_MENU_AUTH;
             INSERT INTO              TB_MENU_AUTH (
                    MENU_ID
                  , USER_GROUP
                  , EMP_ID
                  , READ_FLAG
                  , EDIT_FLAG
                  , CREATE_BY
                  , SAVE_BY )
             SELECT
                    MENU_ID
                  , USER_GROUP
                  , EMP_ID
                  , READ_FLAG
                  , EDIT_FLAG
                  , CREATE_BY
                  , SAVE_BY
             FROM   TB_MENU_AUTH_Backup
             WHERE  APPLY_START = @p_apply_start
                    AND VALID = 1;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @ERR_MSG NVARCHAR(4000);
             SET @ERR_MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@ERR_MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_auth_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_auth_S]
    @p_menu_id    NVARCHAR(20)
  , @p_user_group NVARCHAR(20)
  , @p_user_id    NVARCHAR(20)
  , @p_read       NVARCHAR(20)
  , @p_edit       NVARCHAR(20)
  , @p_child      NVARCHAR(20)
  , @p_saveby     NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         IF @p_read = 'true'
         BEGIN
             SET @p_read = 1;
         END;
             ELSE
         BEGIN
             SET @p_read = 0;
         END;
         IF @p_edit = 'true'
         BEGIN
             SET @p_edit = 1;
         END;
             ELSE
         BEGIN
             SET @p_edit = 0;
         END;
         IF @p_child = 'true'
         BEGIN
             SET @p_child = 1;
         END;
             ELSE
         BEGIN
             SET @p_child = 0;
         END;
         INSERT INTO              TB_MENU_AUTH (
                MENU_ID
              , USER_GROUP
              , EMP_ID
              , READ_FLAG
              , EDIT_FLAG
              , CREATE_BY
              , SAVE_BY )
         VALUES (
                @p_menu_id
              , @p_user_group
              , @p_user_id
              , @p_read
              , @p_edit
              , @p_saveby
              , @p_saveby);
         IF @p_child = 0
         BEGIN
             RETURN;
         END;

--상위폴더의 해당 권한과 같은 항목에 대해서만 수정
         UPDATE                tb_menu_auth
           SET
               EDIT_FLAG = @p_edit
             , READ_FLAG = @p_read
         WHERE
               MENU_ID IN(SELECT
                                 MENU_ID
                          FROM   TB_MENU
                          WHERE  (PARENT LIKE '%/'+@p_menu_id
                                  OR PARENT LIKE '%/'+@p_menu_id+'/%'))
               AND USER_GROUP = @p_user_group
               AND EMP_ID = @p_user_id;

--상위폴더의 해당 권한이 없는 하위 항목에 대해서 권한 추가
         INSERT INTO              TB_MENU_AUTH (
                MENU_ID
              , USER_GROUP
              , EMP_ID
              , READ_FLAG
              , EDIT_FLAG
              , CREATE_BY
              , SAVE_BY )
         SELECT
                new.MENU_ID
              , new.user_group
              , new.emp_id
              , new.read_flag
              , new.edit_flag
              , new.create_by
              , new.save_by
         FROM (
               SELECT
                      menu_id
                    , @p_user_group user_group
                    , @p_user_id    emp_id
                    , @p_read       read_flag
                    , @p_edit       edit_flag
                    , @p_saveby     create_by
                    , @p_saveby     save_by
               FROM   TB_MENU
               WHERE  (PARENT LIKE '%/'+@p_menu_id
                       OR PARENT LIKE '%/'+@p_menu_id+'/%')
                      AND menu_id NOT IN (
                                          SELECT
                                                 menu_id
                                          FROM   tb_menu_auth
                                          WHERE  emp_id = @p_user_id
                                         )
              ) new
         LEFT OUTER JOIN (
                          SELECT
                                 *
                          FROM   TB_MENU_AUTH
                          WHERE  MENU_ID = @p_menu_id
              ) old ON new.MENU_ID = old.MENU_ID
         WHERE old.ROW_STAMP IS NULL;

----상위 폴더 권한 설정
--declare @parent nvarchar(255);
--set @parent=(select parent from tb_menu
--                            where menu_id=@p_menu_id);
--delete from tb_menu
--where menu_id in (
--select vData from dbo.fn_getvalues('/',@parent))
--insert into TB_MENU_AUTH (
--            MENU_ID,
--            USER_GROUP,
--            EMP_ID,
--            READ_FLAG,
--            EDIT_FLAG,
--            CREATE_BY,SAVE_BY
--        )
--SELECT
--    menu_id,
--    @p_user_group,
--    @p_user_id,
--    @p_read,
--    @p_edit,
--    @p_saveby,@p_saveby
--from tb_menu
--where menu_id in (
--select vData from dbo.fn_getvalues('/',@parent))
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_backup_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_backup_S]
    @p_apply_start NVARCHAR(255)
  , @p_user_id     NVARCHAR(50)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DECLARE @BACKUP_SEQ INT;
             SELECT
                    @BACKUP_SEQ = ISNULL(MAX(BACKUP_SEQ) + 1, 0)
             FROM   TB_MENU_BACKUP
             WHERE  APPLY_START = @p_apply_start;
             UPDATE TB_MENU_BACKUP
               SET
                   VALID = 0
                 , BACKUP_BY = @p_user_id
             WHERE
                   APPLY_START = @p_apply_start;
             INSERT INTO                TB_MENU_BACKUP (
                    menu_id
                  , TITLE
                  , remark
                  , URL
                  , ATTR
                  , PARENT
                  , SEQ
                  , apply_start
                  , VALID
                  , BACKUP_SEQ
                  , BACKUP_BY
                  , CREATE_BY
                  , SAVE_BY )
             SELECT
                    menu_id
                  , TITLE
                  , remark
                  , URL
                  , ATTR
                  , PARENT
                  , SEQ
                  , @p_apply_start
                  , 1
                  , @BACKUP_SEQ
                  , ''
                  , CREATE_BY
                  , SAVE_BY
             FROM   tb_menu;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @ERR_MSG NVARCHAR(4000);
             SET @ERR_MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@ERR_MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_D]
    @p_menu_id NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DELETE TB_MENU_AUTH
             WHERE
                   MENU_ID = @p_menu_id;
             DELETE TB_MENU
             WHERE
                   MENU_ID = @p_menu_id;
             DELETE tb_menu
             WHERE
                   parent = @p_menu_id;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_favorite_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_favorite_L]
    @p_menu_id NVARCHAR(20)
  , @p_saveby  NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                menu_id
         FROM   tb_fav
         WHERE  menu_id = @p_menu_id
                AND emp_id = @p_saveby;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_favorite_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_favorite_S]
    @p_menu_id NVARCHAR(20)
  , @p_saveby  NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             IF EXISTS (
                        SELECT
                               *
                        FROM   tb_fav
                        WHERE  menu_id = @p_menu_id
                               AND emp_id = @p_saveby
                       )
             BEGIN
                 DELETE TB_FAV
                 WHERE
                       menu_id = @p_menu_id
                       AND emp_id = @p_saveby;
             END;
                 ELSE
             BEGIN
                 INSERT INTO        tb_fav (
                        menu_id
                      , emp_id
                      , save_dttm )
                 VALUES (
                        @p_menu_id
                      , @p_saveby
                      , GETDATE());
             END;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_first_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

[pk_ATM_sp_menu_first_L] 'ATM기본사용법', '3427','je_Bae'
******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_first_L]
    @p_title   VARCHAR(20)
  , @P_MENU_ID VARCHAR(20)
  , @user_id   NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                'openFirstMenu("'+m.MENU_ID+'","'+M.URL+CASE WHEN CHARINDEX('?', M.URL) > 0
                                                            THEN '&'
                                                            ELSE '?'
                                                        END+'TITLE='+@p_title+'>'+M.TITLE+'&MENU='+M.MENU_ID+'&GROUP_MENU='+M.PARENT+'&USER_ID=@user&REMARK='+M.REMARK+'","'+@p_title+'>'+M.TITLE+'","'+@user_id+'");'
         FROM   TB_MENU m
         WHERE  M.menu_id = @P_MENU_ID;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_group]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

[pk_ATM_sp_menu_group] N'mes', N'KOR'

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_group]
    @user_id   VARCHAR(20)
  , @favorite  VARCHAR(20) = '1'
  , @P_LANG_ID VARCHAR(20) = 'KOR'
AS
BEGIN
SET NOCOUNT ON;

    SELECT
        R.MENU_ID
    INTO
        #M
    FROM (
        SELECT
                A.MENU_ID
        FROM     TB_MENU_AUTH A WITH (NOLOCK)
        WHERE   A.USER_GROUP = 'USER'
                AND A.EMP_ID = CASE WHEN @user_id <> '*'
                                    THEN @user_id
                                    ELSE A.EMP_ID
                                END
        UNION
        SELECT
                A.MENU_ID
        FROM   TB_MENU_AUTH A WITH (NOLOCK)
        JOIN TB_EMP E ON A.EMP_ID = E.AUTH_ID
        WHERE  A.USER_GROUP = 'AUTH'
                AND E.EMP_ID = CASE WHEN @user_id <> '*'
                                    THEN @user_id
                                    ELSE A.EMP_ID
                                END
        ) R;
    SELECT
        CASE WHEN parent = '1'
            THEN '1'
            ELSE ''
        END                                                      IS_GROUP
        , a.menu_id
        , a.title
        , CAST(a.parent AS VARCHAR)+'/'+CAST(a.menu_id AS VARCHAR) subkey
        , a.attr
        , a.url
        , (
            SELECT
                'openFirstMenu("'+m.MENU_ID+'","'+M.URL+CASE WHEN CHARINDEX('?', M.URL) > 0
                                                            THEN '&'
                                                            ELSE '?'
                                                        END+'TITLE='+a.TITLE+'>'+M.TITLE+'&MENU='+M.MENU_ID+'&GROUP_MENU='+M.PARENT+'&USER_ID=@user&REMARK='+M.REMARK+'","'+a.TITLE+'>'+M.TITLE+'","'+@user_id+'");'
            FROM     TB_MENU m WITH (NOLOCK)
            WHERE  M.menu_id = dbo.fn_get_first_sub (a.MENU_ID, @user_id)
        )
        , a.SEQ
        , a.REMARK
        , a.PARENT                                                 parent_key
    FROM tb_menu a WITH (NOLOCK)
    WHERE a.parent = (
                    SELECT
                            CAST(menu_id AS VARCHAR)
                    FROM   tb_menu
                    WHERE  title = 'ROOT'
        )
        AND A.MENU_ID IN (
                            SELECT
                                AA.MENU_ID
                            FROM   #M AA
                        )
    UNION
    SELECT
        *
    FROM (
        SELECT TOP 1
                '1'       IS_GROUP
            , '0000' AS menu_id
            , '즐겨찾기' AS title
            , '1/0000'  subkey
            , 'F' AS    attr
            , '' AS     url
            , ( SELECT 'openFirstMenu("'+v.MENU_ID+'","'+M.URL+CASE WHEN CHARINDEX('?', M.URL) > 0
                                                                    THEN '&'
                                                                    ELSE '?'
                                                                END+'TITLE='+M.TITLE+'&MENU='+M.MENU_ID+'&GROUP_MENU='+M.PARENT+'&USER_ID=@user&REMARK='+M.REMARK+'","'+M.TITLE+'","'+@user_id+'");'
                FROM    TB_MENU m WITH (NOLOCK)
                WHERE  M.menu_id = v.menu_id
              ) AS      first_menu
            , 999 AS    SEQ
            , '' AS     REMARK
            , '1' AS    parent_key
        FROM tb_fav v WITH (NOLOCK)
        WHERE emp_id = @user_id
                AND @favorite = '1'
        ORDER BY
                SAVE_DTTM
        ) A
    ORDER BY SEQ;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_group_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

[pk_ATM_sp_menu_group] 'je_bae'
******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_group_L]
    @user_id   VARCHAR(20)
  , @P_LANG_ID VARCHAR(20) = 'KOR'
AS
     BEGIN
         SET NOCOUNT ON;
         IF isnull(@user_id, '*') <> '*'
         BEGIN
             SELECT
                    menu_id
                  , title
                  , PARENT
                  , CAST(parent AS VARCHAR)+'/'+CAST(menu_id AS VARCHAR) subkey
                  , attr
                  , url
                  , seq
             INTO
                  #ttt
             FROM   tb_menu
             WHERE  menu_id IN (
                                SELECT
                                       menu_id
                                FROM     tb_menu_auth
                                WHERE   emp_id = @user_id
                                UNION
                                SELECT
                                       menu_id
                                FROM   tb_menu_auth
                                WHERE  emp_id = (
                                                 SELECT
                                                        AUTH_ID
                                                 FROM   tb_emp
                                                 WHERE  emp_id = @user_id
                                      )
                               )
             ORDER BY
                      SEQ;
             WITH bomCTE(
                  menu_id
                , title
                , parent
                , subkey
                , attr
                , url
                , seq)
                  AS (
                  SELECT
                         menu_id
                       , title
                       , parent
                       , subkey
                       , attr
                       , url
                       , seq
                  FROM     #ttt
                  UNION ALL
                  SELECT
                         E.menu_id
                       , E.TITLE
                       , E.parent
                       , CAST(E.parent AS VARCHAR)+'/'+CAST(E.menu_id AS VARCHAR)
                       , E.attr
                       , E.url
                       , E.seq
                  FROM   TB_MENU AS E
                  INNER JOIN bomCTE AS M ON CAST(E.parent AS VARCHAR)+'/'+CAST(E.menu_id AS VARCHAR) = M.PARENT)
                  SELECT DISTINCT
                         menu_id
                       , isnull( (
                                  SELECT
                                         TRANS
                                  FROM    TB_DICTIONARY
                                  WHERE  LANG_ID = @P_LANG_ID
                                         AND KOR = a.title
                         ), a.TITLE)
                       , subkey
                       , attr
                       , url
                       , seq
                  FROM bomCTE a
                  WHERE parent = (
                                  SELECT
                                         CAST(menu_id AS VARCHAR)
                                  FROM     tb_menu
                                  WHERE   title = 'ROOT'
                        )
                                 ORDER BY
                                          seq;
         END;
             ELSE
         BEGIN
             SELECT
                    menu_id
                  , isnull( (
                             SELECT
                                    TRANS
                             FROM    TB_DICTIONARY
                             WHERE  LANG_ID = @P_LANG_ID
                                    AND KOR = a.title
                    ), a.TITLE)
                  , CAST(parent AS VARCHAR)+'/'+CAST(menu_id AS VARCHAR) subkey
                  , attr
                  , url
             FROM tb_menu a
             WHERE parent = (
                             SELECT
                                    CAST(menu_id AS VARCHAR)
                             FROM     tb_menu
                             WHERE   title = 'ROOT'
                   )
                            ORDER BY
                                     seq;
         END;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_hist_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

[pk_ATM_sp_menu_group] 'je_bae'
******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_hist_S]
    @p_menu_id NVARCHAR(20)
  , @p_user    NVARCHAR(255)
AS
     BEGIN
         SET NOCOUNT ON;
         INSERT INTO                  TB_MENU_USE_HIST (
                MENU_ID
              , [USER_ID]
              , CLICK_DTTM )
         SELECT
                @p_menu_id
              , @p_user
              , GETDATE();
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_info_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

[pk_ATM_sp_menu_group] 'je_bae'
******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_info_S]
    @p_menu_id VARCHAR(20)
  , @p_title   NVARCHAR(255)
  , @p_url     NVARCHAR(255)
  , @p_save_by NVARCHAR(255)
AS
     BEGIN
         SET NOCOUNT ON;
         UPDATE TB_MENU
           SET
               TITLE = @p_title
             , URL = @p_url
             , SAVE_BY = @p_save_by
         WHERE
               MENU_ID = @p_menu_id;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_init_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

[pk_ATM_sp_menu_group] 'je_bae'
******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_init_L]
    @user_id   VARCHAR(20)
  , @P_LANG_ID VARCHAR(20) = 'KOR'
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                *
         INTO
              #ttt
         FROM (
               SELECT
                      b.menu_id
                    , b.title
                    , b.remark
                    , b.url
                    , b.parent                                                         parent_key
                    , CAST(b.parent AS VARCHAR)+'/'+CAST(b.menu_id AS VARCHAR)         subkey
                    , CASE read_flag WHEN 1
                          THEN 'true'
                          ELSE 'false'
                                                                               END     read_flag
                    , CASE edit_flag WHEN 1
                          THEN 'true'
                          ELSE 'false'
                                                                                   END edit_flag
                    , attr
                    , seq
               FROM     tb_menu_auth a
                      , tb_menu b
               WHERE   a.emp_id = @user_id
                       AND a.menu_id = b.menu_id
                       AND b.title <> '-'
               UNION
               SELECT
                      b.menu_id
                    , b.title
                    , b.remark
                    , b.url
                    , b.parent                                                         parent_key
                    , CAST(b.parent AS VARCHAR)+'/'+CAST(b.menu_id AS VARCHAR)         subkey
                    , CASE read_flag WHEN 1
                          THEN 'true'
                          ELSE 'false'
                                                                               END     read_flag
                    , CASE edit_flag WHEN 1
                          THEN 'true'
                          ELSE 'false'
                                                                                   END edit_flag
                    , attr
                    , seq
               FROM   tb_menu_auth a
                    , tb_menu b
               WHERE  a.emP_id = (
                                  SELECT
                                         AUTH_ID
                                  FROM   tb_emp
                                  WHERE  emp_id = @user_id
                     )
                      AND a.uSer_group = 'AUTH'
                      AND a.menu_id = b.menu_id
                      AND b.title <> '-'
                      AND A.MENU_ID NOT IN (
                                            SELECT
                                                   MENU_ID
                                            FROM   TB_MENU_AUTH
                                            WHERE  EMP_ID = @user_id
                                                   AND USER_GROUP = 'USER'
                                           )
              ) r;
         WITH bomCTE(
              menu_id
            , title
            , parent_key
            , subkey
            , attr
            , url
            , seq
            , remark)
              AS (
              SELECT
                     menu_id
                   , title
                   , parent_key
                   , subkey
                   , attr
                   , url
                   , seq
                   , remark
              FROM     #ttt
              UNION ALL
              SELECT
                     E.menu_id
                   , E.TITLE
                   , E.parent
                   , CAST(E.parent AS VARCHAR)+'/'+CAST(E.menu_id AS VARCHAR)
                   , E.attr
                   , E.url
                   , E.seq
                   , E.REMARK
              FROM   TB_MENU AS E
              INNER JOIN bomCTE AS M ON CAST(E.parent AS VARCHAR)+'/'+CAST(E.menu_id AS VARCHAR) = M.parent_key)
              SELECT DISTINCT
                     menu_id
                   , isnull( (
                              SELECT
                                     TRANS
                              FROM     TB_DICTIONARY
                              WHERE  LANG_ID = @P_LANG_ID
                                     AND KOR = a.title
                     ), a.TITLE)
                   , remark
                   , url
                   , parent_key
                   , CAST(parent_key AS VARCHAR)+'/'+CAST(menu_id AS VARCHAR)         subkey
                   , CASE WHEN attr = 'I'
                         THEN (
                               SELECT
                                      read_flag
                               FROM   #ttt
                               WHERE  menu_id = a.menu_id
                              )
                         ELSE 'true'
                                                                              END     read_flag
                   , CASE WHEN attr = 'I'
                         THEN (
                               SELECT
                                      edit_flag
                               FROM   #ttt
                               WHERE  menu_id = a.menu_id
                              )
                         ELSE 'true'
                                                                                  END edit_flag
                   , attr
                   , seq
              FROM bomCTE A
              UNION
              SELECT
                     b.menu_id
                   , isnull( (
                              SELECT
                                     TRANS
                              FROM    TB_DICTIONARY
                              WHERE  LANG_ID = @P_LANG_ID
                                     AND KOR = B.title
                     ), b.TITLE)
                   , b.remark
                   , b.url
                   , b.parent                                                 parent_key
                   , CAST(b.parent AS VARCHAR)+'/'+CAST(b.menu_id AS VARCHAR) subkey
                   , ''                                                       read_flag
                   , ''                                                       edit_flag
                   , 'I'
                   , seq
              FROM tb_menu b
              WHERE b.title = '-'
              ORDER BY
                       seq;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_init3_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

--[pk_ATM_sp_menu_init3_L] 'je_bae', 'KOR', '1/2389'
******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_init3_L]
    @user_id   VARCHAR(20)
  , @P_LANG_ID VARCHAR(20) = 'KOR'
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                *
         INTO
              #ttt
         FROM (
               SELECT
                      b.menu_id
                    , b.title
                    , b.remark
                    , b.url
                    , b.parent                                                         parent_key
                    , CAST(b.parent AS VARCHAR)+'/'+CAST(b.menu_id AS VARCHAR)         subkey
                    , CASE read_flag WHEN 1
                          THEN 'true'
                          ELSE 'false'
                                                                               END     read_flag
                    , CASE edit_flag WHEN 1
                          THEN 'true'
                          ELSE 'false'
                                                                                   END edit_flag
                    , attr
                    , seq
               FROM     tb_menu_auth a
                      , tb_menu b
               WHERE   a.emp_id = @user_id
                       AND a.menu_id = b.menu_id
                       AND b.title <> '-'
               UNION
               SELECT
                      b.menu_id
                    , b.title
                    , b.remark
                    , b.url
                    , b.parent                                                         parent_key
                    , CAST(b.parent AS VARCHAR)+'/'+CAST(b.menu_id AS VARCHAR)         subkey
                    , CASE read_flag WHEN 1
                          THEN 'true'
                          ELSE 'false'
                                                                               END     read_flag
                    , CASE edit_flag WHEN 1
                          THEN 'true'
                          ELSE 'false'
                                                                                   END edit_flag
                    , attr
                    , seq
               FROM   tb_menu_auth a
                    , tb_menu b
               WHERE  a.emP_id = (
                                  SELECT
                                         AUTH_ID
                                  FROM   tb_emp
                                  WHERE  emp_id = @user_id
                     )
                      AND a.uSer_group = 'AUTH'
                      AND a.menu_id = b.menu_id
                      AND b.title <> '-'
                      AND A.MENU_ID NOT IN (
                                            SELECT
                                                   MENU_ID
                                            FROM   TB_MENU_AUTH
                                            WHERE  EMP_ID = @user_id
                                                   AND USER_GROUP = 'USER'
                                           )
              ) r;
         WITH bomCTE(
              menu_id
            , title
            , parent_key
            , subkey
            , attr
            , url
            , seq
            , remark)
              AS (
              SELECT
                     menu_id
                   , title
                   , parent_key
                   , subkey
                   , attr
                   , url
                   , seq
                   , remark
              FROM     #ttt
              UNION ALL
              SELECT
                     E.menu_id
                   , E.TITLE
                   , E.parent
                   , CAST(E.parent AS VARCHAR)+'/'+CAST(E.menu_id AS VARCHAR)
                   , E.attr
                   , E.url
                   , E.seq
                   , E.REMARK
              FROM   TB_MENU AS E
              INNER JOIN bomCTE AS M ON CAST(E.parent AS VARCHAR)+'/'+CAST(E.menu_id AS VARCHAR) = M.parent_key)
              SELECT DISTINCT
                     menu_id
                   , isnull( (
                              SELECT
                                     TRANS
                              FROM     TB_DICTIONARY
                              WHERE  LANG_ID = @P_LANG_ID
                                     AND KOR = a.title
                     ), a.TITLE)
                   , remark
                   , url
                   , parent_key
                   , CAST(parent_key AS VARCHAR)+'/'+CAST(menu_id AS VARCHAR)         subkey
                   , CASE WHEN attr = 'I'
                         THEN (
                               SELECT
                                      read_flag
                               FROM   #ttt
                               WHERE  menu_id = a.menu_id
                              )
                         ELSE 'true'
                                                                              END     read_flag
                   , CASE WHEN attr = 'I'
                         THEN (
                               SELECT
                                      edit_flag
                               FROM   #ttt
                               WHERE  menu_id = a.menu_id
                              )
                         ELSE 'true'
                                                                                  END edit_flag
                   , attr
                   , seq
              FROM bomCTE A
              UNION
              SELECT
                     b.menu_id
                   , isnull( (
                              SELECT
                                     TRANS
                              FROM    TB_DICTIONARY
                              WHERE  LANG_ID = 'KOR'--@P_LANG_ID 
                                     AND KOR = B.title
                     ), b.TITLE)
                   , b.remark
                   , b.url
                   , b.parent                                                 parent_key
                   , CAST(b.parent AS VARCHAR)+'/'+CAST(b.menu_id AS VARCHAR) subkey
                   , ''                                                       read_flag
                   , ''                                                       edit_flag
                   , 'I'
                   , seq
              FROM tb_menu b
              WHERE b.title = '-'
              ORDER BY
                       seq;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_item_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

--[pk_ATM_sp_menu_init3_L] 'je_bae', 'KOR', '1/2389'
******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_item_L]
    @p_parent  VARCHAR(255)
  , @P_LANG_ID VARCHAR(20)  = 'KOR'
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                menu_id
              , isnull( (
                         SELECT
                                TRANS
                         FROM    TB_DICTIONARY
                         WHERE  LANG_ID = @P_LANG_ID
                                AND KOR = a.title
                ), a.TITLE)
              , remark
              , attr
              , url
         FROM TB_MENU a
         WHERE PARENT = @p_parent
         ORDER BY
                  seq;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

--[pk_ATM_sp_menu_init3_L] 'je_bae', 'KOR', '1/2389'
******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_L]
    @p_id      VARCHAR(20)
  , @P_LANG_ID VARCHAR(20) = 'KOR'
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                menu_id
              , isnull( (
                         SELECT
                                TRANS
                         FROM    TB_DICTIONARY
                         WHERE  LANG_ID = @P_LANG_ID
                                AND KOR = a.title
                ), a.TITLE) TITLE
              , url
              , attr
              , seq
              , parent
         FROM tb_menu a
         WHERE menu_id = @p_id;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_restore_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_restore_S]
    @p_apply_start NVARCHAR(255)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;

--메뉴전체삭제
             DELETE TB_MENU;
             INSERT INTO         TB_MENU (
                    menu_id
                  , TITLE
                  , remark
                  , URL
                  , ATTR
                  , PARENT
                  , SEQ
                  , CREATE_BY
                  , SAVE_BY )
             SELECT
                    menu_id
                  , TITLE
                  , remark
                  , URL
                  , ATTR
                  , PARENT
                  , SEQ
                  , CREATE_BY
                  , SAVE_BY
             FROM   TB_MENU_BACKUP
             WHERE  APPLY_START = @p_apply_start
                    AND VALID = 1;
             COMMIT;
         END TRY
         BEGIN CATCH
             IF(@@TRANCOUNT > 0)
             BEGIN
                 ROLLBACK;
             END;
             DECLARE @ERR_MSG NVARCHAR(4000);
             SET @ERR_MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@ERR_MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_root_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_root_L]
    @P_LANG_ID VARCHAR(20) = 'KOR'
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                menu_id
              , isnull( (
                         SELECT
                                TRANS
                         FROM    TB_DICTIONARY
                         WHERE  LANG_ID = @P_LANG_ID
                                AND KOR = a.title
                ), a.TITLE)
              , remark
         FROM TB_MENU a
         WHERE isnull(parent, '') = ''
         ORDER BY
                  seq;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_menu_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_menu_S]
    @p_id     NVARCHAR(20)
  , @p_title  NVARCHAR(255)
  , @p_remark NVARCHAR(255)
  , @p_url    NVARCHAR(255)
  , @p_attr   NVARCHAR(20)
  , @p_parent NVARCHAR(255)
  , @p_seq    NVARCHAR(20)
  , @p_saveby NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         IF ISNULL(@p_id, ' ') = ' '
         BEGIN
             INSERT INTO         TB_MENU (
                    TITLE
                  , remark
                  , URL
                  , ATTR
                  , PARENT
                  , SEQ
                  , CREATE_BY
                  , SAVE_BY )
             VALUES (
                    @p_title
                  , @p_remark
                  , @p_url
                  , @p_attr
                  , @p_parent
                  , @p_seq
                  , @p_saveby
                  , @p_saveby);
             UPDATE tb_menu
               SET
                   menu_id = SCOPE_IDENTITY()
             WHERE
                   menu_id = 0;
         END;
             ELSE
         BEGIN
             UPDATE tb_menu
               SET
                   title = CASE WHEN (
                                      SELECT TOP 1
                                             lang_id
                                      FROM   tb_login_hist
                                      WHERE  emp_id = @p_saveby
                                      ORDER BY
                                               login_dttm DESC
                                     ) = 'KOR'
                               THEN @p_title
                               ELSE title
                           END
                 , remark = @p_remark
                 , url = @p_url
                 , attr = @p_attr
                 , parent = @p_parent
                 , seq = @p_seq
                 , save_by = @p_saveby
             WHERE
                   menu_id = @p_id;
         END;
         SET NOCOUNT OFF;
     END;
GO

/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_popup_menu_auth_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_popup_menu_auth_D]
    @p_menu_id  VARCHAR(20)
  , @p_cell_idx VARCHAR(20)
  , @p_linked   VARCHAR(20)
  , @p_url_no   VARCHAR(20)
  , @p_saveby   NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         BEGIN TRY
             BEGIN TRAN;
             DELETE FROM TB_POPUP_MENU_AUTH
             WHERE
                   MENU_ID = @p_menu_id
                   AND CELL_INDEX = @p_cell_idx
                   AND LINKED = @p_linked
                   AND URL_NO = @p_url_no;
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_popup_menu_auth_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_popup_menu_auth_L]
    @p_menu_id  VARCHAR(20)
  , @p_cell_idx VARCHAR(20)
  , @p_linked   VARCHAR(20)
  , @p_url_no   VARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                '['+USER_GROUP+']'+emp_id emp_id
              , CASE read_flag WHEN 1
                    THEN 'true'
                    ELSE 'false'
                                          END
              , CASE edit_flag WHEN 1
                    THEN 'true'
                    ELSE 'false'
                                          END
         FROM   TB_POPUP_MENU_AUTH (NOLOCK)
         WHERE  MENU_ID = @p_menu_id
                AND CELL_INDEX = @p_cell_idx
                AND LINKED = @p_linked
                AND URL_NO = @p_url_no
         ORDER BY
                  emp_id;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_popup_menu_auth_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_popup_menu_auth_S]
    @p_menu_id    VARCHAR(20)
  , @p_cell_idx   VARCHAR(20)
  , @p_linked     VARCHAR(20)
  , @p_url_no     VARCHAR(20)
  , @p_saveby     NVARCHAR(20)
  , @p_user_group NVARCHAR(20)
  , @p_user_id    NVARCHAR(20)
  , @p_read       VARCHAR(20)
  , @p_edit       VARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         IF @p_read = 'true'
         BEGIN
             SET @p_read = 1;
         END;
             ELSE
         BEGIN
             SET @p_read = 0;
         END;
         IF @p_edit = 'true'
         BEGIN
             SET @p_edit = 1;
         END;
             ELSE
         BEGIN
             SET @p_edit = 0;
         END;
         BEGIN TRY
             BEGIN TRAN;
             INSERT INTO                    TB_POPUP_MENU_AUTH (
                    MENU_ID
                  , CELL_INDEX
                  , LINKED
                  , URL_NO
                  , USER_GROUP
                  , EMP_ID
                  , READ_FLAG
                  , EDIT_FLAG
                  , CREATE_BY
                  , SAVE_BY )
             VALUES (
                    @p_menu_id
                  , @p_cell_idx
                  , @p_linked
                  , @p_url_no
                  , @p_user_group
                  , @p_user_id
                  , @p_read
                  , @p_edit
                  , @p_saveby
                  , @p_saveby);
             COMMIT;
         END TRY
         BEGIN CATCH
             ROLLBACK;
             DECLARE @MSG NVARCHAR(4000);
             SET @MSG = dbo.[fn_getErrMsg] (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE());
             RAISERROR(@MSG, 16, 1);
         END CATCH;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_popup_menu_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 
-- pk_ATM_sp_popup_menu_L '../user_page/Laboratory/HST_MES036_LDReqOrder.aspx?title=MES036.LD_Request_Order&delimiter;','kor','6855','0','0','mes'
******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_popup_menu_L]
    @p_menu    NVARCHAR(MAX)
  , @P_LANG_ID VARCHAR(20)   = 'KOR'
  , @P_MENU_ID VARCHAR(20)   = NULL
  , @P_CELL_NO VARCHAR(20)   = NULL
  , @P_LINKED  VARCHAR(20)   = NULL
  , @P_USER_ID VARCHAR(50)   = NULL
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................  
         DECLARE @tbl TABLE(
             idx   INT
           , vData NVARCHAR(255));
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues ('&delimiter;', @p_menu);
--.................................................................   
         SELECT DISTINCT
                A.URL_NO
         INTO
              #TMP_TBL
         FROM (
               SELECT
                      MENU_ID
                    , CELL_INDEX
                    , LINKED
                    , URL_NO
                    , USER_GROUP
                    , EMP_ID
                    , READ_FLAG
                    , EDIT_FLAG
               FROM   TB_POPUP_MENU_AUTH PMA
               WHERE  PMA.MENU_ID = @P_MENU_ID
                      AND PMA.CELL_INDEX = @P_CELL_NO
                      AND PMA.LINKED = @P_LINKED
                      AND PMA.USER_GROUP = 'AUTH'
                      AND PMA.EMP_ID = (
                                        SELECT
                                               AUTH_ID
                                        FROM     TB_EMP
                                        WHERE   EMP_ID = @P_USER_ID
                     )
                                       UNION
                                       SELECT
                                              MENU_ID
                                            , CELL_INDEX
                                            , LINKED
                                            , URL_NO
                                            , USER_GROUP
                                            , EMP_ID
                                            , READ_FLAG
                                            , EDIT_FLAG
                                       FROM   TB_POPUP_MENU_AUTH PMA
                                       WHERE  PMA.MENU_ID = @P_MENU_ID
                                              AND PMA.CELL_INDEX = @P_CELL_NO
                                              AND PMA.LINKED = @P_LINKED
                                              AND PMA.USER_GROUP <> 'AUTH'
                                              AND PMA.EMP_ID = @P_USER_ID
              ) A;
         SELECT
                CASE WHEN b.MENU_ID IS NOT NULL
                    THEN '../'+b.URL
                    ELSE vData
                END     "URL"
              , CASE WHEN b.MENU_ID IS NOT NULL
                    THEN CASE WHEN @P_LANG_ID != 'KOR'
                             THEN (
                                   SELECT
                                          TRANS
                                   FROM    TB_DICTIONARY
                                   WHERE  LANG_ID = @P_LANG_ID
                                          AND kor = b.TITLE
                                  )
                             ELSE b.TITLE
                         END
                    ELSE ''
                    END "TITLE"
              , ISNULL(b.MENU_ID, '')
              , ISNULL(b.PARENT, '')
              , CASE WHEN isnull(c.URL_NO, 100) = 100
                    THEN 'false'
                    ELSE 'true'
                                   END
         FROM @tbl a
         LEFT OUTER JOIN #TMP_TBL C ON C.URL_NO = A.idx - 1
         LEFT OUTER JOIN TB_MENU b ON a.vData = b.MENU_ID;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_proc_list_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 
-- pk_ATM_sp_popup_menu_L '../user_page/Laboratory/HST_MES036_LDReqOrder.aspx?title=MES036.LD_Request_Order&delimiter;','kor','6855','0','0','mes'
******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_proc_list_L]
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                name
         FROM   sysobjects
         WHERE  xtype = 'P'
         ORDER BY
                  NAME;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_sub_menu_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_sub_menu_L]
    @p_level        INT            = 1
  , @p_parent_id    NVARCHAR(100)  = '1/0000'
  , @p_group_id     NVARCHAR(100)  = ''
  , @p_parent_title NVARCHAR(4000) = ''
  , @p_user_id      NVARCHAR(100)  = 'je_bae'
  , @P_LANG_ID      VARCHAR(20)    = 'KOR'
AS
     BEGIN
         SET NOCOUNT ON;

--IF @p_level>1
--SELECT         '<DIV STYLE=''BORDER:1 SOLID RED; padding-left:20px''>('+cast(@p_level as varchar)+')'              
         IF @p_level > 1
         BEGIN
             SELECT
                    '<table cellpadding=0 cellspacing=0 id=''div'+@p_group_id+''' class=''divSub'' style=''width:100%;'' >
            <tr>
                <td style=''height:100%;''>
                    <table id ="tdSub'+@p_parent_id+'" cellpadding=0 cellspacing=0 style=''width:100%''>';
         END;
             ELSE
         BEGIN
             SELECT
                    '<table cellpadding=0 cellspacing=0 id=''div'+@p_group_id+''' class=''divSub'' style=''width:100%;display:none'' >
             
            <tr>
                <td style=''height:100%;padding:4 8 4 4''>
                    <table id ="tdSub'+@p_parent_id+'" cellpadding=0 cellspacing=0 style=''width:100%''>';
         END;
         DECLARE @parent_id VARCHAR(255);
         DECLARE @attr VARCHAR(255);
         DECLARE @title VARCHAR(255);
         DECLARE @menu_info NVARCHAR(4000);
         DECLARE @tbl TABLE(
             idx       INT IDENTITY(1, 1)
           , parent_id NVARCHAR(255)
           , attr      NVARCHAR(255)
           , menu_info NVARCHAR(4000)
           , title     NVARCHAR(255));
         SELECT
                menu_id
         INTO
              #fav_tbl
         FROM   tb_fav a
         WHERE  emp_id = @p_user_id
         ORDER BY
                  save_dttm;
         IF @p_parent_id <> '1/0000'
         BEGIN
             INSERT INTO      @tbl (
                    parent_id
                  , attr
                  , menu_info
                  , title )
             SELECT
                    m.PARENT+'/'+m.MENU_ID
                  , M.ATTR
                  , CASE WHEN M.TITLE = '-'
                        THEN ' <tr style=''height:2px;''> 
                        <td colspan=2>
                            <div STYLE="border-top:rgb(172,172,172) dotted 1px;"></div>
                        </td>
                    </tr>'
                        ELSE CASE M.ATTR WHEN 'I'
                                 THEN ' <tr  >
                                <td style=''padding-right:1;white-space:nowrap;text-align:right ''></td>
                                <td style=''width:100%;padding-bottom:1; padding-top:1;  white-space:nowrap;''>
                                    <table style='' width:100%; height:24;'' cellpadding=''0'' cellspacing=''0'' >
                                        <tr>
                                            <td id=''td'+m.MENU_ID+''' 
                                                onmouseout=''outMouse3(this, "'+m.MENU_ID+'")'' 
                                                onmouseover=''overMouse3(this, "'+m.MENU_ID+'")'' 
                                                onclick=''javascript:openWindow3(this,"'+m.MENU_ID+'","'+M.URL+CASE WHEN CHARINDEX('?', M.URL) > 0
                                                                                                                   THEN '&'
                                                                                                                   ELSE '?'
                                                                                                               END+'TITLE='+@p_parent_title+'>'+M.TITLE+'&MENU='+M.MENU_ID+'&GROUP_MENU='+M.PARENT+'&USER_ID='+@p_user_id+'&REMARK='+M.REMARK+'","'+@p_parent_title+'>'+M.TITLE+'","'+@p_user_id+'");''  
                                                style='' white-space:nowrap; width:100%; padding-left:2; font-size:102%; '' >
                                            '+m.TITLE+'
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>' WHEN 'F'
                                 THEN ' <tr height="100%" >
                            <td style=''padding-right:1;white-space:nowrap;text-align:right''>
                                <img id=''img'+m.MENU_ID+''' name=''imgFocus''  src='''+CASE WHEN @p_level > 1
                                                                                            THEN+'img/leftmenu_over_icon.gif'
                                                                                            ELSE 'img/leftmenu_over_icon.gif'
                                                                                        END+'''  style=''border:0;''>
                                </td>
                            <td style=''border-bottom:rgb(172,172,172) solid 1px;width:100%; height:100%; padding-bottom:3; padding-top:2;  white-space:nowrap; vertical-align:middle;''>
                                <table style='' width:100%; height:100%; height:26'' cellpadding=''0'' cellspacing=''0''>
                                    <tr height="100%">
                                        <td id=''td'+m.MENU_ID+''' 
                                                 onclick=''javascript:showSubTD(this,"tdSub'+@p_parent_id+'/'+m.MENU_ID+'",'+m.MENU_ID+');''  
                                                 style=''cursor:hand; white-space:nowrap; width:100%; height:100%; padding-left:2;font-size:102%; font-weight:bold; color:rgb(19,81,120); vertical-align:middle;'' >
                                        '+m.TITLE+'
                                        </td></tr></table>
                            </td>
                           </tr>
                           <TD></TD>
                           <TD STYLE=''PADDING-LEFT:0''>'
                             END
                      END
                  , m.TITLE
             FROM   TB_MENU m
             WHERE  m.PARENT = @p_parent_id
--where case when @p_parent_id = '1/0000' then 
--    case when m.MENU_ID in (select menu_id from #fav_tbl) then 1 else 0 end
--else
--    case when m.PARENT=@p_parent_id then 1 else 0 end
--end = 1
                    AND (M.MENU_ID IN (
                                       SELECT
                                              A.MENU_ID
                                       FROM     TB_MENU_AUTH A
                                       WHERE   A.USER_GROUP = 'USER'
                                               AND A.EMP_ID = @p_user_id
                                       UNION
                                       SELECT
                                              A.MENU_ID
                                       FROM   TB_MENU_AUTH A
                                       JOIN TB_EMP E ON A.EMP_ID = E.AUTH_ID
                                       WHERE  A.USER_GROUP = 'AUTH'
                                              AND E.EMP_ID = @p_user_id
                                      )
                                       OR M.TITLE = '-')
             ORDER BY
                      M.SEQ;
         END;
             ELSE
         BEGIN
             INSERT INTO      @tbl (
                    parent_id
                  , attr
                  , menu_info
                  , title )
             SELECT
                    m.PARENT+'/'+m.MENU_ID
                  , M.ATTR
                  , ' <tr  >
                    <td style=''padding-right:1;white-space:nowrap;text-align:right ''></td>
                    <td style=''width:100%;padding-bottom:1; padding-top:1;  white-space:nowrap;''>
                        <table style='' width:100%; height:24;'' cellpadding=''0'' cellspacing=''0'' >
                            <tr>
                                <td id=''td'+m.MENU_ID+''' 
                                    onmouseout=''outMouse3(this, "'+m.MENU_ID+'")'' 
                                    onmouseover=''overMouse3(this, "'+m.MENU_ID+'")'' 
                                    onclick=''javascript:openWindow3(this,"'+m.MENU_ID+'","'+M.URL+CASE WHEN CHARINDEX('?', M.URL) > 0
                                                                                                       THEN '&'
                                                                                                       ELSE '?'
                                                                                                   END+'TITLE='+@p_parent_title+'>'+M.TITLE+'&MENU='+M.MENU_ID+'&GROUP_MENU='+M.PARENT+'&USER_ID='+@p_user_id+'&REMARK='+M.REMARK+'","'+@p_parent_title+'>'+M.TITLE+'","'+@p_user_id+'");''  
                                    style='' white-space:nowrap; width:100%; padding-left:2; font-size:102%; '' >
                                '+m.TITLE+'
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>'
                  , m.TITLE
             FROM   TB_MENU m
             JOIN tb_fav f ON m.MENU_ID = f.menu_id
                              AND f.emp_id = @p_user_id
             ORDER BY
                      f.save_dttm;
         END;
         DECLARE @i INT;
         SET @i = 1;
         WHILE @i <= (
                      SELECT
                             MAX(idx)
                      FROM   @tbl
               )
         BEGIN
             SELECT
                    @parent_id = a.parent_id
                  , @menu_info = a.menu_info
                  , @attr = a.attr
                  , @title = a.title
             FROM   @tbl a
             WHERE  a.idx = @i;
             SELECT
                    @menu_info;
             IF @attr = 'F'
             BEGIN
                 SET @p_level = @p_level + 1;
                 SET @p_parent_title = @title;
                 EXEC [pk_ATM_sp_sub_menu_L]
                      @p_level
                    , @parent_id
                    , @p_group_id
                    , @p_parent_title
                    , @p_user_id
                    , @P_LANG_ID;
                 SELECT
                        '</TD>';
             END;
             SET @i = @i + 1;
         END;
         SELECT
'</table>
             </tr></td></table>';
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_sp_sys_code_group_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_sp_sys_code_group_L]
    @p_group_name NVARCHAR(255)
  , @p_valid      NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                '@@HEADER' "@@"
              , '코드그룹'
              , '@@PARAM';
         SELECT DISTINCT
                '@@list'
              , '<trans>'+GROUP_NAME  코드그룹
              , GROUP_ID+';'+@p_valid "@@PARAM"
         FROM   TB_GROUP
         WHERE  USE_SYSTEM = 1
                AND GROUP_NAME LIKE '%'+ISNULL(@p_group_name, '')+'%'
         ORDER BY
                  1
                , 2;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_ATM_TEST]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[pk_ATM_TEST]
    @p_rowstamp  NVARCHAR(20)
, @p_delimiter NVARCHAR(20)
  --, @p_values    NVARCHAR(4000)
  --, @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
		RAISERROR(@p_rowstamp,16,1);
     END;
GO
/****** Object:  StoredProcedure [dbo].[pk_CD_sp_user_group_emp_info_add_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- exec pk_CD_sp_user_group_emp_info_add_S @p_user_group_id=N'BUY_ADMIN',@p_values=N'''1''',@p_saveby=N'je_bae'
CREATE PROC  [dbo].[pk_CD_sp_user_group_emp_info_add_S]    
	@p_user_group_id nvarchar(20), 
	@p_keys nvarchar(4000),
	@p_values nvarchar(4000),      
	@p_saveby nvarchar(20)      
as      
begin      
 SET NOCOUNT ON      

 --parsing value string ..............................................        
 declare @tbl table (idx int, vData nvarchar(255));        
 INSERT INTO @tbl        
 SELECT * FROM dbo.fn_getValues(',',@p_values);        
 --.................................................................     

select * from @tbl;
         
 -- if exists(select * from TB_USER_GROUP_EMP_INFO
	--				 where USER_GROUP_ID = @p_user_group_id
	--				  AND EMP_ID in (select substring(vData,2,len(vData)-2) from @tbl where vData<>''))
 -- begin
	--raiserror('이미 등록된 항목 입니다.',16,1)
	--return 0;
 -- end
			
		     
  BEGIN TRY      

   BEGIN TRAN       

    INSERT INTO  TB_USER_GROUP_EMP_INFO(      
	  USER_GROUP_ID, 
	  EMP_ID,    
	  REMARK,      
	  create_by,save_by)      
    SELECT       
	  @P_USER_GROUP_ID, 
	  EMP_ID, 
	  REMARK,       
	  @p_saveby,@p_saveby      
    FROM TB_EMP  
	WHERE EMP_ID in  (select substring(vData,2,len(vData)-2) from @tbl where vData<>''
						and substring(vData,2,len(vData)-2) not in (select EMP_ID from TB_USER_GROUP_EMP_INFO where USER_GROUP_ID = @p_user_group_id ))


   COMMIT;      
     
  END TRY      
  BEGIN CATCH      
   IF (@@TRANCOUNT>0) ROLLBACK;        
   DECLARE @MSG nvarchar(4000);        
   set @MSG = dbo.[fn_getErrMsg](ERROR_NUMBER(),ERROR_MESSAGE(),ERROR_PROCEDURE());        
   raiserror (@MSG,16,1);      
         
  END CATCH;       
  
  
 SET NOCOUNT OFF      
end      
GO
/****** Object:  StoredProcedure [dbo].[SYS_FIND_MISSING_INDEX]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : DMV 상 누락된 인덱스 정보 찾기
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/27  이성근           fixed

사용예: 

EXEC [SYS_FIND_MISSING_INDEX] 'dabom50_demo'

******************************************************************/
CREATE PROCEDURE [dbo].[SYS_FIND_MISSING_INDEX]
    @P_DBNAME VARCHAR(50) 
AS
BEGIN
    
    ------ 생성DB 확인
    -- select name from sys.sysdatabases

    SELECT d.*
         , s.avg_total_user_cost
         , s.avg_user_impact
         , s.last_user_seek
         , s.unique_compiles
    FROM  sys.dm_db_missing_index_groups g
    JOIN sys.dm_db_missing_index_group_stats s ON s.group_handle = g.index_group_handle
    JOIN sys.dm_db_missing_index_details d ON d.index_handle = g.index_handle
    WHERE d.database_id = DB_ID(@P_DBNAME)
    ORDER BY
             s.avg_user_impact DESC;
             
END;
GO
/****** Object:  StoredProcedure [dbo].[SYS_FIND_NOT_USED_INDEX]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 사용안하는 인덱스 찾기
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/27  이성근           fixed

사용예: 

EXEC [SYS_FIND_NOT_USED_INDEX] 'ATM51'


******************************************************************/
CREATE PROCEDURE [dbo].[SYS_FIND_NOT_USED_INDEX]
    @P_DBNAME VARCHAR(50) 
AS
BEGIN
    
    ------ 생성DB 확인
    -- select name from sys.sysdatabases

    SELECT @P_DBNAME               AS DBName
        , OBJECT_NAME(i.object_id) AS TAB
        , i.name                   AS IDXName
    --INTO #unusedindex
    FROM  sys.objects o
    INNER JOIN  sys.indexes i ON o.object_id = i.object_id
    WHERE  i.index_id NOT IN (
                            SELECT
                                    s.index_id
                            FROM   sys.dm_db_index_usage_stats s
                            WHERE  s.object_id = i.object_id
                                    AND i.index_id = s.index_id
                                    --AND database_id = DB_ID(@P_DBNAME)
                            )
        AND o.type = 'U'
    ORDER BY OBJECT_NAME(i.object_id) ASC;

END;
GO
/****** Object:  StoredProcedure [dbo].[SYS_INDEX_REBUILD]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : DMV 상 누락된 인덱스 정보 찾기
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/27  이성근           fixed

사용예: 

EXEC [SYS_INDEX_REBUILD] 'dabom50_demo'

******************************************************************/
CREATE PROCEDURE [dbo].[SYS_INDEX_REBUILD]
    @P_DBNAME VARCHAR(50) 
AS
BEGIN
    
    ------ 생성DB 확인
    -- select name from sys.sysdatabases

    DECLARE @i int, @sql varchar(1000)
    DECLARE @tablename varchar(1000),@ownerName  varchar(1000)
    SET @i = 1

    DECLARE DB_Cursor CURSOR FOR 
        SELECT TABLE_SCHEMA, TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
    
    OPEN DB_Cursor FETCH NEXT FROM DB_Cursor INTO @ownerName, @tablename
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @sql='ALTER INDEX ALL ON ' + @ownerName + '.' + @tablename
                            +' REBUILD WITH (PAD_INDEX = ON, FILLFACTOR = 80) ' -- FILLFACTOR 상황에 맞게 조절 
        PRINT @sql

        -- EXEC (@sql)
        -- PRINT CONVERT(VARCHAR, @i) + '__' + @ownerName + '.' + @tablename + '............ OK'

        SET @i = @i + 1
        
        FETCH NEXT FROM DB_Cursor INTO @ownerName, @tablename
    END

    CLOSE DB_Cursor
    DEALLOCATE DB_Cursor

    CHECKPOINT 1
    DBCC DROPCLEANBUFFERS
             
END;
GO
/****** Object:  StoredProcedure [dbo].[SYS_TABLE_SPACE_USED]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : DMV 상 누락된 인덱스 정보 찾기
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/27  이성근           fixed

사용예: 

EXEC [SYS_TABLE_SPACE_USED] 'dabom50_demo'

******************************************************************/
CREATE PROCEDURE [dbo].[SYS_TABLE_SPACE_USED]
    @P_DBNAME VARCHAR(50) 
AS
BEGIN
    
    CREATE TABLE #TableSize(
        Name       VARCHAR(255)
      , [rows]     INT
      , reserved   VARCHAR(255)
      , data       VARCHAR(255)
      , index_size VARCHAR(255)
      , unused     VARCHAR(255)
    );

    EXEC sp_MSforeachtable
         @command1 = "insert into #TableSize EXEC sp_spaceused '?'";

    SELECT name                                                Name       
         , [rows]                                              [rows]     
         , SUBSTRING(reserved, 0, LEN(reserved)-2) + '(kb)'    reserved   
         , SUBSTRING(data, 0, LEN(data)-2)+ '(kb)'             data       
         , SUBSTRING(index_size, 0, LEN(index_size)-2)+ '(kb)' index_size 
         , SUBSTRING(unused, 0, LEN(unused)-2)+ '(kb)'         unused     
    FROM #TableSize;

SET NOCOUNT OFF
END;
GO
/****** Object:  StoredProcedure [dbo].[SYS_TABLE_SPEC]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : SYS_TABLE_SPEC
* DATE            : ----/--/--
* AUTHOR          : LEE SUNG KEUN 
* PROCEDURE DESC  : 테이블 스크립트 HTML 변환
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
2017/11/24  Lee sung keun    Created. 

******************************************************************/

CREATE PROCEDURE [dbo].[SYS_TABLE_SPEC]
AS
     BEGIN
         SET NOCOUNT ON;
         DECLARE @i INT, @maxi INT;
         DECLARE @j INT, @maxj INT;
         DECLARE @sr INT;
         DECLARE @Output VARCHAR(4000);
--Declare @tmpOutput varchar(max)
         DECLARE @SqlVersion VARCHAR(5);
         DECLARE @last VARCHAR(155), @current VARCHAR(255), @typ VARCHAR(255), @description VARCHAR(4000), @used_page_count INT, @reserved_page_count INT, @row_count INT;
         CREATE TABLE #Tables(
             id                  INT IDENTITY(1, 1)
           , Object_id           INT
           , Name                VARCHAR(155)
           , Type                VARCHAR(20)
           , [description]       VARCHAR(4000)
           , used_page_count     INT
           , reserved_page_count INT
           , row_count           INT);
         CREATE TABLE #Columns(
             id            INT IDENTITY(1, 1)
           , Name          VARCHAR(155)
           , Type          VARCHAR(155)
           , Nullable      VARCHAR(2)
           , [description] VARCHAR(4000));
         CREATE TABLE #Fk(
             id     INT IDENTITY(1, 1)
           , Name   VARCHAR(155)
           , col    VARCHAR(155)
           , refObj VARCHAR(155)
           , refCol VARCHAR(155));
         CREATE TABLE #Constraint(
             id         INT IDENTITY(1, 1)
           , Name       VARCHAR(155)
           , col        VARCHAR(155)
           , definition VARCHAR(1000));
         CREATE TABLE #Indexes(
             id   INT IDENTITY(1, 1)
           , Name VARCHAR(155)
           , Type VARCHAR(25)
           , cols VARCHAR(1000));
         IF(SUBSTRING(@@VERSION, 1, 25) = 'Microsoft SQL Server 2005')
         BEGIN
             SET @SqlVersion = '2005';
         END;
             ELSE
         BEGIN
             IF(SUBSTRING(@@VERSION, 1, 26) = 'Microsoft SQL Server  2000')
             BEGIN
                 SET @SqlVersion = '2000';
             END;
                 ELSE
             BEGIN
                 SET @SqlVersion = '2005';
             END;
         END;
         PRINT '<head>';
         PRINT '<title>::'+DB_NAME()+'::</title>';
         PRINT '<style>';
         PRINT '        body {';
         PRINT '        font-family:verdana;';
         PRINT '        font-size:9pt;';
         PRINT '        }';
         PRINT '        td {';
         PRINT '        font-family:verdana;';
         PRINT '        font-size:9pt;';
         PRINT '        }';
         PRINT '        th {';
         PRINT '        font-family:verdana;';
         PRINT '        font-size:9pt;';
         PRINT '        background:#d3d3d3;';
         PRINT '        }';
         PRINT '        table';
         PRINT '        {';
         PRINT '        background:#d3d3d3;';
         PRINT '        }';
         PRINT '        tr';
         PRINT '        {';
         PRINT '        background:#ffffff;';
         PRINT '        }';
         PRINT '    </style>';
         PRINT '</head>';
         PRINT '<body>';

--FOR 2000
         IF @SqlVersion = '2000'
         BEGIN
             INSERT INTO         #Tables (
                    Object_id
                  , Name
                  , Type
                  , [description]
                  , used_page_count
                  , reserved_page_count
                  , row_count )
             SELECT
                    OBJECT_ID(table_name)
                  , '['+table_schema+'].['+table_name+']'
                  , CASE WHEN table_type = 'BASE TABLE'
                        THEN 'Table'
                        ELSE 'View'
                                                      END
                  , CAST(p.value AS VARCHAR(4000))
                  , 0
                  , 0
                  , 0
             FROM   information_schema.tables t
             LEFT OUTER JOIN sysproperties p ON p.id = OBJECT_ID(t.table_name)
                                                AND smallid = 0
                                                AND p.name = 'MS_Description'
             ORDER BY
                      table_type
                    , table_schema
                    , table_name;
         END;
--FOR 2005
             ELSE
         BEGIN
             IF @SqlVersion = '2005'
             BEGIN
                 INSERT INTO         #Tables (
                        Object_id
                      , Name
                      , Type
                      , [description]
                      , used_page_count
                      , reserved_page_count
                      , row_count )
                 SELECT
                        o.object_id
                      , '['+s.name+'].['+o.name+']'
                      , CASE WHEN type = 'V'
                            THEN 'View' WHEN type = 'U'
                            THEN 'Table'
                                                END
                      , CAST(p.value AS VARCHAR(4000))
                      , dm.used_page_count
                      , dm.reserved_page_count
                      , dm.row_count
                 FROM   sys.objects o
                 LEFT OUTER JOIN sys.schemas s ON s.schema_id = o.schema_id
                 LEFT OUTER JOIN sys.extended_properties p ON p.major_id = o.object_id
                                                              AND minor_id = 0
                                                              AND p.name = 'MS_Description'
                 LEFT OUTER JOIN (
                                  SELECT
                                         object_id
                                       , SUM(used_page_count)     used_page_count
                                       , SUM(reserved_page_count) reserved_page_count
                                       , SUM(row_count)           row_count
                                  FROM   sys.dm_db_partition_stats
                                  GROUP BY
                                           object_id
                      ) dm ON dm.object_id = o.object_id
                 WHERE  type IN('U', 'V')
                 ORDER BY
                          type
                        , s.name
                        , o.name;
             END;
         END;
         SET @maxi = @@rowcount;
         SET @i = 1;
         PRINT '<table border="0" cellspacing="0" cellpadding="0" width="550px" align="center"><tr><td colspan="3" style="height:50;font-size:14pt;text-align:center;"><a name="index"></a><b>Index</b></td></tr></table>';
         PRINT '<table border="0" cellspacing="1" cellpadding="0" width="550px" align="center"><tr>'+'<th>Sr</th>'+'<th>Object</th>'
-- + '<th>Type</th>'
         +'<th>Description</th>'
-- + '<th>used_page_count</th>'
-- + '<th>reserved_page_count</th>'
         +'<th>row_count</th></tr>';
         WHILE(@i <= @maxi)
         BEGIN
             SELECT
                    @Output = '<tr>'+'<td align="right">'+CAST((@i) AS VARCHAR)+'</td>'+'<td><a href="#'+Type+':'+name+'">'+name+'</a></td>'
-- + '<td>' + Type + '</td>' 
                    +'<td>'+CAST(isnull(description, '') AS VARCHAR)+'</td>'
-- + '<td>' + cast(isnull(used_page_count,'') as varchar) + '</td>'
-- + '<td>' + cast(isnull(reserved_page_count,'') as varchar) + '</td>'
                    +'<td align="right">'+CAST(isnull(row_count, '') AS VARCHAR)+'</td>'+'</tr>'
             FROM   #Tables
             WHERE  id = @i;
             PRINT @Output;
             SET @i = @i + 1;
         END;
         PRINT '</table><br />';
         SET @i = 1;
         WHILE(@i <= @maxi)
         BEGIN
--table header
             SELECT
                    @Output = '<tr><th align="left"><a name="'+Type+':'+name+'"></a><b>'+Type+':'+name+'</b></th></tr>'
                  , @description = [description]
             FROM   #Tables
             WHERE  id = @i;
             PRINT '<br /><br /><br /><table border="0" cellspacing="0" cellpadding="0" width="750px"><tr><td align="right"><a href="#index">Index</a></td></tr>';
             PRINT @Output;
             PRINT '</table><br />';
             PRINT '<table border="0" cellspacing="0" cellpadding="0" width="750px">';
             PRINT '<tr><td><b>Description</b></td></tr>'; -- '<td><b>used_page_count</b></td><td><b>reserved_page_count</b></td><td><b>row_count int</b></td></tr>'
             PRINT '<tr><td>'+isnull(@description, '')+'</td></tr>'; -- '<td>' + cast(isnull(@used_page_count, '') as varchar) + '</td><td>' + cast(isnull(@reserved_page_count, '') as varchar) + '</td><td>' + cast(isnull(@row_count, '') as varchar) + '</td></tr>'
             PRINT '</table><br />';
-- @used_page_count int, @reserved_page_count int, @row_count int
--table columns
             TRUNCATE TABLE #Columns;
             IF @SqlVersion = '2000'
             BEGIN
                 INSERT INTO          #Columns (
                        Name
                      , Type
                      , Nullable
                      , [description] )
--FOR 2000  
                 SELECT
                        c.name
                      , TYPE_NAME(xtype)+(CASE WHEN(TYPE_NAME(xtype) = 'varchar'
                                                    OR TYPE_NAME(xtype) = 'nvarchar'
                                                    OR TYPE_NAME(xtype) = 'char'
                                                    OR TYPE_NAME(xtype) = 'nchar')
                                              THEN '('+CAST(length AS VARCHAR)+')' WHEN TYPE_NAME(xtype) = 'decimal'
                                              THEN '('+CAST(prec AS VARCHAR)+','+CAST(scale AS VARCHAR)+')'
                                              ELSE ''
                                          END)
                      , CASE WHEN isnullable = 1
                            THEN 'Y'
                            ELSE 'N'
                                             END
                      , CAST(p.value AS VARCHAR(8000))
                 FROM   syscolumns c
                 INNER JOIN #Tables t ON t.object_id = c.id
                 LEFT OUTER JOIN sysproperties p ON p.id = c.id
                                                    AND p.smallid = c.colid
                                                    AND p.name = 'MS_Description'
                 WHERE  t.id = @i
                 ORDER BY
                          c.colorder;
             END;
                 ELSE
             BEGIN
                 IF @SqlVersion = '2005'
                 BEGIN
                     INSERT INTO          #Columns (
                            Name
                          , Type
                          , Nullable
                          , [description] )
--FOR 2005      
                     SELECT
                            c.name
                          , TYPE_NAME(user_type_id)+(CASE WHEN(TYPE_NAME(user_type_id) = 'varchar'
                                                               OR TYPE_NAME(user_type_id) = 'nvarchar'
                                                               OR TYPE_NAME(user_type_id) = 'char'
                                                               OR TYPE_NAME(user_type_id) = 'nchar')
                                                         THEN '('+CAST(max_length AS VARCHAR)+')' WHEN TYPE_NAME(user_type_id) = 'decimal'
                                                         THEN '('+CAST([precision] AS VARCHAR)+','+CAST(scale AS VARCHAR)+')'
                                                         ELSE ''
                                                     END)
                          , CASE WHEN is_nullable = 1
                                THEN 'Y'
                                ELSE 'N'
                                                        END
                          , CAST(p.value AS VARCHAR(4000))
                     FROM   sys.columns c
                     INNER JOIN #Tables t ON t.object_id = c.object_id
                     LEFT OUTER JOIN sys.extended_properties p ON p.major_id = c.object_id
                                                                  AND p.minor_id = c.column_id
                                                                  AND p.name = 'MS_Description'
                     WHERE  t.id = @i
                     ORDER BY
                              c.column_id;
                 END;
             END;
             SET @maxj = @@rowcount;
             SET @j = 1;
             PRINT '<table border="0" cellspacing="0" cellpadding="0" width="750px"><tr><td><b>Table Columns</b></td></tr></table>';
             PRINT '<table border="0" cellspacing="1" cellpadding="0" width="750px"><tr><th>Sr.</th><th>Name</th><th>Datatype</th><th>Nullable</th><th>Description</th></tr>';
             WHILE(@j <= @maxj)
             BEGIN
                 SELECT
                        @Output = '<tr><td width="20px" align="center">'+CAST((@j) AS VARCHAR)+'</td><td width="150px">'+isnull(name, '')+'</td><td width="150px">'+UPPER(isnull(Type, ''))+'</td><td width="50px" align="center">'+isnull(Nullable, 'N')+'</td><td>'+isnull([description], '')+'</td></tr>'
                 FROM   #Columns
                 WHERE  id = @j;
                 PRINT @Output;
                 SET @j = @j + 1;
             END;
             PRINT '</table><br />';

--reference key
             TRUNCATE TABLE #FK;
             IF @SqlVersion = '2000'
             BEGIN
                 INSERT INTO     #FK (
                        Name
                      , col
                      , refObj
                      , refCol )
--        FOR 2000  
                 SELECT
                        OBJECT_NAME(constid)
                      , s.name
                      , OBJECT_NAME(rkeyid)
                      , s1.name
                 FROM   sysforeignkeys f
                 INNER JOIN sysobjects o ON o.id = f.constid
                 INNER JOIN syscolumns s ON s.id = f.fkeyid
                                            AND s.colorder = f.fkey
                 INNER JOIN syscolumns s1 ON s1.id = f.rkeyid
                                             AND s1.colorder = f.rkey
                 INNER JOIN #Tables t ON t.object_id = f.fkeyid
                 WHERE  t.id = @i
                 ORDER BY
                          1;
             END;
                 ELSE
             BEGIN
                 IF @SqlVersion = '2005'
                 BEGIN
                     INSERT INTO     #FK (
                            Name
                          , col
                          , refObj
                          , refCol )
--        FOR 2005  
                     SELECT
                            f.name
                          , COL_NAME(fc.parent_object_id, fc.parent_column_id)
                          , OBJECT_NAME(fc.referenced_object_id)
                          , COL_NAME(fc.referenced_object_id, fc.referenced_column_id)
                     FROM   sys.foreign_keys f
                     INNER JOIN sys.foreign_key_columns fc ON f.object_id = fc.constraint_object_id
                     INNER JOIN #Tables t ON t.object_id = f.parent_object_id
                     WHERE  t.id = @i
                     ORDER BY
                              f.name;
                 END;
             END;
             SET @maxj = @@rowcount;
             SET @j = 1;
             IF(@maxj > 0)
             BEGIN
                 PRINT '<table border="0" cellspacing="0" cellpadding="0" width="750px"><tr><td><b>Refrence Keys</b></td></tr></table>';
                 PRINT '<table border="0" cellspacing="1" cellpadding="0" width="750px"><tr><th>Sr.</th><th>Name</th><th>Column</th><th>Reference To</th></tr>';
                 WHILE(@j <= @maxj)
                 BEGIN
                     SELECT
                            @Output = '<tr><td width="20px" align="center">'+CAST((@j) AS VARCHAR)+'</td><td width="150px">'+isnull(name, '')+'</td><td width="150px">'+isnull(col, '')+'</td><td>['+isnull(refObj, 'N')+'].['+isnull(refCol, 'N')+']</td></tr>'
                     FROM   #FK
                     WHERE  id = @j;
                     PRINT @Output;
                     SET @j = @j + 1;
                 END;
                 PRINT '</table><br />';
             END;

--Default Constraints 
             TRUNCATE TABLE #Constraint;
             IF @SqlVersion = '2000'
             BEGIN
                 INSERT INTO             #Constraint (
                        Name
                      , col
                      , definition )
                 SELECT
                        OBJECT_NAME(c.constid)
                      , COL_NAME(c.id, c.colid)
                      , s.text
                 FROM   sysconstraints c
                 INNER JOIN #Tables t ON t.object_id = c.id
                 LEFT OUTER JOIN syscomments s ON s.id = c.constid
                 WHERE  t.id = @i
                        AND CONVERT(VARCHAR, +(c.status&1) / 1) + CONVERT(VARCHAR, (c.status&2) / 2) + CONVERT(VARCHAR, (c.status&4) / 4) + CONVERT(VARCHAR, (c.status&8) / 8) + CONVERT(VARCHAR, (c.status&16) / 16) + CONVERT(VARCHAR, (c.status&32) / 32) + CONVERT(VARCHAR, (c.status&64) / 64) + CONVERT(VARCHAR, (c.status&128) / 128) = '10101000';
             END;
                 ELSE
             BEGIN
                 IF @SqlVersion = '2005'
                 BEGIN
                     INSERT INTO             #Constraint (
                            Name
                          , col
                          , definition )
                     SELECT
                            c.name
                          , COL_NAME(parent_object_id, parent_column_id)
                          , c.definition
                     FROM   sys.default_constraints c
                     INNER JOIN #Tables t ON t.object_id = c.parent_object_id
                     WHERE  t.id = @i
                     ORDER BY
                              c.name;
                 END;
             END;
             SET @maxj = @@rowcount;
             SET @j = 1;
             IF(@maxj > 0)
             BEGIN
                 PRINT '<table border="0" cellspacing="0" cellpadding="0" width="750px"><tr><td><b>Default Constraints</b></td></tr></table>';
                 PRINT '<table border="0" cellspacing="1" cellpadding="0" width="750px"><tr><th>Sr.</th><th>Name</th><th>Column</th><th>Value</th></tr>';
                 WHILE(@j <= @maxj)
                 BEGIN
                     SELECT
                            @Output = '<tr><td width="20px" align="center">'+CAST((@j) AS VARCHAR)+'</td><td width="250px">'+isnull(name, '')+'</td><td width="150px">'+isnull(col, '')+'</td><td>'+isnull(definition, '')+'</td></tr>'
                     FROM   #Constraint
                     WHERE  id = @j;
                     PRINT @Output;
                     SET @j = @j + 1;
                 END;
                 PRINT '</table><br />';
             END;

--Check  Constraints
             TRUNCATE TABLE #Constraint;
             IF @SqlVersion = '2000'
             BEGIN
                 INSERT INTO             #Constraint (
                        Name
                      , col
                      , definition )
                 SELECT
                        OBJECT_NAME(c.constid)
                      , COL_NAME(c.id, c.colid)
                      , s.text
                 FROM   sysconstraints c
                 INNER JOIN #Tables t ON t.object_id = c.id
                 LEFT OUTER JOIN syscomments s ON s.id = c.constid
                 WHERE  t.id = @i
                        AND (CONVERT(VARCHAR, +(c.status&1) / 1) + CONVERT(VARCHAR, (c.status&2) / 2) + CONVERT(VARCHAR, (c.status&4) / 4) + CONVERT(VARCHAR, (c.status&8) / 8) + CONVERT(VARCHAR, (c.status&16) / 16) + CONVERT(VARCHAR, (c.status&32) / 32) + CONVERT(VARCHAR, (c.status&64) / 64) + CONVERT(VARCHAR, (c.status&128) / 128) = '00101000'
                             OR CONVERT(VARCHAR, +(c.status&1) / 1) + CONVERT(VARCHAR, (c.status&2) / 2) + CONVERT(VARCHAR, (c.status&4) / 4) + CONVERT(VARCHAR, (c.status&8) / 8) + CONVERT(VARCHAR, (c.status&16) / 16) + CONVERT(VARCHAR, (c.status&32) / 32) + CONVERT(VARCHAR, (c.status&64) / 64) + CONVERT(VARCHAR, (c.status&128) / 128) = '00100100');
             END;
                 ELSE
             BEGIN
                 IF @SqlVersion = '2005'
                 BEGIN
                     INSERT INTO             #Constraint (
                            Name
                          , col
                          , definition )
                     SELECT
                            c.name
                          , COL_NAME(parent_object_id, parent_column_id)
                          , definition
                     FROM   sys.check_constraints c
                     INNER JOIN #Tables t ON t.object_id = c.parent_object_id
                     WHERE  t.id = @i
                     ORDER BY
                              c.name;
                 END;
             END;
             SET @maxj = @@rowcount;
             SET @j = 1;
             IF(@maxj > 0)
             BEGIN
                 PRINT '<table border="0" cellspacing="0" cellpadding="0" width="750px"><tr><td><b>Check  Constraints</b></td></tr></table>';
                 PRINT '<table border="0" cellspacing="1" cellpadding="0" width="750px"><tr><th>Sr.</th><th>Name</th><th>Column</th><th>Definition</th></tr>';
                 WHILE(@j <= @maxj)
                 BEGIN
                     SELECT
                            @Output = '<tr><td width="20px" align="center">'+CAST((@j) AS VARCHAR)+'</td><td width="250px">'+isnull(name, '')+'</td><td width="150px">'+isnull(col, '')+'</td><td>'+isnull(definition, '')+'</td></tr>'
                     FROM   #Constraint
                     WHERE  id = @j;
                     PRINT @Output;
                     SET @j = @j + 1;
                 END;
                 PRINT '</table><br />';
             END;

--Triggers 
             TRUNCATE TABLE #Constraint;
             IF @SqlVersion = '2000'
             BEGIN
                 INSERT INTO             #Constraint (
                        Name )
                 SELECT
                        tr.name
                 FROM   sysobjects tr
                 INNER JOIN #Tables t ON t.object_id = tr.parent_obj
                 WHERE  t.id = @i
                        AND tr.type = 'TR'
                 ORDER BY
                          tr.name;
             END;
                 ELSE
             BEGIN
                 IF @SqlVersion = '2005'
                 BEGIN
                     INSERT INTO             #Constraint (
                            Name )
                     SELECT
                            tr.name
                     FROM   sys.triggers tr
                     INNER JOIN #Tables t ON t.object_id = tr.parent_id
                     WHERE  t.id = @i
                     ORDER BY
                              tr.name;
                 END;
             END;
             SET @maxj = @@rowcount;
             SET @j = 1;
             IF(@maxj > 0)
             BEGIN
                 PRINT '<table border="0" cellspacing="0" cellpadding="0" width="750px"><tr><td><b>Triggers</b></td></tr></table>';
                 PRINT '<table border="0" cellspacing="1" cellpadding="0" width="750px"><tr><th>Sr.</th><th>Name</th><th>Description</th></tr>';
                 WHILE(@j <= @maxj)
                 BEGIN
                     SELECT
                            @Output = '<tr><td width="20px" align="center">'+CAST((@j) AS VARCHAR)+'</td><td width="150px">'+isnull(name, '')+'</td><td></td></tr>'
                     FROM   #Constraint
                     WHERE  id = @j;
                     PRINT @Output;
                     SET @j = @j + 1;
                 END;
                 PRINT '</table><br />';
             END;

--Indexes 
             TRUNCATE TABLE #Indexes;
             IF @SqlVersion = '2000'
             BEGIN
                 INSERT INTO          #Indexes (
                        Name
                      , type
                      , cols )
                 SELECT
                        i.name
                      , CASE WHEN i.indid = 0
                            THEN 'Heap' WHEN i.indid = 1
                            THEN 'Clustered'
                            ELSE 'Nonclustered'
                          END
                      , c.name
                 FROM   sysindexes i
                 INNER JOIN sysindexkeys k ON k.indid = i.indid
                                              AND k.id = i.id
                 INNER JOIN syscolumns c ON c.id = k.id
                                            AND c.colorder = k.colid
                 INNER JOIN #Tables t ON t.object_id = i.id
                 WHERE  t.id = @i
                        AND i.name NOT LIKE '_WA%'
                 ORDER BY
                          i.name
                        , i.keycnt;
             END;
                 ELSE
             BEGIN
                 IF @SqlVersion = '2005'
                 BEGIN
                     INSERT INTO          #Indexes (
                            Name
                          , type
                          , cols )
                     SELECT
                            i.name
                          , CASE WHEN i.type = 0
                                THEN 'Heap' WHEN i.type = 1
                                THEN 'Clustered'
                                ELSE 'Nonclustered'
                              END
                          , COL_NAME(i.object_id, c.column_id)
                     FROM   sys.indexes i
                     INNER JOIN sys.index_columns c ON i.index_id = c.index_id
                                                       AND c.object_id = i.object_id
                     INNER JOIN #Tables t ON t.object_id = i.object_id
                     WHERE  t.id = @i
                     ORDER BY
                              i.name
                            , c.column_id;
                 END;
             END;
             SET @maxj = @@rowcount;
             SET @j = 1;
             SET @sr = 1;
             IF(@maxj > 0)
             BEGIN
                 PRINT '<table border="0" cellspacing="0" cellpadding="0" width="750px"><tr><td><b>Indexes</b></td></tr></table>';
                 PRINT '<table border="0" cellspacing="1" cellpadding="0" width="750px"><tr><th>Sr.</th><th>Name</th><th>Type</th><th>Columns</th></tr>';
                 SET @Output = '';
                 SET @last = '';
                 SET @current = '';
                 WHILE(@j <= @maxj)
                 BEGIN
                     SELECT
                            @current = isnull(name, '')
                     FROM   #Indexes
                     WHERE  id = @j;
                     IF @last <> @current
                        AND @last <> ''
                     BEGIN
                         PRINT '<tr><td width="20px" align="center">'+CAST((@sr) AS VARCHAR)+'</td><td width="150px">'+@last+'</td><td width="150px">'+@typ+'</td><td>'+@Output+'</td></tr>';
                         SET @Output = '';
                         SET @sr = @sr + 1;
                     END;
                     SELECT
                            @Output = @Output+cols+'<br />'
                          , @typ = type
                     FROM   #Indexes
                     WHERE  id = @j;
                     SET @last = @current;
                     SET @j = @j + 1;
                 END;
                 IF @Output <> ''
                 BEGIN
                     PRINT '<tr><td width="20px" align="center">'+CAST((@sr) AS VARCHAR)+'</td><td width="150px">'+@last+'</td><td width="150px">'+@typ+'</td><td>'+@Output+'</td></tr>';
                 END;
                 PRINT '</table><br />';
             END;
             SET @i = @i + 1;
--Print @Output 
         END;
         PRINT '</body>';
         PRINT '</html>';
         DROP TABLE #Tables;
         DROP TABLE #Columns;
         DROP TABLE #FK;
         DROP TABLE #Constraint;
         DROP TABLE #Indexes;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[SYS_TRACE_LOG]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : sp를이용한 trace 파일관리
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/27  이성근           fixed

사용예: 

-- 01. sp수행(return value 가 1이면 정상적으로 시작됨.)
exec SYS_TRACE_LOG  @p_maxfilesize  = 100
                  , @p_Options      = 2                  
                  , @p_stopTime     = null          
                  , @p_OutputFolder = 'C:\temp\'

-- 02. 현재 수행 중인 모든 trace 확인
SELECT * FROM :: fn_trace_getinfo(default) 

-- 03. 특정 trace id 중지
exec sp_trace_setstatus @traceid = 2, @status = 0

-- 04. 특정 trace id 삭제
exec sp_trace_setstatus @traceid = 2, @status = 2

-- 05. 프로파일 열어보기
-- SELECT IDENTITY(int, 1, 1) AS SeqNo, * 
-- INTO TRACE_PROFILE_LOG
-- FROM fn_trace_gettable('c:\temp\Trace_201711271936.trc', default);
SELECT * FROM fn_trace_gettable('C:\temp\Trace_201711291435.trc', default);

******************************************************************/
CREATE PROCEDURE [dbo].[SYS_TRACE_LOG] (
      @p_maxfilesize  bigint = 100              -- 한개의 추적 파일에 대한 최대 크기 지정. MB 단위.
    , @p_Options      int = 2                   -- Roll over. MaxFileSize에 도달하면 새파일 생성후 계속해서 자료수집. 
    , @p_stopTime     datetime = null           -- 추적 파일 수집을 자동으로 중지하려는 시각 설정(NULL:수동으로중지)
    , @p_OutputFolder varchar(100) = 'C:\temp\' -- .trc 파일이 생성될 폴더. 해당 폴더는 수동으로 생성해야 함.
)
as
BEGIN

    -- 0. Create a Queue
    declare @rc int
    declare @TraceID int
    declare @FileName sysname
    declare @error varchar(200)

    -- Filename은 Trace_수집시작시각.trc 형태로 수집됨. (예: Trace_200911101545.trc)
    set @FileName = @p_OutputFolder+'Trace_'+ REPLACE(REPLACE(REPLACE(CONVERT(varchar(16),getdate(),120),':',''),'-',''),' ','')

    -- 1.sp_trace_create를 사용하여 추적을 만듭니다. 
    /* 
       sp_trace_create [ @traceid = ] trace_id OUTPUT   
                     , [ @options = ] option_value   
                     , [ @tracefile = ] 'trace_file'   
                   [ , [ @maxfilesize = ] max_file_size ]  
                   [ , [ @stoptime = ] 'stop_time' ]  
                   [ , [ @filecount = ] 'max_rollover_files' ]  

    [ @options = ] option_value   
    Option name             Option value  Description
    TRACE_FILE_ROLLOVER     2             Specifies that when the max_file_size is reached, the current trace file is closed and a new file is created. All new records will be written to the new file. The new file will have the same name as the previous file, but an integer will be appended to indicate its sequence. For example, if the original trace file is named filename.trc, the next trace file is named filename_1.trc, the following trace file is filename_2.trc, and so on.
                                          As more rollover trace files are created, the integer value appended to the file name increases sequentially.
                                          SQL Server uses the default value of max_file_size (5 MB) if this option is specified without specifying a value for max_file_size. 
    SHUTDOWN_ON_ERROR       4             Specifies that if the trace cannot be written to the file for whatever reason, SQL Server shuts down. This option is useful when performing security audit traces. 
    TRACE_PRODUCE_BLACKBOX  8             Specifies that a record of the last 5 MB of trace information produced by the server will be saved by the server. TRACE_PRODUCE_BLACKBOX is incompatible with all other options. 

    */
    exec @rc = sp_trace_create @TraceID output, @options=@p_Options, @tracefile=@FileName, @maxfilesize=@p_maxfilesize, @stoptime=@p_stopTime

    print @TraceID

    /*
    [Return code]
    Return code Description
    0           No error. 
    1           Unknown error. 
    10          Invalid options. Returned when options specified are incompatible. 
    12          File not created. 
    13          Out of memory. Returned when there is not enough memory to perform the specified action. 
    14          Invalid stop time. Returned when the stop time specified has already happened. 
    15          Invalid parameters. Returned when the user supplied incompatible parameters. 
    */
    if (@rc != 0) 
    BEGIN
        set @error = CASE WHEN @rc = '0'  THEN 'No error. '
                          WHEN @rc = '1'  THEN 'Unknown error. '
                          WHEN @rc = '10' THEN 'Invalid options. Returned when options specified are incompatible. '
                          WHEN @rc = '12' THEN 'File not created. '
                          WHEN @rc = '13' THEN 'Out of memory. Returned when there is not enough memory to perform the specified action. '
                          WHEN @rc = '14' THEN 'Invalid stop time. Returned when the stop time specified has already happened. '
                          WHEN @rc = '15' THEN 'Invalid parameters. Returned when the user supplied incompatible parameters. '
                                          ELSE 'Unknown error. ' END

        raiserror(@error,16,1);

        RETURN;
    END

    -- 2.sp_trace_setevent를 사용하여 이벤트를 추가합니다. 
    /*
    sp_trace_setevent [ @traceid = ] trace_id, [ @eventid = ] event_id, [ @columnid = ] column_id, [ @on = ] on  

    [ @eventid= ] event_id
    No      Event name         Description
    10      RPC:Completed      Occurs when a remote procedure call (RPC) has completed. 
    12      SQL:BatchCompleted Occurs when a Transact-SQL batch has completed. 
    13      SQL:BatchStarting  Occurs when a Transact-SQL batch has started. 
    41	    SQL:StmtCompleted  Occurs when the Transact-SQL statement has completed.
    45	    SP:StmtCompleted   Indicates that a Transact-SQL statement within a stored procedure has finished executing.

    [ @columnid= ] column_id
    No	Column name	       Description
    1	TextData	       Text value dependent on the event class that is captured in the trace.
    2	BinaryData	       Binary value dependent on the event class captured in the trace.
    3	DatabaseID	       ID of the database specified by the USE database statement, or the default database if no USE database statement is issued for a given connection. The value for a database can be determined by using the DB_ID function.
    4	TransactionID	   System-assigned ID of the transaction.
    5	LineNumber	       Contains the number of the line that contains the error. For events that involve Transact-SQL statements, like SP:StmtStarting, the LineNumber contains the line number of the statement in the stored procedure or batch.
    6	NTUserName	       Microsoft Windows user name.
    7	NTDomainName	   Windows domain to which the user belongs.
    8	HostName	       Name of the client computer that originated the request.
    9	ClientProcessID	   ID assigned by the client computer to the process in which the client application is running.
    10	ApplicationName	   Name of the client application that created the connection to an instance of SQL Server. This column is populated with the values passed by the application rather than the displayed name of the program.
    11	LoginName	       SQL Server login name of the client.
    12	SPID	           Server Process ID assigned by SQL Server to the process associated with the client.
    13	Duration	       Amount of elapsed time (in microseconds) taken by the event. This data column is not populated by the Hash Warning event.
    14	StartTime	       Time at which the event started, when available.
    15	EndTime	           Time at which the event ended. This column is not populated for starting event classes, such as SQL:BatchStarting or SP:Starting. It is also not populated by the Hash Warning event.
    16	Reads	           Number of logical disk reads performed by the server on behalf of the event. This column is not populated by the Lock:Released event.
    17	Writes	           Number of physical disk writes performed by the server on behalf of the event.
    18	CPU	               Amount of CPU time (in milliseconds) used by the event.
    19	Permissions	       Represents the bitmap of permissions; used by Security Auditing.
    20	Severity	       Severity level of an exception.
    21	EventSubClass	   Type of event subclass. This data column is not populated for all event classes.
    22	ObjectID	       System-assigned ID of the object.
    23	Success	           Success of the permissions usage attempt; used for auditing. 1 = success0 = failure
    24	IndexID	           ID for the index on the object affected by the event. To determine the index ID for an object, use the indid column of the sysindexes system table.
    25	IntegerData	       Integer value dependent on the event class captured in the trace.
    26	ServerName	       Name of the instance of SQL Server, either servername or servername\instancename, being traced.
    27	EventClass	       Type of event class being recorded.
    28	ObjectType	       Type of object, such as: table, function, or stored procedure.
    29	NestLevel	       The nesting level at which this stored procedure is executing. See @@NESTLEVEL (Transact-SQL).
    30	State	           Server state, in case of an error.
    31	Error	           Error number.
    32	Mode Lock          mode of the lock acquired. This column is not populated by the Lock:Released event.
    33	Handle	           Handle of the object referenced in the event.
    34	ObjectName	       Name of object accessed.
    35	DatabaseName	   Name of the database specified in the USE database statement.
    36	FileName	       Logical name of the file name modified.
    37	OwnerName	       Owner name of the referenced object.
    38	RoleName	       Name of the database or server-wide role targeted by a statement.
    39	TargetUserName	   User name of the target of some action.
    40	DBUserName	       SQL Server database user name of the client.
    41	LoginSid	       Security identifier (SID) of the logged-in user.
    42	TargetLoginName	   Login name of the target of some action.
    43	TargetLoginSid	   SID of the login that is the target of some action.
    44	ColumnPermissions  Column-level permissions status; used by Security Auditing.
    45	LinkedServerName   Name of the linked server.
    46	ProviderName	   Name of the OLE DB provider.
    47	MethodName	       Name of the OLE DB method.
    48	RowCounts	       Number of rows in the batch.
    49	RequestID	       ID of the request containing the statement.
    50	XactSequence	   A token to describe the current transaction.
    51	EventSequence	   Sequence number for this event.
    52	BigintData1	     bigint value, which is dependent on the event class captured in the trace.
    53	BigintData2	     bigint value, which is dependent on the event class captured in the trace.
    54	GUID	               GUID value, which is dependent on the event class captured in the trace.
    55	IntegerData2	     Integer value, which is dependent on the event class captured in the trace.
    56	ObjectID2	          ID of the related object or entity, if available.
    57	Type	               Integer value, which is dependent on the event class captured in the trace.
    58	OwnerID	          Type of the object that owns the lock. For lock events only.
    59	ParentName	     Name of the schema the object is within.
    60	IsSystem	          Indicates whether the event occurred on a system process or a user process. 1 = system 0 = user.
    61	Offset	          Starting offset of the statement within the stored procedure or batch.
    62	SourceDatabaseID	ID of the database in which the source of the object exists.
    63	SqlHandle	          64-bit hash based on the text of an ad hoc query or the database and object ID of an SQL object. This value can be passed to sys.dm_exec_sql_text() to retrieve the associated SQL text.
    64	SessionLoginName	The login name of the user who originated the session. For example, if you connect to SQL Server using Login1 and execute a statement as Login2, SessionLoginName displays Login1, while LoginName displays Login2. This data column displays both SQL Server and Windows logins.
    */
    -- RPC:Completed
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid =  1, @on = 1 -- 1	 TextData	          
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid =  2, @on = 1 -- 2	 BinaryData	    
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid =  6, @on = 1 -- 6	 NTUserName	     
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid =  8, @on = 1 -- 8	 HostName	          
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid =  9, @on = 1 -- 9	 ClientProcessID	
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid = 10, @on = 1 -- 10 ApplicationName	
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid = 11, @on = 1 -- 11 LoginName	          
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid = 12, @on = 1 -- 12 SPID	               
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid = 13, @on = 1 -- 13 Duration	          
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid = 14, @on = 1 -- 14 StartTime	          
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid = 15, @on = 1 -- 15 EndTime	          
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid = 16, @on = 1 -- 16 Reads	          
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid = 17, @on = 1 -- 17 Writes	          
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid = 18, @on = 1 -- 18 CPU	               
    exec sp_trace_setevent @TraceID, @eventid =10, @columnid = 25, @on = 1 -- 25 IntegerData	     
                                                   
    -- SQL:BatchCompleted                          
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid =  1, @on = 1 -- 1	 TextData	          
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid =  6, @on = 1 -- 6	 NTUserName	     
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid =  8, @on = 1 -- 8	 HostName	          
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid =  9, @on = 1 -- 9	 ClientProcessID	
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid = 11, @on = 1 -- 11 LoginName	     
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid = 10, @on = 1 -- 12 SPID	          
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid = 12, @on = 1 -- 13 Duration	          
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid = 13, @on = 1 -- 14 StartTime	     
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid = 14, @on = 1 -- 15 EndTime	          
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid = 15, @on = 1 -- 16 Reads	          
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid = 16, @on = 1 -- 17 Writes	          
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid = 17, @on = 1 -- 18 CPU	               
    exec sp_trace_setevent @TraceID, @eventid =12, @columnid = 18, @on = 1 -- 25 IntegerData	     
                                                                           
    -- SQL:BatchStarting                                                   
    -- exec sp_trace_setevent @TraceID, @eventid =13, @columnid =  1, @on = 1 -- 1	 TextData	          
    -- exec sp_trace_setevent @TraceID, @eventid =13, @columnid =  6, @on = 1 -- 6	 NTUserName	      
    -- exec sp_trace_setevent @TraceID, @eventid =13, @columnid =  8, @on = 1 -- 9	 ClientProcessID	
    -- exec sp_trace_setevent @TraceID, @eventid =13, @columnid =  9, @on = 1 -- 10 ApplicationName	
    -- exec sp_trace_setevent @TraceID, @eventid =13, @columnid = 11, @on = 1 -- 11 LoginName	     
    -- exec sp_trace_setevent @TraceID, @eventid =13, @columnid = 10, @on = 1 -- 12 SPID	          
    -- exec sp_trace_setevent @TraceID, @eventid =13, @columnid = 12, @on = 1 -- 12 SPID	           
    -- exec sp_trace_setevent @TraceID, @eventid =13, @columnid = 14, @on = 1 -- 14 StartTime	     

    -- 45
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid =  1, @on = 1 -- 1  TextData	          
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid =  6, @on = 1 -- 6  NTUserName	     
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid =  8, @on = 1 -- 8  HostName	          
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid =  9, @on = 1 -- 9  ClientProcessID	
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid = 10, @on = 1 -- 10 ApplicationName	
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid = 11, @on = 1 -- 11 LoginName	          
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid = 12, @on = 1 -- 12 SPID	               
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid = 13, @on = 1 -- 13 Duration	          
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid = 14, @on = 1 -- 14 StartTime	          
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid = 15, @on = 1 -- 15 EndTime	          
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid = 16, @on = 1 -- 16 Reads	          
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid = 17, @on = 1 -- 17 Writes	          
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid = 18, @on = 1 -- 18 CPU	               
    exec sp_trace_setevent @TraceID, @eventid = 45, @columnid = 25, @on = 1 -- 25 IntegerData	     
                      
    -- 3.(옵션) sp_trace_setfilter를 사용하여 필터를 설정합니다. 
    /*
    sp_trace_setfilter [ @traceid = ]             trace_id   
                     , [ @columnid = ]            column_id  
                     , [ @logical_operator = ]    logical_operator        -- AND (0) or OR (1) 
                     , [ @comparison_operator = ] comparison_operator  
                     , [ @value = ]               value  

    [ @logical_operator = ]    logical_operator            
    Value   Comparison operator
    0       = (Equal) 
    1       <> (Not Equal) 
    2       > (Greater Than) 
    3       < (Less Than) 
    4       >= (Greater Than Or Equal) 
    5       <= (Less Than Or Equal) 
    6       LIKE 
    7       NOT LIKE 
    */
    declare @bigintfilter bigint

    ---- 10	ApplicationName	Name of the client application that created the connection to an instance of SQL Server. This column is populated with the values passed by the application rather than the displayed name of the program.
    exec sp_trace_setfilter @TraceID, 10, 0, 7, N'SQL Server Profiler%'

    ---- 13	Duration	          Amount of elapsed time (in microseconds) taken by the event. This data column is not populated by the Hash Warning event.
    set @bigintfilter = 1000000 -- 1000000 1초
    exec sp_trace_setfilter @TraceID, 13, 0, 4, @bigintfilter
    set @bigintfilter = NULL
    exec sp_trace_setfilter @TraceID, 13, 0, 1, @bigintfilter

    ---- 35	DatabaseName	     Name of the database specified in the USE database statement.
    ;exec sp_trace_setfilter  @TraceID, 35,  0, 6, N'MES%'

    -- 4.sp_trace_setstatus를 사용하여 추적을 시작합니다. 
    ;exec sp_trace_setstatus  @traceid = @TraceID, @status = 1

    -- 5. 수행 중인 모든 추적 정보 확인
    -- SELECT * FROM :: fn_trace_getinfo(default)

    -- 6.sp_trace_setstatus를 사용하여 추적을 중지합니다. 
    -- exec sp_trace_setstatus @TraceID, @status = 0

    -- 7.sp_trace_setstatus를 사용하여 추적을 닫습니다. 
    -- exec sp_trace_setstatus @TraceID, @status = 2

END
GO
/****** Object:  StoredProcedure [dbo].[SYS_TRACE_LOG_ANALYZE]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : sp를이용한 trace 분석
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/27  이성근           fixed

사용예: 

CREATE TABLE [dbo].[TRACE_PROFILE_LOG_201711291556](
	[IDX] [int] IDENTITY(1,1) NOT NULL,
	[TextData] [nvarchar](max) NULL,
	[BinaryData] [image] NULL,
	[DatabaseID] [int] NULL,
	[TransactionID] [bigint] NULL,
	[LineNumber] [int] NULL,
	[NTUserName] [nvarchar](256) NULL,
	[NTDomainName] [nvarchar](256) NULL,
	[HostName] [nvarchar](256) NULL,
	[ClientProcessID] [int] NULL,
	[ApplicationName] [nvarchar](256) NULL,
	[LoginName] [nvarchar](256) NULL,
	[SPID] [int] NULL,
	[Duration] [bigint] NULL,
	[StartTime] [datetime] NULL,
	[EndTime] [datetime] NULL,
	[Reads] [bigint] NULL,
	[Writes] [bigint] NULL,
	[CPU] [int] NULL,
	[Permissions] [bigint] NULL,
	[Severity] [int] NULL,
	[EventSubClass] [int] NULL,
	[ObjectID] [int] NULL,
	[Success] [int] NULL,
	[IndexID] [int] NULL,
	[IntegerData] [int] NULL,
	[ServerName] [nvarchar](256) NULL,
	[EventClass] [int] NULL,
	[ObjectType] [int] NULL,
	[NestLevel] [int] NULL,
	[State] [int] NULL,
	[Error] [int] NULL,
	[Mode] [int] NULL,
	[Handle] [int] NULL,
	[ObjectName] [nvarchar](256) NULL,
	[DatabaseName] [nvarchar](256) NULL,
	[FileName] [nvarchar](256) NULL,
	[OwnerName] [nvarchar](256) NULL,
	[RoleName] [nvarchar](256) NULL,
	[TargetUserName] [nvarchar](256) NULL,
	[DBUserName] [nvarchar](256) NULL,
	[LoginSid] [image] NULL,
	[TargetLoginName] [nvarchar](256) NULL,
	[TargetLoginSid] [image] NULL,
	[ColumnPermissions] [int] NULL,
	[LinkedServerName] [nvarchar](256) NULL,
	[ProviderName] [nvarchar](256) NULL,
	[MethodName] [nvarchar](256) NULL,
	[RowCounts] [bigint] NULL,
	[RequestID] [int] NULL,
	[XactSequence] [bigint] NULL,
	[EventSequence] [bigint] NULL,
	[BigintData1] [bigint] NULL,
	[BigintData2] [bigint] NULL,
	[GUID] [uniqueidentifier] NULL,
	[IntegerData2] [int] NULL,
	[ObjectID2] [bigint] NULL,
	[Type] [int] NULL,
	[OwnerID] [int] NULL,
	[ParentName] [nvarchar](256) NULL,
	[IsSystem] [int] NULL,
	[Offset] [int] NULL,
	[SourceDatabaseID] [int] NULL,
	[SqlHandle] [image] NULL,
	[SessionLoginName] [nvarchar](256) NULL,
	[PlanHandle] [image] NULL,
	[GroupID] [int] NULL,
	[TextDataConv] [nvarchar](max) NULL,
	[ProcedureName] [nvarchar](255) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO



-- 01. 프로파일 테이블 저장
SELECT IDENTITY(int, 1, 1) AS IDX, * 
INTO TRACE_PROFILE_LOG_201711291556
FROM fn_trace_gettable('c:\temp\Trace_201711291556.trc', default);

-- 02. Column 수정
ALTER TABLE TRACE_PROFILE_LOG_201711291556 ADD TextDataConv  NVARCHAR(MAX)
ALTER TABLE TRACE_PROFILE_LOG_201711291556 ADD ProcedureName NVARCHAR(255)

-- 03. TextData Convert
UPDATE A SET A.TextDataConv = REPLACE(REPLACE(REPLACE(A.TEXTDATA,'[dbo].',''),'[',''),']','') FROM TRACE_PROFILE_LOG_201711291556 A 

-- 04. Procedure Name Update
UPDATE A SET A.PROCEDURENAME = CASE WHEN CHARINDEX('EXEC ', A.TEXTDATACONV) > 0 AND CHARINDEX(' ', A.TEXTDATACONV, (CHARINDEX('EXEC ', A.TEXTDATACONV) + 5)) - (CHARINDEX('EXEC ', A.TEXTDATACONV) + 5) > 0 
                                    THEN SUBSTRING(A.TEXTDATACONV
                                                    , CHARINDEX('EXEC ', A.TEXTDATACONV) + 5
                                                    , CHARINDEX(' ', A.TEXTDATACONV, (CHARINDEX('EXEC ', A.TEXTDATACONV) + 5)) - (CHARINDEX('EXEC ', A.TEXTDATACONV) + 5) )
                                    WHEN CHARINDEX('EXEC ', A.TEXTDATACONV) > 0 
                                    THEN REPLACE(A.TEXTDATACONV, 'EXEC ', '')
                                    WHEN CHARINDEX('FROM ', A.TEXTDATACONV) > 0 AND CHARINDEX('WHERE ', A.TEXTDATACONV, (CHARINDEX('FROM ', A.TEXTDATACONV)+5 )) - (CHARINDEX('FROM ', A.TEXTDATACONV) + 5) > 0 
                                    THEN SUBSTRING(A.TEXTDATACONV
                                                    , CHARINDEX('FROM ', A.TEXTDATACONV) + 5
                                                    , CHARINDEX('WHERE ', A.TEXTDATACONV, (CHARINDEX('FROM ', A.TEXTDATACONV)+5 )) - (CHARINDEX('FROM ', A.TEXTDATACONV) + 5))
                                    WHEN LEFT(A.TEXTDATACONV, 4) = 'USP_' AND CHARINDEX(' ', A.TEXTDATACONV) > 0 
                                    THEN SUBSTRING(A.TEXTDATACONV
                                                    , 1
                                                    , CHARINDEX(' ', A.TEXTDATACONV))
                                    WHEN LEFT(A.TEXTDATACONV, 3) = 'PK_' AND CHARINDEX(' ', A.TEXTDATACONV) > 0 
                                    THEN SUBSTRING(A.TEXTDATACONV
                                                    , 1
                                                    , CHARINDEX(' ', A.TEXTDATACONV))
                                    ELSE A.TEXTDATACONV 
                                    END
FROM TRACE_PROFILE_LOG_201711291556 A 
WHERE A.EVENTCLASS IN ('10','12')


UPDATE A SET A.DURATION = A.DURATION / 1000000
FROM TRACE_PROFILE_LOG_201711291556 A 
WHERE A.EVENTCLASS IN ('10','12')

******************************************************************/
CREATE PROCEDURE [dbo].[SYS_TRACE_LOG_ANALYZE] (
      @p_maxfilesize  bigint = 100              -- 한개의 추적 파일에 대한 최대 크기 지정. MB 단위.
    , @p_Options      int = 2                   -- Roll over. MaxFileSize에 도달하면 새파일 생성후 계속해서 자료수집. 
    , @p_stopTime     datetime = null           -- 추적 파일 수집을 자동으로 중지하려는 시각 설정(NULL:수동으로중지)
    , @p_OutputFolder varchar(100) = 'C:\temp\' -- .trc 파일이 생성될 폴더. 해당 폴더는 수동으로 생성해야 함.
)
as
BEGIN

    /*
    [ @eventid= ] event_id
        No      Event name         Description
        10      RPC:Completed      Occurs when a remote procedure call (RPC) has completed. 
        12      SQL:BatchCompleted Occurs when a Transact-SQL batch has completed. 
        45	    SP:StmtCompleted   Indicates that a Transact-SQL statement within a stored procedure has finished executing.
    */

    DECLARE @TOTAL_COUNT FLOAT
    
    SELECT @TOTAL_COUNT = COUNT(DISTINCT A.PROCEDURENAME) 
    FROM TRACE_PROFILE_LOG_201711291556 A WITH (NOLOCK)
    WHERE A.EVENTCLASS IN ('10','12')

    DECLARE @DURATION_MIN FLOAT
    DECLARE @DURATION_MAX FLOAT
    SET @DURATION_MIN = 1
    DECLARE @DURATION_UNIT FLOAT 
    SET @DURATION_UNIT = 1 -- (@DURATION_MAX - @DURATION_MIN) / 10

    -- TOTAL -- DURATION 점수 
    SELECT A.PROCEDURENAME                                                                                                PROCEDURENAME
         , ((ROW_NUMBER() OVER(ORDER BY SUM(A.DURATION) ASC ) 
             + ROW_NUMBER() OVER(ORDER BY AVG(A.DURATION) ASC ) 
             + ROW_NUMBER() OVER(ORDER BY SUM(A.CPU) ASC ) 
             + ROW_NUMBER() OVER(ORDER BY SUM(A.READS) + SUM(A.WRITES) ASC ) )/(@TOTAL_COUNT*4.0))*100                    RELATIVE_TOTAL_SCORE
         , COUNT(A.IDX)                                                                                                   NUMBER_OF_TIMES
         , SUM(A.DURATION)                                                                                                DURATION_SUM
         , MIN(A.DURATION)                                                                                                DURATION_MIN
         , MAX(A.DURATION)                                                                                                DURATION_MAX
         , AVG(A.DURATION)                                                                                                DURATION_AVG
         , SUM(A.CPU)                                                                                                     CPU_SUM
         , MIN(A.CPU)                                                                                                     CPU_MIN
         , MAX(A.CPU)                                                                                                     CPU_MAX
         , AVG(A.CPU)                                                                                                     CPU_AVG
         , SUM(A.READS)                                                                                                   READS_SUM
         , MIN(A.READS)                                                                                                   READS_MIN
         , MAX(A.READS)                                                                                                   READS_MAX
         , AVG(A.READS)                                                                                                   READS_AVG
         , SUM(A.WRITES)                                                                                                  WRITES_SUM
         , MIN(A.WRITES)                                                                                                  WRITES_MIN
         , MAX(A.WRITES)                                                                                                  WRITES_MAX
         , AVG(A.WRITES)                                                                                                  WRITES_AVG
         -- , MIN(A.TEXTDATA)                                                                                                TEXTDATA
         , MIN(A.StartTime)                                                                                               StartTime_MIN
         , MAX(A.STARTTIME)                                                                                               STARTTIME_MAX
         , MIN(A.ENDTIME)                                                                                                 ENDTIME_MIN
         , MAX(A.ENDTIME)                                                                                                 ENDTIME_MAX
         , MAX(A.ApplicationName)                                                                                         APPILCATIONNAME
         , STUFF((
               SELECT ',' + AA.HOSTNAME
               FROM TRACE_PROFILE_LOG_201711291556 AA
               WHERE AA.PROCEDURENAME = A.PROCEDURENAME 
                 AND AA.EVENTCLASS IN ('10','12')
               GROUP BY AA.HOSTNAME
               FOR XML PATH('')
           ),1,1,'')                                                      HOSTNAMES
        --, SUM(CASE WHEN A.DURATION >= @DURATION_MIN                        AND A.DURATION < @DURATION_MIN + (@DURATION_UNIT *1 ) THEN 1 ELSE 0 END) DUATION01
        --, SUM(CASE WHEN A.DURATION >= @DURATION_MIN + (@DURATION_UNIT *1 ) AND A.DURATION < @DURATION_MIN + (@DURATION_UNIT *2 ) THEN 1 ELSE 0 END) DUATION02
        --, SUM(CASE WHEN A.DURATION >= @DURATION_MIN + (@DURATION_UNIT *2 ) AND A.DURATION < @DURATION_MIN + (@DURATION_UNIT *3 ) THEN 1 ELSE 0 END) DUATION03
        --, SUM(CASE WHEN A.DURATION >= @DURATION_MIN + (@DURATION_UNIT *3 ) AND A.DURATION < @DURATION_MIN + (@DURATION_UNIT *4 ) THEN 1 ELSE 0 END) DUATION04
        --, SUM(CASE WHEN A.DURATION >= @DURATION_MIN + (@DURATION_UNIT *4 ) AND A.DURATION < @DURATION_MIN + (@DURATION_UNIT *5 ) THEN 1 ELSE 0 END) DUATION05
        --, SUM(CASE WHEN A.DURATION >= @DURATION_MIN + (@DURATION_UNIT *5 ) AND A.DURATION < @DURATION_MIN + (@DURATION_UNIT *6 ) THEN 1 ELSE 0 END) DUATION06
        --, SUM(CASE WHEN A.DURATION >= @DURATION_MIN + (@DURATION_UNIT *6 ) AND A.DURATION < @DURATION_MIN + (@DURATION_UNIT *7 ) THEN 1 ELSE 0 END) DUATION07
        --, SUM(CASE WHEN A.DURATION >= @DURATION_MIN + (@DURATION_UNIT *7 ) AND A.DURATION < @DURATION_MIN + (@DURATION_UNIT *8 ) THEN 1 ELSE 0 END) DUATION08
        --, SUM(CASE WHEN A.DURATION >= @DURATION_MIN + (@DURATION_UNIT *8 ) AND A.DURATION < @DURATION_MIN + (@DURATION_UNIT *9 ) THEN 1 ELSE 0 END) DUATION09
        --, SUM(CASE WHEN A.DURATION >= @DURATION_MIN + (@DURATION_UNIT *9 )                                                       THEN 1 ELSE 0 END) DUATION10
        , ROW_NUMBER() OVER(ORDER BY SUM(A.DURATION) ASC ) 
         + ROW_NUMBER() OVER(ORDER BY AVG(A.DURATION) ASC ) 
         + ROW_NUMBER() OVER(ORDER BY SUM(A.CPU) ASC ) 
         + ROW_NUMBER() OVER(ORDER BY SUM(A.READS) + SUM(A.WRITES) ASC ) TOTAL_SCORE
         , ROW_NUMBER() OVER( ORDER BY SUM(A.DURATION) ASC )                                                              DURATION_SUM_SCORE
         , ROW_NUMBER() OVER(ORDER BY AVG(A.DURATION) ASC )                                                               DURATION_AVG_SCORE
         , ROW_NUMBER() OVER( ORDER BY SUM(A.CPU) ASC )                                                                   CPU_SCORE
         , ROW_NUMBER() OVER( ORDER BY SUM(A.READS) + SUM(A.WRITES) ASC )                                                 READSWRITES_SCORE
         
         , ((ROW_NUMBER() OVER( ORDER BY SUM(A.DURATION) ASC )              )/(@TOTAL_COUNT*1.0))*100                     RELATIVE_DURATION_SUM_SCORE
         , ((ROW_NUMBER() OVER(ORDER BY AVG(A.DURATION) ASC )               )/(@TOTAL_COUNT*1.0))*100                     RELATIVE_DURATION_AVG_SCORE
         , ((ROW_NUMBER() OVER( ORDER BY SUM(A.CPU) ASC )                   )/(@TOTAL_COUNT*1.0))*100                     RELATIVE_CPU_SCORE
         , ((ROW_NUMBER() OVER( ORDER BY SUM(A.READS) + SUM(A.WRITES) ASC ) )/(@TOTAL_COUNT*1.0))*100                     RELATIVE_READSWRITES_SCORE


    FROM TRACE_PROFILE_LOG_201711291556 A WITH (NOLOCK)
    WHERE A.EVENTCLASS IN ('10','12')
    GROUP BY A.PROCEDURENAME
    ORDER BY 2 DESC

END
GO
/****** Object:  StoredProcedure [dbo].[SYS_TRACE_LOG_ANALYZE_HISTOGRAM]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : sp를이용한 trace 분석
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/27  이성근           fixed

사용예: 

-- 01. 프로파일 테이블 저장
SELECT IDENTITY(int, 1, 1) AS IDX, * 
INTO TRACE_PROFILE_LOG_201711291556
FROM fn_trace_gettable('c:\temp\Trace_201711291556.trc', default);

-- 02. Column 수정
ALTER TABLE TRACE_PROFILE_LOG_201711291556 ADD TextDataConv  NVARCHAR(MAX)
ALTER TABLE TRACE_PROFILE_LOG_201711291556 ADD ProcedureName NVARCHAR(255)

-- 03. TextData Convert
UPDATE A SET A.TextDataConv = REPLACE(REPLACE(REPLACE(A.TEXTDATA,'[dbo].',''),'[',''),']','') FROM TRACE_PROFILE_LOG_201711291556 A 

-- 04. Procedure Name Update
UPDATE A SET A.PROCEDURENAME = CASE WHEN CHARINDEX('EXEC ', A.TEXTDATACONV) > 0 AND CHARINDEX(' ', A.TEXTDATACONV, (CHARINDEX('EXEC ', A.TEXTDATACONV) + 5)) - (CHARINDEX('EXEC ', A.TEXTDATACONV) + 5) > 0 
                                    THEN SUBSTRING(A.TEXTDATACONV
                                                    , CHARINDEX('EXEC ', A.TEXTDATACONV) + 5
                                                    , CHARINDEX(' ', A.TEXTDATACONV, (CHARINDEX('EXEC ', A.TEXTDATACONV) + 5)) - (CHARINDEX('EXEC ', A.TEXTDATACONV) + 5) )
                                    WHEN CHARINDEX('EXEC ', A.TEXTDATACONV) > 0 
                                    THEN REPLACE(A.TEXTDATACONV, 'EXEC ', '')
                                    WHEN CHARINDEX('FROM ', A.TEXTDATACONV) > 0 AND CHARINDEX('WHERE ', A.TEXTDATACONV, (CHARINDEX('FROM ', A.TEXTDATACONV)+5 )) - (CHARINDEX('FROM ', A.TEXTDATACONV) + 5) > 0 
                                    THEN SUBSTRING(A.TEXTDATACONV
                                                    , CHARINDEX('FROM ', A.TEXTDATACONV) + 5
                                                    , CHARINDEX('WHERE ', A.TEXTDATACONV, (CHARINDEX('FROM ', A.TEXTDATACONV)+5 )) - (CHARINDEX('FROM ', A.TEXTDATACONV) + 5))
                                    WHEN LEFT(A.TEXTDATACONV, 4) = 'USP_' AND CHARINDEX(' ', A.TEXTDATACONV) > 0 
                                    THEN SUBSTRING(A.TEXTDATACONV
                                                    , 1
                                                    , CHARINDEX(' ', A.TEXTDATACONV))
                                    WHEN LEFT(A.TEXTDATACONV, 3) = 'PK_' AND CHARINDEX(' ', A.TEXTDATACONV) > 0 
                                    THEN SUBSTRING(A.TEXTDATACONV
                                                    , 1
                                                    , CHARINDEX(' ', A.TEXTDATACONV))
                                    ELSE A.TEXTDATACONV 
                                    END
FROM TRACE_PROFILE_LOG_201711291556 A 
WHERE A.EVENTCLASS IN ('10','12')


UPDATE A SET A.DURATION = A.DURATION / 1000000
FROM TRACE_PROFILE_LOG_201711291556 A 
WHERE A.EVENTCLASS IN ('10','12')


SELECT * FROM TRACE_PROFILE_LOG_201711291556

******************************************************************/
CREATE PROCEDURE [dbo].[SYS_TRACE_LOG_ANALYZE_HISTOGRAM] (
      @p_maxfilesize  bigint = 100              -- 한개의 추적 파일에 대한 최대 크기 지정. MB 단위.
    , @p_Options      int = 2                   -- Roll over. MaxFileSize에 도달하면 새파일 생성후 계속해서 자료수집. 
    , @p_stopTime     datetime = null           -- 추적 파일 수집을 자동으로 중지하려는 시각 설정(NULL:수동으로중지)
    , @p_OutputFolder varchar(100) = 'C:\temp\' -- .trc 파일이 생성될 폴더. 해당 폴더는 수동으로 생성해야 함.
)
as
BEGIN

    /*
    [ @eventid= ] event_id
        No      Event name         Description
        10      RPC:Completed      Occurs when a remote procedure call (RPC) has completed. 
        12      SQL:BatchCompleted Occurs when a Transact-SQL batch has completed. 
        45	    SP:StmtCompleted   Indicates that a Transact-SQL statement within a stored procedure has finished executing.
    */

    DECLARE @DURATION_SECTION TABLE (
          IDX        INT IDENTITY
        , FROM_VALUE FLOAT 
        , TO_VALUE   FLOAT
    )

    DECLARE @CPU_SECTION TABLE (
          IDX        INT IDENTITY
        , FROM_VALUE FLOAT 
        , TO_VALUE   FLOAT
    )

    DECLARE @READSWRITES_SECTION TABLE (
          IDX        INT IDENTITY
        , FROM_VALUE FLOAT 
        , TO_VALUE   FLOAT
    )

    DECLARE @PREIOD                    INT
    DECLARE @DURATION_INCREASE_UNIT    INT 
    DECLARE @CPU_INCREASE_UNIT         INT 
    DECLARE @READSWRITES_INCREASE_UNIT INT 

    SET @PREIOD = 10
    SET @DURATION_INCREASE_UNIT = 1
    SET @CPU_INCREASE_UNIT      = 1000   
    SET @READSWRITES_INCREASE_UNIT  = 10000

    -- 01. 구간 데이타 만들기
    INSERT INTO @DURATION_SECTION (
        FROM_VALUE, TO_VALUE    
    )
    SELECT CASE WHEN A.IDX = 1 THEN NULL       ELSE (A.IDX-1) * @DURATION_INCREASE_UNIT END FROM_VALUE
        ,  CASE WHEN A.IDX = @PREIOD THEN NULL ELSE A.IDX     * @DURATION_INCREASE_UNIT END TO_VALUE
    FROM TB_IDX A WITH (NOLOCK)
    WHERE A.IDX <= @PREIOD

    INSERT INTO @CPU_SECTION (
        FROM_VALUE, TO_VALUE    
    )
    SELECT CASE WHEN A.IDX = 1 THEN NULL       ELSE (A.IDX-1) * @CPU_INCREASE_UNIT END FROM_VALUE
        ,  CASE WHEN A.IDX = @PREIOD THEN NULL ELSE A.IDX     * @CPU_INCREASE_UNIT END TO_VALUE
    FROM TB_IDX A WITH (NOLOCK)
    WHERE A.IDX <= @PREIOD

    INSERT INTO @READSWRITES_SECTION (
        FROM_VALUE, TO_VALUE    
    )
    SELECT CASE WHEN A.IDX = 1 THEN NULL       ELSE (A.IDX-1) * @READSWRITES_INCREASE_UNIT END FROM_VALUE
        ,  CASE WHEN A.IDX = @PREIOD THEN NULL ELSE A.IDX     * @READSWRITES_INCREASE_UNIT END TO_VALUE
    FROM TB_IDX A WITH (NOLOCK)
    WHERE A.IDX <= @PREIOD

    --SELECT * FROM @DURATION_SECTION
    --SELECT * FROM @CPU_SECTION
    --SELECT * FROM @READSWRITES_SECTION

    -- 02. 
    -- PROCEDURENAME, 구간, DURATION(횟수), CPU(횟수), READSWRITES(횟수)
    SELECT B.PROCEDURENAME 
        ,  A.IDX 
        ,  SUM(CASE WHEN A.DURATION_FROM_VALUE < B.DURATION AND B.DURATION <= A.DURATION_TO_VALUE THEN 1 
                    WHEN A.DURATION_FROM_VALUE IS NULL AND B.DURATION <= A.DURATION_TO_VALUE THEN 1 
                    WHEN A.DURATION_TO_VALUE IS NULL AND A.DURATION_FROM_VALUE < B.DURATION THEN 1 
                    ELSE 0 END
            ) DURATION_COUNT
        ,  SUM(CASE WHEN A.CPU_FROM_VALUE < B.CPU AND B.CPU <= A.CPU_TO_VALUE THEN 1 
                    WHEN A.CPU_FROM_VALUE IS NULL AND B.CPU <= A.CPU_TO_VALUE THEN 1 
                    WHEN A.CPU_TO_VALUE IS NULL AND A.CPU_FROM_VALUE < B.CPU THEN 1 
                    ELSE 0 END
            ) CPU_COUNT
        ,  SUM(CASE WHEN A.READSWRITES_FROM_VALUE < (B.READS + B.WRITES) AND (B.READS + B.WRITES) <= A.READSWRITES_TO_VALUE THEN 1 
                    WHEN A.READSWRITES_FROM_VALUE IS NULL AND (B.READS + B.WRITES) <= A.READSWRITES_TO_VALUE THEN 1 
                    WHEN A.READSWRITES_TO_VALUE IS NULL AND A.READSWRITES_FROM_VALUE < (B.READS + B.WRITES) THEN 1 
                    ELSE 0 END
            ) READSWRITES_COUNT
        ,  MAX(A.DURATION_FROM_VALUE) DURATION_FROM_VALUE 
        ,  MAX(A.DURATION_TO_VALUE ) DURATION_TO_VALUE 
        ,  MAX(A.CPU_FROM_VALUE) CPU_FROM_VALUE 
        ,  MAX(A.CPU_TO_VALUE ) CPU_TO_VALUE 
        ,  MAX(A.READSWRITES_FROM_VALUE ) READSWRITES_FROM_VALUE 
        ,  MAX(A.READSWRITES_TO_VALUE ) READSWRITES_TO_VALUE 
    FROM (
        SELECT A.IDX 
            ,  A.FROM_VALUE DURATION_FROM_VALUE
            ,  A.TO_VALUE   DURATION_TO_VALUE 
            ,  B.FROM_VALUE CPU_FROM_VALUE
            ,  B.TO_VALUE   CPU_TO_VALUE 
            ,  C.FROM_VALUE READSWRITES_FROM_VALUE
            ,  C.TO_VALUE   READSWRITES_TO_VALUE 
        FROM @DURATION_SECTION A 
        INNER JOIN @CPU_SECTION B ON ( A.IDX = B.IDX )
        INNER JOIN @READSWRITES_SECTION C ON ( A.IDX = C.IDX )
    ) A 
    CROSS JOIN TRACE_PROFILE_LOG_201711291556 B WITH (NOLOCK)
    WHERE B.EVENTCLASS IN ('10','12') 
    GROUP BY B.PROCEDURENAME, A.IDX
    ORDER BY B.PROCEDURENAME, A.IDX

END
GO
/****** Object:  StoredProcedure [dbo].[SYS_UPDATE_STATISTICS]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 인덱스 리빌드
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/27  이성근           fixed

사용예: 

EXEC [SYS_UPDATE_STATISTICS] 'dabom50_demo'

******************************************************************/
CREATE PROCEDURE [dbo].[SYS_UPDATE_STATISTICS]
    @P_DBNAME VARCHAR(50) 
AS
BEGIN
    
    ------ 생성DB 확인
    -- select name from sys.sysdatabases

    DECLARE @SQL VARCHAR(5000)
    SELECT @SQL = ''

    DECLARE TAB_CUR CURSOR FOR
        SELECT A = 'UPDATE STATISTICS ' + TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'

    OPEN TAB_CUR
    FETCH NEXT FROM TAB_CUR INTO @SQL
    WHILE(@@FETCH_STATUS = 0)
    BEGIN
        PRINT @SQL
        --     EXEC (@SQL)

       FETCH NEXT FROM TAB_CUR INTO @SQL
    END       

    CLOSE TAB_CUR
    DEALLOCATE TAB_CUR

             
END;
GO
/****** Object:  StoredProcedure [dbo].[SYS_WEBSERVICE_CALL_POST]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 테스트 web service 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 
1. 웹서비스 설정.
  - TagAdaptorWebservice 에 post 방식 웹서비스 허용
    <system.web>
        <webServices>
            <protocols>
                <add name="HttpPost" />
                <add name="HttpGet" />
            </protocols>
        </webServices>
    </system.web>
  - post & 허용
    <httpRuntime requestValidationMode="2.0"/>

2. sql 설정.
  - 설정 확인
    exec sp_configure 'Ole Automation Procedures'
    --> 없거나 고급옵션 에러 발생시 아래와 같은 설정

    2.1. Show Advance Options, 0 = disabled, 1 = enabled 
    EXEC sp_configure 'show advanced options'; 

    2.2. Enable the Advance options if they are not already turned on 
    sp_configure 'show advanced options', 1; 

    2.3. reconfigure
    RECONFIGURE;

    2.4. Enable the Ole Automation Procedures 
    sp_configure 'Ole Automation Procedures', 1; 
    
    2.5. reconfigure
    RECONFIGURE;

3. 실행테스트
    exec RequestHttpWebService2 '','','',''

******************************************************************/

CREATE PROCEDURE [dbo].[SYS_WEBSERVICE_CALL_POST]
    @Url          VARCHAR(1024)
  , @HttpMethod   VARCHAR(10)
  , @ParamsValues VARCHAR(1024) -- param1=value&param2=value
  , @SoapAction   VARCHAR(1024) = NULL
AS
     BEGIN
         SET NOCOUNT ON;
         DECLARE @obj INT;
         DECLARE @ValorDeregreso INT;
         DECLARE @sUrl VARCHAR(200);
         DECLARE @response VARCHAR(8000);
         DECLARE @hr INT;
         DECLARE @src VARCHAR(255);
         DECLARE @desc VARCHAR(255);
         SET @sUrl = 'http://182.252.168.27/tagadaptorwebservice/Service.asmx/SetValue?commId=AAS109&items=CF;0';
         EXEC sp_OACreate
              'MSXML2.ServerXMLHttp'
            , @obj OUT;
         EXEC sp_OAMethod
              @obj
            , 'Open'
            , NULL
            , 'GET'
            , @sUrl
            , false;
         EXEC sp_OAMethod
              @obj
            , 'send';
         EXEC sp_OAGetProperty
              @obj
            , 'responseText'
            , @response OUTPUT;
         SELECT
                @response [response];
         EXEC sp_OADestroy
              @obj;
     END;
GO
/****** Object:  StoredProcedure [dbo].[SYS_WEBSERVICE_CALL_SOAP]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 테스트 web service 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

1. sql 설정.
  - 설정 확인
    exec sp_configure 'Ole Automation Procedures'
    --> 없거나 고급옵션 에러 발생시 아래와 같은 설정

    2.1. Show Advance Options, 0 = disabled, 1 = enabled 
    EXEC sp_configure 'show advanced options'; 

    2.2. Enable the Advance options if they are not already turned on 
    sp_configure 'show advanced options', 1; 

    2.3. reconfigure
    RECONFIGURE;

    2.4. Enable the Ole Automation Procedures 
    sp_configure 'Ole Automation Procedures', 1; 
    
    2.5. reconfigure
    RECONFIGURE;

2. 실행테스트
  EXEC [RequestHttpWebService] 'http://182.252.168.27/tagadaptorwebservice/Service.asmx', 'SOAP', 'commId=AAS109&items=CF;0', 'SetValue'

******************************************************************/

CREATE PROCEDURE [dbo].[SYS_WEBSERVICE_CALL_SOAP]
    @Url          VARCHAR(1024)
  , @HttpMethod   VARCHAR(10)
  , @ParamsValues VARCHAR(1024) -- param1=value&param2=value
  , @SoapAction   VARCHAR(1024) = NULL
AS
     BEGIN
         SET NOCOUNT ON;

--set @Url = 'http://localhost/service.asmx'
--set @HttpMethod = 'soap'
--set @ParamsValues = 'login=tr2280&password=Qwe12345&domain=webtech.development'
--set @SoapAction = 'Authenticate'
         IF @HttpMethod IN('get', 'GET')
            AND LEN(@ParamsValues) > 0
         BEGIN
             SET @Url = @Url+'?'+@ParamsValues;
         END;
         DECLARE @obj INT, @response VARCHAR(8000), @responseXml XML, @status VARCHAR(50), @statusText VARCHAR(1024), @method VARCHAR(10)= (CASE WHEN @HttpMethod IN('soap', 'SOAP')
                                                                                                                                                THEN 'POST'
                                                                                                                                                ELSE @HttpMethod
                                                                                                                                            END);
         EXEC sp_OACreate
              'MSXML2.ServerXMLHttp'
            , @obj OUT;
         EXEC sp_OAMethod
              @obj
            , 'Open'
            , NULL
            , @method
            , @Url
            , false;
         IF @HttpMethod IN('get', 'GET')
         BEGIN
             EXEC sp_OAMethod
                  @obj
                , 'send';
         END;
             ELSE
         BEGIN
             IF @HttpMethod IN('post', 'POST')
             BEGIN
                 EXEC sp_OAMethod
                      @obj
                    , 'setRequestHeader'
                    , NULL
                    , 'Content-Type'
                    , 'application/x-www-form-urlencoded';
                 EXEC sp_OAMethod
                      @obj
                    , 'send'
                    , NULL
                    , @ParamsValues;
             END;
                 ELSE
             BEGIN
                 IF @HttpMethod IN('soap', 'SOAP')
                 BEGIN
                     IF @SoapAction IS NULL
                     BEGIN
                         RAISERROR('@SoapAction is null', 10, 1)
                     END;
                     DECLARE @host VARCHAR(1024)= @Url;
                     IF @host LIKE 'http://%'
                     BEGIN
                         SET @host = RIGHT(@host, LEN(@host) - 7);
                     END
                         ELSE
                     BEGIN
                         IF @host LIKE 'https://%'
                         BEGIN
                             SET @host = RIGHT(@host, LEN(@host) - 8)
                         END;
                     END;
                     IF CHARINDEX(':', @host) > 0
                        AND CHARINDEX(':', @host) < CHARINDEX('/', @host)
                     BEGIN
                         SET @host = LEFT(@host, CHARINDEX(':', @host)-1);
                     END
                         ELSE
                     BEGIN
                         SET @host = LEFT(@host, CHARINDEX('/', @host)-1);
                     END;
                     DECLARE @envelope VARCHAR(8000)= '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><{action} xmlns="http://tempuri.org/">{params}</{action}></soap:Body></soap:Envelope>';
                     DECLARE @params VARCHAR(8000)= '';
                     WHILE LEN(@ParamsValues) > 0
                     BEGIN
                         DECLARE @param VARCHAR(256), @value VARCHAR(256);
                         IF CHARINDEX('&', @ParamsValues) > 0
                         BEGIN
                             SET @param = LEFT(@ParamsValues, CHARINDEX('&', @ParamsValues)-1);
                             SET @value = RIGHT(@param, LEN(@param)-CHARINDEX('=', @param));
                             SET @param = LEFT(@param, CHARINDEX('=', @param)-1);
                             SET @params = @params+'<'+@param+'>'+@value+'</'+@param+'>';
                             SET @ParamsValues = RIGHT(@ParamsValues, LEN(@ParamsValues)-LEN(@param+'='+@value+'&'));
                         END;
                             ELSE
                         BEGIN
                             SET @value = RIGHT(@ParamsValues, LEN(@ParamsValues)-CHARINDEX('=', @ParamsValues));
                             SET @param = LEFT(@ParamsValues, CHARINDEX('=', @ParamsValues)-1);
                             SET @params = @params+'<'+@param+'>'+@value+'</'+@param+'>';
                             SET @ParamsValues = NULL;
                         END;
                     END;
                     SET @envelope = replace(@envelope, '{action}', @SoapAction);
                     SET @envelope = replace(@envelope, '{params}', @params);
                     SET @SoapAction = 'http://tempuri.org/'+@SoapAction;
                     PRINT @host;
                     PRINT @SoapAction;
                     PRINT @envelope;
                     EXEC sp_OAMethod
                          @obj
                        , 'setRequestHeader'
                        , NULL
                        , 'Content-Type'
                        , 'text/xml; charset=utf-8';
                     EXEC sp_OAMethod
                          @obj
                        , 'setRequestHeader'
                        , NULL
                        , 'Host'
                        , @host;
                     EXEC sp_OAMethod
                          @obj
                        , 'setRequestHeader'
                        , NULL
                        , 'SOAPAction'
                        , @SoapAction;
                     EXEC sp_OAMethod
                          @obj
                        , 'send'
                        , NULL
                        , @envelope;
                 END;
             END;
         END;
         EXEC sp_OAGetProperty
              @obj
            , 'responseText'
            , @response OUT;
         EXEC sp_OADestroy
              @obj;
         SELECT
                @status AS     [status]
              , @statusText AS [statusText]
              , @response AS   [response];
     END;
GO
/****** Object:  StoredProcedure [dbo].[SYS_XMAI_INDEXDEFRAGMENTATION_STD_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/***************************************************************************
* Project      : 셰플러코리아 창원공장 통합MES 
* Purpose      : 인덱스리빌드 및 통계업데이트
* Version      : 1.0  
* Created By   : 김태형
* Creation Date: 2011.06.23
* Ex : XMAI_INDEXDEFRAGMENTATION_STD_S
	 1. Check the fragmentation greater than 30% and pages greater than 1000 then rebuild
	 2. Check the fragmentation between 15% to 29% and pages greater than 1000 then reorganize
	 3. Check the fragmentation between 15% to 29% and pages greater than 1000 and page level lock disabled then rebuild
	 4. Update the statistics if the three conditions is false
*------------------------------------------------------------                                                                          
*  Date        Updated By  Version  Description                            
*------------------------------------------------------------
*  2011.06.23   김태형      1.0      Created                                
***************************************************************************/
CREATE PROCEDURE [dbo].[SYS_XMAI_INDEXDEFRAGMENTATION_STD_S]
AS

BEGIN

	SET NOCOUNT ON

	DECLARE
	@db_name SYSNAME,
	@tab_name SYSNAME,
	@ind_name VARCHAR(500),
	@schema_name SYSNAME,
	@frag FLOAT,
	@pages INT,
	@min_id INT,
	@max_id INT

	SET @db_name='MES_CW'

	--------------------------------------------------------------------------------------------------------------------------------------
	--inserting the Fragmentation details
	--------------------------------------------------------------------------------------------------------------------------------------
	CREATE TABLE #tempfrag
	(
	id INT IDENTITY,
	table_name SYSNAME,
	index_name VARCHAR(500),
	frag FLOAT,
	pages INT,
	schema_name SYSNAME
	)

	EXEC ('USE ['+@db_name+'];
	INSERT INTO #tempfrag (table_name,index_name,frag,pages,schema_name)
	SELECT OBJECT_NAME(F.OBJECT_ID) obj,i.name ind,
	f.avg_fragmentation_in_percent,
	f.page_count,table_schema
	FROM SYS.DM_DB_INDEX_PHYSICAL_STATS (DB_ID(),NULL,NULL,NULL,NULL) F
	JOIN SYS.INDEXES I
	ON(F.OBJECT_ID=I.OBJECT_ID)AND i.index_id=f.index_id
	JOIN INFORMATION_SCHEMA.TABLES S
	ON (s.table_name=OBJECT_NAME(F.OBJECT_ID))
	AND f.database_id=DB_ID()
	AND OBJECTPROPERTY(I.OBJECT_ID,''ISSYSTEMTABLE'')=0
	WHERE F.index_id > 0 AND F.index_id <= 10000	'	
	)

	SELECT @min_id=MIN(ID)FROM #tempfrag
	SELECT @max_id=MAX(ID)FROM #tempfrag

	-- TRUNCATE TABLE msdb.dbo.dba_defrag_maintenance_history

	WHILE (@min_id<=@max_id)
	BEGIN

	SELECT
	@tab_name=table_name,
	@schema_name=schema_name,
	@ind_name=index_name ,
	@frag=frag ,
	@pages=pages
	FROM #tempfrag WHERE id = @min_id

	--------------------------------------------------------------------------------------------------------------------------------------
	--Check the fragmentation greater than 30% and pages greater than 1000 then rebuild
	--------------------------------------------------------------------------------------------------------------------------------------

	IF (@ind_name IS NOT NULL)
	BEGIN
	IF (@frag>=30 AND @pages>1000)
	BEGIN
	EXEC ('USE ['+@db_name+'];ALTER INDEX ['+@ind_name+'] ON ['+@schema_name+'].['+@tab_name +'] REBUILD ')
		--INSERT INTO msdb.dbo.dba_defrag_maintenance_history
		--VALUES (@db_name,@tab_name,@ind_name,@frag,@pages,'REBUILD',GETDATE())
		
		PRINT 'USE ['+@db_name+'];ALTER INDEX ['+@ind_name+'] ON ['+@schema_name+'].['+@tab_name +'] REBUILD '
	END
	--------------------------------------------------------------------------------------------------------------------------------------
	--Check the fragmentation between 15% to 29% and pages greater than 1000 then reorganize
	--------------------------------------------------------------------------------------------------------------------------------------
	ELSE IF((@frag BETWEEN 15 AND 29) AND @pages>1000 )
	BEGIN
	BEGIN TRY
	EXEC ('USE ['+@db_name+'];ALTER INDEX ['+@ind_name+'] ON ['+@schema_name+'].['+@tab_name +'] REORGANIZE ')
	EXEC ('USE ['+@db_name+'];UPDATE STATISTICS ['+@schema_name+'].['+@tab_name+'] (['+@ind_name+']) ' )
	
		--INSERT INTO msdb.dbo.dba_defrag_maintenance_history
		--VALUES (@db_name,@tab_name,@ind_name,@frag,@pages,'REORGANIZE & UPDATESTATS',GETDATE())

		PRINT 'USE ['+@db_name+'];ALTER INDEX ['+@ind_name+'] ON ['+@schema_name+'].['+@tab_name +'] REORGANIZE '
		PRINT 'USE ['+@db_name+'];UPDATE STATISTICS ['+@schema_name+'].['+@tab_name+'] (['+@ind_name+']) '

	
	END TRY
	BEGIN CATCH
	--------------------------------------------------------------------------------------------------------------------------------------
	--Check the fragmentation between 15% to 29% and pages greater than 1000 and page level 
	--lock disabled then rebuild
	--------------------------------------------------------------------------------------------------------------------------------------

	IF ERROR_NUMBER()=2552
	EXEC ('USE ['+@db_name+'];ALTER INDEX ['+@ind_name+'] ON ['+@schema_name+'].['+@tab_name +'] REBUILD ')
		--INSERT INTO msdb.dbo.dba_defrag_maintenance_history
		--VALUES (@db_name,@tab_name,@ind_name,@frag,@pages,'PLLD_REBUILD',GETDATE())
		PRINT 'USE ['+@db_name+'];ALTER INDEX ['+@ind_name+'] ON ['+@schema_name+'].['+@tab_name +'] REBUILD '		
	END CATCH
	END

	--------------------------------------------------------------------------------------------------------------------------------------
	--Update the statistics for all indexes if the first three conditions is false
	--------------------------------------------------------------------------------------------------------------------------------------
	ELSE 
	BEGIN 
	EXEC ('USE ['+@db_name+'];UPDATE STATISTICS ['+@schema_name+'].['+@tab_name+'] (['+@ind_name+']) ' ) 
		--INSERT INTO msdb.dbo.dba_defrag_maintenance_history
		--VALUES (@db_name,@tab_name,@ind_name,@frag,@pages,'UPDATESTATS',GETDATE()) 		
		PRINT 'USE ['+@db_name+'];UPDATE STATISTICS ['+@schema_name+'].['+@tab_name+'] (['+@ind_name+']) ' 
	END 
	END 
	ELSE
	BEGIN

	--------------------------------------------------------------------------------------------------------------------------------------
	--Update the statistics for all tables if the first three conditions is false
	--------------------------------------------------------------------------------------------------------------------------------------
	EXEC ('USE ['+@db_name+'];UPDATE STATISTICS ['+@schema_name+'].['+@tab_name+']') 
	--INSERT INTO msdb.dbo.dba_defrag_maintenance_history 
	--VALUES (@db_name,@tab_name,'HEAP',@frag,@pages,'UPDATESTATS',GETDATE()) 
		PRINT 'USE ['+@db_name+'];UPDATE STATISTICS ['+@schema_name+'].['+@tab_name+']';
	END

	SET @min_id=@min_id+1
	END
	DROP TABLE #tempfrag
	--INSERT INTO master.dbo.dba_defrag_maintenance_history
	--SELECT * FROM msdb.dbo.dba_defrag_maintenance_history
	
	--저장프로시저 리컴파일
	--EXEC [XMAI_PROCEDURE_RECOMPILE_STD_S]
END



GO
/****** Object:  StoredProcedure [dbo].[USP_ATM_sp_code_emp_L_FTP]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_ATM_sp_code_emp_L_FTP]
    @p_dept_id  NVARCHAR(20)
  , @p_auth_id  NVARCHAR(20)
  , @p_emp_no   NVARCHAR(20)
  , @p_emp_name NVARCHAR(255)
  , @p_emp_id   NVARCHAR(20)
  , @p_valid    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
--ApplyDB
                emp.emp_no         "@@emp_no"
              , emp.EMP_ID         "@@emp_id"
              , emp.EMP_NAME       "@@emp_name"
              , emp.DEPT_ID        "@@dept_id"
              , emp.STAMP_IMAGE    "@@stamp_image"
              , emp.TEL_INFO       "@@tel_info"
              , emp.ADDR_INFO      "@@addr_info"
              , emp.AUTH_ID        "@@auth_id"
              , emp.IS_ADMIN       "@@is_admin"
              , ''                 "@@PW_INITIAL"
              , emp.REMARK         "@@remark"
              , emp.VALID          "@@valid"
              , emp.ROW_STAMP      "@@key"
--UserView
              , emp.EMP_NO         "사원번호"
              , emp.EMP_ID         로그인ID
              , emp.EMP_NAME       "사원명"
              , dept.DEPT_NAME     "부서"
              , CASE WHEN isnull(emp.STAMP_IMAGE, '') <> ''
                    THEN '<tag>'++'<a class="link_btn" href="javascript:showImage('''+CAST(emp.STAMP_IMAGE AS NVARCHAR(100))+''')"> VIEW</a>'
                    ELSE ''
                               END "<ALIGN=CENTER>사인(도장)"
              , emp.TEL_INFO       "<tag;WIDTH=120>연락처"
              , emp.ADDR_INFO      "<WIDTH=30%>주소"
              , auth.AUTH_NAME     "권한"
              , CASE WHEN EMP.IS_ADMIN = 1
                    THEN 'O'
                    ELSE 'X'
                               END "<ALIGN=CENTER>프로그램관리자"
         FROM   TB_EMP emp
         JOIN TB_DEPT dept ON emp.DEPT_ID = dept.DEPT_ID
         JOIN TB_AUTH auth ON emp.AUTH_ID = auth.AUTH_ID
         WHERE  emp.EMP_ID LIKE '%'+isnull(@p_emp_id, '')+'%'
                AND emp.EMP_NAME LIKE '%'+isnull(@p_emp_name, '')+'%'
                AND emp.emp_no LIKE '%'+isnull(@p_emp_no, '')+'%'
                AND emp.VALID = @p_valid
                AND CASE WHEN isnull(@p_dept_id, '*') <> '*'
                        THEN CASE WHEN emp.DEPT_ID = @p_dept_id
                                 THEN 1
                                 ELSE 0
                             END
                        ELSE 1
                    END = 1
                AND CASE WHEN isnull(@p_auth_id, '*') <> '*'
                        THEN CASE WHEN emp.AUTH_ID = @p_auth_id
                                 THEN 1
                                 ELSE 0
                             END
                        ELSE 1
                    END = 1;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_1_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[USP_TRAINING_1_L]
    @PROJECT_ID   VARCHAR(20) = NULL
  , @PROJECT_NAME VARCHAR(20) = NULL
  , @P_TERM       VARCHAR(20) = NULL
  , @START_DATE   VARCHAR(20) = NULL
  , @END_DATE     VARCHAR(20) = NULL
  , @ORDER_STATUS VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @START VARCHAR(20)
    DECLARE @END   VARCHAR(20)

    SET @START ='19000101'
    SET @END = CONVERT(VARCHAR, CAST(@END_DATE AS DATETIME)+1, 112) 
    SET @START = CASE @P_TERM WHEN 0 THEN @START_DATE 
                      WHEN 1 THEN CONVERT(VARCHAR, GETDATE(), 112)
                      WHEN 7 THEN CONVERT(VARCHAR, GETDATE()-6, 112) END 

    IF((@PROJECT_ID IS NOT NULL))
    BEGIN
        SET @PROJECT_NAME = NULL; 
        SET @START='19000101'  
    END 

    SELECT PROJECT_ID                                                                          "프로젝트번호"
        ,  PROJECT_NAME                                                                        "프로젝트명"
        ,  '<ALIGN=CENTER;>'+CONVERT(VARCHAR(10), CAST(H.ORDER_DATE AS DATE), 120)             "프로젝트 등록일"
        ,  START_DATE                                                                          "프로젝트 시작일"
        ,  END_DATE                                                                            "프로젝트 종료일"
        ,  CASE WHEN ORDER_STATUS = 'R' THEN '<align=center;font-weight=bold;color=blue>대기' 
                WHEN ORDER_STATUS = 'S' THEN '<align=center;font-weight=bold;color=red>진행' 
                WHEN ORDER_STATUS = 'C' THEN '<align=center;font-weight=bold;color=green>완료' 
           END                                                                                 "진행상태"
        ,  (                                                                                   
             SELECT EMP_NAME                                                                   
             FROM   TB_EMP WITH (NOLOCK)                                                       
             WHERE  EMP_ID = H.CREATE_BY                                                       
        )                                                                                      "작성자"
        ,  CREATE_DTTM                                                                         "작성일시"
        ,  (                                                                                   
             SELECT EMP_NAME                                                                   
             FROM   TB_EMP  WITH (NOLOCK)                                                      
             WHERE  EMP_ID = H.SAVE_BY                                                         
        )                                                                                      "수정자"
        ,  SAVE_DTTM                                                                           "수정일시"
        ,  PROJECT_ID                                                                          "KEY"
        ,  CASE WHEN ORDER_STATUS = 'C' THEN '' ELSE PROJECT_ID  END                           "@@KEY" --키값과 체크박스로 넘길값이 다를 경우 @@CHECK 로 표시         
        ,  PROJECT_ID                                                                          "@@PARAM"  --링크드 그리드뷰에 넘길값 
    FROM UTB_EX_PROJECT_HEADER H
    WHERE H.ORDER_DATE BETWEEN @START  AND @END 
      AND ( ISNULL(@PROJECT_ID, '*') = '*' OR H.PROJECT_ID LIKE '%'+@PROJECT_ID+'%')
      AND ( ISNULL(@PROJECT_NAME,'*') = '*' OR H.PROJECT_NAME LIKE '%' + @PROJECT_NAME +'%' )
      AND ( ISNULL(@ORDER_STATUS,'*') = '*' OR H.ORDER_STATUS = @ORDER_STATUS )

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_all_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

SELECT * FROM TB_EX_PROJECT_HEADER   
SELECT * FROM TB_EX_PROJECT_DETAIL 
******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_all_D]
    @P_KEY       VARCHAR(20)
  , @P_DELIMITER VARCHAR(20)
  , @P_VALUES    VARCHAR(8000)
  , @P_SAVEBY    VARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    --DECLARE @MSG VARCHAR(2000);
    --SET @MSG = '1. @P_KEY(키값) :  ' + @P_KEY +
    --           '\n2. @P_DELIMITER(구분자) :  ' + @P_DELIMITER +
    --           '\n3. @P_VALUES(전달값) :  ' + @P_VALUES +
    --           '\n5. @P_SAVEBY(수정자) :  ' + @P_SAVEBY 
    --BEGIN 
    --RAISERROR(@MSG, 16,1)
    --RETURN 0; 
    --END 

    DECLARE @P_PROJECT_ID VARCHAR(20);
    
    SELECT
        @P_PROJECT_ID = PROJECT_ID
    FROM   UTB_EX_PROJECT_DETAIL
    WHERE  ROW_STAMP = @P_KEY;
    
    DECLARE @CNT INT;
    
    SELECT
        @CNT = COUNT(*)
    FROM   UTB_EX_PROJECT_DETAIL
    WHERE  PROJECT_ID = @P_PROJECT_ID;
    
    IF(@CNT > 1)
    BEGIN
        DELETE UTB_EX_PROJECT_DETAIL
        WHERE
            ROW_STAMP = @P_KEY;
    END;
    ELSE
    BEGIN
        DELETE UTB_EX_PROJECT_DETAIL
        WHERE ROW_STAMP = @P_KEY;

        DELETE UTB_EX_PROJECT_HEADER
        WHERE PROJECT_ID = @P_PROJECT_ID;
    END;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_all_editor_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_all_editor_D]
    @p_rowstamp  VARCHAR(20)
  , @P_DELIMITER VARCHAR(20)
  , @P_VALUES    VARCHAR(8000)
  , @P_PARAMS    VARCHAR(8000)
  , @P_SAVEBY    VARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--DECLARE @MSG VARCHAR(2000);
--SET @MSG = '1. @P_KEY(키값) :  ' + @P_KEY +
--           '\n2. @P_DELIMITER(구분자) :  ' + @P_DELIMITER +
--           '\n3. @P_VALUES(전달값) :  ' + @P_VALUES +
--           '\n5. @P_SAVEBY(수정자) :  ' + @P_SAVEBY 
--BEGIN 
--RAISERROR(@MSG, 16,1)
--RETURN 0; 
--END 
         DECLARE @P_PROJECT_ID VARCHAR(20);
         SELECT
                @P_PROJECT_ID = PROJECT_ID
         FROM   TB_EX_PROJECT_DETAIL
         WHERE  ROW_STAMP = @p_rowstamp;
         DECLARE @CNT INT;
         SELECT
                @CNT = COUNT(*)
         FROM   TB_EX_PROJECT_DETAIL
         WHERE  PROJECT_ID = @P_PROJECT_ID;
         IF(@CNT > 1)
         BEGIN
             DELETE TB_EX_PROJECT_DETAIL
             WHERE
                   ROW_STAMP = @p_rowstamp;
         END;
             ELSE
         BEGIN
             DELETE TB_EX_PROJECT_DETAIL
             WHERE
                   ROW_STAMP = @p_rowstamp;
             DELETE TB_EX_PROJECT_HEADER
             WHERE
                   PROJECT_ID = @P_PROJECT_ID;
         END;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_all_editor_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_all_editor_L]
    @PROJECT_ID   VARCHAR(20)
  , @PROJECT_NAME VARCHAR(60)
  , @P_TERM       VARCHAR(20) --1일[1],7일[7],기간지정[0]
  , @START_DATE   VARCHAR(20)
  , @END_DATE     VARCHAR(20)
  , @ORDER_STATUS VARCHAR(20) --대기[R],진행[S],완료[C], *
  , @MEM_ID       VARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    DECLARE @START VARCHAR(20);
    DECLARE @END VARCHAR(20);

    SET @START = '19000101';
    SET @END = CONVERT(VARCHAR, CAST(@END_DATE AS DATETIME) + 1, 112);
    SET @START = CASE @P_TERM WHEN 0
                    THEN @START_DATE WHEN 1
                    THEN CONVERT(VARCHAR, GETDATE(), 112) WHEN 7
                    THEN CONVERT(VARCHAR, GETDATE() - 6, 112)
                END;

    IF((@PROJECT_ID IS NOT NULL))
    BEGIN
        SET @START = '19000101';
    END;

    SELECT H.PROJECT_ID+'&is;'+H.PROJECT_NAME "<edit;type=textbrowser-s;sid=project_id;width=30%>프로젝트번호"
        , H.ORDER_DATE                       "<edit;type=date>프로젝트 등록일"
        --D.MEM_ID  +'&is;'+ (SELECT EMP_NAME FROM TB_EMP WHERE EMP_ID = D.MEM_ID)   "<edit;type=textbrowser-s;sid=mem_id;width=30%;param=emp_id='je_bae'>팀원ID", 
        , D.MEM_ID                           "<edit;type=cb;sid=mem_id;width=30%>팀원ID_콤보"
        , D.[DESC]                           "비고"
        , ( SELECT EMP_NAME
            FROM TB_EMP WITH (NOLOCK)
            WHERE  EMP_ID = D.CREATE_BY
        )                                  "작성자"
        , D.CREATE_DTTM                      "작성일시"
        , ( SELECT EMP_NAME
            FROM   TB_EMP WITH (NOLOCK)
            WHERE  EMP_ID = D.SAVE_BY
        )                                  "수정자"
        , D.SAVE_DTTM                        "수정일시"
        , D.ROW_STAMP                        "@@KEY"
    FROM UTB_EX_PROJECT_HEADER H WITH (NOLOCK)
    JOIN UTB_EX_PROJECT_DETAIL D WITH (NOLOCK) ON H.PROJECT_ID = D.PROJECT_ID
    WHERE ( ISNULL(@PROJECT_ID, '*') = '*' OR H.PROJECT_ID LIKE '%'+@PROJECT_ID+'%' )
      AND ( ISNULL(@PROJECT_NAME, '*') = '*' OR H.PROJECT_NAME LIKE '%'+@PROJECT_NAME+'%' )
      AND H.ORDER_DATE BETWEEN @START AND @END
      AND ( ISNULL(@ORDER_STATUS, '*') = '*' OR H.ORDER_STATUS = @ORDER_STATUS )
      AND ( ISNULL(@MEM_ID, '*') = '*' OR D.MEM_ID = @MEM_ID )

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_all_editor_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_all_editor_S]
    @P_KEY       VARCHAR(20)
  , @P_DELIMITER VARCHAR(20)
  , @P_VALUES    VARCHAR(8000)
  , @P_PARAMS    VARCHAR(8000)
  , @P_SAVEBY    VARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    --PARSING VALUE STRING ..............................................
    DECLARE @TBL TABLE(
          IDX   INT
        , VDATA VARCHAR(255));
    INSERT INTO @TBL
    SELECT
        *
    FROM dbo.fn_getValues (@P_DELIMITER, @P_VALUES);
    --.................................................................
    --DECLARE @MSG VARCHAR(2000);
    --SET @MSG = '1. @P_KEY(키값) :  ' + @P_KEY +
    --           '\n2. @P_DELIMITER(구분자) :  ' + @P_DELIMITER +
    --           '\n3. @P_VALUES(전달값) :  ' + @P_VALUES +
    --           '\n4. @P_PARAMS(파람값-조회조건) :  ' + @P_PARAMS +
    --           '\n5. @P_SAVEBY(수정자) :  ' + @P_SAVEBY 
    --BEGIN 
    --RAISERROR(@MSG, 16,1)
    --RETURN 0; 
    --END 

    DECLARE @PROJECT_ID   AS VARCHAR(255);
    DECLARE @PROJECT_NAME AS VARCHAR(255);
    DECLARE @ORDER_DATE   AS VARCHAR(255);
    DECLARE @MEM_ID       AS VARCHAR(255);
    DECLARE @DESC         AS VARCHAR(255);
    
    SET @PROJECT_ID = ( SELECT VDATA FROM   @TBL WHERE  IDX = 1 );
    SET @ORDER_DATE = ( SELECT VDATA FROM   @TBL WHERE  IDX = 2 );
    SET @MEM_ID     = ( SELECT VDATA FROM   @TBL WHERE  IDX = 3 );
    SET @DESC       = ( SELECT VDATA FROM   @TBL WHERE  IDX = 4 );
    
    DECLARE @CNT INT;
    SELECT @CNT = COUNT(*) FROM   UTB_EX_PROJECT_DETAIL WITH (NOLOCK) WHERE  PROJECT_ID = @PROJECT_ID;

    IF ISNULL(@P_KEY, ' ') = ' '
    BEGIN
        IF(@CNT = 0)
        BEGIN
            INSERT INTO UTB_EX_PROJECT_HEADER (
                   PROJECT_ID
                ,  PROJECT_NAME
                ,  ORDER_DATE
                ,  ORDER_STATUS
                ,  CREATE_DTTM
                ,  CREATE_BY
                ,  SAVE_DTTM
                ,  SAVE_BY
            )
            SELECT @PROJECT_ID
                ,  @PROJECT_NAME
                ,  @ORDER_DATE
                ,  'R'
                ,  GETDATE()
                ,  @P_SAVEBY
                ,  GETDATE()
                ,  @P_SAVEBY
                ;
        END;

        INSERT INTO UTB_EX_PROJECT_DETAIL (
              PROJECT_ID
            , MEM_ID
            , [DESC]
            , CREATE_DTTM
            , CREATE_BY
            , SAVE_DTTM
            , SAVE_BY 
        )
        SELECT @PROJECT_ID
            ,  @MEM_ID
            ,  @DESC
            ,  GETDATE()
            ,  @P_SAVEBY
            ,  GETDATE()
            ,  @P_SAVEBY;
    END;
    ELSE
    BEGIN
        UPDATE UTB_EX_PROJECT_DETAIL
        SET MEM_ID    = @MEM_ID
          , [DESC]    = @DESC
          , SAVE_DTTM = GETDATE()
          , SAVE_BY   = @P_SAVEBY
        WHERE ROW_STAMP = @P_KEY;
    END;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_all_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_all_L]
    @PROJECT_ID   VARCHAR(20)
  , @PROJECT_NAME VARCHAR(60)
  , @P_TERM       VARCHAR(20) --1일[1],7일[7],기간지정[0]  //괄호안에 코드값이 파람으로 전달됨.
  , @START_DATE   VARCHAR(20)
  , @END_DATE     VARCHAR(20)
  , @ORDER_STATUS VARCHAR(20) --대기[R],진행[S],완료[C], *
  , @MEM_ID       VARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    DECLARE @START VARCHAR(20);
    DECLARE @END VARCHAR(20);
    DECLARE @tool_tip VARCHAR(400);

    SET @START = '19000101';
    SET @END = CONVERT(VARCHAR, CAST(@END_DATE AS DATETIME) + 1, 112);
    SET @START = CASE @P_TERM WHEN 0 THEN @START_DATE 
                              WHEN 1 THEN CONVERT(VARCHAR, GETDATE(), 112) 
                              WHEN 7 THEN CONVERT(VARCHAR, GETDATE() - 6, 112)
                 END;

    SET @tool_tip = ( SELECT EMP_ID FROM   TB_EMP WITH (NOLOCK) WHERE  EMP_ID = @MEM_ID );

    IF((@PROJECT_ID IS NOT NULL))
    BEGIN
        SET @START = '19000101';
    END;

    -- APPLY DB
    -- USER VIEW
    SELECT H.PROJECT_ID                                                                        '@@PROJECT_ID'
        ,  H.PROJECT_NAME                                                                      '@@PROJECT_NAME'
        ,  H.ORDER_DATE                                                                        '@@ORDER_DATE'
        ,  D.MEM_ID                                                                            '@@MEM_ID'
        ,  D.[DESC]                                                                            '@@DESC'
        ,  D.ROW_STAMP                                                                         "@@KEY"
        ,  '<width=50%>'+H.PROJECT_ID                                                          '프로젝트번호'
        ,  '<tool_tip=프로젝트명입니다;align=center;>'+H.PROJECT_NAME                                        '프로젝트명'
        ,  '<ALIGN=CENTER;>'+CONVERT(VARCHAR(10), CAST(H.ORDER_DATE AS DATE), 120)             "!!프로젝트 등록일"
        ,  H.START_DATE                                                                        "프로젝트 시작일"
        ,  H.END_DATE                                                                          "프로젝트 종료일"
        -- html tag 적용                                                                       
        ,  CASE WHEN ORDER_STATUS = 'R' THEN '<align=center;font-weight=bold;color=blue>대기'  
                WHEN ORDER_STATUS = 'S' THEN '<align=center;font-weight=bold;color=red>진행'   
                WHEN ORDER_STATUS = 'C' THEN '<align=center;font-weight=bold;background-color=green>완료' 
           END                                                                                 "진행상태"
        ,  D.MEM_ID                                                                            "팀원ID"
        ,  ( SELECT EMP_NAME                                                                   
             FROM   TB_EMP WITH (NOLOCK)                                                       
             WHERE  EMP_ID = D.MEM_ID                                                          
        )                                                                                      "팀원명"
        ,  D.[DESC]                                                                            "비고"
        ,  ( SELECT EMP_NAME                                                                   
             FROM   TB_EMP WITH (NOLOCK)                                             
             WHERE  EMP_ID = D.CREATE_BY                                                       
        )                                                                                      "작성자"
        ,  D.CREATE_DTTM                                                                       "작성일시"
        ,  ( SELECT EMP_NAME                                                                   
             FROM   TB_EMP WITH (NOLOCK)                                                       
             WHERE  EMP_ID = D.SAVE_BY                                                         
        )                                                                                      "수정자"
        ,  D.SAVE_DTTM                                                                         "수정일시"
    FROM UTB_EX_PROJECT_HEADER H WITH (NOLOCK)
    JOIN UTB_EX_PROJECT_DETAIL D WITH (NOLOCK) ON H.PROJECT_ID = D.PROJECT_ID
    WHERE H.ORDER_DATE BETWEEN @START AND @END
      AND ( ISNULL(@PROJECT_ID, '*') = '*' OR H.PROJECT_ID LIKE '%'+@PROJECT_ID+'%' )
      AND ( ISNULL(@PROJECT_NAME, '*') = '*' OR H.PROJECT_NAME LIKE '%'+@PROJECT_NAME+'%' )
      AND ( ISNULL(@ORDER_STATUS, '*') = '*' OR H.ORDER_STATUS = @ORDER_STATUS )
      AND ( ISNULL(@MEM_ID, '*') = '*' OR D.MEM_ID = @MEM_ID )

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_all_merge_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_all_merge_L]
    @PROJECT_ID   VARCHAR(20)
  , @PROJECT_NAME VARCHAR(60)
  , @P_TERM       VARCHAR(20)
  , @START_DATE   VARCHAR(20)
  , @END_DATE     VARCHAR(20)
  , @ORDER_STATUS VARCHAR(20)
  , @MEM_ID       VARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    DECLARE @START VARCHAR(20);
    DECLARE @END VARCHAR(20);

    SET @START = '19000101';
    SET @END = CONVERT(VARCHAR, CAST(@END_DATE AS DATETIME) + 1, 112);
    SET @START = CASE @P_TERM WHEN 0 THEN @START_DATE 
                              WHEN 1 THEN CONVERT(VARCHAR, GETDATE(), 112) 
                              WHEN 7 THEN CONVERT(VARCHAR, GETDATE() - 6, 112)
                END;

    IF((@PROJECT_ID IS NOT NULL))
    BEGIN
        SET @START = '19000101';
    END;

    SELECT '@@Header1'
        , '!!프로젝트번호'
        , '<tool_tip=dddddddd>프로젝트명'
        , '일자정보'
        , '일자정보'
        , '일자정보'
        , '진행상태'
        , '금액(단위:만원)'
        , '팀원ID'
        , '팀원명'
        , '비고'
        , '작성자'
        , '작성일시'
        , '수정자'
        , '수정일시'
        , '비고'
        , '작성자'
        , '작성일시'
        , '수정자'
        , '수정일시'
        , '@@KEY';
    
    SELECT '@@Header2'
        , '프로젝트번호'
        , '프로젝트명'
        , '프로젝트등록일'
        , '프로젝트 시작일'
        , '프로젝트 종료일'
        , '진행상태'
        , '금액(단위:만원)'
        , '팀원ID'
        , '팀원명'
        , '비고'
        , '작성자'
        , '작성일시'
        , '수정자'
        , '수정일시'
        , '비고'
        , '작성자'
        , '작성일시'
        , '수정자'
        , '수정일시'
        , '@@KEY';
         
    SELECT '@@LIST'
        , H.PROJECT_ID                                                                          "PROJECT_ID"
        , H.PROJECT_NAME                                                                        "프로젝트명"
        , H.ORDER_DATE                                                                          "프로젝트 등록일"
        , H.START_DATE                                                                          "프로젝트 시작일"
        , H.END_DATE                                                                            "프로젝트 종료일"
        , CASE WHEN ORDER_STATUS = 'R' THEN '<align=center;font-weight=bold;color=blue>대기' 
               WHEN ORDER_STATUS = 'S' THEN '<align=center;font-weight=bold;color=red>진행' 
               WHEN ORDER_STATUS = 'C' THEN '<align=center;font-weight=bold;color=green>완료'
          END                                                                                   "진행상태"
        , d.PRICE                                                                               "금액(단위:만원)"
        , D.MEM_ID                                                                              "팀원ID"
        , ( SELECT EMP_NAME
            FROM    TB_EMP WITH (NOLOCK)                                                        
            WHERE  EMP_ID = D.MEM_ID
          )                                                                                     "팀원명"
        , D.[DESC]                                                                              "비고"
        , ( SELECT EMP_NAME
            FROM   TB_EMP  WITH (NOLOCK)                                                        
            WHERE  EMP_ID = D.CREATE_BY
          )                                                                                     "작성자"
        , D.CREATE_DTTM                                                                         "작성일시"
        , ( SELECT EMP_NAME
            FROM   TB_EMP  WITH (NOLOCK)                                                        
            WHERE  EMP_ID = D.SAVE_BY
          )                                                                                     "수정자"
        , D.SAVE_DTTM                                                                           "수정일시"
        , D.[DESC]                                                                              "비고"
        , ( SELECT EMP_NAME
            FROM   TB_EMP  WITH (NOLOCK)                                                        
            WHERE  EMP_ID = D.CREATE_BY
          )                                                                                     "작성자"
        , D.CREATE_DTTM                                                                         "작성일시"
        , ( SELECT EMP_NAME
            FROM   TB_EMP  WITH (NOLOCK)                                                        
            WHERE  EMP_ID = D.SAVE_BY
          )                                                                                     "수정자"
        , D.SAVE_DTTM                                                                           "수정일시"
        , D.ROW_STAMP                                                                           "@@KEY"
    FROM UTB_EX_PROJECT_HEADER H WITH (NOLOCK)
    JOIN UTB_EX_PROJECT_DETAIL D WITH (NOLOCK) ON H.PROJECT_ID = D.PROJECT_ID
    WHERE H.ORDER_DATE BETWEEN @START AND @END
      AND ( ISNULL(@PROJECT_ID, '*') = '*' OR H.PROJECT_ID LIKE '%'+@PROJECT_ID+'%' )
      AND ( ISNULL(@PROJECT_NAME, '*') = '*' OR H.PROJECT_NAME LIKE '%'+@PROJECT_NAME+'%' )
      AND ( ISNULL(@ORDER_STATUS, '*') = '*' OR H.ORDER_STATUS = @ORDER_STATUS )
      AND ( ISNULL(@MEM_ID, '*') = '*' OR D.MEM_ID = @MEM_ID )
    
    SELECT '@@sum'
        , ''
        , ''
        , ''
        , ''
        , ''
        , ''
        , '<sum>'
        , ''
        , ''
        , ''
        , ''
        , ''
        , ''
        , ''
        , ''
        , ''
        , ''
        , ''
        , ''
        , '';

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_all_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_all_S]
    @P_KEY       VARCHAR(20) --@@key
  , @P_DELIMITER VARCHAR(20) --구분자    
  , @P_VALUES    VARCHAR(8000) --입력받은값 ~~~
  , @P_SAVEBY    VARCHAR(20)   --사용자아이디
AS
BEGIN
SET NOCOUNT ON;

    --PARSING VALUE STRING ..............................................
    DECLARE @TBL TABLE(
          IDX   INT
        , VDATA VARCHAR(255)
    );

    INSERT INTO @TBL
    SELECT *
    FROM dbo.fn_getValues (@P_DELIMITER, @P_VALUES);

    --.................................................................
    --DECLARE @MSG VARCHAR(2000);
    --SET @MSG = '1. @P_KEY(키값) :  ' + @P_KEY +
    --           '\n2. @P_DELIMITER(구분자) :  ' + @P_DELIMITER +
    --           '\n3. @P_VALUES(전달값) :  ' + @P_VALUES +
    --           '\n5. @P_SAVEBY(수정자) :  ' + @P_SAVEBY 
    --BEGIN 
    --RAISERROR(@MSG, 16,1)
    --RETURN 0; 
    --END 

    DECLARE @PROJECT_ID AS VARCHAR(255);
    DECLARE @PROJECT_NAME AS VARCHAR(255);
    DECLARE @ORDER_DATE AS VARCHAR(255);
    DECLARE @MEM_ID AS VARCHAR(255);
    DECLARE @DESC AS VARCHAR(255);

    ;SET @PROJECT_ID   = ( SELECT VDATA FROM @TBL WHERE IDX = 1 )
    ;SET @PROJECT_NAME = ( SELECT VDATA FROM @TBL WHERE IDX = 2 )
    ;SET @ORDER_DATE   = ( SELECT VDATA FROM @TBL WHERE IDX = 3 )
    ;SET @MEM_ID       = ( SELECT VDATA FROM @TBL WHERE IDX = 4 )
    ;SET @DESC         = ( SELECT VDATA FROM @TBL WHERE IDX = 5 )
    
    ;DECLARE @CNT INT

    SELECT @CNT = COUNT(*)
    FROM UTB_EX_PROJECT_DETAIL WITH (NOLOCK)
    WHERE PROJECT_ID = @PROJECT_ID;

    IF ISNULL(@P_KEY, ' ') = ' '
    BEGIN
        IF(@CNT = 0)
        BEGIN
            INSERT INTO UTB_EX_PROJECT_HEADER (
                  PROJECT_ID
                , PROJECT_NAME
                , ORDER_DATE
                , ORDER_STATUS
                , CREATE_DTTM
                , CREATE_BY
                , SAVE_DTTM
                , SAVE_BY 
            )
            SELECT @PROJECT_ID
                , @PROJECT_NAME
                , @ORDER_DATE
                , 'R'
                , GETDATE()
                , @P_SAVEBY
                , GETDATE()
                , @P_SAVEBY
                ;
        END;
        INSERT INTO UTB_EX_PROJECT_DETAIL (
              PROJECT_ID
            , MEM_ID
            , [DESC]
            , CREATE_DTTM
            , CREATE_BY
            , SAVE_DTTM
            , SAVE_BY 
        )
        SELECT @PROJECT_ID
            ,  @MEM_ID
            ,  @DESC
            ,  GETDATE()
            ,  @P_SAVEBY
            ,  GETDATE()
            ,  @P_SAVEBY
            ;
    END;
    ELSE
    BEGIN
        UPDATE UTB_EX_PROJECT_DETAIL
        SET MEM_ID = @MEM_ID
          , [DESC] = @DESC
          , SAVE_DTTM = GETDATE()
          , SAVE_BY = @P_SAVEBY
        WHERE ROW_STAMP = @P_KEY;
    END;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_chart_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_chart_L]
    @P_PROJECT_NAME VARCHAR(255)
AS
BEGIN
SET NOCOUNT ON;
	--비교대상(프로젝트 이름) | 값1 | 값2 | 값3
    --SELECT TOP 5
	    
    --    H.PROJECT_NAME "프로젝트명"
    --    , 100000         "<line>aaa"
    --    , 900000         "<pie>aaa"
    --    , CASE WHEN H.PROJECT_NAME != 'PLAKOR' THEN '500000'
    --                                           ELSE 'X'
    --           END     "투입인원",
    --  '프로젝트 인원' "<title>"
    --    --100000000 "<line-right>",
    --    --COUNT(d.mem_id) "<line>"
    --FROM UTB_EX_PROJECT_HEADER H WITH (NOLOCK)
    --JOIN UTB_EX_PROJECT_DETAIL D WITH (NOLOCK) ON H.PROJECT_ID = D.PROJECT_ID
    --WHERE ( ISNULL(@P_PROJECT_NAME,'*') = '*' OR H.PROJECT_NAME LIKE @P_PROJECT_NAME + '%' )
    --GROUP BY H.PROJECT_ID
    --    , H.PROJECT_NAME
    --    , H.ORDER_STATUS;


	SELECT TOP 5
	    
        H.PROJECT_NAME "프로젝트명"
        , 100000         "<pie>aaa"
        ,
      '프로젝트 인원' "<title>"
        --100000000 "<line-right>",
        --COUNT(d.mem_id) "<line>"
    FROM UTB_EX_PROJECT_HEADER H WITH (NOLOCK)
    JOIN UTB_EX_PROJECT_DETAIL D WITH (NOLOCK) ON H.PROJECT_ID = D.PROJECT_ID
    WHERE ( ISNULL(@P_PROJECT_NAME,'*') = '*' OR H.PROJECT_NAME LIKE @P_PROJECT_NAME + '%' )
    GROUP BY H.PROJECT_ID
        , H.PROJECT_NAME
        , H.ORDER_STATUS;




SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_emp_info_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[USP_TRAINING_emp_info_L]
    @emp_id VARCHAR(20)  --link 버튼에 key 값 
AS
BEGIN
SET NOCOUNT ON;

    SELECT A.emp_id                                                                               "사원번호"
        ,  A.emp_name                                                                             "이름"
        ,  ( SELECT value2 FROM tb_code (NOLOCK) WHERE group_id = 'AUTH' AND value1 = A.AUTH_ID ) "권한그룹"
        ,  ( SELECT DEPT_NAME FROM tb_dept (NOLOCK) WHERE DEPT_ID = A.DEPT_ID )                   "부서"
        ,  '<align=center>' + (CASE A.IS_ADMIN WHEN 0 THEN 'X' ELSE 'O' END)                      "관리자"
        ,  '<align=center>' + (CASE A.valid    WHEN 0 THEN 'X' ELSE 'O' END)                      "사용여부"
        ,  CONVERT(NVARCHAR, A.save_dttm, 120)                                                    "저장일시"
        ,  ( SELECT emp_name FROM tb_emp WITH (NOLOCK) WHERE emp_id = a.save_by )                 "입력자"
    FROM TB_EMP (NOLOCK) A
    WHERE A.EMP_ID = @emp_id;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_grid_test_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_grid_test_L]
    @emp_id VARCHAR(20) = NULL--중간집계영역에서 @@PARAM으로 받은값 
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
'<tag>  
                  <a class="link_btn" href="#.html"  
                   onclick="javascript:showPopupWindow(500,500,''../common/dataview.aspx?SQL=USP_TRAINING_project_info_L&KEYS='+d.project_id+''',''프로젝트정보'',true)" >'+d.PROJECT_ID+'<a/>' "<text-align=center>프로젝트번호"
, H.PROJECT_NAME                                                                                                                                                                          "프로젝트명"
, '<tag>  
                  <a class="link_btn" href="#.html"  
                   onclick="javascript:showPopupWindow(500,500,''../common/dataview.aspx?SQL=USP_TRAINING_emp_info_L&KEYS='+d.MEM_ID+''',''사원정보'',true)" >'+d.MEM_ID+'<a/>'               "<text-align=center>팀원ID"
, (
   SELECT
          EMP_NAME
   FROM    TB_EMP
   WHERE  EMP_ID = D.MEM_ID
                )                                                                                                                                                                         "팀원명"
, [DESC]                                                                                                                                                                                  "비고"
, (
   SELECT
          EMP_NAME
   FROM   TB_EMP
   WHERE  EMP_ID = D.CREATE_BY
                )                                                                                                                                                                         "작성자"
, d.CREATE_DTTM                                                                                                                                                                           "작성일시"
, (
   SELECT
          EMP_NAME
   FROM   TB_EMP
   WHERE  EMP_ID = D.SAVE_BY
                )                                                                                                                                                                         "수정자"
, d.SAVE_DTTM                                                                                                                                                                             "수정일시"
         FROM UTB_EX_PROJECT_DETAIL D
         JOIN UTB_EX_PROJECT_HEADER H ON d.PROJECT_ID = h.PROJECT_ID
         WHERE MEM_ID = @emp_id;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_grid_test02_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[USP_TRAINING_grid_test02_L]
    @emp_id VARCHAR(20) = NULL--중간집계영역에서 @@PARAM으로 받은값 
AS
BEGIN
SET NOCOUNT ON;

    SELECT d.project_id AS                                                                                                                                                              "@@MENUPARAM"
        , d.project_id+';'+h.PROJECT_NAME+';0;20161221;20161228;*' AS                                                                                                                   "@@MENUPARAM"
        , d.MEM_ID AS                                                                                                                                                                   "@@MENUPARAM"
        , '<tag><a class="link_btn" href="#.html"  
           onclick="javascript:showPopupWindow(500,500,''../common/dataview.aspx?SQL=USP_TRAINING_project_info_L&KEYS='+d.project_id+''',''프로젝트정보'',true)" >'+d.PROJECT_ID+'<a/>' "<text-align=center>프로젝트번호"
        , H.PROJECT_NAME                                                                                                                                                                "프로젝트명"
        , '<tag><a class="link_btn" href="#.html"  
           onclick="javascript:showPopupWindow(500,500,''../common/dataview.aspx?SQL=USP_TRAINING_emp_info_L&KEYS='+d.MEM_ID+''',''사원정보'',true)" >'+d.MEM_ID+'<a/>'                 "<text-align=center>팀원ID"
        , ( SELECT EMP_NAME FROM TB_EMP WITH (NOLOCK) WHERE EMP_ID = D.MEM_ID )                                                                                                         "팀원명" 
        , [DESC]                                                                                                                                                                        "비고"
        , ( SELECT EMP_NAME FROM TB_EMP WITH (NOLOCK) WHERE EMP_ID = D.CREATE_BY )                                                                                                      "작성자"
        , d.CREATE_DTTM                                                                                                                                                                 "작성일시"
        , ( SELECT EMP_NAME FROM TB_EMP WITH (NOLOCK) WHERE EMP_ID = D.SAVE_BY )                                                                                                        "수정자"
        , d.SAVE_DTTM                                                                                                                                                                   "수정일시"
    FROM UTB_EX_PROJECT_DETAIL D WITH (NOLOCK)
    JOIN UTB_EX_PROJECT_HEADER H WITH (NOLOCK) ON d.PROJECT_ID = h.PROJECT_ID
    WHERE MEM_ID = @emp_id;
    
SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_linked_chart_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_linked_chart_L]
    @P_PROJECT_NAME VARCHAR(255)
AS
BEGIN
SET NOCOUNT ON;

    SELECT
        '투입인원'          "@@투입인원" --그리드조회  
        , ISNULL([01], 0) "1월" --그리드조회  
        , ISNULL([02], 0) "2월" --그리드조회  
        , ISNULL([03], 0) "3월" --차트조회  
        , ISNULL([04], 0) "4월" --차트조회  
        , ISNULL([05], 0) "5월" --차트조회  
        , ISNULL([06], 0) "6월"
        , ISNULL([07], 0) "7월"
        , ISNULL([08], 0) "8월"
        , ISNULL([09], 0) "9월"
        , ISNULL([10], 0) "10월"
        , ISNULL([11], 0) "11월"
        , ISNULL([12], 0) "12월"
    FROM (
        SELECT
                SUBSTRING(ORDER_DATE, 5, 2) "DATE"
            , COUNT(PROJECT_ID)           "cnt"
        FROM   UTB_EX_PROJECT_HEADER WITH (NOLOCK) 
        WHERE  ( ISNULL(@P_PROJECT_NAME, '*') = '*' OR PROJECT_NAME LIKE @P_PROJECT_NAME + '%' )
        GROUP BY
                SUBSTRING(ORDER_DATE, 5, 2)
    ) AS a PIVOT(SUM(cnt) FOR date IN( [01]
                                    , [02]
                                    , [03]
                                    , [04]
                                    , [05]
                                    , [06]
                                    , [07]
                                    , [08]
                                    , [09]
                                    , [10]
                                    , [11]
                                    , [12])) AS PVT;
SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_message_btn_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_message_btn_S]
    @PROJECT_ID   VARCHAR(20)
  , @PROJECT_NAME VARCHAR(20)
  , @P_TERM       VARCHAR(20)
  , @START_DATE   VARCHAR(20)
  , @END_DATE     VARCHAR(20) --여기까지는 조회조건
  , @ORDER_STATUS VARCHAR(20)
  , @MEM_ID       VARCHAR(20)
  , @P_KEY        VARCHAR(2000) --@@KEY 또는 @@CHECK로 넘긴 파라미터
  , @P_SAVEBY     VARCHAR(20)   --수정자 
AS
BEGIN
SET NOCOUNT ON;

    DECLARE @MSG VARCHAR(255);
    SET @MSG = '선택한 값들의 key값 : '+@p_key;

    IF(@p_key = '''''')
    BEGIN
        RAISERROR('선택한 데이터가 없습니다.', 16, 1);
        RETURN 0;
    END;
    ELSE
    BEGIN
        RAISERROR(@MSG, 16, 1);
        RETURN 0;
    END;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_D]
    @p_rowstamp  NVARCHAR(20)
  , @p_delimiter NVARCHAR(20)
  , @p_values    NVARCHAR(4000)
  , @p_saveby    NVARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    DELETE FROM tb_ticket_res
    WHERE ticket_res_id = @p_rowstamp;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_dd_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_dd_L]
    @p_work_date     NVARCHAR(20)
  , @p_proc_group_id NVARCHAR(20)
  , @p_proc          NVARCHAR(20)
  , @p_work_hour     NVARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    SELECT RES.WORK_SHOP_ID '작업장'
        , SUM(CASE WHEN SUBSTRING(CONVERT(VARCHAR(20), RES.START_DTTM, 120), 15, 1) = '0' THEN RES.GOOD_QTY ELSE 0 END) '0분'
        , SUM(CASE WHEN SUBSTRING(CONVERT(VARCHAR(20), RES.START_DTTM, 120), 15, 1) = '1' THEN RES.GOOD_QTY ELSE 0 END) '10분'
        , SUM(CASE WHEN SUBSTRING(CONVERT(VARCHAR(20), RES.START_DTTM, 120), 15, 1) = '2' THEN RES.GOOD_QTY ELSE 0 END) '20분'
        , SUM(CASE WHEN SUBSTRING(CONVERT(VARCHAR(20), RES.START_DTTM, 120), 15, 1) = '3' THEN RES.GOOD_QTY ELSE 0 END) '30분'
        , SUM(CASE WHEN SUBSTRING(CONVERT(VARCHAR(20), RES.START_DTTM, 120), 15, 1) = '4' THEN RES.GOOD_QTY ELSE 0 END) '40분'
        , SUM(CASE WHEN SUBSTRING(CONVERT(VARCHAR(20), RES.START_DTTM, 120), 15, 1) = '5' THEN RES.GOOD_QTY ELSE 0 END) '50분'
        --SUM(CASE WHEN SUBSTRING(CONVERT(VARCHAR(20), START_DTTM,120),15,2) ='06' THEN GOOD_QTY ELSE 0 END) '6분',
        --SUM(CASE WHEN SUBSTRING(CONVERT(VARCHAR(20), START_DTTM,120),15,2) ='07' THEN GOOD_QTY ELSE 0 END) '7분',
        --SUM(CASE WHEN SUBSTRING(CONVERT(VARCHAR(20), START_DTTM,120),15,2) ='08' THEN GOOD_QTY ELSE 0 END) '8분',
        --SUM(CASE WHEN SUBSTRING(CONVERT(VARCHAR(20), START_DTTM,120),15,2) ='09' THEN GOOD_QTY ELSE 0 END) '9분',
        --SUM(CASE WHEN SUBSTRING(CONVERT(VARCHAR(20), START_DTTM,120),15,2) ='10' THEN GOOD_QTY ELSE 0 END) '10분'
    FROM UTB_TICKET_RES RES WITH (NOLOCK)
    WHERE RES.WORK_DATE = @P_WORK_DATE
      AND DATEPART(HH, RES.START_DTTM) = @P_WORK_HOUR
    GROUP BY RES.WORK_SHOP_ID, RES.WORK_DATE;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_res_list_btn_D]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_res_list_btn_D]
    @p_part_id   NVARCHAR(20)
  , @p_work_date NVARCHAR(20)
  , @p_key       NVARCHAR(MAX)
  , @p_saveby    NVARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;

--parsing value string ..............................................
         DECLARE @tbl TABLE(
             idx   INT
           , vData VARCHAR(255));
         DECLARE @TMPSTR VARCHAR(MAX);
         SET @TMPSTR = REPLACE(@P_KEY, '''', '');
         INSERT INTO @tbl
         SELECT
                *
         FROM   dbo.fn_getValues (',', @TMPSTR);
--.................................................................
         DELETE TB_TICKET_RES
         WHERE
               TICKET_RES_ID IN(SELECT
                                       vdata
                                FROM   @tbl
                                WHERE  vData <> '');
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_res_list_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_res_list_L]
    @p_work_date     NVARCHAR(20)
  , @p_proc_group_id NVARCHAR(20)
  , @p_proc          NVARCHAR(20)
  , @p_work_shop     NVARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    SELECT -- APPLY DB
          @p_work_shop                                           "@@WORK_SHOP"
        , p.PART_ID                                              "@@PART_ID"
        , DBO.fn_NumFormat (TR.GOOD_QTY)                         "@@RES_QTY"
        , @p_work_date                                           "@@WORK_DATE"
        , CONVERT(NVARCHAR, TR.START_DTTM, 8)                    "@@START_DATE"
        , CONVERT(NVARCHAR, TR.END_DTTM, 8)                      "@@END_DATE"
        , TR.EMP_ID                                              "@@EMP_ID"
        , TR.TICKET_RES_ID                                       "@@KEY"
        , @p_proc+';'+CAST(TR.TICKET_RES_ID AS NVARCHAR)         "@@PARAM"
        -- USER VIEW
        , '<tag>'+ p.PART_ID + '<br/>'+P.PART_NAME               생산제품
        , '<align=right>'  + DBO.fn_NumFormat (TR.GOOD_QTY)      실적수량
        , '<align=center>' + CONVERT(NVARCHAR, TR.START_DTTM, 8) 시작
        , '<align=center>' + CONVERT(NVARCHAR, TR.END_DTTM, 8)   종료
        , '<align=center>' + (SELECT EMP_NAME FROM TB_EMP WITH (NOLOCK) WHERE EMP_ID = TR.EMP_ID ) 작업자
    FROM UTB_TICKET_RES TR WITH (nolock)
    JOIN UTB_PART P WITH (nolock) ON TR.PART_ID = P.PART_ID
    WHERE TR.WORK_DATE = @p_work_date
      AND TR.WORK_SHOP_ID = @p_work_shop
    ;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_res_list2_01_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_res_list2_01_L]
    @p_start_date NVARCHAR(20)
  , @p_end_date   NVARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    SELECT DISTINCT p.PART_ID+';'+tr.work_date "@@MENUPARAM"
         , tr.WORK_DATE                        "생산일자"
         , p.PART_ID                           "생산제품ID"
         , p.PART_NAME                         "생산제품명"
         , p.PART_ID+';'+tr.work_date          "@@PARAM"
    FROM UTB_TICKET_RES TR WITH (NOLOCK)
    JOIN UTB_PART P WITH (NOLOCK) ON TR.PART_ID = P.PART_ID
    WHERE TR.WORK_DATE BETWEEN @p_start_date AND @p_end_date;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_res_list2_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_res_list2_L]
    @p_start_date NVARCHAR(20)
  , @p_end_date   NVARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    SELECT DISTINCT
          tr.WORK_DATE                   "생산일자"
        , p.PART_ID                      "생산제품ID"
        , p.PART_NAME                    "생산제품명"
        , p.PART_ID + ';' + tr.work_date "@@PARAM"
    FROM UTB_TICKET_RES TR WITH (NOLOCK)
    JOIN UTB_PART P WITH (NOLOCK) ON TR.PART_ID = P.PART_ID
    WHERE TR.WORK_DATE BETWEEN @p_start_date AND @p_end_date;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_res_list3_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_res_list3_L]
    @p_part_id   NVARCHAR(20) = NULL
  , @p_work_date NVARCHAR(20) = NULL
AS
BEGIN
SET NOCOUNT ON;

    SELECT p.PART_ID                                                                        "생산제품ID"
        ,  p.PART_NAME                                                                      "생산제품명"
        ,  tr.work_shop_id                                                                  "!!작업장코드"
        ,  ( SELECT WORK_SHOP_NAME FROM Utb_work_shop WHERE work_shop_id = tr.work_shop_id ) 작업장명
        ,  '<align=right>'+DBO.fn_NumFormat (TR.GOOD_QTY)                                   실적수량
        ,  '<align=center>'+CONVERT(NVARCHAR, TR.START_DTTM, 8)                             시작
        ,  '<align=center>'+CONVERT(NVARCHAR, TR.END_DTTM, 8)                               종료
        ,  TR.EMP_ID                                                                        "@@EMP_ID"
        ,  '<align=center>'+ ( SELECT EMP_NAME FROM TB_EMP WHERE  EMP_ID = TR.EMP_ID )      작업자
        ,  tr.TICKET_RES_ID                                                                 "@@KEY"
    FROM UTB_TICKET_RES TR WITH (nolock)
    JOIN UTB_PART P WITH (nolock) ON TR.PART_ID = P.PART_ID
    WHERE tr.WORK_DATE = @p_work_date
      AND ( ISNULL(@p_part_id,'*') = '*' OR TR.PART_ID = @p_part_id )
    ;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[USP_TRAINING_PROD_edit_ticket_res_03_S]
    @p_ticket_res_id NVARCHAR(20)
  , @p_delimiter     NVARCHAR(20)
  , @p_values        NVARCHAR(4000)
  , @p_saveby        NVARCHAR(20)
AS
BEGIN
SET NOCOUNT ON;

    -- parsing value string ..............................................
    DECLARE @tbl TABLE(
        idx   INT
    , vData NVARCHAR(255));
    INSERT INTO @tbl
    SELECT
        *
    FROM   dbo.fn_getValues (@p_delimiter, @p_values);

    --.................................................................
    DECLARE @work_shop_id   NVARCHAR(255);
    DECLARE @work_ticket_id NVARCHAR(255);
    DECLARE @good_qty       NVARCHAR(255);
    DECLARE @work_date      NVARCHAR(255);
    DECLARE @start_time     NVARCHAR(255);
    DECLARE @end_time       NVARCHAR(255);
    DECLARE @emp_id         NVARCHAR(255);
    DECLARE @part_id        NVARCHAR(255);
    
    SET @work_shop_id = ( SELECT vData FROM @tbl WHERE idx = 1 );
    SET @part_id      = ( SELECT vData FROM @tbl WHERE idx = 2 );
    SET @good_qty     = ( SELECT vData FROM @tbl WHERE idx = 3 );
    SET @work_date    = ( SELECT vData FROM @tbl WHERE idx = 4 );
    SET @start_time   = ( SELECT vData FROM @tbl WHERE idx = 5 );
    SET @end_time     = ( SELECT vData FROM @tbl WHERE idx = 6 );
    SET @emp_id       = ( SELECT vData FROM @tbl WHERE idx = 7 );

    IF ISNUMERIC(@good_qty) = 0
    BEGIN
        RAISERROR('양품수량이 숫자형식이 아닙니다.', 16, 1);
        RETURN 0;
    END;

    --실적수량
    IF ISNULL(@p_ticket_res_id, ' ') = ' '
    BEGIN
        INSERT INTO UTB_TICKET_RES (
              WORK_TICKET_ID
            , TICKET_RES_ID
            , part_id
            , WORK_SHOP_ID
            , START_DTTM
            , END_DTTM
            , EMP_ID
            , GOOD_QTY
            , WORK_DATE
            , SAVE_BY
            , CREATE_DTTM
            , SAVE_DTTM
            , create_by 
        )
        SELECT ''
            ,  ''
            ,  @part_id
            ,  @work_shop_id
            ,  @work_date+' '+@start_time
            ,  @work_date+' '+@end_time
            ,  @emp_id
            ,  @good_qty
            ,  @work_date
            ,  @p_saveby
            ,  ''
            ,  ''
            ,  @p_saveby;

        SET @p_ticket_res_id = @@IDENTITY;

    END;
    ELSE
    BEGIN
        UPDATE UTB_TICKET_RES
        SET part_id = @part_id
          , WORK_SHOP_ID = @work_shop_id
          , START_DTTM = @work_date+' '+@start_time
          , END_DTTM = @work_date+' '+@end_time
          , EMP_ID = @emp_id
          , GOOD_QTY = @good_qty
          , WORK_DATE = @work_date
        WHERE TICKET_RES_ID = @p_ticket_res_id;
    END;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_project_detail_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_project_detail_L]
    @P_PROJECT_ID VARCHAR(20)  --@@PARAM으로 받은값 
AS
BEGIN
SET NOCOUNT ON;

    SELECT PROJECT_ID                    "프로젝트번호"
        ,  MEM_ID                        "팀원ID"
        ,  ( SELECT EMP_NAME
             FROM   TB_EMP WITH (NOLOCK) 
             WHERE  EMP_ID = D.MEM_ID
           )                             "팀원명"
        ,  [DESC]                        "비고"
        ,  ( SELECT EMP_NAME
             FROM   TB_EMP WITH (NOLOCK) 
             WHERE  EMP_ID = D.CREATE_BY
           )                             "작성자"
        ,  CREATE_DTTM                   "작성일시"
        ,  ( SELECT EMP_NAME
             FROM   TB_EMP WITH (NOLOCK) 
             WHERE  EMP_ID = D.SAVE_BY
           )                             "수정자"
        ,  SAVE_DTTM                     "수정일시"
    FROM UTB_EX_PROJECT_DETAIL D WITH (NOLOCK) 
    WHERE PROJECT_ID = @P_PROJECT_ID;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_project_header_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/
CREATE PROCEDURE [dbo].[USP_TRAINING_project_header_L]
    @PROJECT_ID   VARCHAR(20)
  , @PROJECT_NAME VARCHAR(20)
  , @P_TERM       VARCHAR(20)
  , @START_DATE   VARCHAR(20)
  , @END_DATE     VARCHAR(20)
  , @ORDER_STATUS VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @START VARCHAR(20);
    DECLARE @END VARCHAR(20);
    SET @START = '19000101';
    SET @END = CONVERT(VARCHAR, CAST(@END_DATE AS DATETIME) + 1, 112);
    SET @START = CASE @P_TERM WHEN 0 THEN @START_DATE 
                              WHEN 1 THEN CONVERT(VARCHAR, GETDATE(), 112) 
                              WHEN 7 THEN CONVERT(VARCHAR, GETDATE() - 6, 112)
                 END;

    IF((@PROJECT_ID IS NOT NULL))
    BEGIN
        SET @PROJECT_NAME = NULL;
        SET @START = '19000101';
    END;

    SELECT PROJECT_ID                                                                          "프로젝트번호"
        ,  PROJECT_NAME                                                                        "프로젝트명"
        ,  '<ALIGN=CENTER;>'+CONVERT(VARCHAR(10), CAST(H.ORDER_DATE AS DATE), 120)             "프로젝트 등록일"
        ,  '<date=F>'+CAST( CAST(START_DATE AS DATETIME)  AS NVARCHAR(100))                                                                         "프로젝트 시작일"
        ,  END_DATE                                                                            "프로젝트 종료일"
        ,  CASE WHEN ORDER_STATUS = 'R' THEN '<align=center;font-weight=bold;color=blue>대기' 
                WHEN ORDER_STATUS = 'S' THEN '<align=center;font-weight=bold;color=red>진행' 
                WHEN ORDER_STATUS = 'C' THEN '<align=center;font-weight=bold;color=green>완료'
           END                                                                                 "진행상태"
        ,  ( SELECT EMP_NAME FROM TB_EMP WITH (NOLOCK) WHERE EMP_ID = H.CREATE_BY )            "작성자"
        ,  CREATE_DTTM                                                                         "작성일시"
        ,  ( SELECT EMP_NAME FROM TB_EMP WITH (NOLOCK) WHERE EMP_ID = H.SAVE_BY )              "수정자" 
        ,  SAVE_DTTM                                                                           "수정일시"
        ,  PROJECT_ID                                                                          "KEY"
        , CASE WHEN ORDER_STATUS = 'C' THEN NULL ELSE PROJECT_ID END                           "@@KEY" --키값과 체크박스로 넘길값이 다를 경우 @@CHECK 로 표시         
        , PROJECT_ID                                                                           "@@PARAM"  --링크드 그리드뷰에 넘길값 
    FROM UTB_EX_PROJECT_HEADER H
    WHERE H.ORDER_DATE BETWEEN @START AND @END
      AND ( ISNULL(@PROJECT_ID, '*') = '*' OR H.PROJECT_ID LIKE '%'+@PROJECT_ID+'%' )
      AND ( ISNULL(@PROJECT_NAME, '*') = '*' OR H.PROJECT_NAME LIKE '%'+@PROJECT_NAME+'%' )
      AND ( ISNULL(@ORDER_STATUS, '*') = '*' OR H.ORDER_STATUS = @ORDER_STATUS )

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_project_info_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 
******************************************************************/
CREATE PROCEDURE [dbo].[USP_TRAINING_project_info_L]
    @project_id     VARCHAR(20)  --link 버튼에 key 값 
AS
BEGIN
SET NOCOUNT ON;

    SELECT H.PROJECT_ID                                                                         "프로젝트번호"
         , H.PROJECT_NAME                                                                       "프로젝트명"
         , H.ORDER_DATE                                                                         "프로젝트 등록일"
         , H.START_DATE                                                                         "프로젝트 시작일"
         , H.END_DATE                                                                           "프로젝트 종료일"
         , CASE WHEN H.ORDER_STATUS = 'R' THEN '<align=center;font-weight=bold;color=blue>대기' 
                WHEN H.ORDER_STATUS = 'S' THEN '<align=center;font-weight=bold;color=red>진행' 
                WHEN H.ORDER_STATUS = 'C' THEN '<align=center;font-weight=bold;color=green>완료'
           END                                                                                  "진행상태"
         , ( SELECT EMP_NAME FROM TB_EMP WHERE  EMP_ID = H.CREATE_BY )                          "작성자"
         , H.CREATE_DTTM                                                                        "작성일시"
         , ( SELECT EMP_NAME FROM TB_EMP WHERE  EMP_ID = H.SAVE_BY )                            "수정자"
         , H.SAVE_DTTM                                                                          "수정일시"
    FROM UTB_EX_PROJECT_HEADER H WITH (NOLOCK)
    WHERE h.PROJECT_ID = @project_id;

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_project_status_btn_end_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_project_status_btn_end_S]
    @PROJECT_ID   VARCHAR(20)
  , @PROJECT_NAME VARCHAR(20)
  , @P_TERM       VARCHAR(20)
  , @START_DATE   VARCHAR(20)
  , @END_DATE     VARCHAR(20) --여기까지는 조회조건
  , @ORDER_STATUS VARCHAR(20)
  , @P_KEY        VARCHAR(2000) --@@KEY 또는 @@CHECK로 넘긴 파라미터
  , @P_SAVEBY     VARCHAR(20)   --수정자 
AS
BEGIN
SET NOCOUNT ON;

    --parsing value string ..............................................
    DECLARE @tbl TABLE(
          idx   INT
        , vData VARCHAR(255)
    );

    DECLARE @TMPSTR VARCHAR(MAX);
    SET @TMPSTR = REPLACE(@P_KEY, '''', '');
    
    INSERT INTO @tbl
    SELECT *
    FROM dbo.fn_getValues (',', @TMPSTR);

    --.................................................................
    --DECLARE @MSG VARCHAR(2000);
    --SET @MSG =     '1. @PROJECT_ID(조회조건) :  ' + @PROJECT_ID +
    --            '\n2. @PROJECT_NAME(조회조건) :  ' + @PROJECT_NAME +
    --            '\n3. @P_TERM(조회조건) :  ' + @P_TERM +
    --            '\n4. @START_DATE(조회조건) :  ' + @START_DATE +
    --            '\n5. @END_DATE(조회조건) :  ' + @END_DATE +
    --            '\n6. @ORDER_STATUS(조회조건) :  ' + @ORDER_STATUS +
    --            '\n7. @P_KEY(키값) :  ' + @P_KEY +
    --            '\n8. @P_SAVEBY(수정자) :  ' + @P_SAVEBY 
    --BEGIN 
    --RAISERROR(@MSG, 16,1)
    --RETURN 0; 
    --END 

    DECLARE @PROJECT_HEADER TABLE (
          IDX           INT IDENTITY
        , PROJECT_ID   VARCHAR(20)
        , ORDER_STATUS  VARCHAR(6)
    )

    INSERT INTO @PROJECT_HEADER (
          PROJECT_ID 
        , ORDER_STATUS 
    )
    SELECT H.PROJECT_ID
        ,  H.ORDER_STATUS
    FROM   UTB_EX_PROJECT_HEADER H
    INNER JOIN @TBL V ON ( H.PROJECT_ID = V.VDATA )
    WHERE  V.VDATA <> ''

    DECLARE @ROW INT 
    DECLARE @MAXROW INT 
    DECLARE @C_PROJECT_ID AS VARCHAR(255);
    DECLARE @C_ORDER_STATUS AS VARCHAR(20);

    SET @ROW = 1
    SELECT @MAXROW = MAX(A.IDX) FROM @PROJECT_HEADER A

    WHILE ( @ROW <= @MAXROW )
    BEGIN
        SELECT @C_PROJECT_ID   = A.PROJECT_ID
            ,  @C_ORDER_STATUS = A.ORDER_STATUS
        FROM @PROJECT_HEADER A WHERE A.IDX = @ROW
        
        IF (@C_ORDER_STATUS = 'C')
        BEGIN
            RAISERROR('완료된 프로젝트 입니다.', 16, 1);
            RETURN 0;
        END;
        ELSE IF(@C_ORDER_STATUS = 'R')
        BEGIN
            RAISERROR('대기중인 프로젝트 입니다.', 16, 1);
            RETURN 0;
        END;
        BEGIN
            UPDATE UTB_EX_PROJECT_HEADER
            SET ORDER_STATUS = 'C'
              , END_DATE = CONVERT(VARCHAR(20), GETDATE(), 112)
              , SAVE_DTTM = GETDATE()
              , SAVE_BY = @P_SAVEBY
            WHERE PROJECT_ID = @C_PROJECT_ID;
        END;

        SET @ROW = @ROW + 1
    END

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_project_status_btn_start_S]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_project_status_btn_start_S]
    @PROJECT_ID   VARCHAR(20)
  , @PROJECT_NAME VARCHAR(20)
  , @P_TERM       VARCHAR(20)
  , @START_DATE   VARCHAR(20)
  , @END_DATE     VARCHAR(20)
  , @ORDER_STATUS VARCHAR(20) --여기까지는 조회조건
  , @P_KEY        VARCHAR(2000) --@@KEY 또는 @@CHECK로 넘긴 파라미터 ''1'',''2'',''3'',''4'
  , @P_SAVEBY     VARCHAR(20)   --수정자 
AS
BEGIN
SET NOCOUNT ON;

    --parsing value string ..............................................
    DECLARE @tbl TABLE(
          idx   INT
        , vData VARCHAR(255));

    DECLARE @TMPSTR VARCHAR(MAX);
    SET @TMPSTR = REPLACE(@P_KEY, '''', '');
    
    INSERT INTO @tbl
    SELECT *
    FROM dbo.fn_getValues (',', @TMPSTR);

    --.................................................................
    --DECLARE @MSG VARCHAR(2000);
    --SET @MSG = '1. @PROJECT_ID(조회조건) :  '+@PROJECT_ID+'\n2. @PROJECT_NAME(조회조건) :  '+@PROJECT_NAME+'\n3. @P_TERM(조회조건) :  '+@P_TERM+'\n4. @START_DATE(조회조건) :  '+@START_DATE+'\n5. @END_DATE(조회조건) :  '+@END_DATE+'\n6. @ORDER_STATUS(조회조건) :  '+@ORDER_STATUS+'\n7. @P_KEY(키값) :  '+@P_KEY+'\n8. @P_SAVEBY(수정자) :  '+@P_SAVEBY;
    --BEGIN
    --    RAISERROR(@MSG, 16, 1);
    --    RETURN 0; 
    --END;

    
    DECLARE @PROJECT_HEADER TABLE (
          IDX           INT IDENTITY
        , PROJECT_ID   VARCHAR(20)
        , ORDER_STATUS  VARCHAR(6)
    )

    INSERT INTO @PROJECT_HEADER (
          PROJECT_ID 
        , ORDER_STATUS 
    )
    SELECT H.PROJECT_ID
        ,  H.ORDER_STATUS
    FROM UTB_EX_PROJECT_HEADER H
    INNER JOIN @TBL V ON ( H.PROJECT_ID = V.VDATA )
    WHERE  V.VDATA <> ''

    DECLARE @ROW INT 
    DECLARE @MAXROW INT 
    DECLARE @C_PROJECT_ID AS VARCHAR(255);
    DECLARE @C_ORDER_STATUS AS VARCHAR(20);

    SET @ROW = 1
    SELECT @MAXROW = MAX(A.IDX) FROM @PROJECT_HEADER A

    WHILE ( @ROW <= @MAXROW )
    BEGIN
        SELECT @C_PROJECT_ID   = A.PROJECT_ID
            ,  @C_ORDER_STATUS = A.ORDER_STATUS
        FROM @PROJECT_HEADER A WHERE A.IDX = @ROW
        
        IF(@C_ORDER_STATUS = 'C')
        BEGIN
            RAISERROR('완료된 프로젝트 입니다.', 16, 1);
            RETURN 0;
        END
        ELSE IF(@C_ORDER_STATUS = 'S')
        BEGIN
            RAISERROR('이미 진행중인 프로젝트 입니다.', 16, 1);
            RETURN 0;
        END
        BEGIN
            UPDATE UTB_EX_PROJECT_HEADER
            SET ORDER_STATUS = 'S'
              , START_DATE = CONVERT(VARCHAR(20), GETDATE(), 112)
              , SAVE_DTTM = GETDATE()
              , SAVE_BY = @P_SAVEBY
            WHERE PROJECT_ID = @C_PROJECT_ID;
        END;

        SET @ROW = @ROW + 1
    END

SET NOCOUNT OFF;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_qc_spc_ppm_chart_by_part_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_qc_spc_ppm_chart_by_part_L]
    @p_part_id NVARCHAR(20) = NULL
  , @p_start   NVARCHAR(20) = NULL
  , @p_end     NVARCHAR(20) = NULL
AS
     BEGIN
         SET NOCOUNT ON;

--관리값  
         DECLARE @ucl NUMERIC(30, 10);
         DECLARE @cl NUMERIC(30, 10);
         DECLARE @lcl NUMERIC(30, 10);
         SELECT
                @cl = ROUND(100 * cl, 4)
              , @ucl = ROUND(100 * ucl, 4)
              , @lcl = ROUND(100 * (CASE WHEN lcl < 0
                                        THEN 0
                                        ELSE lcl
                                    END), 4)
         FROM (
               SELECT
                      p                             cl
                    , p + 3 * SQRT(p * (1 - p) / n) ucl
                    , p - 3 * SQRT(p * (1 - p) / n) lcl
               FROM (
                     SELECT
                            SUM(CASE WHEN c.RES_NG_QTY > 0
                                    THEN 1
                                    ELSE 0
                                END) / CAST(COUNT(*) AS FLOAT) p
                          , COUNT(*)                           n
                     FROM   TB_INSPECTION_RES A
                     JOIN TB_INSPECTION_REQ C ON A.INSPECTION_REQ_ID = C.INSPECTION_REQ_ID
                     WHERE  C.PART_ID = @p_PART_id
                            AND c.RES_DTTM >= CAST(@p_START AS DATETIME)
                            AND C.RES_DTTM < DATEADD(d, 1, @p_END)
                     GROUP BY
                              CONVERT(VARCHAR, C.RES_DTTM, 112)
                    ) r
              ) r2;
         IF @p_start = @p_end
         BEGIN
             DECLARE @tbl_date TABLE(
                 idx    INT IDENTITY(1, 1)
               , vData  NVARCHAR(255)
               , vTitle NVARCHAR(255));
         END;
         DECLARE @date DATETIME;
         SET @date = @p_start;
         WHILE @date < CAST(@p_end AS DATETIME)
         BEGIN
             INSERT INTO           @tbl_date (
                    vData
                  , vTitle )
             VALUES (
                    CONVERT(NVARCHAR, @date, 112)
                  , CONVERT(NVARCHAR(10), @date, 120));
             SET @date = DATEADD(dd, 1, @date);
         END;

--임시테이블 생성  
         SELECT
                CONVERT(VARCHAR, C.RES_DTTM, 112)        dt
              , SUM(CASE WHEN c.RES_NG_QTY > 0
                        THEN 1
                        ELSE 0
                    END)                                 ng
              , 100 * SUM(CASE WHEN c.RES_NG_QTY > 0
                              THEN 1
                              ELSE 0
                          END) / CAST(COUNT(*) AS FLOAT) p
         INTO
              #qc
         FROM   TB_INSPECTION_RES A
         JOIN TB_INSPECTION_REQ C ON A.INSPECTION_REQ_ID = C.INSPECTION_REQ_ID
         WHERE  C.PART_ID = @p_PART_id
                AND c.RES_DTTM >= CAST(@p_START AS DATETIME)
                AND C.RES_DTTM < DATEADD(d, 1, @p_END)
         GROUP BY
                  CONVERT(VARCHAR, C.RES_DTTM, 112);
         SELECT
                idx
              , vTitle              title
              , @ucl                ucl
              , @cl                 cl
              , @lcl                lcl
              , (
                 SELECT
                        p
                 FROM    #qc
                 WHERE  dt = a.vData
                )                   ppm
              , 'PPM Control Chart' header
         INTO
              #res
         FROM @tbl_date a
         ORDER BY
                  idx;
         EXEC ('  
        select  
        title,  
        ucl "<point-none>UCL:'+@ucl+'",  
        lcl "<point-none>CL:'+@lcl+'",  
        cl "<point-none>LCL:'+@cl+'",  
        case when cl>ppm then ''<color=red>'' else ''<color=green>'' end + cast(ppm as varchar) "<line2>PPM",  
        header "<title>"  
        from #res a  
        order by idx');
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_qc_spc_ppm_list_BY_PART_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_qc_spc_ppm_list_BY_PART_L]
    @p_PART_id NVARCHAR(20) = NULL
  , @p_start   NVARCHAR(20) = NULL
  , @p_end     NVARCHAR(20) = NULL
AS
     BEGIN
         SET NOCOUNT ON;

--관리값  
         DECLARE @ucl NVARCHAR(255);
         DECLARE @cl NVARCHAR(255);
         DECLARE @lcl NVARCHAR(255);
         SELECT
                @cl = ROUND(100 * cl, 4)
              , @ucl = ROUND(100 * ucl, 4)
              , @lcl = ROUND(100 * (CASE WHEN lcl < 0
                                        THEN 0
                                        ELSE lcl
                                    END), 4)
         FROM (
               SELECT
                      p                             cl
                    , p + 3 * SQRT(p * (1 - p) / n) ucl
                    , p - 3 * SQRT(p * (1 - p) / n) lcl
               FROM (
                     SELECT
                            SUM(CASE WHEN c.RES_NG_QTY > 0
                                    THEN 1
                                    ELSE 0
                                END) / CAST(COUNT(*) AS FLOAT) p
                          , COUNT(*)                           n
                     FROM   TB_INSPECTION_RES A
                     JOIN TB_INSPECTION_REQ C ON A.INSPECTION_REQ_ID = C.INSPECTION_REQ_ID
                     WHERE  C.PART_ID = @p_PART_id
                            AND C.RES_DTTM >= CAST(@p_START AS DATETIME)
                            AND C.RES_DTTM < DATEADD(d, 1, @p_END)
                     GROUP BY
                              CONVERT(VARCHAR, C.RES_DTTM, 112)
                    ) r
              ) r2;
         DECLARE @vSql_Cnt NVARCHAR(MAX);
         DECLARE @vSql_PPM NVARCHAR(MAX);
         DECLARE @date DATETIME;
         SET @date = @p_start;
         SET @vSql_Cnt = CONVERT(NVARCHAR(MAX), '')+'select ''<ROW-ALIGN=CENTER>불량개수'' "!!구분" ';
         SET @vSql_PPM = CONVERT(NVARCHAR(MAX), '')+'select ''<ROW-ALIGN=CENTER>불량률(ppm)'' ';
         WHILE @date < CAST(@p_end AS DATETIME)
         BEGIN
             SET @vSql_Cnt = @vSql_Cnt+' , sum(case when dt='''+CONVERT(NVARCHAR, @date, 112)+''' then ng else 0 end) "'+CONVERT(NVARCHAR(10), @date, 120)+'"';
             SET @vSql_PPM = @vSql_PPM+' ,sum(case when dt='''+CONVERT(NVARCHAR, @date, 112)+''' then p else 0 end)';
             SET @date = DATEADD(dd, 1, @date);
         END;
         SET @vSql_Cnt = @vSql_Cnt+'   
                    from (  
                    select   
                        CONVERT(VARCHAR,C.RES_DTTM,112)  dt,  
                        sum(case when c.RES_NG_QTY>0 then 1 else 0 end) ng,  
                        round(100*sum(case when c.RES_NG_QTY>0 then 1 else 0 end)/cast(count(*) as float),4) p  
                    from TB_INSPECTION_RES A
                    JOIN TB_INSPECTION_REQ C
                    ON A.INSPECTION_REQ_ID=C.INSPECTION_REQ_ID  
                    where C.PART_ID='''+@p_PART_id+'''
                    AND C.RES_DTTM >= CAST('''+@p_START+''' AS DATETIME) AND C.RES_DTTM < DATEADD(d,1,'''+@p_END+''')
                    group by CONVERT(VARCHAR,C.RES_DTTM,112)) r';
         SET @vSql_PPM = @vSql_PPM+'   
                    from (  
                    select   
                        CONVERT(VARCHAR,C.RES_DTTM,112)  dt,    
                        sum(case when c.RES_NG_QTY>0 then 1 else 0 end) ng,  
                        round(100*sum(case when c.RES_NG_QTY>0 then 1 else 0 end)/cast(count(*) as float),4) p  
                    from TB_INSPECTION_RES A
                    JOIN TB_INSPECTION_REQ C
                    ON A.INSPECTION_REQ_ID=C.INSPECTION_REQ_ID  
                    where C.PART_ID='''+@p_PART_id+'''
                    AND  C.RES_DTTM >= CAST('''+@p_START+''' AS DATETIME) AND C.RES_DTTM < DATEADD(d,1,'''+@p_END+''')
                    group by CONVERT(VARCHAR,C.RES_DTTM,112)) r';
         EXEC (@vSql_Cnt);
         EXEC (@vSql_PPM);
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_qc_spc_r_chart_by_part_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_qc_spc_r_chart_by_part_L]
    @p_PART_id NVARCHAR(20) = NULL
  , @p_start   NVARCHAR(20) = NULL
  , @p_end     NVARCHAR(20) = NULL
  , @p_INSP_ID NVARCHAR(20) = NULL
  , @p_TYPE    NVARCHAR(20) = NULL
AS
     BEGIN
         SET NOCOUNT ON;

--관리값    
         DECLARE @cl NVARCHAR(255);
         SELECT
                @cl = ROUND(SUM(r) / COUNT(dt), 4)
         FROM (
               SELECT
                      CONVERT(VARCHAR, C.RES_DTTM, 112)                      dt
                    , ABS(MAX(b.inspection_value) - MIN(b.inspection_value)) r
               FROM   TB_INSPECTION_RES A
               JOIN TB_INSPECTION_RES_DETAIL B ON A.INSPECTION_RES_ID = B.INSPECTION_RES_ID
               JOIN TB_INSPECTION_REQ C ON A.INSPECTION_REQ_ID = C.INSPECTION_REQ_ID
               WHERE  C.PART_ID = @p_PART_id
                      AND c.RES_DTTM >= CAST(@p_START AS DATETIME)
                      AND C.RES_DTTM < DATEADD(d, 1, @p_END)
                      AND b.INSPECTION_ID = @p_INSP_ID
               GROUP BY
                        CONVERT(VARCHAR, C.RES_DTTM, 112)
              ) r;

--임시테이블 생성    
         SELECT
                CONVERT(VARCHAR, C.RES_DTTM, 112)                 dt
              , MAX(b.inspection_value) - MIN(b.inspection_value) r
         INTO
              #qc
         FROM   TB_INSPECTION_RES A
         JOIN TB_INSPECTION_RES_DETAIL B ON A.INSPECTION_RES_ID = B.INSPECTION_RES_ID
         JOIN TB_INSPECTION_REQ C ON A.INSPECTION_REQ_ID = C.INSPECTION_REQ_ID
         WHERE  C.PART_ID = @p_PART_id
                AND c.RES_DTTM >= CAST(@p_START AS DATETIME)
                AND C.RES_DTTM < DATEADD(d, 1, @p_END)
         GROUP BY
                  CONVERT(VARCHAR, C.RES_DTTM, 112);
         DECLARE @vSQL NVARCHAR(MAX);
         SET @vSQL = CONVERT(NVARCHAR(MAX), '')+'  
    declare @tbl_date table (idx int identity(1,1),vData nvarchar(255),vTitle nvarchar(255));    
    declare @date datetime    

    set @date='''+@p_start+'''   

    WHILE @date<=cast('''+@p_end+''' as datetime)  
    BEGIN      
    insert into @tbl_date (vData,vTitle) values (convert(nvarchar,@date,112),convert(nvarchar,@date,112));    
    set @date=dateadd(dd,1,@date)    

    END     
     
    select    
        vTitle,    
        '+isnull(@cl, 0)+' "<point-none>CL:'+dbo.fn_NumFormat (isnull(@cl, 0)) +'",    
        (select r from #qc    
        where dt=a.vData) "<line>R",    
        ''R Cotrol Chart'' "<title>"    
        from @tbl_date a    
        order by idx';
         EXEC (@vSql);
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_qc_spc_sum_BY_PART_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_qc_spc_sum_BY_PART_L]
    @p_PART_ID   NVARCHAR(20)  = NULL
  , @p_PART_NAME NVARCHAR(20)  = NULL
  , @p_LOT_NO    NVARCHAR(255) = NULL
  , @p_START     NVARCHAR(20)  = NULL
  , @p_END       NVARCHAR(20)  = NULL
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                A.PART_ID                                         품번
              , P.PART_NAME                                       품명
              , '<align=right>'+dbo.fn_NumFormat (SUM(A.REQ_QTY)) 생산량
              , A.PART_ID+';'+@p_START+';'+@p_END                 "@@PARAM"
         FROM   TB_INSPECTION_REQ a
         JOIN TB_WORK_TICKET WT ON A.WORK_ORDER_ID = WT.WORK_ORDER_ID
                                   AND a.WORK_ORDER_VER_NO = wt.WORK_ORDER_VER_NO
                                   AND a.PROC_ID = wt.PROC_ID
         JOIN TB_PART P ON A.PART_ID = P.PART_ID
         WHERE  A.PART_ID LIKE '%'+ISNULL(@p_PART_ID, '')+'%'
                AND P.PART_NAME LIKE '%'+ISNULL(@p_PART_NAME, '')+'%'
-- AND CONVERT(VARCHAR,A.RES_DTTM,112) BETWEEN @p_START AND @p_END          
                AND A.RES_DTTM >= CAST(@p_START AS DATETIME)
                AND A.RES_DTTM < DATEADD(d, 1, @p_END)
                AND CASE WHEN @p_LOT_NO IS NOT NULL
                        THEN CASE WHEN WT.WORK_ORDER_ID IN (
                                                            SELECT
                                                                   WORK_ORDER_ID
                                                            FROM   TB_LOT_INFO
                                                            WHERE  LOT_NO LIKE '%'+ISNULL(@p_LOT_NO, '')+'%'
                                                           )
                                 THEN 1
                                 ELSE 0
                             END
                        ELSE 1
                    END = 1
         GROUP BY
                  a.PART_ID
                , p.PART_NAME;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_sub_grid_01_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_sub_grid_01_L]
    @PROJECT_ID   VARCHAR(20)
  , @PROJECT_NAME VARCHAR(60)
  , @P_TERM       VARCHAR(20) --1일[1],7일[7],기간지정[0]  //괄호안에 코드값이 파람으로 전달됨.
  , @START_DATE   VARCHAR(20)
  , @END_DATE     VARCHAR(20)
  , @ORDER_STATUS VARCHAR(20) --대기[R],진행[S],완료[C], *
  , @MEM_ID       VARCHAR(20)
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                CASE WHEN EMP_ID = @MEM_ID
                    THEN '<font-weight=bold;background-color='+isnull('', 'b5e2ff')+'>'
                    ELSE '<font-weight=bold;background-color=#fff1bf>'
                END+emp_id+'['+EMP_NAME+']'     "사용자정보"
              , CASE WHEN EMP_ID = @MEM_ID
                    THEN '<align=center;font-weight=bold>O'
                    ELSE ''
                                            END "멤버ID"
              , EMP_ID                          "@@PARAM"
         FROM   TB_EMP e;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[USP_TRAINING_sub_grid_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************
* DATABASE        : ATM51
* PROCEDURE NAME  : 
* DATE            : ----/--/--
* AUTHOR          : 
* PROCEDURE DESC  : 
*                   
* Menu Id         : 
******************************************************************* 
* DATE:     Developer        Change 
----------  ---------------- --------------------------------------- 
----/--/--                   Created. 
2017/11/24  이성근           fixed Naming 

******************************************************************/

CREATE PROCEDURE [dbo].[USP_TRAINING_sub_grid_L]
    @color   NVARCHAR(20)  = NULL
  , @user_id NVARCHAR(255) = NULL
AS
     BEGIN
         SET NOCOUNT ON;
         SELECT
                CASE WHEN EMP_ID = @user_id
                    THEN '<font-weight=bold;background-color='+isnull(@color, 'b5e2ff')+'>'
                    ELSE '<font-weight=bold;background-color=#fff1bf>'
                END+emp_id+'['+EMP_NAME+']'     "사용자정보"
              , CASE WHEN EMP_ID = @user_id
                    THEN '<align=center;font-weight=bold>O'
                    ELSE ''
                                            END "로그인"
              , EMP_ID                          "@@PARAM"
         FROM   TB_EMP e;
         SET NOCOUNT OFF;
     END;
GO
/****** Object:  StoredProcedure [dbo].[UTB_TEST_STD_L]    Script Date: 2024-08-05(월) 오후 1:19:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UTB_TEST_STD_L]
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT
		 ROUTING_ID	'<TYPE=ROW>라우팅ID'
		,WORK_TICKET_ID '<TYPE=ROW>작업지시번호'
		,REV_PLAN_QTY '<TYPE=DAT>생산량'
		,PROC_ID '<TYPE=COL>공정'
		,WORK_SHOP_ID '<TYPE=COL>작업장'
	  FROM dbo.UTB_WORK_TICKET WITH(NOLOCK)


END
GO
