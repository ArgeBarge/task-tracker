import mysql from "mysql2/promise"
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})

export const pool = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: process.env.DB_PASS,
    database: "task_tracker",
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    port: 3306
})

export default pool;
