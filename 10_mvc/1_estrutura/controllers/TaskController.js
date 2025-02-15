const Task = require("../models/Task");

module.exports = class TaskController {
  static createTask(req, res) {
    res.render("tasks/create");
  }

  static async createTaskSave(req, res) {
    const { title, description } = req.body;
    const task = {
      title,
      description,
      done: false,
    };

    await Task.create(task);

    res.redirect("/tasks");
  }

  static async showTasks(req, res) {
    const tasks = await Task.findAll({ raw: true });

    res.render("tasks/all", { tasks });
  }

  static async removeTask(req, res) {
    const { id } = req.body;
    await Task.destroy({ where: { id: id } });
    res.redirect("/tasks");
  }

  static async updateTask(req, res) {
    const { id } = req.params;
    const task = await Task.findOne({ raw: true, where: { id } });
    res.render("tasks/edit", { task });
  }

  static async updateTaskPost(req, res) {
    const { id, title, description } = req.body;

    const task = {
      title,
      description,
    };

    await Task.update(task, { where: { id } });

    res.redirect("/tasks");
  }

  static async toggleTaskStatus(req, res) {
    const { id, done } = req.body;
    const task = {
      done: done === "0" ? true : false,
    };

    await Task.update(task, { where: { id } });

    res.redirect("/tasks");
  }
};
