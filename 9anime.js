///Import nickjs
const puppeteer = require('puppeteer');

const jsonfile = require('jsonfile');

//Import util lib
const util = require('./util');

/**
 * Searches 9anime films by keyword
 * @param {page} page
 * @param {String} query 
 */
async function search(page, query) {
    page.waitForSelector('#main > div > div:nth-child(1) > div.widget-body > div.film-list', { visible: true});
    await util.search(page, `https://www3.9anime.is/search?keyword=${query}/`, {timeout: 0});
}

/**
 * Processes search results and returns an array of data
 * @param {page} page 
 * @param {String} query 
 */
async function getSearchResults(page, query) {
    //goto search page
    await search(page, query);
    let numPages = await util.grabHTML(page, '#main > div > div:nth-child(1) > div.widget-body > div.paging-wrapper > form > span.total');
    let searchItems = [];
    if (!numPages) numPages = 1;

    for (let p = 1; p <= numPages; p++) {
        //go to next page
        currentURL = `https://www3.9anime.is/search?keyword=${query}/` + `&page=${p}`;
        page.waitForSelector('#main > div > div:nth-child(1) > div.widget-body > div.film-list', { visible: true});
        await util.search(page, currentURL, {timeout: 0});

        let listLength = await util.getNumElements(page, '.item');

        //grab img sources
        let img = await util.grabSRC(page, ` a.poster.tooltipstered > img`);
        //grab link sources
        let link = await util.grabHREF(page, `a.name`);
        //grab title
        let title = await util.grabHTML(page, `a.name`);
        console.log(img);
        for (let i = 1; i <= listLength; i++) {
            let arg = { selector: `#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${i}) > div > a.poster.tooltipstered > div` };
            //grab status
            let status = await page.evaluate((arg) => {
                let data = [];
                $(arg.selector).children('div').each((index, value) => {
                    data.push({ class: $(value).attr('class'), value: $(value).text() });
                });
                return data;
            }, arg);

            // console.log(link)
            if (title[i - 1] && status && img[i - 1] && link[i - 1]) {
                console.log(`Title: ${title[i - 1]}`);
                searchItems.push({ title: title[i - 1], status: status, img: img[i - 1], link: link[i - 1] });
            }
        }
    }

    return searchItems;
}

/**
 * Main
 */
async function main() {
    //setup puppeteer browser
    let browser = await puppeteer.launch({
        headless: false
    });

    (async () => {
        let page = await browser.newPage();
        //inject jquery so we can select stuff
        await util.injectjQuery(page);
        //search for title
        let results = await getSearchResults(page, "dragon ball super");
        jsonfile.writeFileSync('results.json', results);

    })().then(() => {
        browser.close();
        console.log("Finished Execution");
        //exit code
    })
        .catch((err) => {
            browser.close();
            //exit with error 
            console.error("Execution unsuccessful: ", err);

        });
}

main();