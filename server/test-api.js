const http = require('http');

const request = (path, method, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path,
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let resData = '';
            res.on('data', chunk => resData += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(resData || '{}') }));
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
};

const runTests = async () => {
    console.log('Testing Registration...');
    const registerRes = await request('/api/auth/register', 'POST', {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123'
    });
    console.log('Register Response:', registerRes);
    
    // оновлюємо isEmailConfirmed вручну в базі даних
    const { User } = require('./models/index');
    await User.update({ isEmailConfirmed: true }, { where: { email: 'test@test.com' } });
    
    console.log('\nTesting Login...');
    const loginRes = await request('/api/auth/login', 'POST', {
        email: 'test@test.com',
        password: 'password123'
    });
    console.log('Login Response:', loginRes);
    
    process.exit(0);
};

runTests();
