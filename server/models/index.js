const sequelize = require('../db');
const User = require('./User');
const Order = require('./Order');
const Book = require('./Book');
const Review = require('./Review');
const Subscriber = require('./Subscriber');

// завдання 8: реалізація зв'язку one-to-many
User.hasMany(Order, {
    foreignKey: 'user_id',
    as: 'orders',
    onDelete: 'CASCADE'
});

Order.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// Зв'язок для улюблених книг (many-to-many)
User.belongsToMany(Book, {
    through: 'UserFavorites',
    as: 'favorites',
    foreignKey: 'userId',
    otherKey: 'bookId'
});

Book.belongsToMany(User, {
    through: 'UserFavorites',
    as: 'favoritedBy',
    foreignKey: 'bookId',
    otherKey: 'userId'
});

// Зв'язок для відгуків (one-to-many: User -> Reviews, Book -> Reviews)
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Book.hasMany(Review, { foreignKey: 'bookId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

module.exports = {
    sequelize,
    User,
    Order,
    Book,
    Review,
    Subscriber
};
