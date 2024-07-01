/*******************************************************************************************   
�� �������� : �ε����� �����ȹ.sql
�� �ۼ����� : 2024�� LMS ������ MSSQL ����
�� ���࿹�� :

			-- �۾���� ���̺� �����
			Create Table TB_TICKET_RES
			(
				WORK_TICKET_ID INT IDENTITY(1,1) NOT NULL,
				WORK_DATE VARCHAR(8),
				WORK_SHOP_ID INT,
				PART_ID VARCHAR(50),
				GOOD_QTY DECIMAL(13,8)
			)

�� ��    �� : 

�� �ֿ亯�泻��    
VER         DATE          AUTHOR			DESCRIPTION
----------  ----------   ---------------	------------------------------- 
0.01        2024-02-27   ys_choi			1.�űԻ���
*******************************************************************************************/

-- �۾���� ���̺� �����
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

-- �� ������ ��������ȹ ���غ���
Select * From dbo.TB_TICKET_RES with(nolock)
Select WORK_TICKET_ID From dbo.TB_TICKET_RES with(nolock) Where WORK_TICKET_ID = 1

Create index IDX_TB_TICKET_RES_1 ON dbo.TB_TICKET_RES (WORK_TICKET_ID asc)

Select WORK_DATE From dbo.TB_TICKET_RES with(nolock) Where WORK_DATE = '20240104'
Select WORK_TICKET_ID From dbo.TB_TICKET_RES with(nolock) Where WORK_TICKET_ID = 1

-- ���� 1. �� ��� I/O ���� ���� ��뿡 ���� ū ���̰� ���� ���̴�. �� �׷��� ����Ͽ� �����غ���. Ʋ�� ���� �ص� ��� ����.
/*
   ���̺� ��ĵ�̱� ������ �� ������ ���� ���� ó������ ������ ���� Ȯ���Ͽ� ��ȸ�ϱ⶧���̴�.
*/



-- ���� 2. ���̺� ��ĵ�� ���� �� ������ ���۰�?
/*
	��ü���̺��� ���������� �б⶧���̴�.
*/

-- ���� 3. �ε��� ��ĵ�� ���� �� ������ ������?
/*
	�ε����� ���̺� �ִ� �������� �κ� ������ �����ϰ� �ֱ� ������ ��ü ���̺��� ��ĵ�� �ʿ� ���� �ε����� ��ĵ�ϱ⶧���̴�.
*/