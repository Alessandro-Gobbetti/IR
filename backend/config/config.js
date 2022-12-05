/**
 *
 * Contains all the application settings and/or parameters.
 *
*/
const path = require('path')

const rate_limit = require("express-rate-limit");

///////////////////
// Initializes some settings that depend on whether the application is getting deployed locally or remotely
const PORT = 8888
const HOST = "localhost"
///////////////////

const settings = {
    webserver: {
        domain: HOST,
        port: PORT,

        corsOptions: {
            origin: '*',
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        },

        rate : {
            generic_limiter:
             rate_limit({
                windowMs: 2000,
                max: 1000,
                message: "This IP is sending too many requests, slow down."
            })
        }
    },
    solr: {
        host: '127.0.0.1',
        port: '8983',
        core: 'creators',
        protocol: 'http'
    },
    scrapy: {
        scrapy_folder_path: path.join(__dirname, "../../crawler"),
        // Abs path of folder where the scraped data is stored
        scrapy_json_output_dir: path.join(__dirname,"../../crawler/crawler/crawled"),
        python_venv: path.join(__dirname,"../../crawler/scrapyenv"),

        // How often to check for sites to be rescraped
        scrape_check_ms: 1000*60*60*24, // every day
        // If scraped documents/links are older than X days, they're up for being rescraped.
        scrape_expiry_time: 0
    }
}

// Deep freezes the settings object.
const deepFreeze = obj => {
    Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) deepFreeze(obj[prop]);
    });
    return Object.freeze(obj);
};

module.exports = deepFreeze(settings)
