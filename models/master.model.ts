import MySqlMaster from "../database/mysql.database";
import { QueryEntity } from "../entities/core/query.entity";
import { ResponseEntity } from "../entities/core/response.entity";
import { Constants } from "../utils/constants.util";
import Logger from "../utils/logger.util";
import Methods from "../utils/method.util";

export default class MasterModel {

    protected logger: Logger;
    protected sql: MySqlMaster;
    protected methods: Methods;

    constructor() {
        this.sql = new MySqlMaster();
        this.logger = new Logger();
        this.methods = new Methods();
    }

    public async createUpdateEntity(payload: any, table: string, key: string) {
        const startMS = new Date().getTime();
        const resModel = { ...ResponseEntity }
        let queryModel = { ...QueryEntity }
        let query = "";
        try {
            query = `INSERT INTO ${table} (${Object.keys(payload)}) VALUES (${Object.values(payload).map(val => `'${this.methods._MYSQLTEXT_HANDLE(`${val}`)}'`)}) `
                + ` ${this.methods._OnDuplicate(this.methods._RemoveElementArray(Object.keys(payload), key))} `

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
            this.logger.error(JSON.stringify(resModel), 'createUpdateEntity : model');
        } finally {
            try {
                resModel.tat = (new Date().getTime() - startMS) / 1000;
            } catch (error) {
                this.logger.error(error, "createUpdateEntity : model")
                throw new Error(`${error}`);
            }
        }

        return resModel;
    }

    public async createMultipleEntities(payload: any, table: string, entities: any[]) {
        const startMS = new Date().getTime();
        const resModel = { ...ResponseEntity }
        let queryModel = { ...QueryEntity }
        let query = "";
        try {

            if (entities.length === 0) {
                resModel.status = Constants.ERROR;
                resModel.info = "ERROR: DB Query: " + JSON.stringify(queryModel);
            }

            /** convert params to fields array */
            const fields = Object.keys(entities[0]); // Assuming all entities have the same fields

            query = `INSERT INTO ${table} (`;
            for (const field of fields) {
                query += "`" + field + "`, ";
            }
            query = this.methods.rtrim(query, ", ") + ") ";
            query += "VALUES ";

            const values = [];
            entities.forEach(entity => {
                const rowValues = Object.values(entity).map(value => {
                    if (value == null) {
                        return null;
                    } else {
                        return (typeof value === "object" ? JSON.stringify(value) : value);
                    }
                });
                query += "(" + rowValues.map(() => "?").join(", ") + "), ";
                values.push(...rowValues);
            });

            query = this.methods.rtrim(query, ", ") + ";";

            // Execute Query
            queryModel = await this.sql.executeQueryArgs(query, values);

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
            this.logger.error(JSON.stringify(resModel), 'createMultipleEntities : model');
        } finally {
            try {
                resModel.tat = (new Date().getTime() - startMS) / 1000;
            } catch (error) {
                this.logger.error(error, "createUpdateInfo : model")
                throw new Error(`${error}`);
            }
        }
    }
}
