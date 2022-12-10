const {solr, scrapy} = require('../config/config.js')

/**
 * Runs a Solr query with '/select' as the method handler.
 * By default, the limit is set from the config value.
 * @param JSONquery the Solr JSON query object.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runSearchQuery(JSONquery) {
    JSONquery.limit = JSONquery.limit !== undefined ? JSONquery.limit : solr.query.page_size
    return runQueryOnCollection("select", JSONquery)
}

/**
 * Runs a Solr query with '/update' as the method handler.
 * @param {Object|Object[]} JSONquery the Solr JSON query object.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runUpdateQuery(JSONquery) {
    return runQueryOnCollection("update", JSONquery)
}

/**
 * Runs a Solr query with '/update' as the method handler and the delete keyword.
 * @param {Object|Object[]} JSONquery the Solr JSON query object.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runDeleteQuery(JSONquery) {
    return runQueryOnCollection("update", {'delete': JSONquery})
}


/**
 * Runs a Solr collection query given a method handler and a JSON query obj.
 * @param {String} method_handler the method handler to be used by Solr.
 * @param JSONquery the JSON query obj.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runQueryOnCollection(method_handler, JSONquery) {
    return runQuery(`/solr/${solr.connection.core}/${method_handler}?commit=true`, 'POST',
        {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }, JSONquery);
}


/**
 * Runs any Solr query.
 * @param {String} url the URL of the request.
 * @param {String} method the HTTP method to use.
 * @param {Object} header the HTTP header of the request.
 * @param {Object} body the body of the HTTP request.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runQuery(url,method, header, body) {
    return new Promise((resolve, reject) => {
        // console.log(`${solr.protocol}://${solr.host}:${solr.port}/solr/${solr.core}/${method_handler}? -d '${JSON.stringify(params)}'`)
        const requrl = `${solr.connection.protocol}://${solr.connection.host}:${solr.connection.port}${url}`
        console.log(requrl)
        fetch(requrl, {
            method: method,
            headers: header,
            body: JSON.stringify(body)
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
