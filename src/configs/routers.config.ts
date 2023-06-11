/**
 * This file is used for configuring all the endpoints in the project, as well
 * as separating the post requests to an /api/ endpoint.
 */

import fs from "fs";
import { Application } from "express";
import path from "path";

export const configRouters = (app: Application) => {
  const basePath = path.join(process.cwd(), "build", "routes");
  const routesDir = fs.readdirSync(basePath);

  for (const routeFile of routesDir) {
    import(path.join(basePath, routeFile)).then((route) => {
      app.use(`/api/v1/${route.default.prefix}`, route.default.router);
    });
  }
};
