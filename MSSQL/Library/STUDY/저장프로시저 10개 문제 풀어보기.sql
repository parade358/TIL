/*******************************************************************************************   
■ 문서제목 : 저장프로시저문제 10개 풀어보기.sql
■ 작성목적 : 2024년 LMS 최유성 MSSQL 교육
■ 실행예제 :

			Create Procedure USP_EMP_TEST_L(
				@P_TEXT VARCHAR(50)
				,@P_COUNT INT)
			AS
			BEGIN
				--코드 넣기
				PRINT @P_TEXT
				PRINT @P_COUNT
			END
			GO

■ 비    고 : 

■ 주요변경내역    
VER         DATE          AUTHOR			DESCRIPTION
----------  ----------   ---------------	------------------------------- 
0.01        2024-02-27   ys_choi			1.신규생성
*******************************************************************************************/


-- @P_TEXT 에 값이 NULL일 경우 빈값('')으로 바꿀 수 있도록 하려면 어떻게 해야 하는가?
ALTER PROCEDURE USP_EMP_TEST_L(
    @P_TEXT VARCHAR(50),
    @P_COUNT INT
)
AS
BEGIN
    PRINT ISNULL(@P_TEXT, '');
END
GO

-- @P_COUNT이 출력되기 전에 +1을 하여라
 ALTER PROCEDURE USP_EMP_TEST_L(
    @P_TEXT VARCHAR(50),
    @P_COUNT INT
)
AS
BEGIN
    PRINT @V_COUNT + 1;
END
GO

-- @V_COUNT 지역변수를 만들고 @P_COUNT에 값을 할당한 후 @V_COUNT를 출력시켜라
ALTER PROCEDURE USP_EMP_TEST_L(
    @P_TEXT VARCHAR(50),
    @P_COUNT INT
)
AS
BEGIN
	DECLARE @V_COUNT INT

	SET @V_COUNT = @P_COUNT;

    PRINT @V_COUNT;
END
GO

-- @V_COUNT 지역변수를 만들고 0으로 초기화 한 후 @P_COUNT에 @V_COUNT의 값을 +1을 하여 할당시키고 @V_COUNT를 출력하라.
ALTER PROCEDURE USP_EMP_TEST_L(
    @P_TEXT VARCHAR(50),
    @P_COUNT INT
)
AS
BEGIN
	DECLARE @V_COUNT INT

	SET @V_COUNT = 0;

	SET @V_COUNT = @P_COUNT + 1;

    PRINT @V_COUNT;
END
GO

-- 지역변수 @V_COUNT에 10을 넣은 후 @V_COUNT와 @P_COUNT를 합산하여 출력하라.
ALTER PROCEDURE USP_EMP_TEST_L(
    @P_TEXT VARCHAR(50),
    @P_COUNT INT
)
AS
BEGIN
	DECLARE @V_COUNT INT

	SET @V_COUNT = 10;

	SET @V_COUNT = @P_COUNT + @V_COUNT;

    PRINT @V_COUNT;
END
GO

-- @P_TEXT의 값을 '123456ABCDE'로 할당되었을 경우 'A'부터 종료점까지 잘라서 'ABCDE'만 출력되도록 하라.
-- 조건 : 이 경우 동적으로 가능해야 한다. 예를 들어 '12ABCDE'이거나 'ABCDE'라고 여러 경우로 호출하더라도 'ABCDE'라고 언제나 출력될 수 있어야 한다.
ALTER PROCEDURE USP_EMP_TEST_L(
    @P_TEXT VARCHAR(50),
    @P_COUNT INT
)
AS
BEGIN
	DECLARE @Str VARCHAR(50)

    SET @Str = SUBSTRING(@P_TEXT, CHARINDEX('A', @P_TEXT), LEN(@P_TEXT));

    PRINT @Str;
END
GO

-- @P_COUNT가 1 이상의 어떤 자연수가 주어졌을 때 @P_TEXT를 그 수만큼 출력할 수 있도록 하라.
-- 조건 : WHILE문을 사용하라
ALTER PROCEDURE USP_EMP_TEST_L(
    @P_TEXT VARCHAR(50),
    @P_COUNT INT
)
AS
BEGIN
    DECLARE @Counter INT
    SET @Counter = 1
    
    WHILE @Counter <= @P_COUNT
    BEGIN
        PRINT @P_TEXT;
        SET @Counter += 1;
    END
END
GO

-- SELECT @P_COUNT와 PRINT @P_COUNT의 차이를 설명하라
-- 조건1 : SSMS에서 보여지는 차이를 설명하라.
-- 조건2 : 응용프로그램(예컨대 C#)의 입장에서 두 경우에 대해 받을 수 있는지 없는지 확인하라.
/* 

	SELECT @P_COUNT는 SSMS의 결과 창에선택한 변수의 값이 결과 집합으로 표시됩니다.
	결과집합의 형태로 값이 반환되므로 응용프로그램에서 결과 집합을 데이터 형식으로 읽고 처리할 수 있습니다.

	PRINT @P_COUNT는 SSMS의 메시지 창에만 출력됩니다. 결과 창에는 표시되지않고 디버깅 및 메시지확인에만 사용됩니다.
	결과집합을 반환하지 않으므로 응용프로그램에서 직접 받을 수는 없습니다.

*/

-- 위의 입력파라메터에서 @P_TEXT2 변수를 추가하라. 그 뒤 @P_TEXT와 @P_TEX2를 합쳐서 출력하도록 수정하라.
ALTER PROCEDURE USP_EMP_TEST_L(@P_TEXT VARCHAR(50)
							 , @P_COUNT INT
							 , @P_TEXT2 VARCHAR(50))
AS
BEGIN
    PRINT @P_TEXT + @P_TEXT2;
END
GO

-- @P_TEXT2 입력파라메터를 삭제하여 다시 원복시킬 것.
ALTER PROCEDURE USP_EMP_TEST_L
(
	@P_TEXT VARCHAR(50)
,	@P_COUNT INT
)
AS
BEGIN
    PRINT @P_TEXT;
END
GO

-- @P_TEXT가 숫자인지 검증하여 숫자이면 "OK" 숫자가 아니면 "NG"로 출력하도록 수정하라.
ALTER PROCEDURE USP_EMP_TEST_L
(
	  @P_TEXT VARCHAR(50)	
	, @P_COUNT INT
)
AS
BEGIN
	IF ISNUMERIC(@P_TEXT) = 1
    BEGIN
        PRINT 'OK';
    END
    ELSE
    BEGIN
        PRINT 'NG';
    END
END
GO

EXEC USP_EMP_TEST_L '1', 4;