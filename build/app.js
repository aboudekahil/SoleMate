"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeorm_config_1 = require("./config/typeorm.config");
const sql_migration_runner_1 = require("./utils/sql_migration_runner");
const app = (0, express_1.default)();
const PORT = 3001;
app.use("/", (req, res) => {
    res.send("Hello world!");
});
app.listen(PORT, async () => {
    await typeorm_config_1.AppDataSource.initialize();
    await (0, sql_migration_runner_1.migrationRunner)(typeorm_config_1.AppDataSource.createQueryRunner());
    console.log("Database connected");
    console.log("SERVER IS UP ON PORT:", PORT);
});
