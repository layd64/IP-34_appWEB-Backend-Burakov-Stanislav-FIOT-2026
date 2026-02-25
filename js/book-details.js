// book details system

class BookDetailsSystem {
    constructor() {
        this.reviewsKey = 'bookstore_reviews';
        this.books = this.getAllBooks();
    }

    getAllBooks() {
        // try to get from global scope
        if (typeof window !== 'undefined' && window.catalogBooks) {
            return window.catalogBooks;
        }

        // fallback book list
        return [
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
                image: 'assets/slideshow/books.png',
                description: 'Захоплюючий роман про штучний інтелект та майбутнє технологій. Головний герой намагається розгадати таємницю коду, який може змінити світ.'
            },
            {
                id: 6,
                title: 'Таємниця океану',
                author: 'Майкл Чен',
                genre: 'Детектив',
                price: 480,
                rating: 4,
                image: 'assets/slideshow/books.png',
                description: 'Загадковий детектив про зникнення корабля та таємниці глибин океану. Детектив намагається розкрити правду про загадкову подію.'
            },
            {
                id: 7,
                title: 'Цифрова революція',
                author: 'Емма Девіс',
                genre: 'Наукова фантастика',
                price: 520,
                rating: 5,
                image: 'assets/slideshow/books.png',
                description: 'Футуристичний роман про технологічну революцію, яка змінює суспільство. Автор досліджує етичні питання майбутнього.'
            },
            {
                id: 8,
                title: 'Космічна одіссея',
                author: 'Роберт Вілсон',
                genre: 'Наукова фантастика',
                price: 600,
                rating: 4,
                image: 'assets/slideshow/books.png',
                description: 'Епічна космічна сага про подорож до далеких галактик. Герої стикаються з невідомими цивілізаціями та викликами космосу.'
            },
            {
                id: 9,
                title: 'Загадка старого замку',
                author: 'Олена Петренко',
                genre: 'Детектив',
                price: 380,
                rating: 4,
                image: 'assets/slideshow/books.png',
                description: 'Детективна історія про таємниці старого замку та зниклі скарби. Читач разом з героями розгадує загадки минулого.'
            },
            {
                id: 10,
                title: 'Шлях до успіху',
                author: 'Андрій Коваленко',
                genre: 'Саморозвиток',
                price: 350,
                rating: 3,
                image: 'assets/slideshow/books.png',
                description: 'Практичний посібник з саморозвитку та досягнення цілей. Автор ділиться досвідом та ефективними стратегіями успіху.'
            },
            {
                id: 11,
                title: 'Життя видатних людей',
                author: 'Марія Іваненко',
                genre: 'Біографія',
                price: 420,
                rating: 4,
                image: 'assets/slideshow/books.png',
                description: 'Збірка біографій видатних особистостей, які змінили світ. Натхненні історії про досягнення та подолання перешкод.'
            },
            {
                id: 12,
                title: 'Романтика вічності',
                author: 'Софія Мороз',
                genre: 'Романтика',
                price: 290,
                rating: 3,
                image: 'assets/slideshow/books.png',
                description: 'Романтична історія про кохання, яке долає всі перешкоди. Емоційний твір про вічні почуття та пристрасть.'
            },
            {
                id: 13,
                title: 'Захар Беркут',
                author: 'Іван Франко',
                genre: 'Художня література',
                price: 380,
                rating: 5,
                image: 'assets/slideshow/books.png',
                description: 'Історична повість про боротьбу українського народу за незалежність. Епічний твір про мужність та патріотизм.'
            },
            {
                id: 14,
                title: 'Тіні забутих предків',
                author: 'Михайло Коцюбинський',
                genre: 'Художня література',
                price: 340,
                rating: 5,
                image: 'assets/slideshow/books.png',
                description: 'Поетична повість про життя гуцулів, їхні традиції та звичаї. Твір про кохання, смерть та вічність.'
            },
            {
                id: 15,
                title: 'Майстер і Маргарита',
                author: 'Михайло Булгаков',
                genre: 'Художня література',
                price: 520,
                rating: 5,
                image: 'assets/slideshow/books.png',
                description: 'Філософський роман про добро і зло, кохання та жертву. Один з найвизначніших творів світової літератури.'
            },
            {
                id: 16,
                title: '1984',
                author: 'Джордж Орвелл',
                genre: 'Антиутопія',
                price: 450,
                rating: 5,
                image: 'assets/slideshow/books.png',
                description: 'Класичний роман-антиутопія про тоталітарне суспільство та боротьбу за свободу думки.'
            },
            {
                id: 17,
                title: 'Гаррі Поттер і філософський камінь',
                author: 'Дж. К. Роулінг',
                genre: 'Фентезі',
                price: 480,
                rating: 5,
                image: 'assets/slideshow/books.png',
                description: 'Перша книга про пригоди юного чарівника Гаррі Поттера у світі магії та чарівництва.'
            },
            {
                id: 18,
                title: 'Володар перснів',
                author: 'Дж. Р. Р. Толкін',
                genre: 'Фентезі',
                price: 550,
                rating: 5,
                image: 'assets/slideshow/books.png',
                description: 'Епічна трилогія про боротьбу добра зі злом у вигаданому світі Середзем\'я.'
            },
            {
                id: 19,
                title: 'Шерлок Холмс',
                author: 'Артур Конан Дойл',
                genre: 'Детектив',
                price: 420,
                rating: 5,
                image: 'assets/slideshow/books.png',
                description: 'Збірка детективних оповідань про знаменитого детектива Шерлока Холмса та його друга доктора Ватсона.'
            },
            {
                id: 20,
                title: 'Анна Кареніна',
                author: 'Лев Толстой',
                genre: 'Художня література',
                price: 490,
                rating: 5,
                image: 'assets/slideshow/books.png',
                description: 'Класичний роман про кохання, зраду та суспільні норми в Росії XIX століття.'
            },
            {
                id: 21,
                title: 'Війна і мир',
                author: 'Лев Толстой',
                genre: 'Художня література',
                price: 680,
                rating: 5,
                image: 'assets/slideshow/books.png',
                description: 'Епічний роман про російське суспільство під час наполеонівських воєн. Один з найбільших творів світової літератури.'
            },
            {
                id: 22,
                title: 'Пригоди Тома Сойєра',
                author: 'Марк Твен',
                genre: 'Пригоди',
                price: 320,
                rating: 4,
                image: 'assets/slideshow/books.png',
                description: 'Захоплюючі пригоди хлопчика Тома Сойєра та його друга Гекльберрі Фінна на Міссісіпі.'
            },
            {
                id: 23,
                title: 'Гра престолів',
                author: 'Джордж Р. Р. Мартін',
                genre: 'Фентезі',
                price: 560,
                rating: 5,
                image: 'assets/slideshow/books.png',
                description: 'Перша книга серії "Пісня льоду та полум\'я" про боротьбу за залізний трон у вигаданому світі Вестеросу.'
            },
            {
                id: 24,
                title: 'Дюна',
                author: 'Френк Герберт',
                genre: 'Наукова фантастика',
                price: 540,
                rating: 5,
                image: 'assets/slideshow/books.png',
                description: 'Епічний науково-фантастичний роман про пустельну планету Арракіс та боротьбу за контроль над спецією.'
            }
        ];
    }

    getBookById(id) {
        return this.books.find(book => book.id === parseInt(id));
    }

    getReviews(bookId) {
        const reviewsJson = localStorage.getItem(this.reviewsKey);
        const allReviews = reviewsJson ? JSON.parse(reviewsJson) : [];
        return allReviews.filter(review => review.bookId === parseInt(bookId));
    }

    addReview(bookId, rating, text) {
        const currentUser = authSystem.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Будь ласка, увійдіть до облікового запису, щоб залишити відгук' };
        }

        const reviewsJson = localStorage.getItem(this.reviewsKey);
        const allReviews = reviewsJson ? JSON.parse(reviewsJson) : [];

        // check if reviewed
        const existingReview = allReviews.find(
            review => review.bookId === parseInt(bookId) && review.userId === currentUser.id
        );

        if (existingReview) {
            return { success: false, message: 'Ви вже залишили відгук на цю книгу' };
        }

        const newReview = {
            id: Date.now().toString(),
            bookId: parseInt(bookId),
            userId: currentUser.id,
            userName: currentUser.fullName || currentUser.email,
            rating: parseInt(rating),
            text: text,
            createdAt: new Date().toISOString()
        };

        allReviews.push(newReview);
        localStorage.setItem(this.reviewsKey, JSON.stringify(allReviews));

        return { success: true, message: 'Відгук додано!', review: newReview };
    }

    calculateAverageRating(bookId) {
        const reviews = this.getReviews(bookId);
        if (reviews.length === 0) {
            return null;
        }

        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }

    deleteReview(reviewId) {
        const currentUser = authSystem.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Користувач не автентифікований' };
        }

        const reviewsJson = localStorage.getItem(this.reviewsKey);
        const allReviews = reviewsJson ? JSON.parse(reviewsJson) : [];

        const reviewIndex = allReviews.findIndex(review => review.id === reviewId);
        if (reviewIndex === -1) {
            return { success: false, message: 'Відгук не знайдено' };
        }

        const review = allReviews[reviewIndex];
        if (review.userId !== currentUser.id) {
            return { success: false, message: 'Ви можете видаляти тільки свої відгуки' };
        }

        allReviews.splice(reviewIndex, 1);
        localStorage.setItem(this.reviewsKey, JSON.stringify(allReviews));

        return { success: true, message: 'Відгук видалено!' };
    }
}

// Create global instance (will be initialized after DOM loads)
let bookDetailsSystem;

// init book details
document.addEventListener('DOMContentLoaded', function () {
    // init system
    bookDetailsSystem = new BookDetailsSystem();
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        document.getElementById('bookDetails').innerHTML = '<p>Книга не знайдена</p>';
        return;
    }

    const book = bookDetailsSystem.getBookById(bookId);
    if (!book) {
        document.getElementById('bookDetails').innerHTML = '<p>Книга не знайдена</p>';
        return;
    }

    // display details
    const reviews = bookDetailsSystem.getReviews(bookId);
    const averageRating = bookDetailsSystem.calculateAverageRating(bookId);
    const displayRating = averageRating ? parseFloat(averageRating) : book.rating;

    // check favorite
    const isFavorite = typeof authSystem !== 'undefined' && authSystem.isFavorite(bookId);
    const heartIcon = '<svg viewBox="0 0 24 24" class="heart-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
    const activeClass = isFavorite ? 'active' : '';

    const bookDetailsHTML = `
        <div class="book-details-main">
            <div class="book-details-image">
                <img src="${book.image}" alt="${book.title}">
            </div>
            <div class="book-details-info">
                <h2>${book.title}</h2>
                <p class="book-details-author">${book.author}</p>
                <div class="book-details-meta">
                    <span class="book-genre-badge">${book.genre}</span>
                    <div class="book-rating-display">
                        <span class="rating-stars">${'⭐'.repeat(Math.round(displayRating))}</span>
                        <span class="rating-value">${displayRating}</span>
                        ${reviews.length > 0 ? `<span class="rating-count">(${reviews.length} ${reviews.length === 1 ? 'відгук' : reviews.length < 5 ? 'відгуки' : 'відгуків'})</span>` : ''}
                    </div>
                </div>
                <p class="book-details-price">${book.price} грн</p>
                <p class="book-details-description">${book.description}</p>
                <div class="action-buttons">
                    <button id="addToCartBtn" class="add-to-cart-btn">Додати до кошика</button>
                    <button id="bookDetailFavBtn" class="favorite-btn ${activeClass}" data-book-id="${book.id}" aria-label="Add to favorites">
                        ${heartIcon}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('bookDetails').innerHTML = bookDetailsHTML;

    // favorite button
    const favBtn = document.getElementById('bookDetailFavBtn');
    if (favBtn) {
        favBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

            // use global function
            if (typeof window.toggleFavorite === 'function') {
                const isActive = window.toggleFavorite(bookId);
                if (isActive) {
                    this.classList.add('active');
                } else {
                    this.classList.remove('active');
                }
            }
        });
    }

    // add to cart
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn && typeof addToCart !== 'undefined') {
        addToCartBtn.addEventListener('click', function () {
            const bookData = {
                image: book.image,
                price: `${book.price} грн`,
                title: book.title,
                author: book.author,
                description: book.description
            };
            addToCart(bookData);
        });
    }

    // display reviews
    renderReviews(bookId);

    // display rating
    renderAverageRating(bookId, averageRating, reviews.length);

    // review form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        // rating handlers
        const ratingInputs = document.querySelectorAll('input[name="rating"]');
        const ratingLabels = document.querySelectorAll('.rating-input label');

        // get labels
        const labelsArray = Array.from(ratingLabels).reverse();

        function updateRatingDisplay(selectedValue) {
            labelsArray.forEach((label, index) => {
                const ratingValue = index + 1; // 1, 2, 3, 4, 5
                if (ratingValue <= selectedValue) {
                    label.textContent = '★';
                    label.style.color = '#F7A823';
                } else {
                    label.textContent = '☆';
                    label.style.color = '#ddd';
                }
            });
        }

        ratingInputs.forEach(input => {
            const value = parseInt(input.value);
            const label = input.nextElementSibling;

            input.addEventListener('change', function () {
                updateRatingDisplay(value);
            });

            if (label && label.tagName === 'LABEL') {
                label.addEventListener('mouseenter', function () {
                    updateRatingDisplay(value);
                });
            }
        });

        const ratingInputContainer = document.querySelector('.rating-input');
        if (ratingInputContainer) {
            ratingInputContainer.addEventListener('mouseleave', function () {
                const checkedInput = document.querySelector('input[name="rating"]:checked');
                if (checkedInput) {
                    updateRatingDisplay(parseInt(checkedInput.value));
                } else {
                    labelsArray.forEach(label => {
                        label.textContent = '☆';
                        label.style.color = '#ddd';
                    });
                }
            });
        }

        reviewForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const errorMessage = document.getElementById('reviewErrorMessage');
            const successMessage = document.getElementById('reviewSuccessMessage');

            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            const rating = document.querySelector('input[name="rating"]:checked');
            const text = document.getElementById('reviewText').value.trim();

            if (!rating) {
                errorMessage.textContent = 'Будь ласка, оберіть оцінку';
                errorMessage.style.display = 'block';
                return;
            }

            if (!text) {
                errorMessage.textContent = 'Будь ласка, напишіть відгук';
                errorMessage.style.display = 'block';
                return;
            }

            const result = bookDetailsSystem.addReview(bookId, rating.value, text);

            if (result.success) {
                successMessage.textContent = result.message;
                successMessage.style.display = 'block';
                reviewForm.reset();
                renderReviews(bookId);
                renderAverageRating(bookId, bookDetailsSystem.calculateAverageRating(bookId), bookDetailsSystem.getReviews(bookId).length);

                // update rating
                const newAverageRating = bookDetailsSystem.calculateAverageRating(bookId);
                const displayRating = newAverageRating ? parseFloat(newAverageRating) : book.rating;
                const ratingDisplay = document.querySelector('.book-rating-display');
                if (ratingDisplay) {
                    const reviews = bookDetailsSystem.getReviews(bookId);
                    ratingDisplay.innerHTML = `
                        <span class="rating-stars">${'⭐'.repeat(Math.round(displayRating))}</span>
                        <span class="rating-value">${displayRating}</span>
                        ${reviews.length > 0 ? `<span class="rating-count">(${reviews.length} ${reviews.length === 1 ? 'відгук' : reviews.length < 5 ? 'відгуки' : 'відгуків'})</span>` : ''}
                    `;
                }
            } else {
                errorMessage.textContent = result.message;
                errorMessage.style.display = 'block';
            }
        });
    }
});

function renderReviews(bookId) {
    const reviews = bookDetailsSystem.getReviews(bookId);
    const reviewsList = document.getElementById('reviewsList');
    const currentUser = authSystem.getCurrentUser();

    if (!reviewsList) return;

    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="no-reviews">Поки що немає відгуків. Будьте першим!</p>';
        return;
    }

    // sort reviews
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    reviewsList.innerHTML = reviews.map(review => {
        const date = new Date(review.createdAt);
        const canDelete = currentUser && currentUser.id === review.userId;

        return `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-user-info">
                        <strong>${review.userName}</strong>
                        <span class="review-date">${date.toLocaleDateString('uk-UA')}</span>
                    </div>
                    <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
                </div>
                <p class="review-text">${review.text}</p>
                ${canDelete ? `<button class="delete-review-btn" data-review-id="${review.id}">Видалити</button>` : ''}
            </div>
        `;
    }).join('');

    // delete handlers
    const deleteButtons = document.querySelectorAll('.delete-review-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const reviewId = this.getAttribute('data-review-id');
            toast.confirm(
                'Ви впевнені, що хочете видалити цей відгук?',
                () => {
                    const result = bookDetailsSystem.deleteReview(reviewId);
                    if (result.success) {
                        const urlParams = new URLSearchParams(window.location.search);
                        const bookId = urlParams.get('id');
                        renderReviews(bookId);
                        const reviews = bookDetailsSystem.getReviews(bookId);
                        renderAverageRating(bookId, bookDetailsSystem.calculateAverageRating(bookId), reviews.length);

                        // update rating
                        const book = bookDetailsSystem.getBookById(bookId);
                        const newAverageRating = bookDetailsSystem.calculateAverageRating(bookId);
                        const displayRating = newAverageRating ? parseFloat(newAverageRating) : book.rating;
                        const ratingDisplay = document.querySelector('.book-rating-display');
                        if (ratingDisplay) {
                            ratingDisplay.innerHTML = `
                                <span class="rating-stars">${'⭐'.repeat(Math.round(displayRating))}</span>
                                <span class="rating-value">${displayRating}</span>
                                ${reviews.length > 0 ? `<span class="rating-count">(${reviews.length} ${reviews.length === 1 ? 'відгук' : reviews.length < 5 ? 'відгуки' : 'відгуків'})</span>` : ''}
                            `;
                        }
                        toast.success('Відгук видалено!');
                    } else {
                        toast.error(result.message);
                    }
                }
            );
        });
    });
}

function renderAverageRating(bookId, averageRating, reviewCount) {
    const averageRatingEl = document.getElementById('averageRating');
    if (!averageRatingEl) return;

    if (averageRating) {
        const rating = parseFloat(averageRating);
        averageRatingEl.innerHTML = `
            <div class="average-rating-content">
                <div class="average-rating-value">${rating}</div>
                <div class="average-rating-stars">${'⭐'.repeat(Math.round(rating))}</div>
                <div class="average-rating-text">Середня оцінка на основі ${reviewCount} ${reviewCount === 1 ? 'відгуку' : reviewCount < 5 ? 'відгуків' : 'відгуків'}</div>
            </div>
        `;
    } else {
        averageRatingEl.innerHTML = '<p class="no-rating">Поки що немає оцінок</p>';
    }
}

