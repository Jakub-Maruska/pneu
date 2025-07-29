const puppeteer = require('puppeteer');

async function dismissCookieConsent(page) {
    try {
        // Wait for the cookie consent banner to appear
        await page.waitForSelector('.cc-window');

        // Click the "Got it!" button to dismiss the banner
        await page.click('.cc-btn.cc-allow');
    } catch (error) {
        console.error('Error dismissing cookie consent:', error);
    }
}

async function loginAndScrape(url, email, password) {
    const browser = await puppeteer.launch({ headless: false }); // Launch in headful mode for debugging
    const page = await browser.newPage();

    try {
        // Navigate to the website
        await page.goto(url);

        // Dismiss cookie consent banner if present
        await dismissCookieConsent(page);

        // Wait for the login form and fill it
        await page.waitForSelector('#betburger_user_email');
        await page.type('#betburger_user_email', email);
        await page.type('#betburger_user_password', password);

        // Click the login submit button
        await page.click('button[type="submit"]'); // Replace with the correct selector for the submit button

        // Wait for navigation after clicking login
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // Example: Check if logged in successfully by verifying a profile element
        const isLoggedIn = await page.evaluate(() => {
            return document.querySelector('.user-profile') !== null;
        });

        if (isLoggedIn) {
            console.log('Login successful!');
            await scrapeArbs("https://www.betburger.com/arbs", page); // Replace with your scraping logic
        } else {
            throw new Error('Login failed. Could not find user profile element.');
        }
    } catch (error) {
        console.error('Login process failed:', error);
    } finally {
        await browser.close();
    }
}

async function scrapeArbs(url, page) {
    // Implement scraping logic here
}

// Replace with your actual email and password
const email = 'jakub.maruska014@gmail.com';
const password = 'nyggyd-Vuzjaq-1vofsu';

// Start the login and scraping process
loginAndScrape('https://www.betburger.com/users/sign_in', email, password);
