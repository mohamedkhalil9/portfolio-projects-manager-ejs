import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import User from "../models/userModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            // user.verified = profile.emails[0].verified;
            await user.save();

            return cb(null, user);
          } else {
            return cb(null, user);
          }
        }

        const newUser = await User.create({
          firstName: profile.displayName.split(" ")[0],
          lastName: profile.displayName.split(" ")[1],
          email: profile.emails[0].value,
          provider: "google",
          googleId: profile.id,
          profileImg: profile.photos[0].value,
          verified: profile.emails[0].verified,
        });

        return cb(null, newUser);
      } catch (err) {
        cb(err, null);
      }
    },
  ),
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackUrl: "http://localhost:4000/api/v1/auth/github/callback",
      scope: ["user:email"],
    },
    async (acessToken, refreshToken, profile, cb) => {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          if (!user.githubId) {
            user.githubId = profile.id;
            await user.save();

            return cb(null, user);
          } else {
            return cb(null, user);
          }
        }

        const newUser = await User.create({
          firstName: profile.displayName.split(" ")[0],
          lastName: profile.displayName.split(" ")[1],
          email: profile.emails[0].value,
          provider: "github",
          githubId: profile.id,
          profileImg: profile.photos[0].value,
          // verified: profile.emails[0].verified,
        });

        return cb(null, newUser);
      } catch (err) {
        return cb(err, null);
      }
    },
  ),
);
