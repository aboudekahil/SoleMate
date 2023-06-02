"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routers_config_1 = require("./config/routers.config");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3001;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
(0, routers_config_1.configRouters)(app);
app.listen(PORT, async () => {
    console.log("Database connected");
    console.log("SERVER IS UP ON PORT:", PORT);
});
app.use("/static", express_1.default.static(path_1.default.join(process.cwd(), "public")));
