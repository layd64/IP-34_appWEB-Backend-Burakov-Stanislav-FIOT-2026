// система деталей книги

class BookDetailsSystem {
    constructor() {
        this.reviewsKey = 'bookstore_reviews';
    }

    async getBookById(id) {
        try {
            const res = await fetch(`/api/books/${id}`);
            if (!res.ok) return null;
            const json = await res.json();
            return json.data;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async getReviews(bookId) {
        try {
            const res = await fetch(`/api/reviews/book/${bookId}`);
            if (!res.ok) return [];
            return await res.json();
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async addReview(bookId, rating, text) {
        if (typeof authSystem === 'undefined' || !authSystem.isAuthenticated()) {
            return { success: false, message: 'Будь ласка, увійдіть до облікового запису, щоб залишити відгук' };
        }

        try {
            const res = await fetch(`/api/reviews/book/${bookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authSystem.getToken()}`
                },
                body: JSON.stringify({ rating: parseInt(rating), text })
            });

            const data = await res.json();
            if (res.ok) {
                return { success: true, message: data.message, review: data.review };
            } else {
                return { success: false, message: data.error || 'Помилка' };
            }
        } catch (e) {
            return { success: false, message: 'Помилка з\'єднання' };
        }
    }

    calculateAverageRating(reviews) {
        if (!reviews || reviews.length === 0) {
            return null;
        }
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }

    async deleteReview(reviewId) {
        if (typeof authSystem === 'undefined' || !authSystem.isAuthenticated()) {
            return { success: false, message: 'Користувач не автентифікований' };
        }

        try {
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authSystem.getToken()}`
                }
            });

            const data = await res.json();
            if (res.ok) {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.error || 'Помилка' };
            }
        } catch (e) {
            return { success: false, message: 'Помилка з\'єднання' };
        }
    }
}

// створення глобального об'єкта (буде ініціалізовано після завантаження dom)
let bookDetailsSystem;
let currentBookData = null;

// ініціалізація деталей книги
document.addEventListener('DOMContentLoaded', async function () {
    // ініціалізація системи
    bookDetailsSystem = new BookDetailsSystem();
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    const detailsContainer = document.getElementById('bookDetails');

    if (!bookId) {
        detailsContainer.innerHTML = '<p>Книга не знайдена</p>';
        return;
    }

    detailsContainer.innerHTML = '<div style="text-align:center; padding: 3rem;"><p>Завантаження книги...</p></div>';

    const book = await bookDetailsSystem.getBookById(bookId);
    if (!book) {
        detailsContainer.innerHTML = '<p>Книга не знайдена</p>';
        return;
    }
    
    currentBookData = book;

    // відображення деталей
    const reviews = await bookDetailsSystem.getReviews(bookId);
    const averageRating = bookDetailsSystem.calculateAverageRating(reviews);
    const displayRating = averageRating ? parseFloat(averageRating) : book.rating;

    // перевірка обраного
    const isFavorite = typeof authSystem !== 'undefined' && authSystem.isFavorite(bookId);
    const heartIcon = '<svg viewBox="0 0 24 24" class="heart-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
    const activeClass = isFavorite ? 'active' : '';

    const imgSrc = book.image && !book.image.startsWith('assets/slideshow') 
                   ? book.image 
                   : 'assets/book-placeholder.png';

    const bookDetailsHTML = `
        <div class="book-details-main">
            <div class="book-details-image">
                <img src="${imgSrc}" alt="${book.title}" onerror="this.src='assets/book-placeholder.png'">
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

    // кнопка обраного
    const favBtn = document.getElementById('bookDetailFavBtn');
    if (favBtn) {
        favBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

            // використання глобальної функції
            if (typeof window.toggleFavorite === 'function') {
                window.toggleFavorite(bookId).then(isActive => {
                    if (isActive) {
                        this.classList.add('active');
                    } else {
                        this.classList.remove('active');
                    }
                });
            }
        });
    }

    // додати в кошик
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

    // відображення відгуків
    await renderReviews(bookId);

    // відображення рейтингу
    renderAverageRating(bookId, averageRating, reviews.length);

    // форма відгуку
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        // обробники рейтингу
        const ratingInputs = document.querySelectorAll('input[name="rating"]');
        const ratingLabels = document.querySelectorAll('.rating-input label');

        // отримання міток
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

        reviewForm.addEventListener('submit', async function (e) {
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

            const result = await bookDetailsSystem.addReview(bookId, rating.value, text);

            if (result.success) {
                successMessage.textContent = result.message;
                successMessage.style.display = 'block';
                reviewForm.reset();
                await renderReviews(bookId);
                
                const newReviews = await bookDetailsSystem.getReviews(bookId);
                const newAverageRating = bookDetailsSystem.calculateAverageRating(newReviews);
                
                renderAverageRating(bookId, newAverageRating, newReviews.length);

                // оновлення рейтингу
                const displayRating = newAverageRating ? parseFloat(newAverageRating) : (currentBookData ? currentBookData.rating : 0);
                const ratingDisplay = document.querySelector('.book-rating-display');
                if (ratingDisplay) {
                    ratingDisplay.innerHTML = `
                        <span class="rating-stars">${'⭐'.repeat(Math.round(displayRating))}</span>
                        <span class="rating-value">${displayRating}</span>
                        ${newReviews.length > 0 ? `<span class="rating-count">(${newReviews.length} ${newReviews.length === 1 ? 'відгук' : newReviews.length < 5 ? 'відгуки' : 'відгуків'})</span>` : ''}
                    `;
                }
            } else {
                errorMessage.textContent = result.message;
                errorMessage.style.display = 'block';
            }
        });
    }
});

async function renderReviews(bookId) {
    const reviews = await bookDetailsSystem.getReviews(bookId);
    const reviewsList = document.getElementById('reviewsList');
    const currentUser = typeof authSystem !== 'undefined' ? authSystem.getCurrentUser() : null;

    if (!reviewsList) return;

    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="no-reviews">Поки що немає відгуків. Будьте першим!</p>';
        return;
    }

    // сортування відгуків
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

    // обробники видалення
    const deleteButtons = document.querySelectorAll('.delete-review-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const reviewId = this.getAttribute('data-review-id');
            toast.confirm('Ви впевнені, що хочете видалити цей відгук?', async () => {
                const result = await bookDetailsSystem.deleteReview(reviewId);
                if (result.success) {
                    await renderReviews(bookId);
                    const newReviews = await bookDetailsSystem.getReviews(bookId);
                    const newAvg = bookDetailsSystem.calculateAverageRating(newReviews);
                    renderAverageRating(bookId, newAvg, newReviews.length);

                    // оновлення рейтингу
                    const displayRating = newAvg ? parseFloat(newAvg) : (currentBookData ? currentBookData.rating : 0);
                    const ratingDisplay = document.querySelector('.book-rating-display');
                    if (ratingDisplay) {
                        ratingDisplay.innerHTML = `
                            <span class="rating-stars">${'⭐'.repeat(Math.round(displayRating))}</span>
                            <span class="rating-value">${displayRating}</span>
                            ${newReviews.length > 0 ? `<span class="rating-count">(${newReviews.length} ${newReviews.length === 1 ? 'відгук' : newReviews.length < 5 ? 'відгуки' : 'відгуків'})</span>` : ''}
                        `;
                    }
                    toast.success('Відгук видалено!');
                } else {
                    toast.error(result.message);
                }
            });
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

