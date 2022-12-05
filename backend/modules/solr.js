const {solr, scrapy} = require('../config/config.js')

/**
 * Runs a Solr query with '/select' as the method handler.
 * By default, the limit is set from the config value.
 * @param JSONquery the Solr JSON query object.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runSearchQuery(JSONquery) {
    JSONquery.limit = JSONquery.limit | solr.query.page_size
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

/**
 * Returns the first N documents that are expired and need to be rescraped.
 * @returns Object[]>} resolves with the array of the expired artists, otherwise rejects with the error message
 */
/**
 * Returns the first N documents that are expired and need to be rescraped.
 * @param limit return the first N expired artists.
 * @returns {Promise<Object[]>} array of expired artists.
 */
async function getExpiredArtists(limit=2000) {
    let params = {
        query: `indexDate:[* TO NOW/DAY-${scrapy.scrape_expiry_time}DAY]`,
        fields: ["site", "page_link", "indexDate"],
        sort: "indexDate asc",
        params: {
            "q.op": "OR"
        },
        limit: limit
    }

    result = []
    await runSearchQuery(params)
        .then((res)=> {
            result = res.response.docs
        })
        .catch((err)=>{
            console.error(err)
        })
    return result
}

/**
 * Deletes all indexed documents.
 * @returns {Promise<void>} resolves when the operation is completed.
 */
async function deleteAllDocuments() {
    console.log(await runDeleteQuery({query: "*:*"}))
}

module.exports = {
    runSearchQuery,
    runUpdateQuery,

    getExpiredArtists,
    deleteAllDocuments
}
