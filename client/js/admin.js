// admin.js — повна логіка адмін-панелі (книги + користувачі + замовлення)

let allBooks = [];
let allUsers = [];
let uploadedCoverUrl = null; // URL завантаженої обкладинки
let allOrders = [];
let currentBookPage = 1;
const BOOKS_PAGE_SIZE = 10;

// ===================== ІНІЦІАЛІЗАЦІЯ =====================
document.addEventListener('DOMContentLoaded', async function () {
    await authSystem.initPromise;
    const currentUser = authSystem.getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
        document.querySelector('.admin-main').style.display = 'none';
        document.querySelector('.admin-sidebar').style.display = 'none';
        document.getElementById('accessDenied').style.display = 'flex';
        return;
    }

    document.getElementById('topbarUser').textContent = currentUser.fullName || currentUser.email;

    // Призначення обробників подій для sidebar (замість inline onclick)
    document.getElementById('sidebarTabBooks').addEventListener('click', () => switchTab('books'));
    document.getElementById('sidebarTabUsers').addEventListener('click', () => switchTab('users'));
    document.getElementById('sidebarTabOrders').addEventListener('click', () => switchTab('orders'));
    document.getElementById('sidebarTabNewsletter').addEventListener('click', () => switchTab('newsletter'));

    // Кнопка бургер-меню
    document.getElementById('sidebarToggleBtn').addEventListener('click', toggleSidebar);

    // Кнопка "Додати книгу"
    document.getElementById('addBookBtn').addEventListener('click', () => openBookModal());

    // Кнопки закриття модального вікна
    document.getElementById('bookModalCloseBtn').addEventListener('click', closeBookModal);
    document.getElementById('bookCancelBtn').addEventListener('click', closeBookModal);
    document.getElementById('bookModalBackdrop').addEventListener('click', closeBookModal);

    // Форма збереження книги
    document.getElementById('bookForm').addEventListener('submit', submitBookForm);

    // Форма розсилки
    document.getElementById('newsletterSendForm').addEventListener('submit', submitNewsletterForm);

    // Пошукові поля
    document.getElementById('booksSearch').addEventListener('input', (e) => filterBooksTable(e.target.value));
    document.getElementById('usersSearch').addEventListener('input', (e) => filterUsersTable(e.target.value));
    document.getElementById('ordersSearch').addEventListener('input', (e) => filterOrdersTable(e.target.value));

    // Cover upload zone
    initCoverUpload();

    // Заповнити datalist жанрів
    await populateAdminGenres();

    // Завантажити перший таб
    await loadBooks();
});

// ===================== SIDEBAR / TABS =====================
function switchTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tab}`).style.display = 'block';
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    const titles = {
        books: 'Управління книгами',
        users: 'Управління користувачами',
        orders: 'Список замовлень',
        newsletter: 'Email Розсилка'
    };
    document.getElementById('pageTitle').textContent = titles[tab] || '';

    if (window.innerWidth <= 768) {
        document.getElementById('adminSidebar').classList.remove('mobile-open');
        const overlay = document.getElementById('adminSidebarOverlay');
        if (overlay) overlay.classList.remove('active');
    }

    if (tab === 'books') loadBooks();
    if (tab === 'users') loadUsers();
    if (tab === 'orders') loadOrders();
}

function toggleSidebar() {
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('adminSidebar');
        const overlay = document.getElementById('adminSidebarOverlay');
        sidebar.classList.toggle('mobile-open');
        if (overlay) overlay.classList.toggle('active');
    } else {
        document.getElementById('adminSidebar').classList.toggle('collapsed');
    }
}

// Закриття сайдбару при кліку на оверлей (тільки на мобільному)
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('adminSidebarOverlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            document.getElementById('adminSidebar').classList.remove('mobile-open');
            overlay.classList.remove('active');
        });
    }
});

// ===================== BOOKS =====================
async function loadBooks() {
    document.getElementById('booksTableBody').innerHTML =
        '<tr><td colspan="9" class="table-loading">Завантаження...</td></tr>';
    try {
        const res = await fetch('/api/books?limit=500', {
            headers: { 'Authorization': `Bearer ${authSystem.getToken()}` }
        });
        const json = await res.json();
        allBooks = json.data?.books || [];
        currentBookPage = 1;
        renderBooksTable(allBooks);
    } catch {
        document.getElementById('booksTableBody').innerHTML =
            '<tr><td colspan="9" class="table-error">Помилка завантаження книг</td></tr>';
    }
}

function renderBooksTable(books) {
    const start = (currentBookPage - 1) * BOOKS_PAGE_SIZE;
    const pageBooks = books.slice(start, start + BOOKS_PAGE_SIZE);
    const tbody = document.getElementById('booksTableBody');

    if (!pageBooks.length) {
        tbody.innerHTML = '<tr><td colspan="9" class="table-empty">Книги не знайдено</td></tr>';
        document.getElementById('booksPagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = pageBooks.map(book => {
        const imgSrc = book.image || 'assets/book2.png';
        const stars = '★'.repeat(Math.round(book.rating || 0));
        return `
        <tr>
            <td class="td-id">${book.id}</td>
            <td class="td-image">
                <img src="${imgSrc}" alt="${book.title}" class="admin-book-thumb"
                     onerror="this.src='assets/book2.png'">
            </td>
            <td class="td-title"><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td><span class="genre-badge">${book.genre}</span></td>
            <td class="td-price">${book.price} грн</td>
            <td class="td-rating" style="color:#f59e0b">${stars} <small>${parseFloat(book.rating||0).toFixed(1)}</small></td>
            <td class="td-stock">
                <span class="stock-badge ${(book.stock||0) > 0 ? 'in-stock' : 'out-of-stock'}">
                    ${book.stock || 0}
                </span>
            </td>
            <td class="td-actions">
                <button class="action-btn edit-btn" data-book-id="${book.id}" title="Редагувати">✏️</button>
                <button class="action-btn delete-btn" data-delete-book-id="${book.id}" title="Видалити">🗑️</button>
            </td>
        </tr>`;
    }).join('');

    // Делегування подій для кнопок таблиці книг
    tbody.querySelectorAll('.edit-btn[data-book-id]').forEach(btn => {
        btn.addEventListener('click', () => openBookModal(parseInt(btn.dataset.bookId)));
    });
    tbody.querySelectorAll('.delete-btn[data-delete-book-id]').forEach(btn => {
        btn.addEventListener('click', () => deleteBook(parseInt(btn.dataset.deleteBookId)));
    });

    renderBooksPagination(books.length);
}

function renderBooksPagination(total) {
    const totalPages = Math.ceil(total / BOOKS_PAGE_SIZE);
    const container = document.getElementById('booksPagination');

    if (totalPages <= 1) { container.innerHTML = ''; return; }

    let html = '<div class="pagination-controls">';
    html += `<button class="pagination-btn" data-page="${currentBookPage - 1}" ${currentBookPage === 1 ? 'disabled' : ''}>←</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn ${i === currentBookPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="pagination-btn" data-page="${currentBookPage + 1}" ${currentBookPage === totalPages ? 'disabled' : ''}>→</button>`;
    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('.pagination-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => changeBookPage(parseInt(btn.dataset.page)));
    });
}

function changeBookPage(page) {
    currentBookPage = page;
    const search = document.getElementById('booksSearch').value.toLowerCase();
    const filtered = search
        ? allBooks.filter(b =>
            b.title.toLowerCase().includes(search) ||
            b.author.toLowerCase().includes(search) ||
            b.genre.toLowerCase().includes(search))
        : allBooks;
    renderBooksTable(filtered);
}

function filterBooksTable(val) {
    const search = val.toLowerCase();
    const filtered = search
        ? allBooks.filter(b =>
            b.title.toLowerCase().includes(search) ||
            b.author.toLowerCase().includes(search) ||
            b.genre.toLowerCase().includes(search))
        : allBooks;
    currentBookPage = 1;
    renderBooksTable(filtered);
}

// ===================== BOOK MODAL =====================
function openBookModal(bookId = null) {
    const modal = document.getElementById('bookModal');
    const form = document.getElementById('bookForm');
    form.reset();
    document.getElementById('bookId').value = '';
    resetCoverUpload();

    if (bookId) {
        const book = allBooks.find(b => b.id === bookId);
        if (!book) return;
        document.getElementById('bookModalTitle').textContent = 'Редагувати книгу';
        document.getElementById('bookSubmitBtn').textContent = 'Зберегти зміни';
        document.getElementById('bookId').value = book.id;
        document.getElementById('bookTitle').value = book.title || '';
        document.getElementById('bookAuthor').value = book.author || '';
        document.getElementById('bookGenre').value = book.genre || '';
        document.getElementById('bookPrice').value = book.price || '';
        document.getElementById('bookRating').value = book.rating || '';
        document.getElementById('bookStock').value = book.stock ?? '';
        document.getElementById('bookDescription').value = book.description || '';
        // Показати поточну обкладинку
        if (book.image) {
            setCoverPreview(book.image);
            uploadedCoverUrl = book.image;
            document.getElementById('bookImageUrl').value = book.image;
        }
    } else {
        document.getElementById('bookModalTitle').textContent = 'Додати нову книгу';
        document.getElementById('bookSubmitBtn').textContent = 'Додати';
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeBookModal() {
    document.getElementById('bookModal').style.display = 'none';
    document.body.style.overflow = '';
    resetCoverUpload();
}

async function submitBookForm(e) {
    e.preventDefault();
    const bookId = document.getElementById('bookId').value;
    const isEdit = !!bookId;

    // Визначаємо фінальний URL обкладинки:
    // пріоритет: завантажений файл > URL поле
    const finalImage = uploadedCoverUrl
        || document.getElementById('bookImageUrl').value.trim()
        || null;

    const payload = {
        title: document.getElementById('bookTitle').value.trim(),
        author: document.getElementById('bookAuthor').value.trim(),
        genre: document.getElementById('bookGenre').value.trim(),
        price: parseFloat(document.getElementById('bookPrice').value),
        rating: parseFloat(document.getElementById('bookRating').value) || null,
        stock: parseInt(document.getElementById('bookStock').value) || 0,
        image: finalImage,
        description: document.getElementById('bookDescription').value.trim() || null,
    };

    const btn = document.getElementById('bookSubmitBtn');
    btn.disabled = true;
    btn.textContent = 'Збереження...';

    try {
        const url = isEdit ? `/api/books/${bookId}` : '/api/books';
        const method = isEdit ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authSystem.getToken()}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) {
            const errMsg = data.errors?.[0]?.msg || data.error || 'Помилка';
            toast.error(errMsg);
            return;
        }

        toast.success(isEdit ? 'Книгу успішно оновлено!' : 'Книгу успішно додано!');
        closeBookModal();
        await loadBooks();
    } catch {
        toast.error("Помилка з'єднання з сервером");
    } finally {
        btn.disabled = false;
        btn.textContent = isEdit ? 'Зберегти зміни' : 'Додати';
    }
}

async function deleteBook(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) return;

    if (!confirm(`Видалити книгу "${book.title}"?\nЦю дію не можна скасувати.`)) return;

    try {
        const res = await fetch(`/api/books/${bookId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authSystem.getToken()}` }
        });
        if (!res.ok) {
            const data = await res.json();
            toast.error(data.error || 'Помилка видалення');
            return;
        }
        toast.success('Книгу видалено!');
        await loadBooks();
    } catch {
        toast.error("Помилка з'єднання");
    }
}

// ===================== USERS =====================
async function loadUsers() {
    document.getElementById('usersTableBody').innerHTML =
        '<tr><td colspan="7" class="table-loading">Завантаження...</td></tr>';
    try {
        const res = await fetch('/api/users', {
            headers: { 'Authorization': `Bearer ${authSystem.getToken()}` }
        });
        if (!res.ok) throw new Error();
        allUsers = await res.json();
        renderUsersTable(allUsers);
    } catch {
        document.getElementById('usersTableBody').innerHTML =
            '<tr><td colspan="7" class="table-error">Помилка завантаження</td></tr>';
    }
}

function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!users.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Користувачів не знайдено</td></tr>';
        return;
    }
    tbody.innerHTML = users.map(user => {
        const date = new Date(user.createdAt).toLocaleDateString('uk-UA');
        const isAdmin = user.role === 'admin';
        const confirmed = user.isEmailConfirmed
            ? '<span class="status-badge confirmed">✓ Так</span>'
            : '<span class="status-badge unconfirmed">✗ Ні</span>';
        const deleteBtn = !isAdmin
            ? `<button class="action-btn delete-btn" data-delete-user-id="${user.id}" title="Видалити">🗑️</button>`
            : '<span class="text-muted">—</span>';
        return `
        <tr>
            <td class="td-id">${user.id}</td>
            <td><strong>${user.username}</strong></td>
            <td>${user.email}</td>
            <td>
                <span class="role-badge ${isAdmin ? 'role-admin' : 'role-user'}">
                    ${isAdmin ? 'Адмін' : 'Користувач'}
                </span>
            </td>
            <td>${confirmed}</td>
            <td>${date}</td>
            <td class="td-actions">${deleteBtn}</td>
        </tr>`;
    }).join('');

    // Делегування подій для кнопок видалення користувачів
    tbody.querySelectorAll('.delete-btn[data-delete-user-id]').forEach(btn => {
        btn.addEventListener('click', () => deleteUser(parseInt(btn.dataset.deleteUserId)));
    });
}

function filterUsersTable(val) {
    const search = val.toLowerCase();
    const filtered = search
        ? allUsers.filter(u =>
            u.username.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search))
        : allUsers;
    renderUsersTable(filtered);
}

async function deleteUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    if (!confirm(`Видалити користувача "${user.username}" (${user.email})?`)) return;

    try {
        const res = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authSystem.getToken()}` }
        });
        if (!res.ok) {
            const data = await res.json();
            toast.error(data.error || 'Помилка видалення');
            return;
        }
        toast.success('Користувача видалено!');
        await loadUsers();
    } catch {
        toast.error("Помилка з'єднання");
    }
}

// ===================== ORDERS =====================
async function loadOrders() {
    document.getElementById('ordersTableBody').innerHTML =
        '<tr><td colspan="6" class="table-loading">Завантаження...</td></tr>';
    try {
        const res = await fetch('/api/users/orders/all', {
            headers: { 'Authorization': `Bearer ${authSystem.getToken()}` }
        });
        if (!res.ok) throw new Error();
        allOrders = await res.json();
        renderOrdersTable(allOrders);
    } catch {
        document.getElementById('ordersTableBody').innerHTML =
            '<tr><td colspan="6" class="table-error">Помилка завантаження</td></tr>';
    }
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('ordersTableBody');
    const statsEl = document.getElementById('ordersStats');

    if (!orders.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="table-empty">Замовлень немає</td></tr>';
        if (statsEl) statsEl.textContent = '';
        return;
    }

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    if (statsEl) {
        statsEl.innerHTML = `
            <span class="stat-chip">Всього: <strong>${orders.length}</strong></span>
            <span class="stat-chip">Дохід: <strong>${totalRevenue.toFixed(2)} грн</strong></span>
        `;
    }

    const statusLabels = {
        pending:   { label: 'Очікує',       cls: 'status-pending' },
        confirmed: { label: 'Підтверджено', cls: 'status-confirmed' },
        shipped:   { label: 'Відправлено',  cls: 'status-shipped' },
        delivered: { label: 'Доставлено',   cls: 'status-delivered' },
        cancelled: { label: 'Скасовано',    cls: 'status-cancelled' },
    };

    tbody.innerHTML = orders.map(order => {
        const date = new Date(order.createdAt).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });
        const user = order.user;
        const userName = user ? user.username : 'Невідомий';
        const userEmail = user ? user.email : '—';
        const s = statusLabels[order.status] || { label: order.status, cls: '' };
        return `
        <tr>
            <td class="td-id">${order.id}</td>
            <td><strong>${userName}</strong></td>
            <td>${userEmail}</td>
            <td class="td-price"><strong>${parseFloat(order.total_amount || 0).toFixed(2)} грн</strong></td>
            <td><span class="order-status-badge ${s.cls}">${s.label}</span></td>
            <td>${date}</td>
        </tr>`;
    }).join('');
}

function filterOrdersTable(val) {
    const search = val.toLowerCase();
    const filtered = search
        ? allOrders.filter(o =>
            (o.user?.username || '').toLowerCase().includes(search) ||
            (o.user?.email || '').toLowerCase().includes(search))
        : allOrders;
    renderOrdersTable(filtered);
}

// ===================== COVER UPLOAD =====================
function initCoverUpload() {
    const dropZone  = document.getElementById('coverDropZone');
    const fileInput = document.getElementById('coverFileInput');
    const urlInput  = document.getElementById('bookImageUrl');
    const removeBtn = document.getElementById('coverRemoveBtn');

    // Click on zone → open file picker
    dropZone.addEventListener('click', (e) => {
        if (e.target === removeBtn || removeBtn.contains(e.target)) return;
        fileInput.click();
    });

    // File chosen via picker
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) uploadCoverFile(fileInput.files[0]);
    });

    // Drag & drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) uploadCoverFile(file);
    });

    // Remove cover
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetCoverUpload();
    });

    // URL fallback: typing a URL shows a preview
    urlInput.addEventListener('input', () => {
        const val = urlInput.value.trim();
        if (val) {
            setCoverPreview(val);
            uploadedCoverUrl = null; // manual URL takes over
        } else {
            resetCoverUpload();
        }
    });
}

async function uploadCoverFile(file) {
    const allowed = ['image/jpeg','image/png','image/webp','image/gif'];
    if (!allowed.includes(file.type)) {
        toast.error('Непідтримуваний формат. Дозволено: JPG, PNG, WebP, GIF');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        toast.error('Файл занадто великий. Максимум 5 МБ');
        return;
    }

    showCoverProgress();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authSystem.getToken()}` },
            body: formData
        });
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.error || 'Помилка завантаження');
            resetCoverUpload();
            return;
        }
        uploadedCoverUrl = data.url;
        document.getElementById('bookImage').value = data.url;
        document.getElementById('bookImageUrl').value = data.url;
        setCoverPreview(data.url);
        toast.success('Обкладинку завантажено!');
    } catch {
        toast.error("Помилка з'єднання з сервером");
        resetCoverUpload();
    }
}

function setCoverPreview(src) {
    document.getElementById('coverPreviewImg').src = src;
    document.getElementById('coverPreviewWrap').style.display = 'inline-block';
    document.getElementById('coverUploadPlaceholder').style.display = 'none';
    document.getElementById('coverUploadProgress').style.display = 'none';
}

function showCoverProgress() {
    document.getElementById('coverUploadProgress').style.display = 'flex';
    document.getElementById('coverUploadPlaceholder').style.display = 'none';
    document.getElementById('coverPreviewWrap').style.display = 'none';
}

function resetCoverUpload() {
    uploadedCoverUrl = null;
    document.getElementById('bookImage').value = '';
    const urlInput = document.getElementById('bookImageUrl');
    if (urlInput) urlInput.value = '';
    document.getElementById('coverPreviewWrap').style.display = 'none';
    document.getElementById('coverUploadProgress').style.display = 'none';
    document.getElementById('coverUploadPlaceholder').style.display = 'flex';
    const fi = document.getElementById('coverFileInput');
    if (fi) fi.value = '';
}

// ===================== GENRES DATALIST =====================
async function populateAdminGenres() {
    try {
        const res = await fetch('/api/books?limit=500');
        if (!res.ok) return;
        const json = await res.json();
        const genres = [...new Set((json.data?.books || []).map(b => b.genre).filter(Boolean))].sort();
        const dl = document.getElementById('genresList');
        if (dl) {
            dl.innerHTML = genres.map(g => `<option value="${g}">`).join('');
        }
    } catch {}
}

// ===================== NEWSLETTER =====================
async function submitNewsletterForm(e) {
    e.preventDefault();
    const subject = document.getElementById('newsletterSubject').value;
    const messageHtml = document.getElementById('newsletterMessage').value;

    const btn = document.getElementById('newsletterSendBtn');
    const originalText = btn.textContent;
    btn.textContent = 'Надсилання...';
    btn.disabled = true;

    try {
        const res = await fetch('/api/newsletter/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authSystem.getToken()}`
            },
            body: JSON.stringify({ subject, messageHtml })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Помилка розсилки');
        }

        toast.success(data.message || 'Розсилку успішно надіслано!');
        document.getElementById('newsletterSendForm').reset();
    } catch (error) {
        console.error('Newsletter send error:', error);
        toast.error(error.message || 'Не вдалося надіслати розсилку');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}
