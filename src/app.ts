import express, { Application } from "express";
import { AppDataSource } from "./config/typeorm.config";
import { migrationRunner } from "./utils/sql_migration_runner";
import bodyParser from "body-parser";
import cors from "cors";
import cookies from "cookie-parser";

const app: Application = express();

const PORT: number = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookies());

app.listen(PORT, async (): Promise<void> => {
  await AppDataSource.initialize();
  await migrationRunner(AppDataSource.createQueryRunner());
  console.log("Database connected");
  console.log("SERVER IS UP ON PORT:", PORT);
});
