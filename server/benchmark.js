/**
 * benchmark.js - аналіз продуктивності маршруту GET /api/books
 * демонструє різницю до (без кешу) та після (з redis-кешем) оптимізації.
 * запуск: node benchmark.js
 */

const http = require('http');

const URL = 'http://localhost:3000/api/books';
const REQUESTS = 10; // кількість запитів для кожного сценарію

function singleRequest(url) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const duration = Date.now() - start;
                try {
                    const body = JSON.parse(data);
                    resolve({ duration, source: body.source, status: res.statusCode });
                } catch {
                    resolve({ duration, source: 'unknown', status: res.statusCode });
                }
            });
        }).on('error', reject);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function stats(times) {
    const sorted = [...times].sort((a, b) => a - b);
    const sum = times.reduce((a, b) => a + b, 0);
    return {
        min: sorted[0],
        max: sorted[sorted.length - 1],
        avg: Math.round(sum / times.length),
        median: sorted[Math.floor(sorted.length / 2)],
    };
}

async function run() {
    console.log('='.repeat(55));
    console.log('  Benchmark: GET /api/books (без кешу vs з кешем)');
    console.log('='.repeat(55));

    // --- до оптимізації: перший запит завжди йде до бд ---
    console.log(`\n[до] перший запит (без кешу → до бд):`);
    const beforeResult = await singleRequest(URL);
    console.log(`  source: ${beforeResult.source}  |  час: ${beforeResult.duration} мс`);

    // --- після оптимізації: повторні запити йдуть з redis ---
    console.log(`\n[після] наступні ${REQUESTS} запити (з redis-кешем):`);
    const afterTimes = [];
    for (let i = 1; i <= REQUESTS; i++) {
        const result = await singleRequest(URL);
        afterTimes.push(result.duration);
        console.log(`  запит #${i}  source: ${result.source}  |  час: ${result.duration} мс`);
        await sleep(50);
    }

    const afterStats = stats(afterTimes);

    console.log('\n' + '='.repeat(55));
    console.log('  результати порівняння');
    console.log('='.repeat(55));
    console.log(`  до  оптимізації (бд):   ${beforeResult.duration} мс`);
    console.log(`  після оптимізації (redis):`);
    console.log(`    мінімум : ${afterStats.min} мс`);
    console.log(`    медіана : ${afterStats.median} мс`);
    console.log(`    середнє : ${afterStats.avg} мс`);
    console.log(`    максимум: ${afterStats.max} мс`);

    const improvement = Math.round((1 - afterStats.avg / beforeResult.duration) * 100);
    console.log(`\n  прискорення: ~${improvement}% швидше з кешем`);
    console.log('='.repeat(55));
}

run().catch(err => {
    console.error('помилка:', err.message);
    console.error('переконайся що сервер запущений: node server/index.js');
});
