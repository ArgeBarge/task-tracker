import pool from '../db/db.js'

export async function deleteTask(taskId) {
    const sql = `DELETE FROM tasks WHERE taskId=?`
    const values = [taskId]
    const [result] = await pool.execute(sql, values);
    return result;
}
export async function getTasks() {
    const [rows] = await pool.query(
        "SELECT tasks.taskId, creator.username AS creator_username, tasks.taskName, \
        tasks.expiryDate, completer.username as completer_username, tasks.creationDate, \
        JSON_ARRAYAGG( \
            JSON_OBJECT( \
                'id', u.id, \
                'name', u.username \
            ) \
        ) AS ASIGNEES \
        FROM tasks \
        LEFT JOIN tasks_assignees ta ON ta.taskId = tasks.taskId \
        LEFT JOIN users u ON u.id = ta.asigneeId \
        LEFT JOIN users creator ON tasks.userId = creator.id\
        LEFT JOIN users completer ON tasks.completedUserId = completer.id \
        GROUP BY tasks.taskId, tasks.taskName"
    );
    return rows;
}

export async function getCompletedTasks() {
    const [rows] = await pool.query(
        "SELECT tasks.taskId, creator.username AS creator_username, tasks.taskName, \
        tasks.expiryDate, completer.username as completer_username, tasks.creationDate \
        FROM tasks\
        LEFT JOIN users creator ON tasks.userId = creator.id\
        LEFT JOIN users completer ON tasks.completedUserId = completer.id\
        WHERE tasks.completedUserId IS NOT NULL");

    return rows;
}

export async function getExpiredTasks() {
    const [rows] = await pool.query(
        "SELECT tasks.taskId, creator.username AS creator_username, tasks.taskName, \
        tasks.expiryDate, completer.username as completer_username, tasks.creationDate \
        FROM tasks\
        LEFT JOIN users creator ON tasks.userId = creator.id\
        LEFT JOIN users completer ON tasks.completedUserId = completer.id\
        WHERE tasks.completedUserId IS NULL AND tasks.expiryDate < CURDATE()");

    return rows;
}

export async function getCurrentTasks() {
    const [rows] = await pool.query(
        "SELECT tasks.taskId, creator.username AS creator_username, tasks.taskName, \
        tasks.expiryDate, completer.username as completer_username, tasks.creationDate \
        FROM tasks\
        LEFT JOIN users creator ON tasks.userId = creator.id\
        LEFT JOIN users completer ON tasks.completedUserId = completer.id\
        WHERE tasks.completedUserId IS NULL AND tasks.expiryDate > CURDATE() ORDER BY expiryDate");

    return rows;
}

export async function insertTask(body) {
    const { userId, taskName, expiryDate } = body;
    const values = [
        userId,
        taskName ?? null,
        expiryDate ?? null
    ]
    const query = "INSERT INTO tasks (userId, taskName, expiryDate) VALUES (?, ?, ?)"
    const [result] = await pool.execute(query, values)
    return result;
}

export async function modifyTask(req) {
    const id = req.params.taskId

    const updates = req.body;

    try {
        const keys = Object.keys(updates);

        const setClause = keys.map(key => `${key} = ?`).join(", ")
        const values = keys.map(key => updates[key])

        const sql = `UPDATE tasks SET ${setClause} WHERE taskId = ?`;
        console.log(sql)
        console.log(setClause)
        console.log(values)
        console.log(id)
        await pool.execute(sql, [...values, id])
        
    } catch (error) {
        
    }
}