const { Book } = require('./models/index');
const { seedBooks } = require('./controllers/bookController');

(async () => {
    try {
        console.log('Clearing existing books...');
        await Book.destroy({ where: {}, truncate: true });
        console.log('Books cleared. Reseeding...');
        
        // Use a mock req/res to call seedBooks
        const req = {};
        const res = {
            json: (data) => console.log(data),
            status: function(code) { 
                this.statusCode = code; 
                return this; 
            }
        };
        const next = (err) => console.error(err);
        
        await seedBooks(req, res, next);
        console.log('Done!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
