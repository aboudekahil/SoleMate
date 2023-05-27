CREATE TRIGGER IF NOT EXISTS set_whish_payment_id_trigger
BEFORE INSERT ON whish_payments
FOR EACH ROW
BEGIN
  SET NEW.whishpayment_id = UUID();
END;
