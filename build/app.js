"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routers_config_1 = require("./configs/routers.config");
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const PORT = 3001;
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
exports.app.use(body_parser_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, helmet_1.default)());
exports.app.use((0, morgan_1.default)(":method :url :status :res[content-length] - :response-time ms"));
(0, routers_config_1.configRouters)(exports.app);
exports.app.listen(PORT, async () => {
    console.log("SERVER IS UP ON PORT:", PORT);
});
exports.app.use("/static", express_1.default.static(path_1.default.join(process.cwd(), "public")));
