import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookies from "cookie-parser";
import { configRouters } from "./config/routers.config";
import path from "path";

const app: Application = express();

const PORT: number = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookies());

configRouters(app);

app.listen(PORT, async (): Promise<void> => {
  console.log("Database connected");
  console.log("SERVER IS UP ON PORT:", PORT);
});

app.use("/static", express.static(path.join(process.cwd(), "public")));
