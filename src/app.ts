import dotenv from "dotenv";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookies from "cookie-parser";
import { configRouters } from "./configs/routers.config";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

export const app: Application = express();

const PORT: number = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookies());
app.use(helmet());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

configRouters(app);

app.listen(PORT, async (): Promise<void> => {
  console.log("SERVER IS UP ON PORT:", PORT);
});

app.use("/static", express.static(path.join(process.cwd(), "public")));
