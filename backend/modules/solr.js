const {solr, scrapy} = require('../config/config.js')

/**
 * Runs a Solr query with '/select' as the method handler.
 * @param JSONquery the Solr JSON query object.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runSearchQuery(JSONquery) {
    return runQuery("select", JSONquery)
}

/**
 * Runs a Solr query with '/update' as the method handler.
 * @param {Object|Object[]} JSONquery the Solr JSON query object.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runUpdateQuery(JSONquery) {
    return runQuery("update", JSONquery)
}

/**
 * Runs a Solr query with '/update' as the method handler and the delete keyword.
 * @param {Object|Object[]} JSONquery the Solr JSON query object.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runDeleteQuery(JSONquery) {
    return runQuery("update", {'delete': JSONquery})
}


/**
 * Runs a Solr query given a method handler and a JSON query obj.
 * @param {String} method_handler the method handler to be used by Solr.
 * @param JSONquery the JSON query obj.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runQuery(method_handler, JSONquery) {
    // TODO: Add term weight
    return new Promise((resolve, reject) => {
        // console.log(`${solr.protocol}://${solr.host}:${solr.port}/solr/${solr.core}/${method_handler}? -d '${JSON.stringify(params)}'`)
        const url = `${solr.connection.protocol}://${solr.connection.host}:${solr.connection.port}/solr/${solr.connection.core}/${method_handler}?commit=true`
        console.log(url)
        // console.log(JSONquery)
        fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(JSONquery)
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.error)
                    reject(data)
                else
                    resolve(data)
            });
    })
}

// HELPER METHODS

async function getLeastRecentlyScraped() {
    let params = {
        query: `indexDate:[* TO NOW/DAY+1DAY]`,
        fields: ["site", "page_link", "indexDate"],
        sort: "indexDate asc",
        params: {
            "q.op": "OR"
        }
    }
    // Search documents using objQuery
    return (await runSearchQuery(params)).response.docs
}

/**
 * Deletes all indexed documents.
 * @returns {Promise<void>} resolves when the operation is completed.
 */
async function deleteAllDocuments() {
    console.log(await runDeleteQuery({query: "*:*"}))
}

module.exports = { runSearchQuery, runUpdateQuery, getLeastRecentlyScraped, deleteAllDocuments }
