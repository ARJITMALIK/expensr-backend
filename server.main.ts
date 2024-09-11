import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import MySqlMaster from "./database/mysql.database";
import { Routes } from "./routes/server.routes";
import Logger from "./utils/logger.util";
dotenv.config();

class App {
  public app: express.Application;
  private readonly SERVER_PORT = process.env.SERVER_PORT || 5000;
  private logger: Logger;
  private mysqlDB: MySqlMaster;

  constructor() {
    this.app = express();
    this.logger = new Logger();
    this.mysqlDB = new MySqlMaster();

    // initialize connection pool
    this.mysqlDB.connect();
    this.middlewares();
    this.routes();
    this.listen();
  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    // this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  }

  private routes(): void {
    this.app.use("/", new Routes().router);
  }

  private listen(): void {
    this.app.listen(this.SERVER_PORT, () => {
      this.logger.info(`Server is running on http://localhost:${this.SERVER_PORT}`, 'App.listen');
    });
  }
}

export default new App().app;
