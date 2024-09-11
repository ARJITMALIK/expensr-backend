import { Request, Response } from "express";
import { ExampleModel } from "../models/example.model";
import { Constants } from "../utils/constants.util";
import { ResponseEntity } from "../entities/core/response.entity";
import MasterController from "./master.controller";

export class ExampleController extends MasterController {

    private exampleModel: ExampleModel;

    constructor() {
        super();

        this.exampleModel = new ExampleModel();

        //bindings
        this.getAllInfo = this.getAllInfo.bind(this);
        this.createUpdateInfo = this.createUpdateInfo.bind(this);
    }

    async getAllInfo(req: Request, res: Response) {
        const startMS = new Date().getTime();
        let resModel = {...ResponseEntity}
        let payload;
        try {
            payload = req.body;
            resModel = await this.exampleModel.getAllInfo(payload);

        } catch (error) {
            resModel.status = -9;
            resModel.info = "catch: " + error + " : " + resModel.info;
            this.logger.error(JSON.stringify(resModel), 'getAllInfo : controller');
        } finally {
            resModel.endDT = new Date();
            resModel.tat = (new Date().getTime() - startMS) / 1000;
            res.status(Constants.HTTP_OK).json(resModel);
        }
    }

    async createUpdateInfo(req: Request, res: Response) {
        const startMS = new Date().getTime();
        let resModel = {...ResponseEntity}
        let payload;
        try {
            payload = req.body;
            resModel = await this.exampleModel.createUpdateInfo(payload);

        } catch (error) {
            resModel.status = -9;
            resModel.info = "catch: " + error + " : " + resModel.info;
            this.logger.error(JSON.stringify(resModel), 'createUpdateInfo : controller');
        } finally {
            resModel.endDT = new Date();
            resModel.tat = (new Date().getTime() - startMS) / 1000;
            res.status(Constants.HTTP_OK).json(resModel);
        }
    }
}