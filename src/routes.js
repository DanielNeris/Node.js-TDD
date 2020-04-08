const { Router } = require("express");

const RepositoriesController = require("./app/controllers/RepositoriesController");
const LikeController = require("./app/controllers/LikeController");

const validateProjectId = require("./app/middlewares/repositories");

const routes = new Router();

routes.get("/repositories", RepositoriesController.index);

routes.post("/repositories", RepositoriesController.store);

routes.put(
  "/repositories/:id",
  validateProjectId,
  RepositoriesController.update
);

routes.delete(
  "/repositories/:id",
  validateProjectId,
  RepositoriesController.delete
);

routes.post("/repositories/:id/like", validateProjectId, LikeController.store);

module.exports = routes;
