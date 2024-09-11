import dotenv from "dotenv";
import Logger from "../utils/logger.util";
import * as mysql from 'mysql2'
import { Constants } from "../utils/constants.util";
import { QueryEntity } from "../entities/core/query.entity";
import Methods from "../utils/method.util";

dotenv.config();



export default class MySqlMaster {
  autoCommit = true;
  private methods: Methods;
  private logger: Logger;

  private db_host_ip: string = process.env.SQL_DB_HOST_IP + "";
  private db_port: number = Number(process.env.SQL_DB_PORT + "");
  private db_name: string = process.env.SQL_DB_NAME + "";
  private db_user: string = process.env.SQL_DB_USER + "";
  private db_password: string = process.env.SQL_DB_PASSWORD + "";
  // let db_conn_count: number = Number(process.env.MYSQL_DB_CONN_COUNT + "");

  public connPool;

  constructor() {
    this.methods = new Methods();
    this.logger = new Logger();
  }

  connect() {
    const dbConnectionInfo = {
      host: this.db_host_ip,
      port: this.db_port,
      database: this.db_name,
      user: this.db_user,
      password: this.db_password,
      dateStrings: true,
      // multipleStatements: true,
      connectionLimit: 1000, //mysql connection pool length, ie DB Connections in pool
    };


    //create mysql connection pool
    this.logger.info(
      "DB Connection Pool: Starting: DB Name :: " + JSON.stringify(dbConnectionInfo.database), 'DB CONN POOL'
    );
    this.connPool = mysql.createPool(dbConnectionInfo);
    this.logger.info("DB Connection Pool: Success", 'DB CONN POOL');
  }

  //query result
  executeQuery(query: string): Promise<typeof QueryEntity> {
    let promise: any;
    let startMS = new Date().getTime();
    let queryModel = { ...QueryEntity }
    try {
      promise = new Promise((resolve, reject) => {
        this.connPool.query(
          query,
          async <T extends typeof QueryEntity>(
            err: any,
            results: T,
            fields: any
          ): Promise<void> => {
            // in case of errror in executing the query rejecting the request
            if (err) {
              //throw new Error('Error in Query Execution: ' + err);
              queryModel.status = Constants.DB_QUERY_ERROR;
              queryModel.info =
                "DB: executeQuery(): ERROR: " + JSON.stringify(err);
              //reject(model);
            } else {
              //SUCCESS
              queryModel.status = Constants.SUCCESS;
              queryModel.info = "SUCCESS";
              // check for select query results i.e JSON ARRAY of selected Rows
              if (Array.isArray(results)) {
                queryModel.fetchedRows = results.length;
                queryModel.rows = results;
                queryModel.info =
                  queryModel.info +
                  ": 1, fetchedRows: " +
                  queryModel.fetchedRows;
              } else if (this.methods.isObject(results)) {
                queryModel.affectedRows = results.affectedRows;
                queryModel.fieldCount = results.fieldCount;
                queryModel.insertId = results.insertId;
                queryModel.message = results.message;
                queryModel.protocol41 = results.protocol41;
                queryModel.serverStatus = results.serverStatus;
                queryModel.warningCount = results.warningCount;
              }
            } // end else

            // finally resolving the request
            queryModel.tat = (new Date().getTime() - startMS) / 1000;
            // logger.log('results: ' + JSON.stringify(results));
            resolve(queryModel);
          }
        ); // close conn pool
      }); // close promise

      return promise;
    } catch (error) {
      throw new Error("executeQuery: " + error);
    } finally {
      try {
        queryModel.endDT = new Date();
      } catch (error) { }
      try {
        queryModel.tat = (new Date().getTime() - startMS) / 1000;
      } catch (error) { }
    }
  }

  //query with arguments
  executeQueryArgs(sql: any, args: any) {
    let promise;
    let startMS = new Date().getTime();
    let queryModel = { ...QueryEntity };
    try {
      promise = new Promise((resolve, reject) => {
        this.connPool.query(sql, args, async (err, results: any, fields) => {
          // in case of errror in executing the query rejecting the request
          if (err) {
            //throw new Error('Error in Query Execution: ' + err);
            queryModel.status = Constants.DB_QUERY_ERROR;
            queryModel.info =
              "DB: executeQuery(): ERROR: " + JSON.stringify(err);
            //reject(model);
          } else {
            //SUCCESS
            queryModel.status = Constants.SUCCESS;
            queryModel.info = "SUCCESS";
            // check for select query results i.e JSON ARRAY of selected Rows
            if (Array.isArray(results)) {
              queryModel.fetchedRows = results.length;
              queryModel.rows = results;
              queryModel.info =
                queryModel.info + ": 1, fetchedRows: " + queryModel.fetchedRows;
            } else if (this.methods.isObject(results)) {
              queryModel.affectedRows = results.affectedRows;
              queryModel.fieldCount = results.fieldCount;
              queryModel.insertId = results.insertId;
              queryModel.message = results.message;
              queryModel.protocol41 = results.protocol41;
              queryModel.serverStatus = results.serverStatus;
              queryModel.warningCount = results.warningCount;
            }
          } // end else

          // finally resolving the request
          queryModel.tat = (new Date().getTime() - startMS) / 1000;
          // logger.log('results: ' + JSON.stringify(results));
          resolve(queryModel);
        }); // close conn pool
      }); // close promise

      return promise;
    } catch (error) {
      throw new Error("executeQuery: " + error);
    } finally {
      try {
        queryModel.endDT = new Date();
      } catch (error) { }
      try {
        queryModel.tat = (new Date().getTime() - startMS) / 1000;
      } catch (error) { }
    }
  }

  async getEnvKey(payload: string) {
    let query = "select * from `env` where key_id = '" + payload + "'";
    let queryModel: any;
    try {
      queryModel = await this.executeQuery(query);

      if (queryModel.rows.length == 1) {
        let temp = queryModel.rows[0].value;
        return temp;
      } else {
        // throw new Errro/
      }
    } catch (error) {
      throw new Error("getEnvKey error :: " + error);
    }
  }
};