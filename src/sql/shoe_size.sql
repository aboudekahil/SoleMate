CREATE TRIGGER IF NOT EXISTS set_shoe_size_id_trigger
BEFORE INSERT ON shoe_sizes
FOR EACH ROW
BEGIN
  SET NEW.shoesize_id = UUID();
END;
