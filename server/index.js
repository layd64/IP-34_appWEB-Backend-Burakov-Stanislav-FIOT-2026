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
const studentRoutes = require('./routes/studentRoutes');
const { renderTestPage } = require('./controllers/studentController');
const errorLogger = require('./middlewares/errorLogger');
const responseTimeLogger = require('./middlewares/responseTimeLogger');
const uploadRoutes = require('./routes/uploadRoutes');
const statusRoutes = require('./routes/statusRoutes');
const bookRoutes = require('./routes/bookRoutes');
const morgan = require('morgan');

const app = express();
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


// завдання 2 та інтерфейс для тестування
app.get('/', renderTestPage);

// підключення маршрутів студентів
app.use('/students', studentRoutes);

// маршрути користувачів та їх замовлень тепер знаходяться в userroutes

// підключення маршрутів
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/', uploadRoutes);
app.use('/', statusRoutes);

// middleware логування помилок має бути останнім
app.use(errorLogger);

// синхронізація з бд та запуск сервера
sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
  .then(() => sequelize.sync({ alter: true }))
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
    app.listen(PORT, () => {
      console.log(`Сервер запущено на http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Помилка підключення до бази даних:', err);
  });
