const {scrapy} = require('../config/config');
const solr = require("./solr.js");
const path = require('path');
const fs = require("fs");
const mongodb = require("../modules/mongodb.js")
const exec = require('child_process').exec;


/**
 * Retrieves the entities to be indexed by the crawler.
 * Used for a  number of tasks:
 *  - Re-scraping artists who were initially scraped long ago and therefore outdated
 *  - Re-scraping tags (useful for discovering new artists)
 *  - Scraping search results for queries whose results the users flagged as incorrect.
 * @returns {Promise<{searches: String[], artists: {spider: String, link: String}[], tags: String[]}>}
 */
async function getEntitiesToBeIndexed(limit=1000) {
    [docs, tags, searches] = await Promise.all([solr.getExpiredArtists(limit), mongodb.getExpiredTags(limit), mongodb.getSearchQueriesToScrape(limit)])

    return {
        artists: docs.map(doc => {
            return {
                spider: doc.site,
                link: doc.page_link
            }
        }),
        tags: tags.map(tag=>tag.tag),
        searches: searches.map(search=>search.query)
    }
}
setTimeout(async () => console.log(await getEntitiesToBeIndexed()),3000)

/**
 * Periodically runs scrapy to rescrape expired documents
 */
function init() {
    async function func() {
        if(!scrapy.DISABLE_SCRAPING)
            await scrape_necessary_links()
        setTimeout(func, scrapy.scrape_check_ms)
    }
    setTimeout(func,1000)
}


/**
 * (Re)scrapes and indexes the links/search_terms/artists that either haven't been scraped in a long time,
 * or haven't been scraped at all.
 * Spawns a process for the scrapy spiders. Indexes the scraped data with an HTTP request to Solr.
 * @returns {Promise<void>} resolves upon finishing the scraping and indexing.
 */
async function scrape_necessary_links() {
    function scrapy_command(spider_name, tags = [], artists = [], searches = [], file_postfix) {
        return `scrapy crawl ${spider_name}` +
            ` -a tags=${tags.length > 0 ? tags.join(',') : 'null'}` +
            (artists.length > 0 ? ` -a artists=${artists.join(',')}` : '') +
            (searches.length > 0 ? ` -a searches=${searches.join(',')}` : '') +
            ` -o ${path.join(scrapy.scrapy_json_output_dir, `/${spider_name}-${file_postfix}.json`)}`
    }

    const postfix = new Date().getMilliseconds()

    const crawler_names = ["ko-fi", "patreon", "subscribestar"]

    const {tags, artists, searches} = await getEntitiesToBeIndexed()

    const command = [
        `source ${path.join(scrapy.python_venv, "/bin/activate")}`,
        crawler_names.map((crawler) => scrapy_command(crawler, tags, artists.filter(artist=>artist.spider==crawler).map(artist=>artist.link), searches, postfix))
    ].flat().join(" && ")


    console.info("++ STARTING SCRAPER++", command)
    await runConsoleCommand(command, scrapy.scrapy_folder_path)
    console.info("++ FINISHED SCRAPER++")

    // Filenames of the JSON files generated by the spiders
    const files = (await fs.promises.readdir(scrapy.scrapy_json_output_dir)).filter(fn => fn.endsWith(`-${postfix}.json`));

    for (const file of files) {
        const filepath = path.join(scrapy.scrapy_json_output_dir, file)
        console.log(`Indexing '${filepath}' ...`)
        const content = JSON.parse( (await fs.promises.readFile(filepath)).toString() || '[]')

        // console.log("FILTER: ",content.filter((val)=>{val.artist_name === undefined}))

        await solr.runUpdateQuery(content)
            .then(data => {
                console.log("SUCCESS: ", data)
            })
            .catch(data => {
                console.log("ERR: ", data)
            })
    }

    await mongodb.addScrapedTags(tags)
    await mongodb.removeSearchQueries(searches)

    // TODO: If scraping an artist returned 404, delete him from Solr.
    // TODO: Delete JSON file after indexing
    // TODO: Periodic database dump

}


/**
 * Spawns a process and runs a terminal command.
 * @param {String} command the command to be run.
 * @param {String} cwd the current working directory of the command.
 * @param {Boolean=true} stdout whether to print to console the stdout output of the command.
 * @param {Boolean=true} stderr whether to print to console the stderr output of the command.
 * @returns {Promise<void>} resolves when the command has terminated.
 */
function runConsoleCommand(command, cwd, stdout=true,stderr=true) {
    return new Promise((resolve, reject) => {
        let process = exec(command, {cwd: cwd}, async () => {
            resolve()
        })
        if (stdout)
            process.stdout.on('data', function (data) {
                console.log(data.toString());
            });
        if (stderr)
            process.stderr.on('data', function (data) {
                console.error(data.toString());
            });
    })
}


module.exports = {
    init,
    runConsoleCommand
}
