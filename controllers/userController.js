const bcrypt = require("bcryptjs");
const { prisma } = require("../config/helpers");
const jwt = require("jsonwebtoken");
const { generateUsername } = require("unique-username-generator");

async function getUser(req, res) {
  const user = await prisma.user.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });

  return res.json(user);
}

async function getUserByUsername(req, res, next) {
  if (!req.query.username) {
    return next();
  }

  const user = await prisma.user.findFirst({
    where: {
      username: req.query.username,
    },
  });

  return res.json(user);
}

async function searchUsers(req, res, next) {
  if (req.query.search && req.query.search !== "") {
    const User = await prisma.user.findMany({
      where: {
        NOT: {
          username: req.user.username,
        },
        OR: [
          {
            username: { contains: req.query.search, mode: "insensitive" },
          },
          {
            fullname: {
              contains: req.query.search.toLowerCase(),
              mode: "insensitive",
            },
          },
        ],
        isActive: true,
      },
    });
    return res.json(User);
  }

  // if (req.query.username && req.query.username != "") {
  //   const User = await prisma.user.findFirst({
  //     where: {
  //       username: req.query.username,
  //       isActive: true,
  //     },
  //   });
  //   return res.json(User);
  // }
  return next();
}

async function getChatUser(req, res, next) {
  let conversationId = req.query.conversation_id;
  let userId = req.query.auth_id;
  if (!conversationId || conversationId === "" || !userId || userId === "") {
    return next();
  } else {
    const conversation = await prisma.conversation.findFirst({
      where: {
        isActive: true,
        id: Number(conversationId),
      },
      include: {
        ChatMember: {
          where: {
            NOT: {
              userId: Number(userId),
            },
          },
          include: {
            user: true,
          },
        },
      },
    });

    return res.json(conversation.ChatMember[0].user);
  }
}

async function getUsers(req, res) {
  const users = await prisma.user.findMany({
    where: {
      isActive: true,
    },
    // orderBy: {
    //   created_at: "desc",
    // },
  });

  return res.json(users);
}

async function getUsersByHighestFollowers(req, res, next) {
  if (!req.query.top_users) {
    return next();
  }

  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      NOT: {
        id: req.user.id,
      },
    },
    include: {
      followee: true,
    },
    orderBy: {
      follower: {
        _count: "desc",
      },
    },
  });

  return res.json(users);
}

async function createUser(req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      fullname: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };

    const User = await prisma.user.create({
      data: user,
    });

    const userAuth = {
      username: req.body.username,
      password: req.body.password,
    };

    const token = jwt.sign(userAuth, process.env.SECRET_KEY);
    return res.json({ username: User.username, token });
  } catch (err) {
    next(err);
  }
}

async function createGuest(req, res, next) {
  try {
    const username = generateUsername("", 3);
    const password = username;
    const hashedPassword = await bcrypt.hash(password, 10);
    const fullname = username;

    const user = {
      username,
      fullname,
      password: hashedPassword,
    };

    await prisma.user.create({
      data: user,
    });

    const token = jwt.sign({ username, password }, process.env.SECRET_KEY);

    return res.json({ username, token });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    
    req.params.id = parseInt(req.params.id);

    let user = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (key === "password" && value !== "") {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
      } else if (value === "" || !value) {
        continue;
      } else {
        user[key] = value;
      }
    }

    await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: user,
    });

    return res.json(user);
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    let hashedPassword = "";

    if (password !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const User = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.json(User);
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
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

  return res.json(user);
}

module.exports = {
  getUsers,
  getUser,
  searchUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  getChatUser,
  getUsersByHighestFollowers,
  getUserByUsername,
  createGuest,
};
