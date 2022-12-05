const solr = require("../modules/solr.js");
const path = require("path");
const {scrapy} = require("../config/config");
const fs = require("fs");

/**
 * Module for clearing and manually indexing documents in Solr's collection.
 * Useful for maintenance work.
 */



indexFiles(['subscribestar-v3.json','kofi-v4.json','patreon-v3.json'])


/**
 * Clears the indexed documents and indexes a set of JSON files.
 * @param {String[]} files the files to index.
 * @returns {Promise<void>} resolves when the indexing is done.
 */
async function indexFiles(files) {
    await solr.deleteAllDocuments()

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
}