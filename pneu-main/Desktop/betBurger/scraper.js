const puppeteer = require('puppeteer');

async function dismissCookieConsent(page) {
    try {
        await page.waitForSelector('.cc-window');
        await page.click('.cc-btn.cc-allow');
        } catch (error) {
        console.error('Error dismissing cookie consent:', error);
    }
}

async function loginAndScrape(url, email, password) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(url);
        await dismissCookieConsent(page);

        await page.waitForSelector('#betburger_user_email');
        await page.type('#betburger_user_email', email);
        await page.type('#betburger_user_password', password);

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);

        const isLoggedIn = page.url().startsWith('https://www.betburger.com/profile');

        if (isLoggedIn) {

            if (page.url().startsWith('https://www.betburger.com/profile')) {
                await page.goto('https://www.betburger.com/arbs');
                await page.waitForSelector('.arb'); // Wait for arbitrage data to load
            }

            const arbsData = await scrapeArbs(page);
            console.log(arbsData);
        } else {
            throw new Error('Login failed. Could not verify successful login.');
        }
    } catch (error) {
        console.error('Login process failed:', error);
    } finally {
        await browser.close();
    }
}

async function scrapeArbs(page) {
    const arbsData = await page.evaluate(() => {
    const arbs = Array.from(document.querySelectorAll('.arb'));
    const data = arbs.map(arb => {
    // Extract basic information
    const percent = arb.querySelector('.percent').textContent.trim();
    const sport = arb.querySelector('.sport-name').textContent.trim();
    const updatedAt = arb.querySelector('.updated-at').textContent.trim();

            // Extract event and league details
            const eventName = arb.querySelector('.event-name .name').textContent.trim();
            const league = arb.querySelector('.event-name .league').textContent.trim();

            // Extract market type and odds information
            const market = arb.querySelector('.market').textContent.trim();
            const odds = arb.querySelector('.coefficient').textContent.trim();

            // Extract bookmakers involved
            const bookmakers = Array.from(arb.querySelectorAll('.bet-wrapper')).map(bookmaker => {
                const bookmakerName = bookmaker.querySelector('.bookmaker-name').textContent.trim();
                const date = bookmaker.querySelector('.date').textContent.trim();
                const event = bookmaker.querySelector('.event-name .name').textContent.trim();
                const eventLeague = bookmaker.querySelector('.event-name .league').textContent.trim();
                const marketInfo = bookmaker.querySelector('.market').textContent.trim();
                const coefficient = bookmaker.querySelector('.coefficient').textContent.trim();

                return {
                    bookmakerName,
                    date,
                    event,
                    eventLeague,
                    marketInfo,
                    coefficient
                };
            });

            return {
                percent,
                sport,
                updatedAt,
                bookmakers
                };
            });
            return data;
        });
    return formatArbsData(arbsData); // Format data before returning
    }

function formatArbsData(arbsData) {
const formattedData = arbsData.map(arb => {
const { percent, sport, updatedAt, bookmakers } = arb;

    let formattedOutput = `Arbitrage Opportunity - ${percent} in ${sport} (Updated ${updatedAt})\n`;

    bookmakers.forEach((bookmaker, index) => {
        formattedOutput += `Bookmaker ${index + 1}: ${bookmaker.bookmakerName}\n`;
        formattedOutput += `Date: ${bookmaker.date}\n`;
        formattedOutput += `Event: ${bookmaker.event}\n`;
        formattedOutput += `League: ${bookmaker.eventLeague}\n`;
        formattedOutput += `Market: ${bookmaker.marketInfo}\n`;
        formattedOutput += `Coefficient: ${bookmaker.coefficient}\n`;
        formattedOutput += `-----------------------\n`;
    });


    return formattedOutput;
});

return formattedData.join('\n'); // Join formatted outputs into a single string
}

// Replace with your actual email and password
const email = 'jakub.maruska014@gmail.com';
const password = 'nyggyd-Vuzjaq-1vofsu';

loginAndScrape('https://www.betburger.com/users/sign_in', email, password);