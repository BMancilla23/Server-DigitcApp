import { Application } from "express";
import fs from "fs";
import path from "path";

const loadRoutes = (app: Application, routesPath = __dirname) => {
  fs.readdirSync(routesPath).forEach((file) => {
    const fullPath = path.join(routesPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadRoutes(app, fullPath);
    } else if (file.endsWith(".routes.ts") && file !== "index.ts") {
      const route = require(fullPath).default;
      if (route) app.use("/api", route); // Nota el prefijo "/api"
    }
  });
};

export default loadRoutes;
