const { prisma } = require("../config/helpers");

async function create(req, res) {
  const postMedias = req.body.postMedias;
  if (postMedias.length > 0) {
    const data = await prisma.postMedia.createManyAndReturn({
      data: postMedias,
    });
    return res.json(data);
  }
  return res.json([]);
}

module.exports = {
  create,
};
