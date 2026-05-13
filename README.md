# BookStore Pro — Fullstack Web App

Сучасний веб-застосунок для онлайн-магазину книг із повноцінним REST API бекендом.

## Стек технологій

**Бекенд:** Node.js, Express.js, MySQL (Sequelize ORM), Redis, JWT, Docker  
**Фронтенд:** HTML, CSS, Vanilla JS

## Реалізовані вимоги лабораторної роботи

| Вимога | Реалізація |
|--------|-----------|
| REST API (Node.js + Express) | `server/index.js`, `routes/` |
| Захист — Helmet | `app.use(helmet())` у `index.js` |
| Захист — Rate Limit | `middlewares/rateLimiter.js` (5 спроб / 15 хв) |
| Валідація даних | `middlewares/validators.js`, `routes/bookRoutes.js` |
| Кешування відповідей | Redis у `controllers/bookController.js` |
| Оптимізація маршруту | `GET /api/books` — Redis cache (TTL 60s) |
| Тестування API | `server.test.js` (Jest + Supertest, 11 тестів) |
| Аналіз продуктивності | `benchmark.js` — порівняння БД vs Redis |
| JWT-автентифікація | `middlewares/authMiddleware.js`, `controllers/authController.js` |
| Redis-кешування | `docker-compose.yml` (redis:alpine) + `bookController.js` |
| Swagger документація | `swagger.js`, JSDoc у всіх `routes/*.js` → `/api-docs` |
| Docker-контейнеризація | `Dockerfile` + `docker-compose.yml` (app + MySQL + Redis) |
| Навантажувальне тестування | Artillery: `npm run loadtest` |

## Швидкий запуск (Docker)

```bash
cd server
docker-compose up --build
```

Сервер: http://localhost:3000  
Swagger UI: http://localhost:3000/api-docs

Дефолтний адмін: `admin@admin.com` / `admin123`

## Запуск без Docker

```bash
cd server
npm install
# Потрібен запущений MySQL на порту 3306 і Redis на порту 6379
npm start
```

## Тестування

```bash
# Юніт-тести (Jest + Supertest) — сервер має бути запущений
npm test

# Навантажувальне тестування (Artillery)
npm run loadtest

# Benchmark до/після оптимізації
node benchmark.js
```

## Структура проєкту

```
server/
├── controllers/     # Бізнес-логіка
├── middlewares/     # Helmet, JWT, Rate-limit, Validators, Logger
├── models/          # Sequelize моделі (User, Order, Book)
├── routes/          # Express маршрути зі Swagger JSDoc
├── services/        # Поштовий сервіс
├── utils/           # Winston logger
├── swagger.js       # Swagger конфігурація
├── docker-compose.yml
├── Dockerfile
└── server.test.js   # Jest тести

client/              # Фронтенд (HTML/CSS/JS)
```

## Автор
Бураков Станіслав, група ІП-34

