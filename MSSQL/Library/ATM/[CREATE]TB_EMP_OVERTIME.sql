USE [ATM52]
GO

/****** Object:  Table [dbo].[TB_EMP_OVERTIME]    Script Date: 2024-06-23(��) ���� 1:27:51 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TB_EMP_OVERTIME](
	[EMP_NAME] [varchar](50) NOT NULL,
	[REASON] [nvarchar](255) NOT NULL,
	[START_OVERTIME] [datetime] NULL,
	[END_OVERTIME] [datetime] NULL,
	[TOTAL_OVERTIME] [datetime] NULL,
	[CREATE_DTTM] [datetime] NOT NULL,
	[SAVE_DTTM] [datetime] NOT NULL,
	[CREATE_BY] [varchar](50) NOT NULL,
	[SAVE_BY] [varchar](50) NOT NULL,
	[ROW_STAMP] [int] IDENTITY(1,1) NOT FOR REPLICATION NOT NULL,
 CONSTRAINT [PK_TB_EMP_OVERTIME] PRIMARY KEY CLUSTERED 
(
	[ROW_STAMP] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[TB_EMP_OVERTIME] ADD  CONSTRAINT [DF_TB_EMP_OVERTIME_CREATE_DTTM]  DEFAULT (getdate()) FOR [CREATE_DTTM]
GO

ALTER TABLE [dbo].[TB_EMP_OVERTIME] ADD  CONSTRAINT [DF_TB_EMP_OVERTIME_SAVE_DTTM]  DEFAULT (getdate()) FOR [SAVE_DTTM]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'�����' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EMP_OVERTIME', @level2type=N'COLUMN',@level2name=N'EMP_NAME'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'�ʰ��ٹ�����' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EMP_OVERTIME', @level2type=N'COLUMN',@level2name=N'REASON'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'�ʰ��ٹ����۽ð�' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EMP_OVERTIME', @level2type=N'COLUMN',@level2name=N'START_OVERTIME'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'�ʰ��ٹ�����ð�' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EMP_OVERTIME', @level2type=N'COLUMN',@level2name=N'END_OVERTIME'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'���ʰ��ð�' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EMP_OVERTIME', @level2type=N'COLUMN',@level2name=N'TOTAL_OVERTIME'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'�����Ͻ�' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EMP_OVERTIME', @level2type=N'COLUMN',@level2name=N'CREATE_DTTM'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'�����Ͻ�' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EMP_OVERTIME', @level2type=N'COLUMN',@level2name=N'SAVE_DTTM'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'������' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EMP_OVERTIME', @level2type=N'COLUMN',@level2name=N'CREATE_BY'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'������' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EMP_OVERTIME', @level2type=N'COLUMN',@level2name=N'SAVE_BY'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ROW UNIQUE ID' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EMP_OVERTIME', @level2type=N'COLUMN',@level2name=N'ROW_STAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'������' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EMP_OVERTIME'
GO


