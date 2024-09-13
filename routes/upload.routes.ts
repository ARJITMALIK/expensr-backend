import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import multer from 'multer';
import { AWSUploadController } from "../controllers/v1/uploads/aws.upload.controller";

const fileSizeLimit = 5 * 1024 * 1024;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: fileSizeLimit } });

export class UploadRoutes {
  public readonly router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {

    // middlewares
    const authMiddleware = new AuthMiddleware();
    
    // controllers
    const awsUploadController = new AWSUploadController();

    // user routes
    this.router.post(`/`, upload.single('file'), awsUploadController.uploadSingleFile);
  }
}