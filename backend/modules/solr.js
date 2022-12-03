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
 * Runs a Solr query given a method handler and a JSON query obj.
 * @param {String} method_handler the method handler to be used by Solr.
 * @param JSONquery the JSON query obj.
 * @returns {Promise<Object>} resolves with Solr's response if the query was carried out successfully and rejects otherwise with the error message.
 */
function runQuery(method_handler, JSONquery) {
    return new Promise((resolve, reject) => {
        // console.log(`${solr.protocol}://${solr.host}:${solr.port}/solr/${solr.core}/${method_handler}? -d '${JSON.stringify(params)}'`)
        const url = `${solr.protocol}://${solr.host}:${solr.port}/solr/${solr.core}/${method_handler}`
        console.log(url)
        console.log(JSONquery)
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


module.exports = { runSearchQuery }
