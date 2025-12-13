const { prisma } = require("../config/helpers");

async function getNotifications(req, res) {
  const Notifications = await prisma.notification.findMany({
    where: {
      currentUserId: req.user.id,
      isActive: true,
    },
    include: {
      OtherUser: true,
    },
  });

  return res.json(Notifications);
}

async function createNotification(req, res, next) {
  try {
    const notification = {
      currentUserId: Number(req.body.currentUserId),
      otherUserId: req.user.id,
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
