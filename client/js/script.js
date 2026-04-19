// головний скрипт

// глобальні дані книг
window.catalogBooks = [
    {
        id: 1,
        title: 'Кобзар',
        author: 'Тарас Шевченко',
        genre: 'Поезія',
        price: 300,
        rating: 5,
        image: 'assets/kobzar.png',
        description: 'Збірка віршів видатного українського поета Тараса Шевченка. "Кобзар" є символом боротьби українського народу за свободу і незалежність, втіленням народної мудрості та духовності.'
    },
    {
        id: 2,
        title: 'Кайдашева сім\'я',
        author: 'Іван Нечуй-Левицький',
        genre: 'Художня література',
        price: 450,
        rating: 4,
        image: 'assets/book2.png',
        description: 'Соціально-побутова повість Івана Нечуя-Левицького про непросте життя селянської родини. Гумористичний та водночас драматичний твір, що розкриває традиції та звичаї українського села XIX століття.'
    },
    {
        id: 3,
        title: 'Енеїда',
        author: 'Іван Котляревський',
        genre: 'Поезія',
        price: 249,
        rating: 5,
        image: 'assets/book3.png',
        description: 'Іван Котляревський створив травестійну поему на основі "Енеїди" Вергілія. Це перший твір написаний живою українською мовою, що поклав початок новій українській літературі. Гумористичний твір про пригоди троянців.'
    },
    {
        id: 4,
        title: 'Лісова пісня',
        author: 'Леся Українка',
        genre: 'Драма',
        price: 320,
        rating: 5,
        image: 'assets/book1.webp',
        description: 'Поетична драма-феєрія Лесі Українки, яка поєднує фольклорні мотиви з глибокою філософією. Твір про кохання, природу та вічну боротьбу добра зі злом.'
    },
    {
        id: 5,
        title: 'Код майбутнього',
        author: 'Сара Джонсон',
        genre: 'Наукова фантастика',
        price: 550,
        rating: 4,
        image: 'assets/books_part2/код_майбутнього.jpeg',
        description: 'Захоплюючий роман про штучний інтелект та майбутнє технологій. Головний герой намагається розгадати таємницю коду, який може змінити світ.'
    },
    {
        id: 6,
        title: 'Таємниця океану',
        author: 'Майкл Чен',
        genre: 'Детектив',
        price: 480,
        rating: 4,
        image: 'assets/books_part2/таємниця_океану.jpg',
        description: 'Загадковий детектив про зникнення корабля та таємниці глибин океану. Детектив намагається розкрити правду про загадкову подію.'
    },
    {
        id: 7,
        title: 'Цифрова революція',
        author: 'Емма Девіс',
        genre: 'Наукова фантастика',
        price: 520,
        rating: 5,
        image: 'assets/books_part2/цифрова революція.jpg',
        description: 'Футуристичний роман про технологічну революцію, яка змінює суспільство. Автор досліджує етичні питання майбутнього.'
    },
    {
        id: 8,
        title: 'Космічна одіссея',
        author: 'Роберт Вілсон',
        genre: 'Наукова фантастика',
        price: 600,
        rating: 4,
        image: 'assets/books_part2/космічна_одісея.jpg',
        description: 'Епічна космічна сага про подорож до далеких галактик. Герої стикаються з невідомими цивілізаціями та викликами космосу.'
    },
    {
        id: 9,
        title: 'Загадка старого замку',
        author: 'Олена Петренко',
        genre: 'Детектив',
        price: 380,
        rating: 4,
        image: 'assets/books_part2/тайна_старого_замку.webp',
        description: 'Детективна історія про таємниці старого замку та зниклі скарби. Читач разом з героями розгадує загадки минулого.'
    },
    {
        id: 10,
        title: 'Шлях до успіху',
        author: 'Андрій Коваленко',
        genre: 'Саморозвиток',
        price: 350,
        rating: 3,
        image: 'assets/books_part2/шлях_до_успіху.jpg',
        description: 'Практичний посібник з саморозвитку та досягнення цілей. Автор ділиться досвідом та ефективними стратегіями успіху.'
    },
    {
        id: 11,
        title: 'Життя видатних людей',
        author: 'Марія Іваненко',
        genre: 'Біографія',
        price: 420,
        rating: 4,
        image: 'assets/books_part2/життя_видатних_людей.jpg',
        description: 'Збірка біографій видатних особистостей, які змінили світ. Натхненні історії про досягнення та подолання перешкод.'
    },
    {
        id: 12,
        title: 'Романтика вічності',
        author: 'Софія Мороз',
        genre: 'Романтика',
        price: 290,
        rating: 3,
        image: 'assets/books_part2/романтика_вічності.jpg',
        description: 'Романтична історія про кохання, яке долає всі перешкоди. Емоційний твір про вічні почуття та пристрасть.'
    },
    {
        id: 13,
        title: 'Захар Беркут',
        author: 'Іван Франко',
        genre: 'Художня література',
        price: 380,
        rating: 5,
        image: 'assets/books_part2/захар_беркут.webp',
        description: 'Історична повість про боротьбу українського народу за незалежність. Епічний твір про мужність та патріотизм.'
    },
    {
        id: 14,
        title: 'Тіні забутих предків',
        author: 'Михайло Коцюбинський',
        genre: 'Художня література',
        price: 340,
        rating: 5,
        image: 'assets/books_part2/тіні_забутих_предків.jpg',
        description: 'Поетична повість про життя гуцулів, їхні традиції та звичаї. Твір про кохання, смерть та вічність.'
    },
    {
        id: 15,
        title: 'Майстер і Маргарита',
        author: 'Михайло Булгаков',
        genre: 'Художня література',
        price: 520,
        rating: 5,
        image: 'assets/books_part2/майстер_і_маргарита.webp',
        description: 'Філософський роман про добро і зло, кохання та жертву. Один з найвизначніших творів світової літератури.'
    },
    {
        id: 16,
        title: '1984',
        author: 'Джордж Орвелл',
        genre: 'Антиутопія',
        price: 450,
        rating: 5,
        image: 'assets/books_part2/1984.jpg',
        description: 'Класичний роман-антиутопія про тоталітарне суспільство та боротьбу за свободу думки.'
    },
    {
        id: 17,
        title: 'Гаррі Поттер і філософський камінь',
        author: 'Дж. К. Роулінг',
        genre: 'Фентезі',
        price: 480,
        rating: 5,
        image: 'assets/books_part2/гаррі_поттер_і_філософський_камень.jpg',
        description: 'Перша книга про пригоди юного чарівника Гаррі Поттера у світі магії та чарівництва.'
    },
    {
        id: 18,
        title: 'Володар перснів',
        author: 'Дж. Р. Р. Толкін',
        genre: 'Фентезі',
        price: 550,
        rating: 5,
        image: 'assets/books_part2/володар_перснів.jpg',
        description: 'Епічна трилогія про боротьбу добра зі злом у вигаданому світі Середзем\'я.'
    },
    {
        id: 19,
        title: 'Шерлок Холмс',
        author: 'Артур Конан Дойл',
        genre: 'Детектив',
        price: 420,
        rating: 5,
        image: 'assets/books_part2/шерлок_холмс.jpg',
        description: 'Збірка детективних оповідань про знаменитого детектива Шерлока Холмса та його друга доктора Ватсона.'
    },
    {
        id: 20,
        title: 'Анна Кареніна',
        author: 'Лев Толстой',
        genre: 'Художня література',
        price: 490,
        rating: 5,
        image: 'assets/books_part2/анна_кареніна.jpg',
        description: 'Класичний роман про кохання, зраду та суспільні норми в Росії XIX століття.'
    },
    {
        id: 21,
        title: 'Війна і мир',
        author: 'Лев Толстой',
        genre: 'Художня література',
        price: 680,
        rating: 5,
        image: 'assets/books_part2/війна_і_мир.jpg',
        description: 'Епічний роман про російське суспільство під час наполеонівських воєн. Один з найбільших творів світової літератури.'
    },
    {
        id: 22,
        title: 'Пригоди Тома Сойєра',
        author: 'Марк Твен',
        genre: 'Пригоди',
        price: 320,
        rating: 4,
        image: 'assets/books_part2/пригоди_тома_сойєра.jpg',
        description: 'Захоплюючі пригоди хлопчика Тома Сойєра та його друга Гекльберрі Фінна на Міссісіпі.'
    },
    {
        id: 23,
        title: 'Гра престолів',
        author: 'Джордж Р. Р. Мартін',
        genre: 'Фентезі',
        price: 560,
        rating: 5,
        image: 'assets/books_part2/гра_престолів.jpg',
        description: 'Перша книга серії "Пісня льоду та полум\'я" про боротьбу за залізний трон у вигаданому світі Вестеросу.'
    },
    {
        id: 24,
        title: 'Дюна',
        author: 'Френк Герберт',
        genre: 'Наукова фантастика',
        price: 540,
        rating: 5,
        image: 'assets/books_part2/дюна.jpg',
        description: 'Епічний науково-фантастичний роман про пустельну планету Арракіс та боротьбу за контроль над спецією.'
    }
];

// ключ зберігання відгуків
const REVIEWS_STORAGE_KEY = 'bookstore_reviews';

// отримання даних рейтингу книги
function getBookRatingInfo(bookId, fallbackRating = 0) {
    const reviewsJson = null;
    const allReviews = reviewsJson ? JSON.parse(reviewsJson) : [];
    const id = parseInt(bookId);
    const bookReviews = allReviews.filter(review => review.bookId === id);

    if (bookReviews.length === 0) {
        const ratingValue = parseFloat(fallbackRating) || 0;
        return { ratingValue, reviewCount: 0 };
    }

    const sum = bookReviews.reduce((acc, review) => acc + (parseInt(review.rating) || 0), 0);
    const average = parseFloat((sum / bookReviews.length).toFixed(1));
    return { ratingValue: average, reviewCount: bookReviews.length };
}

// побудова рядка зірок
function buildRatingStars(ratingValue) {
    const starCount = Math.max(1, Math.round(ratingValue || 0));
    return '⭐'.repeat(starCount);
}

// ініціалізація додатку
document.addEventListener('DOMContentLoaded', function () {
    // мобільне меню
    initMobileMenu();

    // оновлення стану авторизації
    updateAuthUI();

    // налаштування кошика
    initCart();

    // форма розсилки
    initNewsletter();

    // логіка сторінки
    const path = window.location.pathname;

    if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
        renderHomePageCategories();
        initHomePage();
    } else if (path.endsWith('catalog.html')) {
        initCatalog();
    }

    // перемикач пароля
    initPasswordToggles();
});

// ініціалізація перемикачів пароля
function initPasswordToggles() {
    const toggleBtns = document.querySelectorAll('.password-toggle-btn');

    const eyeOpenPath = "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z";
    const eyeClosedPath = "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4.01.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z";

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.previousElementSibling;
            if (input && input.tagName === 'INPUT') {
                const isPassword = input.getAttribute('type') === 'password';
                const type = isPassword ? 'text' : 'password';
                input.setAttribute('type', type);

                // перемикання іконки
                const svgPath = this.querySelector('path');
                if (svgPath) {
                    svgPath.setAttribute('d', isPassword ? eyeOpenPath : eyeClosedPath);
                }

                // оновлення aria-label
                this.setAttribute('aria-label', isPassword ? 'Приховати пароль' : 'Показати пароль');
            }
        });
    });
}

// мобільне меню
function initMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    let overlay = document.querySelector('.menu-overlay');

    // створення оверлею, якщо відсутній
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    function closeMenu() {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (burgerMenu) burgerMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    function toggleMenu() {
        if (!mobileMenu) return;
        const isActive = mobileMenu.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            mobileMenu.classList.add('active');
            burgerMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('menu-open');
        }
    }

    if (burgerMenu && mobileMenu) {
        // обробник кліку по бургеру
        burgerMenu.onclick = function (e) {
            e.stopPropagation();
            toggleMenu();
        };

        // закриття по кліку на оверлей
        overlay.addEventListener('click', closeMenu);

        // закриття по кліку на посилання
        const links = mobileMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // автозакриття при зміні розміру
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }
}

// оновлення інтерфейсу хедера
async function updateAuthUI() {
    if (typeof authSystem === 'undefined') return;

    await authSystem.initPromise;
    const currentUser = authSystem.getCurrentUser();
    const loginLink = document.getElementById('loginLink');
    const mobileLoginLink = document.getElementById('mobileLoginLink');

    if (currentUser) {
        if (currentUser.role === 'admin') {
            if (!document.getElementById('adminNavItem')) {
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.insertAdjacentHTML('beforeend', '<li id="adminNavItem"><a href="admin.html">Адмін-панель</a></li>');
                }
                const mobileNavLinks = document.querySelector('.mobile-nav-links');
                if (mobileNavLinks) {
                    mobileNavLinks.insertAdjacentHTML('beforeend', '<li id="mobileAdminNavItem"><a href="admin.html">Адмін-панель</a></li>');
                }
            }
        }

        // десктоп
        if (loginLink) {
            loginLink.textContent = 'Профіль';
            loginLink.href = 'profile.html';
        }

        if (mobileLoginLink) {
            mobileLoginLink.textContent = 'Профіль';
            mobileLoginLink.href = 'profile.html';
        }
    }
}

// слухач повідомлень вікна google oauth
window.addEventListener('message', async (e) => {
    if (e.data && e.data.type === 'GOOGLE_LOGIN_SUCCESS') {
        const token = e.data.token;
        if (typeof authSystem !== 'undefined') {
            authSystem.setToken(token);
            await authSystem.initProfile();
            
            if (typeof toast !== 'undefined' && toast.success) {
                toast.success('Успішний вхід через Google!');
            } else {
                alert('Успішний вхід через Google!');
            }

            setTimeout(() => {
                const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'profile.html';
                window.location.href = redirectUrl;
            }, 1000);
        }
    }
});

// ініціалізація кнопок google
document.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.getElementById('googleLoginBtn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            const width = 500;
            const height = 600;
            const left = (window.screen.width / 2) - (width / 2);
            const top = (window.screen.height / 2) - (height / 2);
            window.open('http://localhost:3000/api/auth/google', 'Google Auth', `width=${width},height=${height},top=${top},left=${left}`);
        });
    }
});

// відображення категорій головної сторінки
function renderHomePageCategories() {
    const categoriesList = document.querySelector('.categories-list ul');
    if (!categoriesList) return;

    // отримання унікальних жанрів
    const genres = [...new Set(window.catalogBooks.map(book => book.genre))].sort();

    // відображення списку
    categoriesList.innerHTML = genres.map(genre => `
        <li><a href="catalog.html?category=${encodeURIComponent(genre)}#catalog-title">${genre}</a></li>
    `).join('');
}

// ініціалізація сторінки каталогу
function initCatalog() {
    const catalogGrid = document.getElementById('catalogGrid');
    const genreFilter = document.getElementById('genreFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortBy = document.getElementById('sortBy');
    const searchInput = document.getElementById('searchInput');
    const resetBtn = document.getElementById('resetFilters');
    const noResults = document.getElementById('noResults');
    const paginationContainer = document.getElementById('catalogPagination');

    if (!catalogGrid) return;

    const BOOKS_PER_PAGE = 15;
    let currentPage = 1;
    let filteredBooks = [];

    // заповнення фільтру жанрів
    const genres = [...new Set(window.catalogBooks.map(book => book.genre))].sort();
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });

    // застосування url фільтрів
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && genres.includes(categoryParam)) {
        genreFilter.value = categoryParam;
    }

    // функція відображення
    function renderBooks() {
        currentPage = 1; // скидання сторінки

        // збір фільтрів
        const genreValue = genreFilter.value;
        const ratingValue = parseInt(ratingFilter.value) || 0;
        const priceValue = priceFilter.value;
        const sortValue = sortBy.value;
        const searchValue = searchInput.value.toLowerCase().trim();

        // збагачення рейтингами
        const booksWithRatings = window.catalogBooks.map(book => {
            const { ratingValue: liveRating, reviewCount } = getBookRatingInfo(book.id, book.rating);
            return { ...book, ratingValue: liveRating, reviewCount };
        });

        // фільтрація книг
        filteredBooks = booksWithRatings.filter(book => {
            // жанр
            if (genreValue && book.genre !== genreValue) return false;

            // рейтинг
            if (book.ratingValue < ratingValue) return false;

            // ціна
            if (priceValue) {
                const [min, max] = priceValue.split('-').map(v => v === '+' ? Infinity : parseInt(v));
                if (priceValue.includes('+')) {
                    if (book.price < 600) return false;
                } else {
                    if (book.price < min || book.price > max) return false;
                }
            }

            // пошук
            if (searchValue) {
                const searchMatch = book.title.toLowerCase().includes(searchValue) ||
                    book.author.toLowerCase().includes(searchValue);
                if (!searchMatch) return false;
            }

            return true;
        });

        // сортування книг
        if (sortValue === 'rating-desc') {
            filteredBooks.sort((a, b) => b.ratingValue - a.ratingValue);
        } else if (sortValue === 'rating-asc') {
            filteredBooks.sort((a, b) => a.ratingValue - b.ratingValue);
        }

        renderCurrentPage();
        renderPagination();
    }

    function renderCurrentPage() {
        // відображення сітки
        if (filteredBooks.length === 0) {
            catalogGrid.innerHTML = '';
            noResults.style.display = 'block';
            paginationContainer.innerHTML = '';
            return;
        }

        noResults.style.display = 'none';

        // обчислення пагінації
        const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
        const endIndex = startIndex + BOOKS_PER_PAGE;
        const booksToShow = filteredBooks.slice(startIndex, endIndex);

        catalogGrid.innerHTML = booksToShow.map(book => `
            <div class="book-card" data-book-id="${book.id}">
                <a href="book.html?id=${book.id}" class="book-card-link">
                    <img src="${book.image}" alt="${book.title}" class="book-image">
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p class="book-author">${book.author}</p>
                        <p class="book-genre-small">${book.genre}</p>
                        <div class="book-rating-card">
                            <span class="book-rating-stars">${buildRatingStars(book.ratingValue)}</span>
                            <span class="book-rating-value">${book.ratingValue.toFixed(1)}</span>
                        </div>
                        <p class="book-price">${book.price} грн</p>
                    </div>
                </a>
                <div class="card-actions">
                     <button class="add-to-cart-btn" onclick="addToCart({
                        id: ${book.id},
                        title: '${book.title.replace(/'/g, "\\'")}',
                        price: '${book.price} грн',
                        image: '${book.image}'
                     })">В КОШИК</button>
                     <button class="favorite-btn ${isFavorite(book.id) ? 'active' : ''}" 
                             onclick="const btn = this; const isAdded = toggleFavorite(${book.id}); isAdded ? btn.classList.add('active') : btn.classList.remove('active');" 
                             aria-label="Toggle favorite">
                        <svg viewBox="0 0 24 24" class="heart-icon">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        // прокрутка вгору
        catalogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderPagination() {
        if (filteredBooks.length === 0) {
            paginationContainer.innerHTML = '';
            return;
        }

        const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination-controls">';

        // кнопка назад
        paginationHTML += `
            <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} 
                    onclick="goToPage(${currentPage - 1})">
                ← Попередня
            </button>
        `;

        // номери сторінок
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // коригування початкової сторінки
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // перша сторінка
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        // номери сторінок
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                        onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        // остання сторінка
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
        }

        // кнопка вперед
        paginationHTML += `
            <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} 
                    onclick="goToPage(${currentPage + 1})">
                Наступна →
            </button>
        `;

        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;
    }

    // глобальна навігація
    window.goToPage = function (page) {
        currentPage = page;
        renderCurrentPage();
        renderPagination();
    };

    // слухачі подій
    genreFilter.addEventListener('change', renderBooks);
    ratingFilter.addEventListener('change', renderBooks);
    priceFilter.addEventListener('change', renderBooks);
    sortBy.addEventListener('change', renderBooks);
    searchInput.addEventListener('input', renderBooks);

    resetBtn.addEventListener('click', function () {
        genreFilter.value = '';
        ratingFilter.value = '0';
        priceFilter.value = '';
        sortBy.value = 'none';
        searchInput.value = '';

        // оновлення url
        const newUrl = window.location.pathname;
        window.history.pushState({ path: newUrl }, '', newUrl);

        renderBooks();
    });

    // початкове відображення
    renderBooks();
}

// налаштування кошика
function initCart() {
    const cartBtn = document.getElementById('cartBtn');
    const mobileCartBtn = document.getElementById('mobileCartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeBtn = cartModal ? cartModal.querySelector('.modal-close') : null;
    const countSpan = document.getElementById('cartCount');
    const mobileCountSpan = document.getElementById('mobileCartCount');

    // завантаження кошика
    let cart = [];
    updateCartCount();

    // відкрити модальне вікно
    function openCart() {
        if (cartModal) {
            cartModal.style.display = 'flex';
            renderCartItems();
        }
    }

    if (cartBtn) cartBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
    if (mobileCartBtn) mobileCartBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });

    // закрити модальне вікно
    if (closeBtn) closeBtn.addEventListener('click', () => { cartModal.style.display = 'none'; });
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal || e.target.classList.contains('modal-backdrop')) {
                cartModal.style.display = 'none';
            }
        });
    }

    // логіка оформлення
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            if (typeof authSystem === 'undefined' || !authSystem.isAuthenticated()) {
                toast.error('Будь ласка, увійдіть до облікового запису, щоб оформити замовлення');
                return;
            }

            if (cart.length === 0) {
                toast.warning('Ваш кошик порожній');
                return;
            }

            // очищення кошика
            cart = [];
            // localstorage видалено
            updateCartCount();
            renderCartItems();

            // закрити модальне вікно
            if (cartModal) {
                cartModal.style.display = 'none';
            }

            // показати успіх
            toast.success('Замовлення успішно оформлено! Дякуємо за покупку.');
        });
    }

    // глобальне додавання в кошик
    window.addToCart = function (book) {
        if (typeof authSystem === 'undefined' || !authSystem.isAuthenticated()) {
            toast.error('Будь ласка, увійдіть до облікового запису, щоб додати книгу до кошика');
            return;
        }

        cart.push(book);
        // localstorage видалено
        updateCartCount();
        toast.success('Книгу додано до кошика!');
    };

    function updateCartCount() {
        if (countSpan) countSpan.textContent = cart.length;
        if (mobileCountSpan) mobileCountSpan.textContent = `(${cart.length})`;
    }

    function renderCartItems() {
        const container = document.querySelector('.cart-items-container');
        const totalAmountEl = document.getElementById('cartTotalAmount');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<p class="empty-cart-message">Ваш кошик порожній</p>';
            if (totalAmountEl) totalAmountEl.textContent = '0 грн';
            return;
        }

        let total = 0;
        container.innerHTML = cart.map((item, index) => {
            const price = parseInt(item.price.replace(/\D/g, ''));
            total += price;
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>${item.price}</p>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})" aria-label="Видалити">&times;</button>
                </div>
            `;
        }).join('');

        if (totalAmountEl) totalAmountEl.textContent = `${total} грн`;
    }

    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        // localstorage видалено
        updateCartCount();
        renderCartItems();
    };
}

// ініціалізація головної сторінки
function initHomePage() {
    // кнопки додавання в кошик
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const bookId = parseInt(this.getAttribute('data-book-id'));
            const book = window.catalogBooks.find(b => b.id === bookId);
            if (book) {
                addToCart({
                    id: book.id,
                    title: book.title,
                    price: book.price + ' грн',
                    image: book.image
                });
            }
        });
    });

    // кнопки обраного
    const favBtns = document.querySelectorAll('.favorite-btn');
    favBtns.forEach(btn => {
        // початковий стан
        const bookId = parseInt(btn.getAttribute('data-book-id'));
        if (isFavorite(bookId)) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const isAdded = toggleFavorite(bookId);
            if (isAdded) {
                this.classList.add('active');
            } else {
                this.classList.remove('active');
            }
        });
    });

    // оновлення рейтингів
    updateBookCardRatings();

    // оновлення лічильників категорій
    updateCategoryCounts();
}

// обробка розсилки
function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // валідація

            const emailInput = form.querySelector('input[name="email"]');
            if (emailInput && emailInput.value) {
                toast.success('Дякуємо за підписку! Ми надіслали підтвердження на вашу пошту.');
                form.reset();
            }
        });
    }
}

// перевірка обраного
function isFavorite(bookId) {
    if (typeof authSystem !== 'undefined' && authSystem.isAuthenticated()) {
        return authSystem.isFavorite(bookId);
    }
    return false;
}

// перемикання обраного
window.toggleFavorite = function (bookId) {
    if (typeof authSystem !== 'undefined' && authSystem.isAuthenticated()) {
        const result = authSystem.toggleFavorite(bookId);

        // показати сповіщення
        if (result.success) {
            if (result.action === 'added') {
                toast.success('Книгу додано до улюблених!');
            } else {
                toast.info('Книгу видалено з улюблених');
            }
        } else {
            toast.error(result.message);
        }

        return result.success && result.action === 'added';
    }

    toast.error('Будь ласка, увійдіть до облікового запису, щоб додати книгу до улюблених');
    return false;
};



// оновлення віджетів
function updateBookCardRatings(container = document) {
    const cards = container.querySelectorAll('.book-card[data-book-id]');

    cards.forEach(card => {
        const bookId = parseInt(card.getAttribute('data-book-id'));
        const book = window.catalogBooks.find(b => b.id === bookId);
        if (!book) return;

        const { ratingValue } = getBookRatingInfo(bookId, book.rating);
        const starsEl = card.querySelector('.book-rating-stars');
        const valueEl = card.querySelector('.book-rating-value');

        if (starsEl) starsEl.textContent = buildRatingStars(ratingValue);
        if (valueEl) valueEl.textContent = ratingValue.toFixed(1);
    });
}

// оновлення лічильників
function updateCategoryCounts() {
    const cards = document.querySelectorAll('.category-card[data-genre]');
    if (!cards.length) return;

    cards.forEach(card => {
        const genre = card.getAttribute('data-genre');
        const countEl = card.querySelector('.category-count');
        if (!genre || !countEl) return;

        const count = window.catalogBooks.filter(book => book.genre === genre).length;
        countEl.textContent = count > 0 ? `${count} книг` : 'Новинки';
    });
}
