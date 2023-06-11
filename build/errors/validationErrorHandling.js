"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseErrorMessages = void 0;
function parseErrorMessages(errorMessages) {
    const errors = [];
    for (const error of errorMessages.errors) {
        const field = error.path.join(".");
        let message = error.message;
        if (error.code === "invalid_type" && error.expected && error.received) {
            message = `Expected '${error.expected}', but received '${error.received}'`;
        }
        else if ("validation" in error &&
            error.validation === "email" &&
            error.code === "invalid_string") {
            message = "Invalid email";
        }
        errors.push({ field, message });
    }
    return errors;
}
exports.parseErrorMessages = parseErrorMessages;
