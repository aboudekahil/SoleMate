CREATE TRIGGER IF NOT EXISTS set_omt_payment_id_trigger
BEFORE INSERT ON omt_payments
FOR EACH ROW
BEGIN
  SET NEW.omt_payment_id = UUID();
END;
