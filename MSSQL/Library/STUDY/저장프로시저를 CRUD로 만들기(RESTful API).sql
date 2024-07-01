/*******************************************************************************************   
�� �������� : �������ν����� CRUD�� �����(RESTful API).sql
�� �ۼ����� : 2024�� LMS ������ MSSQL ����
�� ���࿹�� :
				
				CREATE TABLE UTB_USER(
							 USER_ID INT IDENTITY(1,1) PRIMARY KEY,
							 USER_NAME VARCHAR(20),
							 USER_PHONE VARCHAR(20),
							 CREATE_DTTM DATETIME,
							 CREATE_BY VARCHAR(20),
							 SAVE_DTTM DATETIME,
							 SAVE_BY VARCHAR(20)
				)
				
�� ��    �� : 

�� �ֿ亯�泻��    
VER         DATE          AUTHOR			DESCRIPTION
----------  ----------   ---------------	------------------------------- 
0.01        2024-02-27   ys_choi			1.�űԻ���
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

--1. ������ ����� ������ USP_TB_USER_I ���ν����� �����ϴ� ���� ������.
--ID	�̸�	��ȭ��ȣ
--1	�����	010-123-1234
--2	�̼���	010-2344-3456
--3	�����	010-3455-4567
--4	�迵��	010-4566-5678
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

--2. ������ ������ USP_TB_USER_L�� ��ȸ�Ͽ���.
--ID : 1. 3
CREATE PROC USP_TB_USER_L
	@P_USER_ID INT
AS
BEGIN
	SELECT *
	FROM UTB_USER
	WHERE USER_ID = @P_USER_ID
END

--3. USP_TB_USER_D�� ������ �����϶�.
--ID : 2
CREATE PROC USP_TB_USER_D
	@P_USER_ID INT
AS
BEGIN
	DELETE FROM UTB_USER
	WHERE USER_ID = @P_USER_ID
END

--4. USP_TB_USER_U�� ������ �����϶�.
--ID : 3 => ��ȭ��ȣ : 010-3445-1234
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

