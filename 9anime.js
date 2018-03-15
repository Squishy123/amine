///Import nickjs
const Nick = require('nickjs');
const nick = new Nick({
    loadImages: true,
    printNavigation: false,
    printResourceErrors: false,
    printPageErrors: false
});

const jsonfile = require('jsonfile');

//Import util lib
const util = require('./util');

/**
 * Searches 9anime films by keyword
 * @param {Tab} tab
 * @param {String} query 
 */
async function search(tab, query) {
    await util.search(tab, `https://www3.9anime.is/search?keyword=${query}/`);
    await tab.waitUntilVisible('#main > div > div:nth-child(1) > div.widget-body > div.film-list');
}

/**
 * Processes search results and returns an array of data
 * @param {Tab} tab 
 * @param {String} query 
 */
async function getSearchResults(tab, query) {
    //goto search page
    await search(tab, query);
    let numPages = await util.grabHTML(tab, '#main > div > div:nth-child(1) > div.widget-body > div.paging-wrapper > form > span.total');
    let searchItems = [];
    if (!numPages) numPages = 1;

    for (let p = 1; p <= numPages; p++) {
        //go to next page
        currentURL = `https://www3.9anime.is/search?keyword=${query}/` + `&page=${p}`;
        await tab.open(currentURL);

        let listLength = await util.getNumElements(tab, '.item');

        //grab img sources
        for (let i = 1; i <= listLength; i++) {
            let title, status;
            //grab title
            title = await util.grabHTML(tab, `#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${i}) > div > a.name`);
            let arg = { selector: `#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(${i}) > div > a.poster.tooltipstered > div` };
            //grab status
            status = await tab.evaluate((arg, done) => {
                let data = [];
                $(arg.selector).children('div').each((index, value) => {
                    data.push({ class: $(value).attr('class'), value: $(value).text() });
                });
                done(null, data);
            }, arg);

            // console.log(link)
            if (title && status) {
                console.log(`Title: ${title}`);
                searchItems.push({ title: title, status: status});
            }
        }
    }

    return searchItems;
}

/**
 * Main
 */
async function main() {

    (async () => {
        let tab = await nick.newTab();
        //inject jquery so we can select stuff
        await util.injectjQuery(tab);
        //search for title
        let results = await getSearchResults(tab, "Steins Gate");
        //jsonfile.writeFileSync('results.json', results);
    })().then(() => {
        console.log("Finished Execution");
        //exit code
        nick.exit(0);
    })
        .catch((err) => {
            //exit with error 
            console.error(err);
            nick.exit(1);
        });
}

main();