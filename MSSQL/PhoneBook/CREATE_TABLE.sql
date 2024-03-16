CREATE TABLE CONTACTS(
	CONTACT_ID INT PRIMARY KEY IDENTITY,
    PROFILE_PICTURE VARCHAR(MAX),
	NAME VARCHAR(50) NOT NULL,
	PHONE_NUMBER VARCHAR(50) NOT NULL,
	CONTACT_GROUP NVARCHAR(50) NOT NULL
);

USE [ContactsDB]

INSERT INTO [dbo].[CONTACTS]
            ([NAME]
           , [PROFILE_PICTURE]
           , [PHONE_NUMBER]
           , [CONTACT_GROUP])
     VALUES 
     ('������', 'https://via.placeholder.com/100', '010-4246-5588', 'ACS'),
     ('������', 'https://via.placeholder.com/100', '010-5346-8527', 'ACS'),
     ('�̼���', 'https://via.placeholder.com/100', '010-6446-6429', 'KR'),
     ('������', 'https://via.placeholder.com/100', '010-7546-4579', 'CO'),
	 ('������', 'https://via.placeholder.com/100', '010-1546-2527', 'ACS'),
	 ('�ֹ���', 'https://via.placeholder.com/100', '010-2546-9520', 'CO'),
	 ('���¿�', 'https://via.placeholder.com/100', '010-3546-6467', 'KR')


