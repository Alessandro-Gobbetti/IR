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
        connection: {
            host: '127.0.0.1',
            port: '8983',
            core: 'creators',
            protocol: 'http'
        },
        query: {
            term_weights: {

            },
            // How many results to retrieve with each search query by default.
            page_size: 20
        }
    },
    scrapy: {
        DISABLE_SCRAPING: true,

        scrapy_folder_path: path.join(__dirname, "../../crawler/crawler"),
        // Abs path of folder where the scraped data is stored
        scrapy_json_output_dir: path.join(__dirname,"../../crawler/crawler/crawled"),
        python_venv: path.join(__dirname,"../../crawler/scrapyenv"),

        // How much to wait after scraping before starting another scrape.
        scrape_check_ms: 1000*60*60*24, // 24h
        // If scraped documents/links are older than X days, they're up for being rescraped.
        scrape_expiry_time: 5
    },
    mongodb: {
        mongodb_uri: process.env.MONGODB_URI || `mongodb://localhost:27017`,
        db_name: "IR_db",
        collections: ["tags","searches"]
    },
}

// Deep freezes the settings object.
const deepFreeze = obj => {
    Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) deepFreeze(obj[prop]);
    });
    return Object.freeze(obj);
};

// module.exports = deepFreeze(settings)
module.exports = settings
