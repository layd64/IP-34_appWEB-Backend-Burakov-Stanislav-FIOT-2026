function authorizeRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Користувач не авторизований' });
        }
        if (req.user.role !== role) {
            return res.status(403).json({ error: 'Відмовлено в доступі. Недостатньо прав.' });
        }
        next();
    };
}

module.exports = authorizeRole;
