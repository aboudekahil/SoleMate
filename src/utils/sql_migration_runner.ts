import fs from "fs";
import path from "path";
import { QueryRunner } from "typeorm";

const readSqlFile = (filepath: string): string => {
  return fs.readFileSync(filepath).toString();
};

export const migrationRunner = async (
  queryRunner: QueryRunner
): Promise<void> => {
  const basePath = path.join(process.cwd(), "src", "sql");
  const files = fs.readdirSync(basePath);

  const filePaths = files.map((fileName) => {
    return path.join(basePath, fileName);
  });

  for (const filePath of filePaths) {
    const query = readSqlFile(filePath);
    await queryRunner.query(query);
  }
};
