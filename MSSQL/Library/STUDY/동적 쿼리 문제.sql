/*******************************************************************************************   
�� �������� : ���� ���� ����.sql
�� �ۼ����� : 2024�� LMS ������ MSSQL ����
�� ���࿹�� :

			Create Table TB_EMP(
				idx int IDENTITY(1,1) NOT NULL,
				name varchar(10) NULL
			)

			Declare @vInputNameText Varchar(10) = ''--�Է� ��

			Declare @vSql Varchar(500)
			Set @vSql = 'Select v.idx, v.name From TB_EMP Where 1=1'
			Exec @vSql

�� ��    �� : 

�� �ֿ亯�泻��    
VER         DATE          AUTHOR			DESCRIPTION
----------  ----------   ---------------	------------------------------- 
0.01        2024-02-27   ys_choi			1.�űԻ���
*******************************************************************************************/



CREATE TABLE TB_EMP(
    idx INT IDENTITY(1,1) NOT NULL,
    name VARCHAR(10) NULL
)

-- TB_EMP ���̺��� Select ��ȸ �������� �̸��� �ԷµǾ��� ���� ���ǹ��� name�� ã�ƺ��� ���ǹ��� Where���� �ְ� �׷��� ���� ��� name�� ��ȸ�ϴ� ���ǹ� ��ü�� Where���� �ȳ������� �ۼ��϶�.
DECLARE @vInputNameText VARCHAR(10) = ''; -- �Է� ��
DECLARE @vSql NVARCHAR(MAX);
SET @vSql = 'SELECT idx, name FROM TB_EMP';
IF (@vInputNameText IS NOT NULL)
BEGIN
    SET @vSql += ' WHERE name = @vInputNameText';
END
EXEC sp_executesql @vSql, N'@vInputNameText VARCHAR(10)', @vInputNameText;
	

-- sp_executesql�� ���� �����϶�.
-- SQL Server���� ���� SQL�� �����ϴ� �� ���Ǵ� �ý��� ���� ���ν���.

-- ���� 1)�� �ۼ��� ���α׷��� �����غ���. ������ � ����ڰ� � ���� ���α׷����� name�� �Է��ؼ� ��ȸ�ϱ⵵ �ϰ� � ���� name�� �Է����� �ʰ� ��ȸ�ϴ� ������ �Ź� �����ư��� �õ��Ѵٰ� ��������. 
-- �׶����� ���α׷��� ������ ���̰� ���� �Ǵµ� �� �׷����� 2)���� Ȯ���� sp_executesql�� ���� ���� �����غ���.

-- sp_executesql�� 1)�� ������ ���� ���� ������ �ٽ� �ۼ��غ���.
