const taskModel = require("../models/taskModels");

async function addTask(description, userId) {
    if (!description || description.length === 0) {
        throw new Error("Description manquante.")
    }
    
    await taskModel.create({
        description,
        userId,
    });
}

async function getAllTasks(userId, description) {

    const tasks = await taskModel.getAll(userId, description);

    const stats = await taskModel.getTaskStats(userId);

    return {
        total: stats.total,
        ongoing: stats.ongoing,
        completed: stats.completed,
        result: tasks,
    };
}

async function deleteTask(userId, taskId) {
    if (!taskId) {
        throw new Error("Veuillez préciser un identifiant de tâche.")
    }
    await taskModel.delete(userId, taskId);
}

async function updateTask(userId, taskId, description) {
    if (!taskId) {
        throw new Error("Veuillez préciser un identifiant de tâche.")
    }
    if (!description || description.length === 0) {
        throw new Error("Description manquante.")
    }
    await taskModel.update(description, userId, taskId);
}

async function updateTaskStatus(status, userId, taskId) {
    if (!taskId) {
        throw new Error("Veuillez préciser un identifiant de tâche.")
    }
    await taskModel.updateCheckboxTask(status, userId, taskId);
}



module.exports = {
    addTask,
    getAllTasks,
    deleteTask,
    updateTask,
    updateTaskStatus
}