import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email: profile.emails?.[0].value });
          if (user) {
            // Link existing user to Google ID
            user.googleId = profile.id;
            await user.save();
          } else {
            // Create new user
            user = new User({
              googleId: profile.id,
              email: profile.emails?.[0].value,
              isVerified: true, // Google emails are verified
            });
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error, false);
      }
    }
  )
);

export default passport;
