const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;
const GitHubStrategy = require("passport-github2").Strategy;
const { prisma } = require("./helpers");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passportField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            username: username,
          },
        });

        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await db.query("SELECT * FROM User WHERE id = ($1)", [id]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (jwtPayload, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            uuid: jwtPayload.uuid,
          },
        });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.APP_PORT}/api/auth/github/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      // return done(err, user);
      // });
      try {
        const User = await prisma.oAuth.findFirst({
          where: {
            profileId: profile._json.id,
          },
        });

        if (!User) {
          const User = await prisma.user.create({
            data: {
              fullname: profile._json.name,
              username: profile.username,
              about: profile.bio,
              avatarPath: profile._json.avatar_url,
              email: profile._json.email,
              password: await bcrypt.hash(profile.username, 10),
            },
          });

          return done(null, User);
        }

        return done(null, User);
      } catch (err) {
        return done(err);
      }
    }
  )
);
