CREATE TRIGGER IF NOT EXISTS set_shoe_image_id_trigger
BEFORE INSERT ON shoe_images
FOR EACH ROW
BEGIN
  SET NEW.image_id = UUID();
END;
