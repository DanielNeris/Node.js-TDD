const { isUuid } = require("uuidv4");
module.exports = function validateProjectId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res
      .status(400)
      .json({ error: "Invalid project ID.", success: false });
  }

  return next();
};
