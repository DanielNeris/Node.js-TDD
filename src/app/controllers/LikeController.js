const repositories = require("../data/data");

class LikeController {
  async store(req, res) {
    try {
      const { id } = req.params;

      const repositorie = repositories.find((r) => r.id === id);

      if (!repositorie)
        return res
          .status(400)
          .json({ error: "Repository not found.", success: false });

      repositorie.likes += 1;

      return res.json({ likes: repositorie.likes });
    } catch (error) {
      return res.status(400).json({ error, success: false });
    }
  }
}

module.exports = new LikeController();
