const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile');

let browser, page, currentURL, searchURL;

//write to json
const filePath = 'data.json';

async function init() {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();

}
async function search(query) {
    searchURL = `https://www3.9anime.is/search?keyword=${query}`;
    await page.goto(searchURL, { waitUntil: "domcontentloaded" });
}

async function getNumPages() {
    let numPages = await page.evaluate((sel) => {
        return (document.querySelector(sel)) ? parseInt(document.querySelector(sel).innerHTML) : null;
    }, '#main > div > div:nth-child(1) > div.widget-body > div.paging-wrapper > form > span.total');
    return (numPages) ? numPages : 1;
}

async function searchResults() {
    let numPages = await getNumPages();
    let searchItems = [];

    for (let p = 1; p <= numPages; p++) {
        //go to next page
        currentURL = searchURL + `&page=${p}`;
        await page.goto(currentURL, { waitUntil: "domcontentloaded" });

        let listLength = await page.evaluate((sel) => {
            return document.getElementsByClassName(sel).length;
        }, 'item');

        for (let i = 1; i <= listLength; i++) {
            let title, status, img, link;
            //grab title
            title = await page.evaluate((sel) => {
                return (document.querySelector(sel)) ? document.querySelector(sel).innerHTML : null;
            }, `#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${i}) > div > a.name`);


            //grab status
            status = await page.evaluate((sel) => {
                if (document.querySelector(sel)) {
                    let data = []
                    let el = document.querySelector(sel).children;

                    for (let c = 0; c < el.length; c++) {
                        if (el[c].innerHTML)
                            data.push(el[c].innerHTML);
                    }

                    return data;
                }
                return null;
            }, `#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${i}) > div > a.poster.tooltipstered > div`);

            //grab img sources
            img = await page.evaluate((sel) => {
                return (document.querySelector(sel)) ? document.querySelector(sel).src : null;
            }, `#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${i}) > div > a.poster.tooltipstered > img`);

            //grab link sources
            link = await page.evaluate((sel) => {
                return (document.querySelector(sel)) ? document.querySelector(sel).href : null;
            }, `#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${i}) > div > a.name`);

            if (title && status && img && link) {
                //console.log(`Title: ${title}`);
                searchItems.push({ title: title, status: status, img: img, link: link });
            }
        }
    }

    return searchItems;
}

async function getProviderNames() {
    let providers = await page.evaluate((sel) => {
        let children = document.querySelector(sel).children;
        let names = [];
        for (let p = 0; p < children.length; p++) {
            names.push(children[p].innerHTML);
        }
        return names;
    }, '#main > div > div.widget.servers > div.widget-title > span.tabs');
    return providers;
}

async function navItem(url) {
    //navigate to page
    currentURL = url;
    await page.goto(currentURL, { waitUntil: "domcontentloaded" });
    let sources = [];

    //fill sources with subserver catagories
    providers = await getProviderNames();
    providers.forEach((e) => {
        sources.push({ serverName: e });
    });

    for (let s = 0; s < sources.length; s++) {
        //let server = await page.$();
        //TODO FIX RANGE CHECK
        let range = await page.evaluate((sel) => {
            return (document.querySelector(sel)) ? document.querySelector(sel).children.length : 1;
        }, `#main > div > div.widget.servers > div.widget-body > div:nth-child(${s + 1}) > div`); //??????
        //let server = await page.$(`#main > div > div.widget.servers > div.widget-body > div:nth-child(${s + 1})`)
        //range = 4;
        //console.log(range);
        //range = 3;
        for (let r = 0; r < range; r++) {
            let eps = await page.evaluate((sel) => {
                let episodes = [];
                if (document.querySelector(sel)) {
                    if (document.querySelector(sel).children) {
                        let u = document.querySelector(sel).children;
                        for (let i = 0; i < u.length; i++) {
                            episodes.push(u[i].children[0].href);
                        }
                    }
                }
                return episodes;
            }, `#main > div > div.widget.servers > div.widget-body > div:nth-child(${s + 1}) > ul:nth-child(${r + 1})`);
            if (sources[s].episodes)
                sources[s].episodes = sources[s].episodes.concat(eps);
            else
                sources[s].episodes = eps;
        }
    }
    return sources;
}

async function main() {
    await init();
    await search("steins gate");
    //tester code
    let searchItems = await searchResults();
    //jsonfile.writeFileSync(filePath, searchItems, {flag: 'a'});
    let sources = await navItem(searchItems[0].link);
    jsonfile.writeFileSync(filePath, sources);
    browser.close();

    //await page.screenshot({ path: 'screenshots/github.png' });

    //browser.close();
}
main();