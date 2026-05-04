require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('./config/passport-config');
const { sequelize, User, Order } = require('./models/index');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const { renderTestPage } = require('./controllers/studentController');
const errorLogger = require('./middlewares/errorLogger');
const responseTimeLogger = require('./middlewares/responseTimeLogger');
const uploadRoutes = require('./routes/uploadRoutes');
const statusRoutes = require('./routes/statusRoutes');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// middleware для парсингу json у тілі запитів
app.use(express.json());
app.use(passport.initialize());


// логування HTTP-запитів
app.use(morgan('dev'));

// вимірювання часу відповіді
app.use(responseTimeLogger);


// завдання 2 та інтерфейс для тестування
app.get('/', renderTestPage);

// підключення маршрутів студентів
app.use('/students', studentRoutes);

// маршрути користувачів та їх замовлень тепер знаходяться в userroutes

// підключення маршрутів
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/', uploadRoutes);
app.use('/', statusRoutes);

// middleware логування помилок має бути останнім
app.use(errorLogger);

// синхронізація з бд та запуск сервера
sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
  .then(() => sequelize.sync({ force: true }))
  .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 1'))
  .then(async () => {
    console.log('Підключення до бази даних через Sequelize успішне, моделі синхронізовані.');

    // seed admin
    const adminEmail = 'admin@admin.com';
    const bcrypt = require('bcrypt');
    let admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isEmailConfirmed: true
      });
      console.log('Created default admin: admin@admin.com / admin123');
    }
    app.listen(PORT, () => {
      console.log(`Сервер запущено на http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Помилка підключення до бази даних:', err);
  });
