import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import crypto from 'crypto';

// Only initialize Google OAuth strategy if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value, // Save Google profile photo URL
              provider: 'google',
              isEmailVerified: true,
              emailVerifiedAt: new Date(),
              password: crypto.randomBytes(32).toString('hex'), // Random password
              passwordConfirm: crypto.randomBytes(32).toString('hex') // Random password confirmation
            });
          } else {
            // Update existing user's avatar if changed
            if (user.avatar !== profile.photos[0].value) {
              user.avatar = profile.photos[0].value;
              await user.save({ validateBeforeSave: false });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  console.log('✅ Google OAuth strategy initialized');
} else {
  console.log('⚠️ Google OAuth credentials not found. Google login will be disabled.');
}

export default passport;