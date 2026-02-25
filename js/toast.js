// toast notification system

class ToastNotification {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // create container
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    // show notification
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        // status icons
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

        // add to container
        this.container.appendChild(toast);

        // animate entry
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        // close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hide(toast);
        });

        // auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }

        return toast;
    }

    // hide notification
    hide(toast) {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // helper methods
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

    // confirm dialog
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

        // close on escape
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

// create global instance
const toast = new ToastNotification();

// export globally
window.toast = toast;
