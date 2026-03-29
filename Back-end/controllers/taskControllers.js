const taskModel = require("../models/taskModels");
const taskService = require("../services/taskService");
const taskControllers = {
  add: async (req, res) => {
    const userId = req.auth.userId;
    try {
      const { description } = req.body;

      await taskService.addTask(description, userId);

      // 201 status created -> une resource a été crée / 200 aussi valide dans ce cas.
      res.status(201).json({
        message: "La tâche a été inséré.",
      });
    } catch (error) {
      res.status(400).json({
        message: "Erreur lors de l'insertion.",
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const userId = req.auth.userId;
      const description = req.query.description ?? "";

      const response = await taskService.getAllTasks(userId, description);

      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Erreur lors de la récupération des tâches.",
      });
    }
  },

  delete: async (req, res) => {
    try {
      const userId = req.auth.userId;
      const taskId = req.params.taskId;
      await taskService.deleteTask(userId, taskId);
      res.status(200).json({
        message: "la tache à bien été supprimée",
      });
      console.log("la tache à bien été supprimée");
    } catch (error) {
      console.log(error);
    }
  },

  update: async (req, res) => {
    try {
      const userId = req.auth.userId;
      const taskId = req.params.taskId;
      const description = req.body.description;
      await taskService.updateTask(userId, taskId, description);
      res.status(200).json({
        message: "la tache à bien été mise à jour",
      });
    } catch (error) {
      console.log(error);
    }
  },

  updateCheckboxTask: async (req, res) => {
    try {
      const userId = req.auth.userId;
      const taskId = req.params.taskId;
      const is_done = req.body.is_done;
      await taskService.updateTaskStatus(is_done, userId, taskId);
      res.status(200).json({
        message: "la tache à bien été mise à jour",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = taskControllers;
