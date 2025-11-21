const { prisma } = require("../config/helpers");

async function getFollowersByUserid(req, res, next) {
  const isFollower = req.query.followers;

  if (!isFollower) {
    return next();
  }

  const followeeId = req.user.id;
  const followers = await prisma.followRequest.findMany({
    where: {
      isActive: true,
      followeeId: followeeId,
    },
    include:{
      follower:true
    }
  });

  return res.json(followers);
}

async function getFollowingsByUserId(req, res, next) {
  const isFollowing = req.query.followings;

  if (!isFollowing) {
    return next();
  }

  const userId = req.user.id;
  const Followings = await prisma.followRequest.findMany({
    where: {
      isActive: true,
      followerId: userId,
    },
    include: {
      followee: true,
    },
  });

  return res.json(Followings);
}

async function createFollowRequest(req, res, next) {
  try {
    const followRequest = {
      followerId: Number(req.body.followerId),
      followeeId: Number(req.body.followeeId),
    };

    const oldFollowRequest = await prisma.followRequest.findFirst({
      where: {
        followerId: followRequest.followerId,
        followeeId: followRequest.followeeId,
      },
    });

    if (oldFollowRequest) {
      return res.json(oldFollowRequest);
    }

    const FollowRequest = await prisma.followRequest.create({
      data: followRequest,
    });

    return res.json(FollowRequest);
  } catch (err) {
    next(err);
  }
}

async function deleteFollowRequest(req, res, next) {
  const id = Number(req.params.id);

  const FollowRequest = await prisma.followRequest.update({
    where: {
      id: id,
      AND: {
        isActive: true,
      },
    },
    data: {
      isActive: false,
    },
  });

  return res.json({
    message: "FollowRequest has been deleted.",
  });
}

module.exports = {
  getFollowersByUserid,
  getFollowingsByUserId,
  createFollowRequest,
  deleteFollowRequest,
};
