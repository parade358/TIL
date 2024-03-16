CREATE PROCEDURE P_UPDATE
    @ContactID INT,
    @Name VARCHAR(50),
    @PhoneNumber VARCHAR(50),
    @ContactGroup VARCHAR(50)
AS
BEGIN
    UPDATE CONTACTS
    SET NAME = @Name,
        PHONE_NUMBER = @PhoneNumber,
        CONTACT_GROUP = @ContactGroup
    WHERE CONTACT_ID = @ContactID;
END;
