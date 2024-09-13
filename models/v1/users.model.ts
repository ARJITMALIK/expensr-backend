import { QueryEntity } from "../../entities/core/query.entity";
import { ResponseEntity } from "../../entities/core/response.entity";
import { Constants } from "../../utils/constants.util";
import MasterModel from "../master.model";

export class UsersModel extends MasterModel {

    constructor() {
        super();
    }

    async fetch(params: any, limit: number = 1) {
        const startMS = new Date().getTime();
        const resModel = { ...ResponseEntity }
        let queryModel = { ...QueryEntity }
        let query = "";
        let values = [];

        try {

            query = `SELECT `;

            if (params.fields && params.fields.length != 0) {
                query += params.fields;
            } else {
                query += "*";
            }

            query += ' FROM `user_master` WHERE ';

            // filter with user_id
            if (params.user_id && params.user_id.length != 0) {
                query += "user_id = ? AND ";
                values.push(params.user_id);
            }

            // filter with firstname
            if (params.firstname && params.firstname.length != 0) {
                query += "firstname = ? AND ";
                values.push(params.firstname);
            }

            // filter with email
            if (params.email && params.email.length != 0) {
                query += "email = ? AND ";
                values.push(params.email);
            }

            // filter with status
            if (params.status && params.status.length !== 0) {
                var placeholders = params.status.map(() => '?').join(',');
                query += `status IN (${placeholders}) AND `;
                values.push(...params.status);
            }

            // search filter
            if (params.search && params.search.length != 0) {
                query += "((firstname LIKE ?) OR (lastname LIKE ?) OR (email LIKE ?)) AND ";
                values.push("%" + params.search + "%");
                values.push("%" + params.search + "%");
                values.push("%" + params.search + "%");
            }

            // trimming any excess AND or WHERE
            query = this.methods.rtrim(query, "AND ");
            query = this.methods.rtrim(query, "WHERE ");

            // sorting
            if ((params.sorting_type && params.sorting_type.length != 0) && (params.sorting_field && params.sorting_field.length != 0)) {
                query = query + ` ORDER BY ${params.sorting_field} ${params.sorting_type} `;
            }

            // pagination
            if (params.limit && params.limit.length != 0) {
                query = query + " LIMIT ? OFFSET ? ";
                values.push(parseInt(params.limit));
                values.push(parseInt(params.page || 0) * parseInt(params.limit));
            }


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
}