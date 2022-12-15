const solr = require("../modules/solr.js");
const path = require("path");
const mongodb = require('../modules/mongodb')
const {scrapy} = require("../config/config");
const fs = require("fs");

/**
 * Module for clearing and manually indexing documents in Solr's collection.
 * Useful for maintenance work.
 */



indexFiles(['subscribestar-v5.json','kofi-v5.json','patreon-v3.json']).then(()=>process.exit())


/**
 * Clears the indexed documents and indexes a set of JSON files.
 * @param {String[]} files the files to index.
 * @returns {Promise<void>} resolves when the indexing is done.
 */
async function indexFiles(files) {
    await solr.deleteAllDocuments().then(console.log).catch(console.log)

    for (const file of files) {
        const filepath = path.join(scrapy.scrapy_json_output_dir, file)
        console.log(`Indexing '${filepath}' ...`)
        const content = JSON.parse(await fs.promises.readFile(filepath))

        // console.log("FILTER: ",content.filter((val)=>{val.artist_name === undefined}))

        await solr.runUpdateQuery(content)
            .then(data => {
                console.log("SUCCESS: ", data)
            })
            .catch(data => {
                console.log("ERR: ", data)
            })
    }
    const stats = await solr.getStatistics()

    await mongodb.removeAllTags();
    await mongodb.removeAllSearchQueries()
    await mongodb.addScrapedTags(stats.tags.map(tag=>tag.title))
    console.log(stats)
}