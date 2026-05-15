// catalog.js — завантаження книг з реального API

const BOOKS_PER_PAGE = 8;
let currentPage = 1;
let totalBooks = 0;
let currentFilters = { genre: '', search: '', minRating: 0, price: '', sort: 'none' };
let allGenres = [];

// --- API ---
async function fetchBooks(page = 1, filters = {}) {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('limit', BOOKS_PER_PAGE);
    if (filters.genre) params.set('genre', filters.genre);
    if (filters.search) params.set('search', filters.search);
    if (filters.minRating) params.set('minRating', filters.minRating);
    if (filters.price) params.set('price', filters.price);
    if (filters.sort && filters.sort !== 'none') params.set('sort', filters.sort);

    const res = await fetch(`/api/books?${params.toString()}`);
    if (!res.ok) throw new Error('Помилка завантаження книг');
    const json = await res.json();
    return json.data; // { total, page, limit, books }
}

async function fetchAllGenres() {
    try {
        // Отримуємо всі книги щоб зібрати жанри (без пагінації, велика вибірка)
        const res = await fetch('/api/books?limit=500');
        if (!res.ok) return [];
        const json = await res.json();
        const genres = [...new Set(json.data.books.map(b => b.genre).filter(Boolean))].sort();
        return genres;
    } catch {
        return [];
    }
}

// --- Рендеринг ---
function buildStars(rating) {
    const filled = Math.round(rating || 0);
    return '★'.repeat(Math.max(0, filled)) + '☆'.repeat(Math.max(0, 5 - filled));
}

// Клієнтські фільтри видалено, використовується серверне фільтрування

function renderBooks(books) {
    const grid = document.getElementById('catalogGrid');
    const noResults = document.getElementById('noResults');

    if (!books.length) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    grid.innerHTML = books.map(book => {
        const imgSrc = book.image
            ? (book.image.startsWith('http') ? book.image : book.image)
            : 'assets/book-placeholder.png';
        const stars = buildStars(book.rating);
        const rating = parseFloat(book.rating || 0).toFixed(1);

        return `
        <div class="book-card" data-book-id="${book.id}">
            <a href="book.html?id=${book.id}" class="book-card-link">
                <div class="book-image-wrapper">
                    <img src="${imgSrc}" alt="${book.title}" class="book-image"
                         onerror="this.src='assets/book2.png'">
                </div>
                <div class="book-info">
                    <h3 class="book-title-card">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <p class="book-genre-small">${book.genre}</p>
                    <div class="book-rating-card">
                        <span class="book-rating-stars" style="color:#f59e0b">${stars}</span>
                        <span class="book-rating-value">${rating}</span>
                    </div>
                    <p class="book-price">${book.price} грн</p>
                </div>
            </a>
            <div class="card-actions">
                <button class="add-to-cart-btn catalog-cart-btn"
                    data-id="${book.id}"
                    data-title="${book.title.replace(/"/g, '&quot;')}"
                    data-price="${book.price}"
                    data-image="${imgSrc}">В КОШИК</button>
            </div>
        </div>`;
    }).join('');

    // event delegation для кнопок кошика після рендеру
    grid.querySelectorAll('.catalog-cart-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.addToCart === 'function') {
                window.addToCart({
                    id: this.dataset.id,
                    title: this.dataset.title,
                    price: parseFloat(this.dataset.price),
                    image: this.dataset.image
                });
            }
        });
    });
}

function renderPagination(total, page, limit) {
    const container = document.getElementById('catalogPagination');
    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1) { container.innerHTML = ''; return; }

    let html = '<div class="pagination-controls">';

    html += `<button class="pagination-btn" ${page === 1 ? 'disabled' : ''} 
        data-page="${page - 1}">← Попередня</button>`;

    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    if (start > 1) {
        html += `<button class="pagination-btn" data-page="1">1</button>`;
        if (start > 2) html += `<span class="pagination-ellipsis">…</span>`;
    }

    for (let i = start; i <= end; i++) {
        html += `<button class="pagination-btn ${i === page ? 'active' : ''}" 
            data-page="${i}">${i}</button>`;
    }

    if (end < totalPages) {
        if (end < totalPages - 1) html += `<span class="pagination-ellipsis">…</span>`;
        html += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
    }

    html += `<button class="pagination-btn" ${page === totalPages ? 'disabled' : ''} 
        data-page="${page + 1}">Наступна →</button>`;
    html += '</div>';

    container.innerHTML = html;

    // Attach event listeners
    const buttons = container.querySelectorAll('button.pagination-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.hasAttribute('disabled')) return;
            const targetPage = parseInt(this.getAttribute('data-page'), 10);
            if (!isNaN(targetPage)) {
                window.goToPage(targetPage);
            }
        });
    });
}

function showLoading() {
    const grid = document.getElementById('catalogGrid');
    grid.innerHTML = `<div class="catalog-loading">
        <div class="loading-spinner"></div>
        <p>Завантаження книг...</p>
    </div>`;
}

// --- Ініціалізація жанрів ---
async function populateGenres() {
    allGenres = await fetchAllGenres();
    const select = document.getElementById('genreFilter');
    allGenres.forEach(genre => {
        const opt = document.createElement('option');
        opt.value = genre;
        opt.textContent = genre;
        select.appendChild(opt);
    });

    // Застосувати жанр з URL
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('category');
    if (cat && allGenres.includes(cat)) {
        select.value = cat;
        currentFilters.genre = cat;
    }
}

// --- Головна функція завантаження ---
async function loadCatalog() {
    showLoading();
    try {
        const data = await fetchBooks(currentPage, currentFilters);
        let books = data.books || [];

        // Серверне фільтрування і сортування
        totalBooks = data.total;
        renderBooks(books);
        renderPagination(totalBooks, currentPage, BOOKS_PER_PAGE);
        updateResultsCount(data.total);
    } catch (e) {
        document.getElementById('catalogGrid').innerHTML =
            `<div class="catalog-error"><p>⚠️ Помилка завантаження. Перевірте з'єднання з сервером.</p></div>`;
    }
}

function updateResultsCount(total) {
    const el = document.getElementById('resultsCount');
    if (el) el.textContent = `Знайдено книг: ${total}`;
}

// --- Глобальна навігація (виклик з пагінації) ---
window.goToPage = function (page) {
    if (page === currentPage) return; // запобігти повторному виклику
    currentPage = page;
    loadCatalog();
    setTimeout(() => {
        document.getElementById('catalog-title')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
};

// --- Ініціалізація ---
document.addEventListener('DOMContentLoaded', async function () {
    await populateGenres();

    // Слухачі фільтрів
    document.getElementById('genreFilter').addEventListener('change', function () {
        currentFilters.genre = this.value;
        currentPage = 1;
        loadCatalog();
    });

    document.getElementById('ratingFilter').addEventListener('change', function () {
        currentFilters.minRating = parseInt(this.value) || 0;
        currentPage = 1;
        loadCatalog();
    });

    document.getElementById('priceFilter').addEventListener('change', function () {
        currentFilters.price = this.value;
        currentPage = 1;
        loadCatalog();
    });

    document.getElementById('sortBy').addEventListener('change', function () {
        currentFilters.sort = this.value;
        currentPage = 1;
        loadCatalog();
    });

    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentFilters.search = this.value.trim();
            currentPage = 1;
            loadCatalog();
        }, 400); // debounce 400ms
    });

    document.getElementById('resetFilters').addEventListener('click', function () {
        currentFilters = { genre: '', search: '', minRating: 0, price: '', sort: 'none' };
        currentPage = 1;
        document.getElementById('genreFilter').value = '';
        document.getElementById('ratingFilter').value = '0';
        document.getElementById('priceFilter').value = '';
        document.getElementById('sortBy').value = 'none';
        document.getElementById('searchInput').value = '';
        window.history.pushState({}, '', window.location.pathname);
        loadCatalog();
    });

    // Кнопка "Скинути фільтри" у блоці "немає результатів"
    const resetNoResults = document.getElementById('resetFiltersNoResults');
    if (resetNoResults) {
        resetNoResults.addEventListener('click', () => {
            document.getElementById('resetFilters').click();
        });
    }

    // Початкове завантаження
    loadCatalog();
});
