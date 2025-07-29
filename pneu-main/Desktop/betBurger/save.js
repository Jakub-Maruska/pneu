const puppeteer = require("puppeteer");

async function scrapeArbs(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Wait for the element to load
    await page.waitForSelector('.wrapper.arb.has-2-bets');

    // Extract data from each arb item
    const arbs = await page.evaluate(() => {
        const arbsList = [];
        const arbElements = document.querySelectorAll('.wrapper.arb.has-2-bets');

        arbElements.forEach(arbElement => {
            const percent = arbElement.querySelector('.percent').textContent.trim();
            const sport = arbElement.querySelector('.sport-name').textContent.trim();
            const updatedAt = arbElement.querySelector('.updated-at').textContent.trim();
            const bookmakers = [];
            
            // Iterate over each bet-wrapper to get bookmaker details
            const betWrappers = arbElement.querySelectorAll('.bet-wrapper');
            betWrappers.forEach(betWrapper => {
                const bookmakerName = betWrapper.querySelector('.bookmaker-name').textContent.trim();
                const date = betWrapper.querySelector('.date').textContent.trim();
                const event = betWrapper.querySelector('.event-name .name').textContent.trim();
                const league = betWrapper.querySelector('.event-name .league').textContent.trim();
                const market = betWrapper.querySelector('.market').textContent.trim();
                const coefficient = betWrapper.querySelector('.coefficient').textContent.trim();
                
                bookmakers.push({
                    bookmakerName,
                    date,
                    event,
                    league,
                    market,
                    coefficient
                });
            });

            // Push the arb data into the arbsList array
            arbsList.push({
                percent,
                sport,
                updatedAt,
                bookmakers
            });
        });

        return arbsList;
    });

    // Log each arb with detailed bookmaker information
    arbs.forEach(arb => {
        console.log(`Arbitrage Opportunity - ${arb.percent} in ${arb.sport} (Updated ${arb.updatedAt})`);
        arb.bookmakers.forEach((bookmaker, index) => {
            console.log(`Bookmaker ${index + 1}: ${bookmaker.bookmakerName}`);
            console.log(`Date: ${bookmaker.date}`);
            console.log(`Event: ${bookmaker.event}`);
            console.log(`League: ${bookmaker.league}`);
            console.log(`Market: ${bookmaker.market}`);
            console.log(`Coefficient: ${bookmaker.coefficient}`);
            console.log("-----------------------");
        });
        console.log("====================================");
    });

    await browser.close();
}

scrapeArbs("https://www.betburger.com/arbs");
