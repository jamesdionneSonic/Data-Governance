USE [$(APP_DB_NAME)];
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'catalog')
BEGIN
    EXEC('CREATE SCHEMA [catalog]');
END;
GO

IF OBJECT_ID('catalog.Objects', 'U') IS NULL
BEGIN
    CREATE TABLE [catalog].[Objects] (
        [ObjectId] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
        [ObjectKey] NVARCHAR(500) NOT NULL,
        [ObjectType] NVARCHAR(50) NOT NULL,
        [Environment] NVARCHAR(20) NOT NULL,
        [Description] NVARCHAR(MAX) NULL,
        [CreatedAtUtc] DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_catalog_Objects] PRIMARY KEY ([ObjectId]),
        CONSTRAINT [UQ_catalog_Objects_ObjectKey] UNIQUE ([ObjectKey])
    );
END;
GO

IF OBJECT_ID('catalog.ImportRuns', 'U') IS NULL
BEGIN
    CREATE TABLE [catalog].[ImportRuns] (
        [ImportRunId] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
        [StartedAtUtc] DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
        [CompletedAtUtc] DATETIME2(0) NULL,
        [Status] NVARCHAR(30) NOT NULL,
        [Summary] NVARCHAR(MAX) NULL,
        CONSTRAINT [PK_catalog_ImportRuns] PRIMARY KEY ([ImportRunId])
    );
END;
GO
