"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePostEndpoint = void 0;
const httpErrorHandling_1 = require("../errors/httpErrorHandling");
const validationErrorHandling_1 = require("../errors/validationErrorHandling");
function makePostEndpoint(schema, callback) {
    return async (req, res) => {
        if ("sizes" in req.body) {
            req.body.sizes = JSON.parse(req.body.sizes);
        }
        const result = await schema.safeParseAsync(req.body);
        if (!result.success) {
            return (0, httpErrorHandling_1.handleBadRequest)(res, (0, validationErrorHandling_1.parseErrorMessages)(result.error));
        }
        return callback(req, res);
    };
}
exports.makePostEndpoint = makePostEndpoint;
