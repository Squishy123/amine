/**
 * Util class with helpful methods
 */
module.exports = {
    /**
     * Navigate to search url, waits for selector to appear
     * @param {Tab} tab
     * @param {String} url
     */
    search: async function (tab, url) {
        await tab.open(url);
    },

    /**
     * Returns the number of elements with the same selector
     * @param {Tab} tab 
     * @param {String} selector 
     */
    getNumElements: async function (tab, selector) {
        let arg = { selector: selector };
        let scraper = (arg, done) => {
            done(null, $(arg.selector).length);
        }
        try {
            return await tab.evaluate(scraper, arg);
        } catch (err) {
            console.error(err);
            return null;
        }
    },

    /**
     * Returns the src property of  element of given selector
     */
    grabSRC: async function (tab, selector) {
        let numElements = await this.getNumElements(tab, selector);
        if (numElements > 1) {
            let arg = { selector: selector };
            let scraper = (arg, done) => {
                let src = [];
                let el = $(arg.selector);
                el.each((index, value) => {
                    src.push($(value).attr('src'));
                });
                done(null, src);
            }
            try {
                return await tab.evaluate(scraper, arg);
            } catch (err) {
                console.error("Can't grab src", err);
                return null;
            }
        } else if (numElements == 1) {
            let arg = { selector: selector };
            let scraper = (arg, done) => {
                done(null, $(arg.selector).attr('src'));
            }
            try {
                return await tab.evaluate(scraper, arg);
            } catch (err) {
                console.error(err);
                return null;
            }
        }

    },

    /**
   * Returns the href property of element of given selector
   */
    grabHREF: async function (tab, selector) {
        let numElements = await this.getNumElements(tab, selector);
        if (numElements > 1) {
            let arg = { selector: selector };
            let scraper = (arg, done) => {
                let href = [];
                let el = $(arg.selector);
                el.each((index, value) => {
                    href.push($(value).attr('href'));
                });
                done(null, href);
            }
            try {
                return await tab.evaluate(scraper, arg);
            } catch (err) {
                console.error("Can't grab href", err);
                return null;
            }
        } else if (numElements == 1) {
            let arg = { selector: selector };
            let scraper = (arg, done) => {
                done(null, $(arg.selector).attr('href'));
            }
            try {
                return await tab.evaluate(scraper, arg);
            } catch (err) {
                console.error("Can't grab href", err);
                return null;
            }
        }

    },

    /**
    * Returns the innerHTML property of element of given selector
    */
    grabHTML: async function (tab, selector) {
        let numElements = await this.getNumElements(tab, selector);
        if (numElements > 1) {
            let arg = { selector: selector };
            let scraper = (arg, done) => {
                let html = [];
                let el = $(arg.selector);
                el.each((index, value) => {
                    html.push($(value).html());
                });
                done(null, html);
            }
            try {
                return await tab.evaluate(scraper, arg);
            } catch (err) {
                console.error("Can't grab html", err);
                return null;
            }
        } else if (numElements === 1) {
            let arg = { selector: selector };
            let scraper = (arg, done) => {
                done(null, $(arg.selector).html());
            }
            try {
                return await tab.evaluate(scraper, arg);
            } catch (err) {
                console.error("Can't grab html", err);
                return null;
            }
        }

    },

    /**
     * Injects jQuery 3.3.1 into tab 
     */
    injectjQuery: async function (tab) {
        try {
            await tab.inject("https://code.jquery.com/jquery-3.3.1.min.js")
            console.log("jQuery successfully injected")
        } catch (err) {
            console.error(err, "Could not inject jQuery");
        }
    },

    /**
     * Saves screenshot into folder, labelled with current date
     */
    logScreenshot: async function (tab, path) {
        try {
            await tab.screenshot(path);
            console.log("Screenshot successfully taken");
        } catch (err) {
            console.error(err, "Could not take screenshot");
        }
    }
};