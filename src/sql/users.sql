CREATE TRIGGER IF NOT EXISTS set_user_id_trigger
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  SET @uuid := UUID();
  SET NEW.user_id = @uuid;
END;
