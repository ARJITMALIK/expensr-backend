import { Router } from "express";
import { UsersController } from "../controllers/v1/users.controller";
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
    const usersController = new UsersController();

    // user routes
    this.router.get(`/users`, usersController.getUserInfo);
    this.router.post(`/users`, usersController.createUpdateUser);
  }
}