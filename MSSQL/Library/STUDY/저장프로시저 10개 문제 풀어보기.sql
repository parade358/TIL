/*******************************************************************************************   
�� �������� : �������ν������� 10�� Ǯ���.sql
�� �ۼ����� : 2024�� LMS ������ MSSQL ����
�� ���࿹�� :

			Create Procedure USP_EMP_TEST_L(
				@P_TEXT VARCHAR(50)
				,@P_COUNT INT)
			AS
			BEGIN
				--�ڵ� �ֱ�
				PRINT @P_TEXT
				PRINT @P_COUNT
			END
			GO

�� ��    �� : 

�� �ֿ亯�泻��    
VER         DATE          AUTHOR			DESCRIPTION
----------  ----------   ---------------	------------------------------- 
0.01        2024-02-27   ys_choi			1.�űԻ���
*******************************************************************************************/


-- @P_TEXT �� ���� NULL�� ��� ��('')���� �ٲ� �� �ֵ��� �Ϸ��� ��� �ؾ� �ϴ°�?
ALTER PROCEDURE USP_EMP_TEST_L(
    @P_TEXT VARCHAR(50),
    @P_COUNT INT
)
AS
BEGIN
    PRINT ISNULL(@P_TEXT, '');
END
GO

-- @P_COUNT�� ��µǱ� ���� +1�� �Ͽ���
 ALTER PROCEDURE USP_EMP_TEST_L(
    @P_TEXT VARCHAR(50),
    @P_COUNT INT
)
AS
BEGIN
    PRINT @V_COUNT + 1;
END
GO

-- @V_COUNT ���������� ����� @P_COUNT�� ���� �Ҵ��� �� @V_COUNT�� ��½��Ѷ�
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

-- @V_COUNT ���������� ����� 0���� �ʱ�ȭ �� �� @P_COUNT�� @V_COUNT�� ���� +1�� �Ͽ� �Ҵ��Ű�� @V_COUNT�� ����϶�.
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

-- �������� @V_COUNT�� 10�� ���� �� @V_COUNT�� @P_COUNT�� �ջ��Ͽ� ����϶�.
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

-- @P_TEXT�� ���� '123456ABCDE'�� �Ҵ�Ǿ��� ��� 'A'���� ���������� �߶� 'ABCDE'�� ��µǵ��� �϶�.
-- ���� : �� ��� �������� �����ؾ� �Ѵ�. ���� ��� '12ABCDE'�̰ų� 'ABCDE'��� ���� ���� ȣ���ϴ��� 'ABCDE'��� ������ ��µ� �� �־�� �Ѵ�.
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

-- @P_COUNT�� 1 �̻��� � �ڿ����� �־����� �� @P_TEXT�� �� ����ŭ ����� �� �ֵ��� �϶�.
-- ���� : WHILE���� ����϶�
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

-- SELECT @P_COUNT�� PRINT @P_COUNT�� ���̸� �����϶�
-- ����1 : SSMS���� �������� ���̸� �����϶�.
-- ����2 : �������α׷�(������ C#)�� ���忡�� �� ��쿡 ���� ���� �� �ִ��� ������ Ȯ���϶�.
/* 

	SELECT @P_COUNT�� SSMS�� ��� â�������� ������ ���� ��� �������� ǥ�õ˴ϴ�.
	��������� ���·� ���� ��ȯ�ǹǷ� �������α׷����� ��� ������ ������ �������� �а� ó���� �� �ֽ��ϴ�.

	PRINT @P_COUNT�� SSMS�� �޽��� â���� ��µ˴ϴ�. ��� â���� ǥ�õ����ʰ� ����� �� �޽���Ȯ�ο��� ���˴ϴ�.
	��������� ��ȯ���� �����Ƿ� �������α׷����� ���� ���� ���� �����ϴ�.

*/

-- ���� �Է��Ķ���Ϳ��� @P_TEXT2 ������ �߰��϶�. �� �� @P_TEXT�� @P_TEX2�� ���ļ� ����ϵ��� �����϶�.
ALTER PROCEDURE USP_EMP_TEST_L(@P_TEXT VARCHAR(50)
							 , @P_COUNT INT
							 , @P_TEXT2 VARCHAR(50))
AS
BEGIN
    PRINT @P_TEXT + @P_TEXT2;
END
GO

-- @P_TEXT2 �Է��Ķ���͸� �����Ͽ� �ٽ� ������ų ��.
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

-- @P_TEXT�� �������� �����Ͽ� �����̸� "OK" ���ڰ� �ƴϸ� "NG"�� ����ϵ��� �����϶�.
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