const mysql = require('mysql2/promise');

async function runTasks() {
    console.log('--- Демонстрація роботи mysql2 (Завдання 1-5) ---');

    // Підключення до MySQL сервера (без вказування конкретної бази даних)
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '84758475'
    });

    console.log('1. Створення бази даних web_backend_lab...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS web_backend_lab;`);

    // Переключення на створену базу даних
    await connection.query(`USE web_backend_lab;`);

    console.log('2. Створення таблиць users та orders...');
    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE
        );
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            total_amount DECIMAL(10, 2) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    console.log('3 & 5. Виконання SQL-запитів з Node.js...');

    // INSERT
    console.log('--> INSERT заявка у таблиці:');
    await connection.query(`INSERT IGNORE INTO users (username, email) VALUES ('Ivan', 'ivan@example.com');`);

    // Отримуємо id для подальшого використання
    const [[user]] = await connection.query(`SELECT id FROM users WHERE email = 'ivan@example.com' LIMIT 1;`);
    const userId = user.id;

    await connection.query(`INSERT INTO orders (user_id, total_amount, status) VALUES (?, 450.00, 'completed');`, [userId]);
    console.log(`Додано користувача з id = ${userId} та його замовлення.`);

    // SELECT
    console.log('--> SELECT (Отримання даних):');
    const [rows] = await connection.query(`SELECT users.username, orders.total_amount, orders.status FROM users JOIN orders ON users.id = orders.user_id;`);
    console.log('Результат:', rows);

    // UPDATE
    console.log('--> UPDATE (Оновлення даних):');
    await connection.query(`UPDATE users SET username = 'Ivan_Updated' WHERE id = ?;`, [userId]);
    const [updatedUser] = await connection.query(`SELECT * FROM users WHERE id = ?;`, [userId]);
    console.log('Оновлений користувач:', updatedUser[0]);

    // DELETE (Очищення даних після тесту)
    console.log('--> DELETE (Видалення):');
    const [deleteResult] = await connection.query(`DELETE FROM users WHERE id = ?;`, [userId]);
    console.log(`Видалено користувача (записів: ${deleteResult.affectedRows}). Усі його замовлення теж видалено автоматично через ON DELETE CASCADE!`);

    console.log('Усі завдання mysql2 виконано успішно!');
    await connection.end();
}

runTasks().catch(console.error);
