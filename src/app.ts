import express, { Application, Request, Response } from "express";
import { AppDataSource } from "./config/typeorm.config";

const app: Application = express();

const PORT: number = 3001;

app.use("/", (req: Request, res: Response): void => {
  res.send("Hello world!");
});

app.listen(PORT, async (): Promise<void> => {
  await AppDataSource.initialize();
  console.log("Database connected");
  console.log("SERVER IS UP ON PORT:", PORT);
});
