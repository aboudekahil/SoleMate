import { ZodError } from "zod";
import { ErrorType } from "./httpErrorHandling";

export function parseErrorMessages(errorMessages: ZodError): ErrorType {
  const errors = [];

  for (const error of errorMessages.errors) {
    const field = error.path.join(".");
    let message = error.message;

    if (error.code === "invalid_type" && error.expected && error.received) {
      message = `Expected '${error.expected}', but received '${error.received}'`;
    } else if (
      "validation" in error &&
      error.validation === "email" &&
      error.code === "invalid_string"
    ) {
      message = "Invalid email";
    }

    errors.push({ field, message });
  }

  return errors as ErrorType;
}
