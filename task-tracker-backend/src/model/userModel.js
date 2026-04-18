import pool from '../db/db.js'

export async function getAllUsers() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
}

export async function findUser(username) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE username='${username}'`);
    return rows[0];
}

export async function findUserById(id) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id=${id}`);
    return rows[0];
}

export async function insertUser(body) {
    const { username, password } = body;
    const values = [
        username,
        password
    ]
    const query = "INSERT INTO users (username, password) VALUES (?, ?)"
    const [result] = await pool.execute(query, values)
    return result;
}