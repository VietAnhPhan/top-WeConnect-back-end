const { prisma } = require("../config/helpers");

async function getPost(req, res) {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });

  return res.json(post);
}

async function getPosts(req, res) {
  const posts = await prisma.post.findMany({
    where: {
      isActive: true,
    },
    include: {
      author: {
        select: {
          username: true,
          fullname: true,
          avatarPath: true,
        },
      },
      Like: {
        include: {
          User: true,
        },
      },
      Comment: {
        include: {
          User: true,
        },
      },
      _count: {
        select: {
          Like: true,
          Comment: true,
        },
      },
    },
    // orderBy: {
    //   created_at: "desc",
    // },
  });

  return res.json(posts);
}

async function getPostsByUsername(req, res) {
  const username = req.params.username;

  if (!username) {
    return res.json([]);
  }

  const posts = await prisma.post.findMany({
    where: {
      isActive: true,
      author: {
        username: username,
      },
    },
    include: {
      author: {
        select: {
          username: true,
          fullname: true,
          avatarPath: true,
        },
      },
      Comment: {
        include: {
          User: true,
        },
      },
      _count: {
        select: {
          Like: true,
          Comment: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json(posts);
}

async function getTrendingPosts(req, res, next) {
  if (req.query.trending && req.query.trending == "true") {
    const posts = await prisma.post.findMany({
      where: {
        isActive: true,
      },
      include: {
        author: {
          select: {
            username: true,
            fullname: true,
            avatarPath: true,
          },
        },
        Comment: {
          include: {
            User: true,
          },
        },
        _count: {
          select: {
            Like: true,
            Comment: true,
          },
        },
      },
      orderBy: {
        Like: {
          _count: "desc",
        },
      },
    });

    return res.json(posts);
  }
  next();
}

async function createPost(req, res, next) {
  try {
    const post = {
      body: req.body.body,
      authorId: req.user.id,
    };

    const Post = await prisma.post.create({
      data: post,
      include: {
        author: true,
        _count: {
          select: {
            Like: true,
            Comment: true,
          },
        },
      },
    });

    return res.json(Post);
  } catch (err) {
    next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    const postId = parseInt(req.params.id);
    const body = req.body.body;

    const Post = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        body: body,
      },
    });

    return res.json(Post);
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  const id = Number(req.params.id);

  const user = await prisma.user.update({
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
    message: "Post has been deleted.",
  });
}

async function searchPosts(req, res, next) {
  if (req.query.search && req.query.search != "") {
    const Posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            body: { contains: req.query.search, mode: "insensitive" },
          },
        ],
        isActive: true,
      },
      include: {
        author: {
          select: {
            fullname: true,
            username: true,
            avatarPath: true,
          },
        },
        Comment: {
          include: {
            User: true,
          },
        },
        _count: {
          select: {
            Like: true,
            Comment: true,
          },
        },
      },
    });
    return res.json(Posts);
  }
  next();
}

module.exports = {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
  getTrendingPosts,
  getPostsByUsername,
};
