"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_feedback_schema = void 0;
const zod_1 = require("zod");
exports.send_feedback_schema = zod_1.z.object({ content: zod_1.z.string() });
