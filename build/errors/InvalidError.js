"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidError = void 0;
class InvalidError extends Error {
    errors;
    constructor(errors) {
        super();
        this.errors = errors;
    }
    toString = () => {
        const errors = this.errors.map((error) => {
            return {
                title: error.title,
                message: error.message,
            };
        });
        return JSON.stringify(errors);
    };
}
exports.InvalidError = InvalidError;
