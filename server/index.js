const express = require('express');
const { sequelize, User, Order } = require('./models/index');
const app = express();
const PORT = 3000;

// Middleware для парсингу JSON у тілі запитів
app.use(express.json());

// Завдання 2:Головний маршрут — повертає привітальне повідомлення
app.get('/', (req, res) => {
  res.send('Hello from Node.js server');
});

// масив студентів
let students = [
  { id: 1, name: 'Іванов Іван', group: 'IP-34' },
  { id: 2, name: 'Петренко Петро', group: 'IP-34' },
  { id: 3, name: 'Сидоренко Анна', group: 'IP-35' },
];

// Завдання 3: GET /students - отримати список усіх студентів
app.get('/students', (req, res) => {
  res.json(students);
});

// Завдання 4: POST /students - додати нового студента
app.post('/students', (req, res) => {
  const { id, name, group } = req.body;

  // Валідація: перевіряємо, що всі поля присутні
  if (!id || !name || !group) {
    return res.status(400).json({ error: 'Усі поля (id, name, group) є обовʼязковими' });
  }

  // Перевірка на дублювання id
  const exists = students.find((s) => s.id === id);
  if (exists) {
    return res.status(409).json({ error: `Студент з id=${id} вже існує` });
  }

  const newStudent = { id, name, group };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// Завдання 5: PUT /students/:id — оновити дані студента
app.put('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const index = students.findIndex((s) => s.id === studentId);

  if (index === -1) {
    return res.status(404).json({ error: `Студента з id=${studentId} не знайдено` });
  }

  const { name, group } = req.body;

  if (name) students[index].name = name;
  if (group) students[index].group = group;

  res.json(students[index]);
});

// DELETE /students/:id — видалити студента
app.delete('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const index = students.findIndex((s) => s.id === studentId);

  if (index === -1) {
    return res.status(404).json({ error: `Студента з id=${studentId} не знайдено` });
  }

  const deleted = students.splice(index, 1);
  res.json({ message: `Студента з id=${studentId} видалено`, student: deleted[0] });
});

// Завдання: Sequelize ORM. Отримати всіх користувачів разом з їхніми замовленнями
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({ include: 'orders' });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Додати нового користувача
app.post('/api/users', async (req, res) => {
  try {
    const { username, email } = req.body;
    const newUser = await User.create({ username, email });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Додати нове замовлення для користувача
app.post('/api/users/:userId/orders', async (req, res) => {
  try {
    const { userId } = req.params;
    const { total_amount, status } = req.body;
    const newOrder = await Order.create({ total_amount, status, user_id: userId });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Синхронізація з БД та запуск сервера
sequelize.sync({ alter: true }).then(() => {
  console.log('Підключення до бази даних через Sequelize успішне, моделі синхронізовані.');
  app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Помилка підключення до бази даних:', err);
});
