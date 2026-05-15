const { Review, User, Book } = require('../models/index');
const { invalidateCache } = require('./bookController');

const getReviewsByBookId = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const reviews = await Review.findAll({
            where: { bookId },
            include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
            order: [['createdAt', 'DESC']]
        });
        
        // Форматуємо для фронтенду
        const formattedReviews = reviews.map(r => ({
            id: r.id.toString(),
            bookId: r.bookId,
            userId: r.userId,
            userName: r.user ? r.user.username : 'Невідомий',
            rating: r.rating,
            text: r.text,
            createdAt: r.createdAt
        }));

        res.json(formattedReviews);
    } catch (err) {
        next(err);
    }
};

const updateBookRating = async (bookId) => {
    const reviews = await Review.findAll({ where: { bookId } });
    const book = await Book.findByPk(bookId);
    if (!book) return;

    if (reviews.length === 0) {
        book.rating = 0;
    } else {
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        book.rating = parseFloat((sum / reviews.length).toFixed(1));
    }
    await book.save();
    
    // Інвалідуємо кеш каталогу, щоб оновлений рейтинг був видно одразу
    if (typeof invalidateCache === 'function') {
        await invalidateCache();
    }
};

const addReview = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const { rating, text } = req.body;
        const userId = req.user.id;

        // Перевіряємо чи книга існує
        const book = await Book.findByPk(bookId);
        if (!book) return res.status(404).json({ error: 'Книгу не знайдено' });

        // Перевіряємо чи користувач вже залишив відгук
        const existingReview = await Review.findOne({ where: { bookId, userId } });
        if (existingReview) {
            return res.status(400).json({ error: 'Ви вже залишили відгук на цю книгу' });
        }

        const newReview = await Review.create({
            bookId,
            userId,
            rating,
            text
        });

        await updateBookRating(bookId);

        // Завантажуємо користувача для відповіді
        const user = await User.findByPk(userId, { attributes: ['id', 'username'] });

        const formattedReview = {
            id: newReview.id.toString(),
            bookId: newReview.bookId,
            userId: newReview.userId,
            userName: user ? user.username : 'Невідомий',
            rating: newReview.rating,
            text: newReview.text,
            createdAt: newReview.createdAt
        };

        res.status(201).json({ message: 'Відгук додано!', review: formattedReview });
    } catch (err) {
        next(err);
    }
};

const deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const review = await Review.findByPk(id);
        if (!review) return res.status(404).json({ error: 'Відгук не знайдено' });

        // Користувач може видалити тільки свій відгук (або адмін, але тут просто перевіряємо userId)
        if (review.userId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Ви можете видаляти тільки свої відгуки' });
        }

        const bookId = review.bookId;
        await review.destroy();
        
        await updateBookRating(bookId);
        
        res.json({ message: 'Відгук видалено!' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getReviewsByBookId,
    addReview,
    deleteReview
};
