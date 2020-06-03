const { uuid } = require("uuidv4");
const Yup = require("yup");
const repositories = require("../data/data");

class RepositoriesController {
  async index(req, res) {
    try {
      return res.json(repositories);
    } catch (error) {
      return res.status(400).json({ error, success: false });
    }
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        title: Yup.string().required(),
        url: Yup.string().required(),
        techs: Yup.array().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ error: "Validation failed", success: false });
      }

      const { title, url, techs } = req.body;

      const repositorie = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0,
      };

      repositories.push(repositorie);

      return res.status(201).json(repositorie);
    } catch (error) {
      return res.status(400).json({ error, success: false });
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        title: Yup.string(),
        url: Yup.string(),
        techs: Yup.array(),
      });

      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({ error: "Validation failed", success: false });
      }

      const { id } = req.params;

      const { title, url, techs } = req.body;

      const repositorie = repositories.find((r) => r.id === id);

      if (!repositorie)
        return res
          .status(400)
          .json({ error: "Repository not found.", success: false });

      repositorie.title = title;
      repositorie.url = url;
      repositorie.techs = techs;

      return res.json(repositorie);
    } catch (error) {
      return res.status(400).json({ error, success: false });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const repositorie = repositories.findIndex((r) => r.id == id);

      if (repositorie === -1)
        return res
          .status(400)
          .json({ error: "Repository not found.", success: false });

      repositories.splice(repositorie, 1);

      return res.status(204).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error, success: false });
    }
  }
}

module.exports = new RepositoriesController();
