const { prisma } = require("../config/helpers");

async function getComment(req, res) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });

  return res.json(comment);
}

async function getCommentsByPostId(req, res) {
  const postId = Number(req.params.id);
  const Comments = await prisma.comment.findMany({
    where: {
      isActive: true,
      postId: postId,
    },
    // orderBy: {
    //   created_at: "desc",
    // },
  });

  return res.json(Comments);
}

async function createComment(req, res, next) {
  try {
    const post = {
      comment: req.body.comment,
      audienceId: req.user.id,
      postId: Number(req.body.postId),
    };

    const Post = await prisma.comment.create({
      data: post,
      include: {
        User: true,
      },
    });

    return res.json(Post);
  } catch (err) {
    next(err);
  }
}

async function deleteComment(req, res, next) {
  const id = Number(req.params.id);

  const Comment = await prisma.comment.update({
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
    message: "Comment has been deleted.",
  });
}

module.exports = {
  getComment,
  getCommentsByPostId,
  createComment,
  deleteComment,
};
