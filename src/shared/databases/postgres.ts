import { Pool, QueryResult } from 'pg';
import * as _ from 'lodash';
import { IPostgres } from './../types';

const postGresConnectionString = process.env.POSTGRES_CONNECTION_STRING

const pool = new Pool({ connectionString: postGresConnectionString });

const create = async (table: string, data: IPostgres): Promise<QueryResult<IPostgres>> => {
    const fields = Object.keys(data);
    const values = Object.values(data);

    const query = {
        text: `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`,
        values: values,
    };

    const result = await pool.query<IPostgres>(query);

    return result;
};

const findAll = async (table: string, conditions: IPostgres, jsonbType: Array<string> = [], arrayType: Array<string> = []): Promise<IPostgres[]> => {
    const columns = Object.keys(conditions);

    const values = Object.values(conditions);

    const whereClause = columns
        .map((column, i) => {
            if (_.isString(values[i]) && _.includes(values[i], '%')) {
                return `${column} ILIKE $${i + 1}`;
            } else if (_.isArray(values[i]) && !_.isEmpty(jsonbType) && !_.isEqual(_.indexOf(jsonbType, column), -1)) {
                if (_.isString(values[i][0])) {
                    return `${column} ?| $${i + 1}`;
                }

                return `${column} @> $${i + 1}`;
            } else if (_.isObject(values[i]) && !_.isEmpty(jsonbType) && !_.isEqual(_.indexOf(jsonbType, column), -1)) {
                if (_.isString(values[i][0])) {
                    return `${column} ?| $${i + 1}`;
                }

                return `${column} @> $${i + 1}`;
            } else if (_.isArray(values[i]) && !_.isEmpty(arrayType) && !_.isEqual(_.indexOf(arrayType, column), -1)) {
                return `${column} && $${i + 1}`;
            } else if (_.isObject(values[i]) && _.isArray(values[i])) {
                return `${column} = ANY($${i + 1})`;
            } else {
                return `${column}=$${i + 1}`;
            }
        })
        .join(' AND ');

    const query = {
        text: `SELECT * FROM ${table} WHERE ${whereClause}`,
        values: [...values],
    };

    const result = await pool.query<IPostgres>(query);

    return result.rows;
};

const update = async (table: string, id: string, data: IPostgres): Promise<QueryResult<IPostgres>> => {
    const fields = Object.keys(data);
    const values = Object.values(data);

    const query = {
        text: `UPDATE ${table} SET ${fields.map((key, i) => `${key}=$${i + 1}`).join(', ')} WHERE id=$${fields.length + 1} RETURNING *`,
        values: [...values, id],
    };

    const result = await pool.query<IPostgres>(query);

    return result;
};

const destroy = async (table: string, id: string): Promise<QueryResult<IPostgres>> => {
    const query = {
        text: `DELETE FROM ${table} WHERE id=$1 RETURNING *`,
        values: [id],
    };

    const result = await pool.query<IPostgres>(query);

    return result;
};

export { create, findAll, update, destroy };