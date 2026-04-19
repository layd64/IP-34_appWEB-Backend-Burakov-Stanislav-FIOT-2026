let students = [
  { id: 1, name: 'Іванов Іван', group: 'IP-34' },
  { id: 2, name: 'Петренко Петро', group: 'IP-34' },
  { id: 3, name: 'Сидоренко Анна', group: 'IP-35' },
];

const renderTestPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="uk">
    <head>
      <meta charset="UTF-8">
      <title>Тестування API Студентів</title>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        .section { margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; }
        input, button { margin: 5px 0; padding: 5px; }
      </style>
    </head>
    <body>
      <h1>Тестування API Студентів</h1>
      
      <div class="section">
        <h2>GET /students (Отримати всіх)</h2>
        <button onclick="getStudents()">Отримати список</button>
      </div>

      <div class="section">
        <h2>POST /students (Додати нового)</h2>
        <input type="number" id="post-id" placeholder="ID"><br>
        <input type="text" id="post-name" placeholder="Ім'я"><br>
        <input type="text" id="post-group" placeholder="Група"><br>
        <button onclick="postStudent()">Додати студента</button>
      </div>

      <div class="section">
        <h2>PUT /students/:id (Оновити)</h2>
        <input type="number" id="put-id" placeholder="ID студента"><br>
        <input type="text" id="put-name" placeholder="Нове ім'я"><br>
        <input type="text" id="put-group" placeholder="Нова група"><br>
        <button onclick="putStudent()">Оновити студента</button>
      </div>

      <div class="section">
        <h2>DELETE /students/:id (Видалити)</h2>
        <input type="number" id="delete-id" placeholder="ID студента"><br>
        <button onclick="deleteStudent()">Видалити студента</button>
      </div>

      <h3>Результат від сервера:</h3>
      <pre id="result" style="background:#eee; padding:10px; border:1px solid #aaa; min-height:50px;"></pre>

      <script>
        async function displayResult(response) {
          const resultEl = document.getElementById('result');
          try {
            const data = await response.json();
            resultEl.textContent = JSON.stringify(data, null, 2);
          } catch (e) {
             resultEl.textContent = 'Статус: ' + response.status;
          }
        }

        async function getStudents() {
          const res = await fetch('/students');
          displayResult(res);
        }

        async function postStudent() {
          const id = parseInt(document.getElementById('post-id').value, 10);
          const name = document.getElementById('post-name').value;
          const group = document.getElementById('post-group').value;
          
          const res = await fetch('/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name, group })
          });
          displayResult(res);
        }

        async function putStudent() {
          const id = document.getElementById('put-id').value;
          const name = document.getElementById('put-name').value;
          const group = document.getElementById('put-group').value;
          
          const body = {};
          if (name) body.name = name;
          if (group) body.group = group;

          const res = await fetch('/students/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          displayResult(res);
        }

        async function deleteStudent() {
          const id = document.getElementById('delete-id').value;
          const res = await fetch('/students/' + id, { method: 'DELETE' });
          displayResult(res);
        }
      </script>
    </body>
    </html>
  `);
};

const getStudents = (req, res) => {
  res.json(students);
};

const createStudent = (req, res) => {
  const { id, name, group } = req.body;
  if (!id || !name || !group) return res.status(400).json({ error: 'Усі поля (id, name, group) є обовʼязковими' });
  const exists = students.find((s) => s.id === id);
  if (exists) return res.status(409).json({ error: `Студент з id=${id} вже існує` });
  
  const newStudent = { id, name, group };
  students.push(newStudent);
  res.status(201).json(newStudent);
};

const updateStudent = (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const index = students.findIndex((s) => s.id === studentId);
  if (index === -1) return res.status(404).json({ error: `Студента з id=${studentId} не знайдено` });
  
  const { name, group } = req.body;
  if (name) students[index].name = name;
  if (group) students[index].group = group;
  res.json(students[index]);
};

const deleteStudent = (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const index = students.findIndex((s) => s.id === studentId);
  if (index === -1) return res.status(404).json({ error: `Студента з id=${studentId} не знайдено` });
  
  const deleted = students.splice(index, 1);
  res.json({ message: `Студента з id=${studentId} видалено`, student: deleted[0] });
};

module.exports = { renderTestPage, getStudents, createStudent, updateStudent, deleteStudent };
