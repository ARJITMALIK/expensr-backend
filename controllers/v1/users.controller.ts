import { Request, Response } from "express";
import { UsersModel } from "../../models/v1/users.model";
import { Constants } from "../../utils/constants.util";
import { ResponseEntity } from "../../entities/core/response.entity";
import MasterController from "../master.controller";
import bcrypt from 'bcrypt';

export class UsersController extends MasterController {

    private usersModel: UsersModel;

    constructor() {
        super();

        this.usersModel = new UsersModel();

        //bindings
        this.getUserInfo = this.getUserInfo.bind(this);
        this.createUpdateUser = this.createUpdateUser.bind(this);
    }

    async getUserInfo(req: Request, res: Response) {
        const startMS = new Date().getTime();
        let resModel = { ...ResponseEntity }
        let params;
        try {
            params = req.query;
            resModel = await this.usersModel.fetch(params);

            resModel.endDT = new Date();
            resModel.tat = (new Date().getTime() - startMS) / 1000;
            res.status(Constants.HTTP_OK).json(resModel);
        } catch (error) {
            resModel.status = -9;
            resModel.info = "catch: " + error + " : " + resModel.info;
            this.logger.error(JSON.stringify(resModel), 'getUserInfo : controller');
        } 
    }

    async createUpdateUser(req: Request, res: Response) {
        const startMS = new Date().getTime();
        let resModel = { ...ResponseEntity }
        let payload;
        try {
            payload = req.body;

            /** make sure required keys exist */
            var verifyKeys = this.verifyKeys(req.body, ['firstname', 'lastname', 'email', 'password']);
            if (verifyKeys.length != 0) {
                resModel.status = -9;
                resModel.info = "error: " + verifyKeys + " : " + resModel.info;
                return res.status(Constants.HTTP_BAD_REQUEST).json(resModel);
            }

            /** make sure required fields are not empty */
            var mandatoryFields = this.mandatoryFields(req.body, ['firstname', 'email', 'password']);
            if (mandatoryFields.length != 0) {
                resModel.status = -9;
                resModel.info = "error: " + mandatoryFields + " : " + resModel.info;
                return res.status(Constants.HTTP_BAD_REQUEST).json(resModel);
            }

            // email verification
            if (payload.hasOwnProperty("email") && payload.email.length != 0) {
                var verifyEmail: any = this.methods.verifyEmail(req.body.email);
                if (!verifyEmail) {
                    resModel.status = -9;
                    resModel.info = "error: " + "Please provide a valid email" + " : " + resModel.info;
                    return res.status(Constants.HTTP_BAD_REQUEST).json(resModel);
                }

                /** make sure email does not exist already */
                var verifyEmail: any = await this.usersModel.fetch({ email: req.body.email, status: [1] });
                if (!this.methods.empty(verifyEmail)) {
                    resModel.status = -9;
                    resModel.info = "error: " + "This email already exists" + " : " + resModel.info;
                    return res.status(Constants.HTTP_BAD_REQUEST).json(resModel);
                }
            }

            const hashedPass = await bcrypt.hash(payload.password, 10);
            payload.password = hashedPass;

            resModel = await this.usersModel.createUpdateEntity(payload, "user_master", "user_id");

            resModel.endDT = new Date();
            resModel.tat = (new Date().getTime() - startMS) / 1000;
            res.status(Constants.HTTP_OK).json(resModel);

        } catch (error) {
            resModel.status = -9;
            resModel.info = "catch: " + error + " : " + resModel.info;
            this.logger.error(JSON.stringify(resModel), 'createUpdateUser : controller');
        }
    }
}