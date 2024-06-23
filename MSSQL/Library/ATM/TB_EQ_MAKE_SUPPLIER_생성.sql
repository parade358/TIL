USE [ATM52]
GO

/****** Object:  Table [dbo].[TB_EQ_MAKE_SUPPLIER]    Script Date: 2024-06-23(일) 오후 1:27:51 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TB_EQ_MAKE_SUPPLIER](
	[EQ_SUPPLIER_ID] [varchar](50) NOT NULL,
	[EQ_SUPPLIER_NAME] [nvarchar](255) NOT NULL,
	[EQ_SUPPLIER_LOC] [nvarchar](255) NOT NULL,
	[REMARK] [nvarchar](255) NULL,
	[VALID] [int] NULL,
	[CREATE_DTTM] [datetime] NOT NULL,
	[SAVE_DTTM] [datetime] NOT NULL,
	[CREATE_BY] [varchar](50) NULL,
	[SAVE_BY] [varchar](50) NULL,
	[ROW_STAMP] [int] IDENTITY(1,1) NOT FOR REPLICATION NOT NULL,
 CONSTRAINT [PK_TB_EQ_MAKE_SUPPLIER] PRIMARY KEY CLUSTERED 
(
	[EQ_SUPPLIER_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[TB_EQ_MAKE_SUPPLIER] ADD  CONSTRAINT [DF_TB_EQ_MAKE_SUPPLIER_VALID]  DEFAULT ((1)) FOR [VALID]
GO

ALTER TABLE [dbo].[TB_EQ_MAKE_SUPPLIER] ADD  CONSTRAINT [DF_TB_EQ_MAKE_SUPPLIER_CREATE_DTTM]  DEFAULT (getdate()) FOR [CREATE_DTTM]
GO

ALTER TABLE [dbo].[TB_EQ_MAKE_SUPPLIER] ADD  CONSTRAINT [DF_TB_EQ_MAKE_SUPPLIER_SAVE_DTTM]  DEFAULT (getdate()) FOR [SAVE_DTTM]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'제조사코드' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EQ_MAKE_SUPPLIER', @level2type=N'COLUMN',@level2name=N'EQ_SUPPLIER_ID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'제조사명' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EQ_MAKE_SUPPLIER', @level2type=N'COLUMN',@level2name=N'EQ_SUPPLIER_NAME'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'제조사위치' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EQ_MAKE_SUPPLIER', @level2type=N'COLUMN',@level2name=N'EQ_SUPPLIER_LOC'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'비고' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EQ_MAKE_SUPPLIER', @level2type=N'COLUMN',@level2name=N'REMARK'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'사용여부' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EQ_MAKE_SUPPLIER', @level2type=N'COLUMN',@level2name=N'VALID'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'생성일시' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EQ_MAKE_SUPPLIER', @level2type=N'COLUMN',@level2name=N'CREATE_DTTM'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'저장일시' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EQ_MAKE_SUPPLIER', @level2type=N'COLUMN',@level2name=N'SAVE_DTTM'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'생성자' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EQ_MAKE_SUPPLIER', @level2type=N'COLUMN',@level2name=N'CREATE_BY'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'저장자' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EQ_MAKE_SUPPLIER', @level2type=N'COLUMN',@level2name=N'SAVE_BY'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ROW UNIQUE ID' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EQ_MAKE_SUPPLIER', @level2type=N'COLUMN',@level2name=N'ROW_STAMP'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'제조사' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'TB_EQ_MAKE_SUPPLIER'
GO


