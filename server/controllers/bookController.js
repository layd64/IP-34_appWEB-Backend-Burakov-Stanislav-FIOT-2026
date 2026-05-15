const { validationResult } = require('express-validator');
const { Book } = require('../models/index');
const { Op } = require('sequelize');
const { createClient } = require('redis');

const CACHE_KEY = 'books:all';
const CACHE_TTL = 60; // секунд

//redis клієнт
let redisClient;
(async () => {
    redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: { reconnectStrategy: false }
    });
    redisClient.on('error', (err) => console.error('Redis Error:', err));
    redisClient.on('connect', () => console.log('Redis connected for books'));
    try {
        await redisClient.connect();
    } catch (e) {
        console.error('Redis connection failed:', e.message);
    }
})();

//seed-дані для першого запуску
const SEED_BOOKS = [
    { title: 'Кобзар', author: 'Тарас Шевченко', genre: 'Поезія', price: 300, rating: 5, image: 'assets/kobzar.png', description: 'Збірка віршів видатного українського поета.', stock: 15 },
    { title: 'Кайдашева сімʼя', author: 'Іван Нечуй-Левицький', genre: 'Художня література', price: 450, rating: 4, image: 'assets/book2.png', description: 'Соціально-побутова повість про селянську родину.', stock: 10 },
    { title: 'Енеїда', author: 'Іван Котляревський', genre: 'Поезія', price: 249, rating: 5, image: 'assets/book3.png', description: 'Перший твір написаний живою українською мовою.', stock: 8 },
    { title: 'Лісова пісня', author: 'Леся Українка', genre: 'Драма', price: 320, rating: 5, image: 'assets/book1.webp', description: 'Поетична драма-феєрія.', stock: 12 },
    { title: 'Код майбутнього', author: 'Сара Джонсон', genre: 'Наукова фантастика', price: 550, rating: 4, image: 'assets/books_part2/код_майбутнього.jpeg', description: 'Роман про штучний інтелект.', stock: 7 },
    { title: 'Таємниця океану', author: 'Майкл Чен', genre: 'Детектив', price: 480, rating: 4, image: 'assets/books_part2/таємниця_океану.jpg', description: 'Детектив про зникнення корабля.', stock: 9 },
    { title: 'Захар Беркут', author: 'Іван Франко', genre: 'Художня література', price: 380, rating: 5, image: 'assets/books_part2/захар_беркут.webp', description: 'Повість про боротьбу за незалежність.', stock: 11 },
    { title: '1984', author: 'Джордж Орвелл', genre: 'Антиутопія', price: 450, rating: 5, image: 'assets/books_part2/1984.jpg', description: 'Роман про тоталітарне суспільство.', stock: 14 },
    { title: 'Гаррі Поттер і філософський камінь', author: 'Дж. К. Роулінг', genre: 'Фентезі', price: 480, rating: 5, image: 'assets/books_part2/гаррі_поттер_і_філософський_камень.jpg', description: 'Пригоди юного чарівника.', stock: 20 },
    { title: 'Дюна', author: 'Френк Герберт', genre: 'Наукова фантастика', price: 540, rating: 5, image: 'assets/books_part2/дюна.jpg', description: 'Науково-фантастичний роман.', stock: 6 },
    { title: 'Анна Кареніна', author: 'Лев Толстой', genre: 'Класика', price: 390, rating: 4, image: 'assets/books_part2/анна_кареніна.jpg', description: 'Трагічна історія кохання.', stock: 5 },
    { title: 'Володар перснів', author: 'Дж. Р. Р. Толкін', genre: 'Фентезі', price: 650, rating: 5, image: 'assets/books_part2/володар_перснів.jpg', description: 'Епічне фентезі про боротьбу добра і зла.', stock: 18 },
    { title: 'Війна і мир', author: 'Лев Толстой', genre: 'Класика', price: 700, rating: 4, image: 'assets/books_part2/війна_і_мир.jpg', description: 'Історичний роман-епопея.', stock: 4 },
    { title: 'Гра престолів', author: 'Джордж Р. Р. Мартін', genre: 'Фентезі', price: 620, rating: 5, image: 'assets/books_part2/гра_престолів.jpg', description: 'Перша книга епічної саги.', stock: 25 },
    { title: 'Життя видатних людей', author: 'Різні автори', genre: 'Біографія', price: 290, rating: 4, image: 'assets/books_part2/життя_видатних_людей.jpg', description: 'Біографії відомих особистостей.', stock: 8 },
    { title: 'Космічна одісея', author: 'Артур Кларк', genre: 'Наукова фантастика', price: 410, rating: 5, image: 'assets/books_part2/космічна_одісея.jpg', description: 'Подорож за межі Сонячної системи.', stock: 12 },
    { title: 'Майстер і Маргарита', author: 'Михайло Булгаков', genre: 'Містика', price: 350, rating: 5, image: 'assets/books_part2/майстер_і_маргарита.webp', description: 'Культовий роман зі складною філософією.', stock: 17 },
    { title: 'Пригоди Тома Сойєра', author: 'Марк Твен', genre: 'Дитяча література', price: 280, rating: 4, image: 'assets/books_part2/пригоди_тома_сойєра.jpg', description: 'Класична історія про хлопчика-бешкетника.', stock: 22 },
    { title: 'Романтика вічності', author: 'Олександр Довженко', genre: 'Художня література', price: 310, rating: 4, image: 'assets/books_part2/романтика_вічності.jpg', description: 'Поетична проза про красу життя.', stock: 9 },
    { title: 'Тайна старого замку', author: 'Агата Крісті', genre: 'Детектив', price: 430, rating: 5, image: 'assets/books_part2/тайна_старого_замку.webp', description: 'Заплутана історія вбивства.', stock: 13 },
    { title: 'Тіні забутих предків', author: 'Михайло Коцюбинський', genre: 'Художня література', price: 340, rating: 5, image: 'assets/books_part2/тіні_забутих_предків.jpg', description: 'Трагічна історія кохання гуцулів.', stock: 11 },
    { title: 'Цифрова революція', author: 'Кевін Келлі', genre: 'Наукова література', price: 580, rating: 4, image: 'assets/books_part2/цифрова революція.jpg', description: 'Книга про вплив технологій на суспільство.', stock: 6 },
    { title: 'Шерлок Холмс', author: 'Артур Конан Дойл', genre: 'Детектив', price: 460, rating: 5, image: 'assets/books_part2/шерлок_холмс.jpg', description: 'Збірка оповідань про геніального детектива.', stock: 19 },
    { title: 'Шлях до успіху', author: 'Роберт Кійосакі', genre: 'Мотивація', price: 399, rating: 4, image: 'assets/books_part2/шлях_до_успіху.jpg', description: 'Поради з фінансової грамотності.', stock: 15 }
];

//утиліти
async function invalidateCache() {
    if (redisClient?.isOpen) {
        await redisClient.del(CACHE_KEY);
    }
}

//контролери

/**
 * GET /api/books
 * повернути всі книги
 */
const getBooks = async (req, res, next) => {
    try {
        const { genre, search, minRating, price, sort, page = 1, limit = 20 } = req.query;

        // кешуємо тільки чистий запит: без фільтрів і зі стандартною пагінацією
        const isDefaultPagination = parseInt(page) === 1 && parseInt(limit) === 20;
        const useCache = !genre && !search && !minRating && !price && !sort && isDefaultPagination;

        if (useCache && redisClient?.isOpen) {
            const cached = await redisClient.get(CACHE_KEY);
            if (cached) {
                return res.json({ source: 'cache', data: JSON.parse(cached) });
            }
        }

        const where = {};
        if (genre) where.genre = genre;
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { author: { [Op.like]: `%${search}%` } }
            ];
        }
        if (minRating) {
            where.rating = { [Op.gte]: parseFloat(minRating) };
        }
        if (price) {
            if (price === '600+') {
                where.price = { [Op.gte]: 600 };
            } else {
                const [min, max] = price.split('-');
                if (min !== undefined && max !== undefined) {
                    where.price = { [Op.between]: [parseFloat(min), parseFloat(max)] };
                }
            }
        }

        let order = [['id', 'ASC']];
        if (sort === 'rating-desc') order = [['rating', 'DESC']];
        else if (sort === 'rating-asc') order = [['rating', 'ASC']];
        else if (sort === 'price-desc') order = [['price', 'DESC']];
        else if (sort === 'price-asc') order = [['price', 'ASC']];

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows: books } = await Book.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset,
            order
        });

        const result = {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            books
        };

        // зберігаємо в кеш тільки чисті запити
        if (useCache && redisClient?.isOpen) {
            await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(result));
        }

        res.json({ source: 'database', data: result });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/books/:id
 * повернути одну книгу за id
 */
const getBookById = async (req, res, next) => {
    try {
        const cacheKey = `book:${req.params.id}`;

        if (redisClient?.isOpen) {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                return res.json({ source: 'cache', data: JSON.parse(cached) });
            }
        }

        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: 'Книгу не знайдено' });

        if (redisClient?.isOpen) {
            await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(book));
        }

        res.json({ source: 'database', data: book });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/books  (тільки admin)
 * додати нову книгу
 */
const createBook = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { title, author, genre, price, rating, image, description, stock } = req.body;
        const book = await Book.create({ title, author, genre, price, rating, image, description, stock });

        await invalidateCache();
        res.status(201).json(book);
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/books/:id  (тільки admin)
 * оновити книгу
 */
const updateBook = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: 'Книгу не знайдено' });

        const { title, author, genre, price, rating, image, description, stock } = req.body;
        await book.update({ title, author, genre, price, rating, image, description, stock });

        await invalidateCache();
        if (redisClient?.isOpen) await redisClient.del(`book:${req.params.id}`);

        res.json(book);
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/books/:id  (тільки admin)
 * видалити книгу
 */
const deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: 'Книгу не знайдено' });

        await book.destroy();

        await invalidateCache();
        if (redisClient?.isOpen) await redisClient.del(`book:${req.params.id}`);

        res.json({ message: 'Книгу успішно видалено' });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/books/seed  (тільки admin, одноразово)
 */
const seedBooks = async (req, res, next) => {
    try {
        const count = await Book.count();
        if (count > 0) return res.json({ message: `База вже містить ${count} книг, seed пропущено.` });

        await Book.bulkCreate(SEED_BOOKS);
        await invalidateCache();

        res.status(201).json({ message: `Додано ${SEED_BOOKS.length} книг до бази даних.` });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    seedBooks,
    invalidateCache
};
