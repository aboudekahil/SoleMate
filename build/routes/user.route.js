"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Requires
// ----------------------------------------------------------------------------
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Controller
// ----------------------------------------------------------------------------
const userController = require("../controllers/user.controller");
// exporting
module.exports = router;
