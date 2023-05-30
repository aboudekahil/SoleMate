CREATE TRIGGER IF NOT EXISTS set_feedback_id_trigger
BEFORE INSERT ON feedbacks
FOR EACH ROW
BEGIN
  SET NEW.feedback_id = UUID();
END;
