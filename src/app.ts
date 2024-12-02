import "dotenv/config";
import express from "express";
import dbConnect from "./config/dbConnect";
import errorHandler from "./middlewares/errorHandler";
import loadRoutes from "./routes";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware para usar morgan para loguear las peticiones
app.use(morgan("dev"));

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to log incoming requests
app.use(express.urlencoded({ extended: false }));

// Middleware para manejar cookies
app.use(cookieParser());

// Cargar las rutas antes del manejador de errores
loadRoutes(app);

// Middleware de manejo de errores debe ir al final
app.use(errorHandler);

app.listen(PORT, async () => {
  /*  console.log(`Server is running on port ${PORT}`); */
  logger.info(`Server is running on port ${PORT}`);

  await dbConnect();
});
