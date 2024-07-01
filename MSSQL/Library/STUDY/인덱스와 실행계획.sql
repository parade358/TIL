/*******************************************************************************************   
■ 문서제목 : 인덱스와 실행계획.sql
■ 작성목적 : 2024년 LMS 최유성 MSSQL 교육
■ 실행예제 :

			-- 작업결과 테이블 만들기
			Create Table TB_TICKET_RES
			(
				WORK_TICKET_ID INT IDENTITY(1,1) NOT NULL,
				WORK_DATE VARCHAR(8),
				WORK_SHOP_ID INT,
				PART_ID VARCHAR(50),
				GOOD_QTY DECIMAL(13,8)
			)

■ 비    고 : 

■ 주요변경내역    
VER         DATE          AUTHOR			DESCRIPTION
----------  ----------   ---------------	------------------------------- 
0.01        2024-02-27   ys_choi			1.신규생성
*******************************************************************************************/

-- 작업결과 테이블 만들기
Create Table TB_TICKET_RES
(
	WORK_TICKET_ID INT IDENTITY(1,1) NOT NULL,
	WORK_DATE VARCHAR(8),
	WORK_SHOP_ID INT,
	PART_ID VARCHAR(50),
	GOOD_QTY DECIMAL(13,8)
)

Declare @cnt int = 1
While @cnt <= 1000
Begin
	Insert into dbo.TB_TICKET_RES(WORK_DATE, WORK_SHOP_ID, PART_ID, GOOD_QTY) Values('20240104',1,'PT001-AXQ001', 150.000)
	SET @cnt = @cnt+1
End

-- 두 쿼리의 예상실행계획 비교해보기
Select * From dbo.TB_TICKET_RES with(nolock)
Select WORK_TICKET_ID From dbo.TB_TICKET_RES with(nolock) Where WORK_TICKET_ID = 1

Create index IDX_TB_TICKET_RES_1 ON dbo.TB_TICKET_RES (WORK_TICKET_ID asc)

Select WORK_DATE From dbo.TB_TICKET_RES with(nolock) Where WORK_DATE = '20240104'
Select WORK_TICKET_ID From dbo.TB_TICKET_RES with(nolock) Where WORK_TICKET_ID = 1

-- 문제 1. 둘 모두 I/O 비용과 연산 비용에 대해 큰 차이가 없을 것이다. 왜 그런지 고민하여 설명해보라. 틀린 답을 해도 상관 없다.
/*
   테이블 스캔이기 때문에 두 쿼리문 전부 값을 처음부터 끝까지 전부 확인하여 조회하기때문이다.
*/



-- 문제 2. 테이블 스캔의 경우는 왜 성능이 나쁜가?
/*
	전체테이블을 순차적으로 읽기때문이다.
*/

-- 문제 3. 인덱스 스캔의 경우는 왜 성능이 좋은가?
/*
	인덱스는 테이블에 있는 데이터의 부분 집합을 저장하고 있기 때문에 전체 테이블을 스캔할 필요 없이 인덱스만 스캔하기때문이다.
*/