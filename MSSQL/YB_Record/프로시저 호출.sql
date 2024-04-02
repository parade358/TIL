DECLARE @Opponent VARCHAR(100) = 'FC ���Ǿ�';
DECLARE @Location VARCHAR(100) = '�����ʵ��б�';
DECLARE @MatchDate DATE = '2024-04-05';
DECLARE @PlayerNames VARCHAR(MAX) = '������, ���ؼ�, ������';

-- ��� �� ���� �߰� ���ν��� ȣ��
EXEC InsertMatchAndPlayers @Opponent, @Location, @MatchDate, @PlayerNames;

-- �߰��� ����� ID ��������
DECLARE @MatchID INT;
SELECT @MatchID = SCOPE_IDENTITY();

-- �� �� ��ý�Ʈ �߰� ���ν��� ȣ��
-- ����1�� 2���Ϳ� ���� �־�����, ����2�� ��ý�Ʈ�� ������ ���
EXEC InsertGoalAndAssist '������', @MatchID, 2, '����2', 2;

-- ����2�� 3���Ϳ� ���� �־�����, ����3�� ��ý�Ʈ�� ������ ���
EXEC InsertGoalAndAssist '����2', @MatchID, 3, '����3', 3;

-- �߰������� �� �� ��ý�Ʈ�� �߰��� �� �ֽ��ϴ�.