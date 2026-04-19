const mysql = require('mysql2/promise');

async function runTasks() {
    console.log('--- Демонстрація роботи mysql2 (Завдання 1-5) ---');

    // підключення до mysql сервера (без вказування конкретної бази даних)
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '84758475'
    });

    console.log('1. Перевірка та створення бази даних web_backend_lab (якщо її ще не існує)...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS web_backend_lab;`);

    // переключення на створену базу даних
    await connection.query(`USE web_backend_lab;`);

    console.log('2. Перевірка та створення таблиць users та orders (якщо їх ще не існує)...');
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
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    console.log('3 & 5. Виконання SQL-запитів з Node.js...');

    // insert
    console.log('--> INSERT заявка у таблиці:');
    await connection.query(`INSERT IGNORE INTO users (username, email) VALUES ('Ivan', 'ivan@example.com');`);

    // отримуємо id для подальшого використання
    const [[user]] = await connection.query(`SELECT id FROM users WHERE email = 'ivan@example.com' LIMIT 1;`);
    const userId = user.id;

    await connection.query(`INSERT INTO orders (user_id, total_amount, status, createdAt, updatedAt) VALUES (?, 450.00, 'completed', NOW(), NOW());`, [userId]);
    console.log(`Додано користувача з id = ${userId} та його замовлення.`);

    // select
    console.log('--> SELECT (Отримання даних):');
    const [rows] = await connection.query(`SELECT users.username, orders.total_amount, orders.status FROM users JOIN orders ON users.id = orders.user_id;`);
    console.log('Результат:', rows);

    // update
    console.log('--> UPDATE (Оновлення даних):');
    await connection.query(`UPDATE users SET username = 'Ivan_Updated' WHERE id = ?;`, [userId]);
    const [updatedUser] = await connection.query(`SELECT * FROM users WHERE id = ?;`, [userId]);
    console.log('Оновлений користувач:', updatedUser[0]);

    // delete (очищення даних після тесту)
    console.log('--> DELETE (Видалення):');
    const [deleteResult] = await connection.query(`DELETE FROM users WHERE id = ?;`, [userId]);
    console.log(`Видалено користувача (записів: ${deleteResult.affectedRows}). Усі його замовлення теж видалено автоматично через ON DELETE CASCADE!`);

    console.log('Усі завдання mysql2 виконано успішно!');
    await connection.end();
}

runTasks().catch(console.error);
