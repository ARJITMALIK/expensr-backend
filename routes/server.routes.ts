import { Router } from "express";
import { ExampleController } from "../controllers/example.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class Routes {
  public readonly router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {

    // middlewares
    const authMiddleware = new AuthMiddleware();
    
    // controllers
    const exampleController = new ExampleController();

    this.router.post(`/info/get-all-info`, authMiddleware.checkAuth, exampleController.getAllInfo);
    this.router.post(`/info/create-update-info`, exampleController.createUpdateInfo);
  }
}