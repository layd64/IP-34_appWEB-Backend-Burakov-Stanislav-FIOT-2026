# BookStore Pro — Fullstack Web App

Сучасний веб-застосунок для онлайн-магазину книг із повноцінним REST API бекендом, адмін-панеллю та системою розсилок.

## Стек технологій

**Бекенд:** Node.js, Express.js, MySQL (Sequelize ORM), Redis, JWT, Docker, Nodemailer  
**Фронтенд:** HTML, CSS, Vanilla JS

## Реалізований функціонал

- **Клієнтська частина:** Каталог книг із "живими" лічильниками категорій, фільтрацією, сортуванням, кошиком, сторінкою профілю та сторінками авторизації.
- **Адмін-панель:** Управління книгами, користувачами, замовленнями та інструмент для масової email-розсилки підписникам.
- **Автентифікація:** JWT-токени (Access/Refresh), OAuth2 (вхід через Google), підтвердження пошти, відновлення пароля.
- **Оптимізація та Безпека:** Кешування запитів у Redis, Helmet, Rate-Limit, перевірка та валідація даних.
- **Документація:** Повністю задокументоване API у Swagger UI.
- **Деплой:** Готове налаштування для розгортання на Render (Web Service) та підключення віддаленої БД (Aiven MySQL).

## Швидкий запуск (Docker)

```bash
cd server
docker-compose up --build
```

Сервер: http://localhost:3000  
Swagger UI: http://localhost:3000/api-docs

Дефолтний адмін: `admin@admin.com` / `admin123`

## Запуск без Docker (Локально)

```bash
cd server
npm install
# Потрібен запущений MySQL та Redis (можна запустити локально або через Docker)
npm run dev
```
*Не забудьте створити файл `server/.env` за зразком та вказати необхідні змінні.*

## Розгортання (Deployment) на Render

Застосунок оптимізовано для безкоштовного хостингу **Render**. 
Для успішного деплою вкажіть такі налаштування під час створення Web Service:
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Root Directory:** `server`

Вам необхідно додати змінну `DB_URI` у форматі `mysql://user:pass@host:port/dbname?ssl-mode=REQUIRED` для підключення керованої БД (наприклад, Aiven). Завдяки спеціальним налаштуванням у `db.js`, сервер автоматично обробляє нестандартні порти та SSL сертифікати хмарних провайдерів.

## Тестування

```bash
# Юніт-тести (Jest + Supertest)
npm test

# Навантажувальне тестування (Artillery)
npm run loadtest

# Benchmark до/після оптимізації
node benchmark.js
```

## Структура проєкту

```
server/
├── controllers/     # Бізнес-логіка (auth, books, users, newsletter)
├── middlewares/     # Helmet, JWT, Rate-limit, Validators, FileUpload
├── models/          # Sequelize моделі (User, Order, Book, Subscriber)
├── routes/          # Express маршрути зі Swagger JSDoc
├── services/        # Поштовий сервіс (Nodemailer)
├── utils/           # Winston logger
├── swagger.js       # Swagger конфігурація
├── docker-compose.yml
├── Dockerfile
└── server.test.js   # Jest тести

client/              # Фронтенд (HTML/CSS/JS)
```

## Автор
Бураков Станіслав, група ІП-34

