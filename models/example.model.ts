import { QueryEntity } from "../entities/core/query.entity";
import { ResponseEntity } from "../entities/core/response.entity";
import { Constants } from "../utils/constants.util";
import MasterModel from "./master.model";

export class ExampleModel extends MasterModel {

    constructor() {
        super();
    }

    async getAllInfo(payload: { id: number }) {
        const startMS = new Date().getTime();
        const resModel = {...ResponseEntity}
        let queryModel = {...QueryEntity}
        let query = "";
        try {

            query = `
SELECT id from example
            `;
            queryModel = await this.sql.executeQuery(query);

            /* Unchange Method Validate Query */
            if (queryModel.status == Constants.SUCCESS) {
                resModel.status = queryModel.status;
                resModel.info =
                    "OK: DB Query: " +
                    queryModel.info +
                    " : " +
                    queryModel.tat +
                    " : " +
                    queryModel.message;
                resModel.data = queryModel;
            } else {
                resModel.status = Constants.ERROR;
                resModel.info = "ERROR: DB Query: " + JSON.stringify(queryModel);
            }
        } catch (error) {
            resModel.status = -33;
            resModel.info = "catch : " + resModel.info + " : " + error;
            this.logger.error(JSON.stringify(resModel), 'getAllInfo: model');
        } finally {
            try {
                resModel.tat = (new Date().getTime() - startMS) / 1000;
            } catch (error) {
                this.logger.error(error, "createUpdateInfo : model")
                throw new Error(`${error}`);
            }
        }

        return resModel;
    }

    public async createUpdateInfo(payload: {
        infoId: number,
        id: number
    }) {
        const startMS = new Date().getTime();
        const resModel = {...ResponseEntity}
        let queryModel = {...QueryEntity}
        let query = "";
        try {
            query = `INSERT INTO exampleTable (${Object.keys(payload)}) VALUES (${Object.values(payload).map(val => `'${this.methods._MYSQLTEXT_HANDLE(`${val}`)}'`)}) `
                + ` ${this.methods._OnDuplicate(this.methods._RemoveElementArray(Object.keys(payload), 'infoId'))} `
            // Execute Query
            queryModel = await this.sql.executeQuery(query);

            if (queryModel.status == Constants.SUCCESS) {
                resModel.status = queryModel.status;
                resModel.info =
                    "OK: DB Query: " +
                    queryModel.info +
                    " : " +
                    queryModel.tat +
                    " : " +
                    queryModel.message;
                resModel.data = queryModel;
            } else {
                resModel.status = Constants.ERROR;
                resModel.info = "ERROR: DB Query: " + JSON.stringify(queryModel);
            }
        } catch (error) {
            resModel.status = -33;
            resModel.info = "catch : " + resModel.info + " : " + error;
            this.logger.error(JSON.stringify(resModel), 'createUpdateInfo : model');
        } finally {
            try {
                resModel.tat = (new Date().getTime() - startMS) / 1000;
            } catch (error) {
                this.logger.error(error, "createUpdateInfo : model")
                throw new Error(`${error}`);
            }
        }

        return resModel;
    }
}