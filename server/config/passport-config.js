const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/index');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'your-client-id.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-client-secret',
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
      try {
          // шукаємо користувача за googleid
          let user = await User.findOne({ where: { googleId: profile.id } });

          if (user) {
              return done(null, user);
          }

          // якщо користувача немає, але є email
          const email = profile.emails[0].value;
          user = await User.findOne({ where: { email } });

          if (user) {
              // оновлюємо існуючого користувача
              user.googleId = profile.id;
              await user.save();
              return done(null, user);
          }

          // створюємо нового користувача
          user = await User.create({
              username: profile.displayName,
              email: email,
              googleId: profile.id,
              isEmailConfirmed: true, // google вже перевірив
              role: 'user'
          });

          return done(null, user);

      } catch (err) {
          return done(err, null);
      }
  }
));

module.exports = passport;
