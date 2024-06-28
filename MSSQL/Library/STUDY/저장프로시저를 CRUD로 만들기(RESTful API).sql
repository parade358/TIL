/*******************************************************************************************   
■ 문서제목 : 저장프로시저를 CRUD로 만들기(RESTful API).sql
■ 작성목적 : 2024년 LMS 최유성 MSSQL 교육
■ 실행예제 :
				
				CREATE TABLE UTB_USER(
							 USER_ID INT IDENTITY(1,1) PRIMARY KEY,
							 USER_NAME VARCHAR(20),
							 USER_PHONE VARCHAR(20),
							 CREATE_DTTM DATETIME,
							 CREATE_BY VARCHAR(20),
							 SAVE_DTTM DATETIME,
							 SAVE_BY VARCHAR(20)
				)
				
■ 비    고 : 

■ 주요변경내역    
VER         DATE          AUTHOR			DESCRIPTION
----------  ----------   ---------------	------------------------------- 
0.01        2024-02-27   ys_choi			1.신규생성
*******************************************************************************************/

CREATE TABLE UTB_USER(
USER_ID INT IDENTITY(1,1) PRIMARY KEY,
USER_NAME VARCHAR(20),
USER_PHONE VARCHAR(20),
CREATE_DTTM DATETIME,
CREATE_BY VARCHAR(20),
SAVE_DTTM DATETIME,
SAVE_BY VARCHAR(20)
)

SELECT *
FROM UTB_USER;

--1. 다음의 사용자 정보를 USP_TB_USER_I 프로시저로 저장하는 것을 보여라.
--ID	이름	전화번호
--1	김덕수	010-123-1234
--2	이성근	010-2344-3456
--3	김원배	010-3455-4567
--4	김영삼	010-4566-5678
CREATE PROC USP_TB_USER_I
	@P_USER_ID INT,
	@P_USER_NAME VARCHAR(20), 
	@P_USER_PHONE VARCHAR(20),
	@P_INPUT_USER_ID INT
AS
BEGIN
	INSERT INTO UTB_USER (USER_NAME, USER_PHONE)
	VALUES (@P_USER_NAME, @P_USER_PHONE)
END

--2. 다음의 정보를 USP_TB_USER_L로 조회하여라.
--ID : 1. 3
CREATE PROC USP_TB_USER_L
	@P_USER_ID INT
AS
BEGIN
	SELECT *
	FROM UTB_USER
	WHERE USER_ID = @P_USER_ID
END

--3. USP_TB_USER_D로 다음을 삭제하라.
--ID : 2
CREATE PROC USP_TB_USER_D
	@P_USER_ID INT
AS
BEGIN
	DELETE FROM UTB_USER
	WHERE USER_ID = @P_USER_ID
END

--4. USP_TB_USER_U로 다음을 수정하라.
--ID : 3 => 전화번호 : 010-3445-1234
CREATE PROC USP_TB_USER_U
	@P_USER_ID INT
  , @P_USER_PHONE VARCHAR(20)
  , @P_INPUT_USER_ID INT
AS
BEGIN
	UPDATE UTB_USER
	SET USER_PHONE = @P_USER_PHONE
	WHERE USER_ID = @P_INPUT_USER_ID
END


EXEC USP_TB_USER_U 6, '010-3445-1234', 6;

