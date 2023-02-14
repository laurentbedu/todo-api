const mysql = require("mysql2/promise");
// const dotenv = require('dotenv');
// dotenv.config();
// const config = require(`../configs/${process.env.NODE_ENV}.config`)
const config = require("../config");

let db;
async function connect(){
    if(!db){
        const {host, port, database, user, password} = config.db;
        db = await mysql.createConnection({
            host,
            port,
            database,
            user,
            password
        });
    }
    return db;
}

async function query(sql){
    const connection = await connect();
    const [rows] = await connection.query(sql);
    return rows;
}

module.exports = {query};