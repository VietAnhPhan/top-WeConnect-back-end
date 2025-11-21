const { Router } = require("express");
const { prisma } = require("../config/helpers");

const router = Router();

router.get("/", async (req, res) => {
  const sessions = await prisma.session.findMany();
  return res.json(sessions);
});

module.exports = router;
