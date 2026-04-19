// система сповіщень

class ToastNotification {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // створення контейнера
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    // показати сповіщення
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        // іконки статусу
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;

        // додати до контейнера
        this.container.appendChild(toast);

        // анімація появи
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        // обробник кнопки закриття
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hide(toast);
        });

        // автоматичне видалення
        if (duration > 0) {
            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }

        return toast;
    }

    // сховати сповіщення
    hide(toast) {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // допоміжні методи
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 3500) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }

    // діалог підтвердження
    confirm(message, onConfirm, onCancel) {
        const confirmToast = document.createElement('div');
        confirmToast.className = 'toast-confirm';

        confirmToast.innerHTML = `
            <div class="toast-confirm-content">
                <div class="toast-confirm-icon">?</div>
                <div class="toast-confirm-message">${message}</div>
                <div class="toast-confirm-buttons">
                    <button class="toast-btn toast-btn-cancel">Скасувати</button>
                    <button class="toast-btn toast-btn-confirm">Підтвердити</button>
                </div>
            </div>
        `;

        document.body.appendChild(confirmToast);

        setTimeout(() => {
            confirmToast.classList.add('toast-confirm-show');
        }, 10);

        const btnCancel = confirmToast.querySelector('.toast-btn-cancel');
        const btnConfirm = confirmToast.querySelector('.toast-btn-confirm');

        const close = () => {
            confirmToast.classList.remove('toast-confirm-show');
            setTimeout(() => {
                if (confirmToast.parentNode) {
                    confirmToast.parentNode.removeChild(confirmToast);
                }
            }, 300);
        };

        btnCancel.addEventListener('click', () => {
            close();
            if (onCancel) onCancel();
        });

        btnConfirm.addEventListener('click', () => {
            close();
            if (onConfirm) onConfirm();
        });

        // закрити по escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                close();
                if (onCancel) onCancel();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        return confirmToast;
    }
}

// створення глобального об'єкта
const toast = new ToastNotification();

// експорт глобально
window.toast = toast;
