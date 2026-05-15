require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const passport = require('./config/passport-config');
const { sequelize, User, Order, Book } = require('./models/index');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorLogger = require('./middlewares/errorLogger');
const responseTimeLogger = require('./middlewares/responseTimeLogger');
const uploadRoutes = require('./routes/uploadRoutes');
const statusRoutes = require('./routes/statusRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const morgan = require('morgan');

const app = express();
app.set('trust proxy', 1); // Trust first proxy for Render/Railway etc
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// middleware для парсингу json у тілі запитів
app.use(express.json());
app.use(passport.initialize());


// логування HTTP-запитів
app.use(morgan('dev'));

// вимірювання часу відповіді
app.use(responseTimeLogger);


// Serve frontend static files
const path = require('path');
app.use(express.static(path.join(__dirname, '../client')));

// Serve uploaded files (book covers etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// підключення маршрутів
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api', uploadRoutes);
app.use('/', statusRoutes);

// 404 handler for API routes
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Маршрут не знайдено' });
});

// Fallback to index.html for frontend routes (SPA behavior)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// middleware логування помилок має бути останнім
app.use(errorLogger);

// синхронізація з бд та запуск сервера
sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
  .then(() => sequelize.sync())
  .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 1'))
  .then(async () => {
    console.log('Підключення до бази даних через Sequelize успішне, моделі синхронізовані.');

    // seed admin — надійний upsert з env-змінних
    const bcrypt = require('bcrypt');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminUsername = process.env.ADMIN_USERNAME || 'Administrator';

    try {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const [admin, created] = await User.findOrCreate({
        where: { email: adminEmail },
        defaults: {
          username: adminUsername,
          password: hashedPassword,
          role: 'admin',
          isEmailConfirmed: true
        }
      });

      // Якщо вже існує — примусово оновлюємо роль і підтвердження email
      if (!created) {
        await admin.update({
          role: 'admin',
          isEmailConfirmed: true
        });
        console.log(`Admin already exists, ensured role=admin for: ${adminEmail}`);
      } else {
        console.log(`Created default admin: ${adminEmail} / ${adminPassword}`);
      }
    } catch (err) {
      console.error('Failed to seed admin user:', err.message);
    }

    // seed books
    const bookCount = await Book.count();
    if (bookCount === 0) {
      const { seedBooks } = require('./controllers/bookController');
      // Безпосередній виклик seed-логіки
      const SEED_BOOKS = [
        { title: 'Кобзар', author: 'Тарас Шевченко', genre: 'Поезія', price: 300, rating: 5, image: 'assets/kobzar.png', description: 'Збірка віршів видатного українського поета.', stock: 15 },
        { title: 'Кайдашева сімʼя', author: 'Іван Нечуй-Левицький', genre: 'Художня література', price: 450, rating: 4, image: 'assets/book2.png', description: 'Соціально-побутова повість про селянську родину.', stock: 10 },
        { title: 'Енеїда', author: 'Іван Котляревський', genre: 'Поезія', price: 249, rating: 5, image: 'assets/book3.png', description: 'Перший твір написаний живою українською мовою.', stock: 8 },
        { title: 'Лісова пісня', author: 'Леся Українка', genre: 'Драма', price: 320, rating: 5, image: 'assets/book1.webp', description: 'Поетична драма-феєрія.', stock: 12 },
        { title: 'Код майбутнього', author: 'Сара Джонсон', genre: 'Наукова фантастика', price: 550, rating: 4, image: 'assets/books_part2/код_майбутнього.jpeg', description: 'Роман про штучний інтелект.', stock: 7 },
        { title: 'Таємниця океану', author: 'Майкл Чен', genre: 'Детектив', price: 480, rating: 4, image: 'assets/books_part2/таємниця_океану.jpg', description: 'Детектив про зникнення корабля.', stock: 9 },
        { title: 'Захар Беркут', author: 'Іван Франко', genre: 'Художня література', price: 380, rating: 5, image: 'assets/books_part2/захар_беркут.webp', description: 'Повість про боротьбу за незалежність.', stock: 11 },
        { title: '1984', author: 'Джордж Орвелл', genre: 'Антиутопія', price: 450, rating: 5, image: 'assets/books_part2/1984.jpg', description: 'Роман про тоталітарне суспільство.', stock: 14 },
        { title: 'Гаррі Поттер і філософський камінь', author: 'Дж. К. Роулінг', genre: 'Фентезі', price: 480, rating: 5, image: 'assets/books_part2/гаррі_поттер.jpg', description: 'Пригоди юного чарівника.', stock: 20 },
        { title: 'Дюна', author: 'Френк Герберт', genre: 'Наукова фантастика', price: 540, rating: 5, image: 'assets/books_part2/дюна.jpg', description: 'Науково-фантастичний роман.', stock: 6 },
      ];
      await Book.bulkCreate(SEED_BOOKS);
      console.log(`Додано ${SEED_BOOKS.length} книг до бази даних.`);
    }
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Сервер запущено на http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Помилка підключення до бази даних:', err);
  });
