/*******************************************************************************************   
■ 문서제목 : 동적 쿼리 문제.sql
■ 작성목적 : 2024년 LMS 최유성 MSSQL 교육
■ 실행예제 :

			Create Table TB_EMP(
				idx int IDENTITY(1,1) NOT NULL,
				name varchar(10) NULL
			)

			Declare @vInputNameText Varchar(10) = ''--입력 값

			Declare @vSql Varchar(500)
			Set @vSql = 'Select v.idx, v.name From TB_EMP Where 1=1'
			Exec @vSql

■ 비    고 : 

■ 주요변경내역    
VER         DATE          AUTHOR			DESCRIPTION
----------  ----------   ---------------	------------------------------- 
0.01        2024-02-27   ys_choi			1.신규생성
*******************************************************************************************/



CREATE TABLE TB_EMP(
    idx INT IDENTITY(1,1) NOT NULL,
    name VARCHAR(10) NULL
)

-- TB_EMP 테이블의 Select 조회 쿼리에서 이름이 입력되었을 때만 조건문에 name을 찾아보는 조건문을 Where절에 넣고 그렇지 않을 경우 name을 조회하는 조건문 자체가 Where절에 안나오도록 작성하라.
DECLARE @vInputNameText VARCHAR(10) = ''; -- 입력 값
DECLARE @vSql NVARCHAR(MAX);
SET @vSql = 'SELECT idx, name FROM TB_EMP';
IF (@vInputNameText IS NOT NULL)
BEGIN
    SET @vSql += ' WHERE name = @vInputNameText';
END
EXEC sp_executesql @vSql, N'@vInputNameText VARCHAR(10)', @vInputNameText;
	

-- sp_executesql에 대해 설명하라.
-- SQL Server에서 동적 SQL을 실행하는 데 사용되는 시스템 저장 프로시저.

-- 위의 1)로 작성된 프로그램을 생각해보자. 괴팍한 어떤 사용자가 어떨 때는 프로그램에서 name을 입력해서 조회하기도 하고 어떤 때는 name을 입력하지 않고 조회하는 행위를 매번 번갈아가며 시도한다고 가정하자. 
-- 그때마다 프로그램의 성능이 차이가 나게 되는데 왜 그러한지 2)에서 확인한 sp_executesql와 관련 지어 설명해보라.

-- sp_executesql로 1)의 문제를 성능 차이 없도록 다시 작성해보라.
