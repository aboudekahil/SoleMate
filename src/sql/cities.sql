CREATE TRIGGER IF NOT EXISTS set_city_id_trigger
BEFORE INSERT ON cities
FOR EACH ROW
BEGIN
  SET @uuid := UUID();
  SET NEW.city_id = @uuid;
END;
