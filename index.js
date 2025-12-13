require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

const { PrismaClient } = require("./generated/prisma");
const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEON_URL
    : process.env.DATABASE_URL;

const routes = require("./routes/index");
const authRoutes = require("./routes/auth");

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

require("./config/passport");

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      }),
      {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    ),
  })
);

app.use("/sessions", routes.session);
app.use("/api/users", routes.user);
app.use("/api/posts", routes.post);
app.use("/api/auth", authRoutes);
app.use("/api/conversations", routes.conversation);
app.use("/api/messages", routes.message);
app.use("/api/chatmembers", routes.chatMember);
app.use("/api/friendrequests", routes.friendRequest);
app.use("/api/friends", routes.friend);
app.use("/api/comments", routes.comment);
app.use("/api/likes", routes.like);
app.use("/api/followRequests", routes.followRequest);
app.use("/api/notifications", routes.notification);
app.use("/api/postMedias",routes.postMedia)

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json(err);
});

app.get("/", (req, res) => {
  res.json({
    message: "index",
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`App listen on PORT: ${process.env.APP_PORT}`);
});
