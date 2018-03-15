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
        }
        return null;
    },

    /**
     * Returns the src property of  element of given selector
     */
    getImgSources: async function (tab, selector) {
        let numElements = await this.getNumElements(tab, selector);
        if (numElements > 0) {
            let arg = { selector: selector };
            let scraper = (arg, done) => {
                let src = [];
                let el = $(arg.selector);
                for (let i = 0; i < el.length; i++) {
                    src.push(el[i].src);
                }
                done(null, src);
            }
            try {
                return await tab.evaluate(scraper, arg);
            } catch (err) {
                console.error(err);
            }
        } else if (numElements == 1) {
            let arg = { selector: selector };
            let scraper = (arg, done) => {
                done(null, $(arg.selector).src);
            }
            try {
                return await tab.evaluate(scraper, arg);
            } catch (err) {
                console.error(err);
            }
        }
        return null;
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