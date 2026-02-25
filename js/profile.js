document.addEventListener('DOMContentLoaded', function () {
    const currentUser = authSystem.getCurrentUser();

    if (!currentUser) {
        document.getElementById('profileContent').style.display = 'none';
        document.getElementById('notAuthenticated').style.display = 'block';
        return;
    }

    // load user data
    document.getElementById('fullName').value = currentUser.fullName || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('address').value = currentUser.address || '';

    if (currentUser.createdAt) {
        const date = new Date(currentUser.createdAt);
        document.getElementById('createdAt').textContent = date.toLocaleDateString('uk-UA');
    }

    // profile form
    const editBtn = document.getElementById('editBtn');
    const saveButtons = document.getElementById('saveButtons');
    const saveBtn = saveButtons.querySelector('button[type="submit"]');
    const profileInputs = document.querySelectorAll('#profileForm input');
    let isEditing = false;

    // icons
    const pencilIcon = '<svg viewBox="0 0 24 24" class="edit-icon"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
    const closeIcon = '<svg viewBox="0 0 24 24" class="edit-icon"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

    editBtn.addEventListener('click', function () {
        isEditing = !isEditing;

        profileInputs.forEach(input => {
            if (input.id !== 'email') { // email read-only
                input.readOnly = !isEditing;
            }
        });

        if (isEditing) {
            saveBtn.disabled = false;
            profileInputs[0].focus();
            this.innerHTML = closeIcon;
            this.setAttribute('aria-label', 'Скасувати редагування');
        } else {
            saveBtn.disabled = true;
            this.innerHTML = pencilIcon;
            this.setAttribute('aria-label', 'Редагувати');
            // reset ui if needed
        }
    });

    // form submit
    document.getElementById('profileForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        const result = authSystem.updateProfile({
            fullName,
            phone,
            address
        });

        if (result.success) {
            toast.success(result.message);

            // Immediately exit edit mode
            isEditing = false;
            profileInputs.forEach(input => input.readOnly = true);

            // Reset UI
            saveBtn.disabled = true;
            editBtn.innerHTML = pencilIcon;
            editBtn.setAttribute('aria-label', 'Редагувати');
        } else {
            toast.error(result.message);
        }
    });

    // Change password
    // change password
    const passwordForm = document.getElementById('passwordForm');
    passwordForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmPassword) {
            toast.error('Паролі не співпадають');
            return;
        }

        const result = authSystem.changePassword(oldPassword, newPassword);

        if (result.success) {
            toast.success(result.message);
            passwordForm.reset();
        } else {
            toast.error(result.message);
        }
    });

    // Logout
    // logout
    document.getElementById('logoutBtn').addEventListener('click', function () {
        authSystem.logout();
        window.location.href = 'index.html';
    });

    // Logout and Clear localStorage
    // logout and clear
    document.getElementById('logoutClearBtn').addEventListener('click', function () {
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // render favorites
    function renderFavorites() {
        const favorites = authSystem.getFavorites();
        const favoritesGrid = document.getElementById('favoritesGrid');

        if (!favoritesGrid) return;

        if (favorites.length === 0) {
            favoritesGrid.innerHTML = '<p class="no-favorites">У вас поки немає улюблених книг.</p>';
            return;
        }

        favoritesGrid.innerHTML = '';

        if (!window.catalogBooks) {
            favoritesGrid.innerHTML = '<p class="error-message">Не вдалося завантажити список книг.</p>';
            return;
        }

        favorites.forEach(bookId => {
            const book = window.catalogBooks.find(b => b.id === parseInt(bookId));
            if (book) {
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card');
                bookCard.setAttribute('data-description', book.description); // ensure attributes match

                // exact match logic
                const { ratingValue } = getBookRatingInfo(book.id, book.rating);
                const heartIcon = '<svg viewBox="0 0 24 24" class="heart-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

                // active state
                const activeClass = 'active';

                bookCard.innerHTML = `
                    <a href="book.html?id=${book.id}" class="book-card-link">
                        <img src="${book.image}" alt="${book.title}" class="book-image">
                        <h3>${book.title}</h3>
                        <p class="book-author">${book.author}</p>
                        <p class="book-price">${book.price} грн</p>
                        <div class="book-rating-card">
                            <span class="book-rating-stars">${buildRatingStars(ratingValue)}</span>
                            <span class="book-rating-value">${ratingValue.toFixed(1)}</span>
                        </div>
                    </a>
                    <div class="card-actions">
                         <button class="add-to-cart-btn" data-book-id="${book.id}">В КОШИК</button>
                         <button class="favorite-btn ${activeClass}" data-book-id="${book.id}" aria-label="Remove from favorites">
                            ${heartIcon}
                        </button>
                    </div>
                `;

                const favBtn = bookCard.querySelector('.favorite-btn');
                favBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // use global function
                    window.toggleFavorite(book.id);
                    // re-render
                    renderFavorites();
                });

                const cartBtn = bookCard.querySelector('.add-to-cart-btn');
                cartBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (typeof window.addToCart === 'function') {
                        window.addToCart({
                            id: book.id, // ensure id passed
                            title: book.title,
                            price: `${book.price} грн`,
                            image: book.image
                        });
                    } else {
                        console.error('addToCart function not found');
                        toast.error('Помилка додавання до кошика');
                    }
                });

                favoritesGrid.appendChild(bookCard);
            }
        });
    }

    renderFavorites();
});
