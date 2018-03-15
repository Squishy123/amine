///Import nickjs
const Nick = require('nickjs');
const nick = new Nick({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36",
    resourceTimeout: 0,
    loadImages: false
});

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
 * Main
 */
async function main() {

    (async () => {
        let tab = await nick.newTab();
        //inject jquery so we can select stuff
        await util.injectjQuery(tab);
        //search for title
        await search(tab, "Dragon Ball Super");
        let i = await util.getNumElements(tab, '#main > div > div:nth-child(1) > div.widget-body > div.film-list > div');
        console.log(i);

        let img = await util.getImgSources(tab, '#main > div > div:nth-child(1) > div.widget-body > div.film-list > div:nth-child(1) > div > a.poster.tooltipstered > img')
        console.log(img);
       await util.logScreenshot(tab, "screenshots/screenshot.png")


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