const { prisma } = require("../config/helpers");

async function getNotifications(req, res) {
  const comment = await prisma.notification.findMany({
    where: {
      currentUserId: req.user.id,
      isActive: true,
    },
  });

  return res.json(comment);
}

async function createNotification(req, res, next) {
  try {
    const notification = {
      currentUserId: Number(req.body.currentUserId),
      otherUserId: Number(req.body.otherUserId),
      type: req.body.type,
    };

    const Notification = await prisma.notification.create({
      data: notification,
    });

    return res.json(Notification);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotifications,
  createNotification,
};
