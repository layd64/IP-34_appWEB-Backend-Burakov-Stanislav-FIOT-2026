const request = require('supertest');

const API_URL = 'http://localhost:3000';

describe('Bookstore API — Books', () => {
    test('GET /api/books — повертає список книг', async () => {
        const response = await request(API_URL).get('/api/books');
        expect(response.statusCode).toBe(200);
        expect(response.body.source).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.books).toBeInstanceOf(Array);
    });

    test('GET /api/books — кешування (поле source)', async () => {
        // перший запит: може бути 'датабаза' або 'кеш' (залежно від стану кешу)
        const first = await request(API_URL).get('/api/books');
        expect(first.statusCode).toBe(200);
        expect(['database', 'cache']).toContain(first.body.source);

        // другий запит завжди з кешу (тртл 60c)
        const second = await request(API_URL).get('/api/books');
        expect(second.statusCode).toBe(200);
        expect(second.body.source).toBe('cache');
    });

    test('GET /api/books — пагінація (limit=3)', async () => {
        const response = await request(API_URL).get('/api/books?limit=3&page=1');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.books.length).toBeLessThanOrEqual(3);
    });

    test('GET /api/books — фільтр за жанром', async () => {
        const response = await request(API_URL).get('/api/books?genre=Поезія');
        expect(response.statusCode).toBe(200);
        const books = response.body.data.books;
        books.forEach(book => {
            expect(book.genre).toBe('Поезія');
        });
    });

    test('GET /api/books/:id — повертає книгу за ID', async () => {
        const response = await request(API_URL).get('/api/books/1');
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('id', 1);
        expect(response.body.data).toHaveProperty('title');
        expect(response.body.data).toHaveProperty('author');
        expect(response.body.data).toHaveProperty('price');
    });

    test('GET /api/books/9999 — 404 для неіснуючої книги', async () => {
        const response = await request(API_URL).get('/api/books/9999');
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    test('POST /api/books — відхиляє запит без авторизації', async () => {
        const response = await request(API_URL)
            .post('/api/books')
            .send({ title: 'Тест', author: 'Автор', genre: 'Поезія', price: 100 });
        expect(response.statusCode).toBe(401);
    });
});

describe('Bookstore API — Auth', () => {
    test('POST /api/auth/register — валідація: короткий пароль', async () => {
        const response = await request(API_URL)
            .post('/api/auth/register')
            .send({ username: 'TestUser', email: 'test@example.com', password: '123', confirmPassword: '123' });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    test('POST /api/auth/login — помилковий логін', async () => {
        const response = await request(API_URL)
            .post('/api/auth/login')
            .send({ email: 'wrong@example.com', password: 'wrongpass' });
        expect([400, 401, 404, 429]).toContain(response.statusCode);
    });

    test('GET /api/users/profile — відхиляє без токена', async () => {
        const response = await request(API_URL).get('/api/users/profile');
        expect(response.statusCode).toBe(401);
    });
});

describe('Bookstore API — Security headers (Helmet)', () => {
    test('Заголовки безпеки присутні', async () => {
        const response = await request(API_URL).get('/api/books');
        expect(response.headers['x-dns-prefetch-control']).toBeDefined();
        expect(response.headers['x-frame-options']).toBeDefined();
        expect(response.headers['x-content-type-options']).toBeDefined();
    });
});
