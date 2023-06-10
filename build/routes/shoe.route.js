"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ShoeController = __importStar(require("../controllers/shoe.controller"));
const multer_config_1 = require("../config/multer.config");
const router = express_1.default.Router({ mergeParams: true });
router.post("/", ShoeController.multerErrorHandlerMiddleware(multer_config_1.upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
    { name: "sides1", maxCount: 1 },
    { name: "sides2", maxCount: 1 },
    { name: "tag", maxCount: 1 },
    { name: "insole", maxCount: 1 },
    { name: "box_front", maxCount: 1 },
    { name: "box_tag", maxCount: 1 },
    { name: "box_date", maxCount: 1 },
    { name: "other", maxCount: 5 },
])), ShoeController.addShoe);
router.get("/", ShoeController.getShoes);
exports.default = { prefix: "shoe", router };
