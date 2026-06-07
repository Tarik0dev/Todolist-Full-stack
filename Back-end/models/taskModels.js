const pool = require("../config/configDatabase");

const taskModel = {
  create: async ({ description, userId, priority }) => {
    const result = await pool.query(
      "INSERT INTO tasks (description, user_id, priority) VALUES ($1, $2, $3) RETURNING *",
      [description, userId, priority],
    );

    return result.rows[0]
  },
  getAll: async (userId, description) => {
    const desc = (description ?? "").trim();

    let query = "SELECT id, description, is_done FROM tasks WHERE user_id = $1";
    const values = [userId];

    if (desc.length > 0) {
      query += " AND description ILIKE $2";
      values.push(`%${desc}%`);
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);
    return result.rows;
  },

  getTaskStats: async (userId) => {
    const result = await pool.query(
      `
      SELECT 
        COUNT(id) as total,
        COUNT(*) FILTER (WHERE is_done = false) as ongoing,
        COUNT(*) FILTER (WHERE is_done = true) as completed
      FROM tasks 
      WHERE user_id = $1
      `,
      [userId],
    );

    return result.rows[0];
  },

  delete: async (user, taskId) => {
    const result = await pool.query(
      "DELETE FROM tasks WHERE user_id = $1 AND id = $2",
      [user, taskId],
    );
  },
  update: async (userId, taskId, description) => {
    const result = await pool.query(
      "UPDATE tasks SET description = $1 WHERE user_id = $2 AND id = $3",
      [description, userId, taskId],
    );
  },

  updateCheckboxTask: async (is_done, user, taskId) => {
    const result = await pool.query(
      "UPDATE tasks SET is_done = $1 WHERE user_id = $2 AND id = $3",
      [is_done, user, taskId],
    );
  },
};

module.exports = taskModel;
