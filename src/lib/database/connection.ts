import {Pool} from "@neondatabase/serverless";

const sql = new Pool({ connectionString: process.env.POSTGRES_URL });

export {sql}