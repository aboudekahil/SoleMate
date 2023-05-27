"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationRunner = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readSqlFile = (filepath) => {
    return fs_1.default.readFileSync(filepath).toString();
};
const migrationRunner = async (queryRunner) => {
    const basePath = path_1.default.join(process.cwd(), "src", "sql");
    const files = fs_1.default.readdirSync(basePath);
    const filePaths = files.map((fileName) => {
        return path_1.default.join(basePath, fileName);
    });
    for (const filePath of filePaths) {
        const query = readSqlFile(filePath);
        await queryRunner.query(query);
    }
};
exports.migrationRunner = migrationRunner;
